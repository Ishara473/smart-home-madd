const { onSchedule } = require("firebase-functions/v2/scheduler");
const { db, FieldValue } = require("./firebase");

/**
 * Schedule Executor
 *
 * Runs every minute to evaluate all enabled schedules and toggle devices
 * accordingly. Supports:
 *   - TIME_BASED: Turn devices ON/OFF at specific times on specific days
 *   - SAFETY_RULE: Enforced by safetyCutoff.js (max_on_duration)
 *   - TIME_RANGE: Keep devices active during a time window (e.g., lights 6PM-10PM)
 */
exports.scheduleExecutor = onSchedule(
  "every 1 minutes",
  async (event) => {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    const currentDay = now.toLocaleDateString("en-US", { weekday: "long" });

    console.log(
      `[ScheduleExecutor] Running at ${now.toISOString()} (${currentTime}, ${currentDay})`
    );

    try {
      // Fetch all enabled schedules
      const schedulesSnap = await db
        .collection("schedules")
        .where("enabled", "==", true)
        .get();

      if (schedulesSnap.empty) {
        console.log("[ScheduleExecutor] No enabled schedules.");
        return;
      }

      const batch = db.batch();
      let actionsQueued = 0;

      for (const scheduleDoc of schedulesSnap.docs) {
        const schedule = scheduleDoc.data();
        const {
          deviceId,
          type: scheduleType,
          startTime,
          endTime,
          daysOfWeek,
          action,
        } = schedule;

        if (!deviceId) continue;

        // Check if schedule applies to current day
        if (daysOfWeek && daysOfWeek.length > 0) {
          if (!daysOfWeek.includes(currentDay)) continue;
        }

        let shouldTurnOn = false;
        let shouldTurnOff = false;

        switch (scheduleType) {
          case "TIME_BASED":
          case "TIME_TRIGGER": {
            // Turn ON at startTime, OFF at endTime
            if (startTime && currentTime === startTime) {
              shouldTurnOn = true;
            }
            if (endTime && currentTime === endTime) {
              shouldTurnOff = true;
            }
            break;
          }

          case "TIME_RANGE": {
            // Keep device ON during the time window
            const inRange =
              startTime &&
              endTime &&
              currentTime >= startTime &&
              currentTime < endTime;

            const deviceSnap = await db
              .collection("devices")
              .doc(deviceId)
              .get();
            if (!deviceSnap.exists) continue;

            const deviceData = deviceSnap.data();
            const isCurrentlyOn =
              deviceData.state?.power === true ||
              deviceData.status === "ON";

            if (inRange && !isCurrentlyOn) {
              shouldTurnOn = true;
            } else if (!inRange && isCurrentlyOn) {
              shouldTurnOff = true;
            }
            break;
          }

          default:
            break;
        }

        if (shouldTurnOn) {
          const deviceRef = db.collection("devices").doc(deviceId);
          batch.update(deviceRef, {
            "state.power": true,
            status: "ON",
            lastUpdated: FieldValue.serverTimestamp(),
          });

          // Update lastExecuted on schedule
          batch.update(scheduleDoc.ref, {
            lastExecuted: FieldValue.serverTimestamp(),
          });

          actionsQueued++;
          console.log(
            `[ScheduleExecutor] Schedule ${scheduleDoc.id}: Turning ON device ${deviceId}`
          );
        }

        if (shouldTurnOff) {
          const deviceRef = db.collection("devices").doc(deviceId);
          batch.update(deviceRef, {
            "state.power": false,
            status: "OFF",
            lastUpdated: FieldValue.serverTimestamp(),
          });

          batch.update(scheduleDoc.ref, {
            lastExecuted: FieldValue.serverTimestamp(),
          });

          actionsQueued++;
          console.log(
            `[ScheduleExecutor] Schedule ${scheduleDoc.id}: Turning OFF device ${deviceId}`
          );
        }
      }

      if (actionsQueued > 0) {
        await batch.commit();
        console.log(
          `[ScheduleExecutor] Batch committed. ${actionsQueued} device actions executed.`
        );
      } else {
        console.log("[ScheduleExecutor] No actions to execute this minute.");
      }
    } catch (error) {
      console.error("[ScheduleExecutor] Error:", error);
    }
  }
);
