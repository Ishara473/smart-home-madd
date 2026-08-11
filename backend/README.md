# Backend & Cloud Services

Firebase Cloud Functions for the **Smart Home Monitoring & Control System**.

## Cloud Functions

### 1. `safetyCutoffListener` (Firestore Trigger)
- **Trigger:** `devices/{deviceId}` document update
- **Purpose:** When a safety-critical device (e.g., clothing iron) with a `maxOnDuration` field transitions from OFF to ON, a pending cutoff record is created in the `pendingCutoffs` collection with a timestamp for when the device should be auto-shut-off.

### 2. `safetyCutoffExecutor` (Scheduled — every 1 minute)
- **Purpose:** Checks all expired pending cutoffs. If the device is still ON after its `maxOnDuration`, it:
  - Forces the device status to OFF
  - Creates a `SAFETY_ALERT` notification in the `notifications` collection
  - Sends a push notification (FCM) to all home members

### 3. `scheduleExecutor` (Scheduled — every 1 minute)
- **Purpose:** Evaluates all enabled schedules and toggles devices:
  - `TIME_BASED` / `TIME_TRIGGER`: Turns devices ON/OFF at specific times
  - `TIME_RANGE`: Keeps devices active during a time window (e.g., lights 6PM–10PM)
  - Respects `daysOfWeek` filtering

## Setup

```bash
cd backend
npm install
firebase login
firebase init  # Select your project: smart-home-monitoring-f1d87
```

## Deploy

```bash
firebase deploy --only functions
```

## Local Emulator Testing

```bash
firebase emulators:start --only functions
```

## Firestore Collections Used

| Collection | Purpose |
|---|---|
| `devices` | IoT device documents (read/write by functions) |
| `pendingCutoffs` | Temporary safety cutoff scheduling records |
| `notifications` | Alert documents created by safety cutoffs |
| `homes` | Home documents (read for member FCM tokens) |
| `users` | User documents (read for FCM tokens) |
| `schedules` | Schedule documents (read by schedule executor) |
