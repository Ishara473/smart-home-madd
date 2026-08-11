# Firebase Authentication & Firestore Security

## Architecture Overview

```
Firebase Authentication
        ↓
AuthContext (user, loading, signIn, signUp, signOut)
        ↓
users/{uid}  →  currentHomeId
        ↓
HomeContext (home, homeId, loading)
        ↓
Home Membership Check  (homes/{homeId}.memberUserIds)
        ↓
Firestore Security Rules
        ↓
Repositories → UI
```

---

## Auth Flow

```
1. App starts
        ↓
2. AuthProvider mounts → subscribeToAuthChanges()
        ↓
3a. User IS signed in → user object available
        ↓
4. HomeProvider reads users/{uid}.currentHomeId
        ↓
5. HomeProvider subscribes to homes/{homeId}
        ↓
6. Feature providers (DeviceProvider, etc.) receive homeId
        ↓
7. Data flows to UI

3b. User NOT signed in → user = null
        ↓
4. HomeProvider receives user = null → no home loaded
        ↓
5. Feature providers receive homeId = null → empty states
```

---

## Firestore Permission Model

| Collection | Who Can Access |
|------------|---------------|
| `users/{uid}` | The user themselves only (`request.auth.uid == uid`) |
| `homes/{homeId}` | Any user whose UID is in `memberUserIds[]` |
| `floors`, `rooms`, `devices`, `cameras`, `schedules`, `notifications`, `reports` | Any user who is a member of the document's `homeId` home |

### Core Security Function

```javascript
function isHomeMember(homeId) {
  return request.auth != null
    && exists(.../homes/$(homeId))
    && request.auth.uid in get(.../homes/$(homeId)).data.memberUserIds;
}
```

This single function enforces the **home membership ownership model** across all child collections.

---

## Deploying the Rules

### Option A — Firebase Console (Manual)
1. Go to [Firebase Console](https://console.firebase.google.com) → Firestore Database → Rules
2. Copy the contents of `firestore.rules`
3. Paste and click **Publish**

### Option B — Firebase CLI (Recommended for production)
```bash
npm install -g firebase-tools
firebase login
firebase init firestore
firebase deploy --only firestore:rules
```

---

## Testing Instructions

### Test User Isolation
1. Create **User A** via `signUp('usera@test.com', 'password', 'User A')`
2. Create **User B** via `signUp('userb@test.com', 'password', 'User B')`
3. Create a home and assign only User A to `memberUserIds[]`
4. Sign in as User A → data loads ✅
5. Sign in as User B → all queries return `Missing or insufficient permissions` ✅

### Test Own User Document
- User A can read `users/uidA` ✅
- User A cannot read `users/uidB` ✅

### Validate with Firebase Rules Playground
In the Firebase Console under Rules, use the **Rules Playground** tab to simulate reads/writes as specific users without running the actual app.

---

## Development Without Auth

Set `EXPO_PUBLIC_USE_MOCK_DATA=true` in `.env`.

The `AuthContext` will provide a **synthetic mock user** (`uid: test-user-123`) and `HomeContext` will load from `dashboardMockData`. No Firebase Auth calls are made, and the entire app works offline.
