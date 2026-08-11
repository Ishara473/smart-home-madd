# Firebase Production Mode & Mock Data Guide

## Overview

The Smart Home Monitoring System supports two runtime data modes:

| Mode | Environment Variable | Data Source |
|------|---------------------|-------------|
| **Mock Mode** | `EXPO_PUBLIC_USE_MOCK_DATA=true` | Local JS mock files |
| **Firebase Mode** | `EXPO_PUBLIC_USE_MOCK_DATA=false` (default) | Firestore via Repository Layer |

> [!IMPORTANT]
> The mock data **files** in `src/features/**/data/*MockData.js` are never deleted. They remain useful for development, testing, and offline demos. What changes is whether the runtime **loads** from them.

---

## Environment Variables

All environment variables must be placed in a `.env` file in the `mobile/` directory:

```env
# Firebase credentials (required for production mode)
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef

# Data mode control
EXPO_PUBLIC_USE_MOCK_DATA=false
```

---

## Mock Mode (Development Offline)

Use this when you want to develop without Firebase connectivity or credentials.

**Setup:**
```env
EXPO_PUBLIC_USE_MOCK_DATA=true
```

**Behaviour:**
- Firebase is **never contacted**
- All contexts load data from `*MockData.js` files
- No Firestore reads or writes occur
- Runs completely offline
- Ideal for UI-only development

**Start:**
```bash
npx expo start -c
```

---

## Firebase Mode (Production / Seeded Development)

Use this when Firebase is configured and Firestore data has been seeded.

**Setup:**
```env
EXPO_PUBLIC_USE_MOCK_DATA=false
EXPO_PUBLIC_FIREBASE_API_KEY=...  # all 6 keys required
```

**Behaviour:**
- All contexts load data from Firestore via the Repository Layer
- Real-time listeners active on: `devices`, `homes`, `cameras`, `notifications`
- Static fetches for: `floors`, `rooms`, `schedules`
- Firebase errors are **visible** in loading/error states — no silent fallbacks

**Seed the database first (one-time):**
```javascript
import { seedFirestore } from './src/services/firebase/seed';
seedFirestore(); // Run once, then remove this call
```

---

## Data Flow Architecture

```
Production (Firebase Mode):

UI Component
    ↓
Context / Hook
    ↓
Firebase Repository (repositories/)
    ↓
Firestore

---

Development (Mock Mode):

UI Component
    ↓
Context / Hook
    ↓
MockData files (features/**/data/)
```

---

## Firebase Error Behaviour

In Firebase Mode, if Firestore is unreachable:

```
loading: false
error: "Unable to load devices. Check your connection."
```

There is **no automatic fallback to mock data** in Firebase Mode. Errors are surfaced to the UI via the `error` state so they remain visible and debuggable.

---

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| "Firebase is not configured" | Missing `.env` keys | Copy `.env.example` to `.env` and fill in credentials |
| "Unable to load floors/rooms/devices" | Firestore empty | Run `seedFirestore()` once |
| App shows no data and no error | `EXPO_PUBLIC_USE_MOCK_DATA` is not `true`/`false` | Check `.env` spelling — must be exactly `true` or `false` |
| Old cached errors after adding `.env` | Metro cache | Restart with `npx expo start -c` |

---

## Firebase Connection Status

Use the `firebaseStatus.js` utility to inspect connection state programmatically:

```javascript
import { getFirebaseStatus, isFirebaseOnline } from './src/services/firebase/firebaseStatus';

console.log(getFirebaseStatus());
// { connected: true, projectId: "smart-home-xxx", appName: "[DEFAULT]" }

console.log(isFirebaseOnline()); // true / false
```
