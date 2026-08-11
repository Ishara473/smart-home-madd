const { onDocumentUpdated } = require("firebase-functions/v2/firestore");
const { db, messaging } = require("./firebase");

/**
 * Safety Cutoff Listener
 *
 * Watches the `devices` collection. When a safety-critical device (e.g., iron)
 * with a `maxOnDuration` is toggled ON, a scheduled check is created.
 * If the device is still ON after `maxOnDuration` minutes, it is automatically
 * flipped to OFF and a notification is pushed to the user.
 *
 * This function fires on every device document update.
 */
exports.safetyCutoffListener = onDocumentUpdated(
  "devices/{deviceId}",
  async (event) => {
    const deviceId = event.params.deviceId;
    const before = event.data?.data()?.before?.data();
    const after = event.data?.data()?.after?.data();

    if (!before || !after) return;

    const wasOn = before.state?.power === true || before.status === "ON";
    const isOn = after.state?.power === true || after.status === "ON";
    const maxOnDuration = after.maxOnDuration;

    // Only act when a safety-critical device transitions from OFF to ON
    if (wasOn || !isOn || !maxOnDuration) return;

    console.log(
      `[SafetyCutoff] Device ${deviceId} turned ON with maxOnDuration=${maxOnDuration}min. Scheduling cutoff.`
    );

    // Schedule a delayed function to check and cutoff
    const cutoffTimeMs = maxOnDuration * 60 * 1000;

    // Use setTimeout via a separate Firestore "pendingCutoffs" document
    // that a periodic Cloud Scheduler function checks, OR use a direct timer.
    // For simplicity, we use a Firestore-based approach with a timestamp.
    await db.collection("pendingCutoffs").doc(deviceId).set({
      deviceId,
      homeId: after.homeId,
      deviceName: after.name,
      scheduledAt: new Date(),
      cutoffAt: new Date(Date.now() + cutoffTimeMs),
      maxOnDuration,
    });

    console.log(
      `[SafetyCutoff] Cutoff scheduled for ${deviceId} at ${new Date(Date.now() + cutoffTimeMs).toISOString()}`
    );
  }
);

/**
 * Safety Cutoff Executor
 *
 * Triggered on a 1-minute schedule by Cloud Scheduler (pub/sub).
 * Checks all pending cutoffs and fires the ones that have expired.
 */
exports.safetyCutoffExecutor = require("firebase-functions/v2/scheduler").onSchedule(
  "every 1 minutes",
  async (event) => {
    const now = new Date();
    console.log(`[SafetyCutoffExecutor] Running at ${now.toISOString()}`);

    try {
      const expiredCutoffs = await db
        .collection("pendingCutoffs")
        .where("cutoffAt", "<=", now)
        .get();

      if (expiredCutoffs.empty) {
        console.log("[SafetyCutoffExecutor] No expired cutoffs.");
        return;
      }

      const batch = db.batch();
      const notifications = [];

      for (const cutoffDoc of expiredCutoffs.docs) {
        const cutoff = cutoffDoc.data();
        const { deviceId, homeId, deviceName } = cutoff;

        // Re-read device to confirm it is still ON
        const deviceSnap = await db.collection("devices").doc(deviceId).get();
        if (!deviceSnap.exists) {
          batch.delete(cutoffDoc.ref);
          continue;
        }

        const deviceData = deviceSnap.data();
        const stillOn =
          deviceData.state?.power === true || deviceData.status === "ON";

        if (!stillOn) {
          // Device was manually turned off — just clean up the cutoff
          batch.delete(cutoffDoc.ref);
          continue;
        }

        // SAFETY VIOLATION: Force device OFF
        batch.update(deviceSnap.ref, {
          "state.power": false,
          status: "OFF",
          lastUpdated: now,
        });

        // Delete the pending cutoff
        batch.delete(cutoffDoc.ref);

        // Create a notification document
        const notifRef = db.collection("notifications").doc();
        const notificationData = {
          homeId,
          deviceId,
          title: "Safety Cutoff Triggered",
          message: `${deviceName} was automatically turned OFF after exceeding the ${cutoff.maxOnDuration}-minute safety limit.`,
          type: "SAFETY_ALERT",
          severity: "HIGH",
          isRead: false,
          createdAt: now,
          updatedAt: now,
        };
        batch.set(notifRef, notificationData);

        // Prepare push notification
        notifications.push({
          homeId,
          title: "Safety Cutoff Alert",
          body: `${deviceName} was auto-shut off after ${cutoff.maxOnDuration} minutes.`,
          deviceId,
        });

        console.log(
          `[SafetyCutoffExecutor] CUTOFF APPLIED: Device ${deviceId} (${deviceName}) forced OFF`
        );
      }

      await batch.commit();
      console.log(
        `[SafetyCutoffExecutor] Batch committed. ${notifications.length} cutoffs applied.`
      );

      // Send push notifications to home members
      for (const notif of notifications) {
        await sendPushToHomeMembers(notif);
      }
    } catch (error) {
      console.error("[SafetyCutoffExecutor] Error:", error);
    }
  }
);

/**
 * Sends a push notification to all members of a home.
 */
async function sendPushToHomeMembers({ homeId, title, body, deviceId }) {
  try {
    const homeDoc = await db.collection("homes").doc(homeId).get();
    if (!homeDoc.exists) return;

    const memberUserIds = homeDoc.data().memberUserIds || [];

    for (const uid of memberUserIds) {
      const userDoc = await db.collection("users").doc(uid).get();
      if (!userDoc.exists) continue;

      const fcmToken = userDoc.data().fcmToken;
      if (!fcmToken) continue;

      try {
        await messaging.send({
          token: fcmToken,
          notification: { title, body },
          data: { deviceId, type: "SAFETY_CUTOFF" },
        });
        console.log(`[SafetyCutoff] Push sent to user ${uid}`);
      } catch (pushError) {
        console.error(`[SafetyCutoff] Push failed for user ${uid}:`, pushError.message);
      }
    }
  } catch (error) {
    console.error("[SafetyCutoff] sendPushToHomeMembers error:", error);
  }
}
