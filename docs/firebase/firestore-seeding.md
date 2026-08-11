# Firestore Seed Migration

## Purpose
This seed system is a controlled data migration layer designed to convert existing local mock data into structured Firestore documents, while preserving the exact relational graph (string IDs) necessary for the application to function. 

This process guarantees that when the repository layer is migrated to Firebase in the future, all relationships (`devices.roomId`, `schedules.deviceId`, etc.) resolve perfectly.

## Execution
The seed process is **MANUAL** and **DEVELOPMENT-ONLY**. It does not run automatically on app start.

### UI Access Method (Recommended)
A developer-only seed screen is available at the direct route `/developer/seed`. Access it by:

1. Navigate to the route directly in your development build
2. Review system status (Firebase connection, authentication, data mode)
3. Confirm the seed operation
4. Wait for completion and verify success message

The seed screen includes:
- Firebase connection status
- Current authentication user UID
- Data mode indicator (Mock vs Firebase)
- Real-time seeding progress
- Success/error feedback
- Protection against multiple simultaneous executions

> **Note**: This screen is only accessible in development builds (`__DEV__ === true`). In production, it displays a "Development Only" message.

### Programmatic Access
Alternatively, you can import and run the function directly in a development context:

```javascript
import { seedFirestore } from './src/services/firebase/seed';

// Run once to seed the database
seedFirestore();
```

> [!WARNING]  
> **OVERWRITE WARNING**  
> Running `seedFirestore()` will overwrite any existing Firestore documents that share the same IDs with the mock data. Ensure you are targeting a development Firestore database, not production.

## Environment Protection
The seed process contains multiple layers of protection:

1. **Build-time guard**: The seed function contains an explicit guard that prevents execution in production builds:
```javascript
if (!__DEV__) {
  console.warn('Seed function can only run in development mode.');
  return;
}
```

2. **UI-level guard**: The seed screen (`/developer/seed`) is only accessible in development mode and displays a "Development Only" message in production builds.

3. **Data mode guard**: The seed cannot run when `EXPO_PUBLIC_USE_MOCK_DATA=true`. The screen will display an error and prevent execution.

4. **Authentication guard**: The seed requires an authenticated Firebase user session before execution.

5. **Confirmation dialog**: The seed requires explicit user confirmation before overwriting any data.

These guarantees ensure no accidental overwrites can occur once deployed.

## Collections Seeded (in dependency order)
1. `users` (Uses static ID: `test-user-123`)
2. `homes` (Uses static ID: `home-main`)
3. `floors`
4. `rooms`
5. `devices` (Transforms location object into strict `roomId` & `floorId` string references)
6. `cameras`
7. `schedules` (Transforms triggers and filters named vs device-specific schedules)
8. `notifications`
9. `reports` (Transforms ISO dates into Firestore `Timestamp` objects)

All seeded documents include `createdAt` and `updatedAt` Firestore Timestamps to adhere strictly to the Prompt 032B schema.

## When to Use the Seed
Use the Firestore seed in the following scenarios:

1. **Initial Firebase Setup**: When first setting up Firestore for development and need test data
2. **After Schema Changes**: When the Firestore schema has been modified and requires fresh test data
3. **Development Testing**: When testing the full Firebase integration end-to-end
4. **Reset State**: When you need to reset the database to a known clean state

**Do NOT use the seed when:**
- Production Firestore is connected (risk of data loss)
- Using mock data mode (`EXPO_PUBLIC_USE_MOCK_DATA=true`)
- You have real user data in Firestore (seed will overwrite)

## Expected Results After Seeding
After successful seed execution, verify the following in Firebase Console:

### Collections Created
- `users` (1 document: `{authenticatedFirebaseUserUid}`)
- `homes` (1 document: `home-main`)
- `floors` (2 documents)
- `rooms` (4 documents)
- `devices` (8 documents)
- `cameras` (3 documents)
- `schedules` (5 documents)
- `notifications` (3 documents)
- `reports` (2 documents)

**Important**: The seed now uses the currently authenticated Firebase user's UID instead of a static ID. This ensures that:
- The `users/{uid}` document matches the Firebase Auth UID
- The `homes.memberUserIds` array contains the authenticated UID
- HomeContext can correctly resolve `currentHomeId` for the signed-in user

### Document Structure
Each document will contain:
- All fields from the original mock data
- `createdAt`: Firestore Timestamp
- `updatedAt`: Firestore Timestamp

### Relationships Preserved
- All `deviceId`, `roomId`, `floorId`, `homeId` references will match exactly
- Device-to-room and room-to-floor relationships will be intact
- Schedule-to-device triggers will resolve correctly

## Troubleshooting

### Seed button disabled
- Ensure you're in development mode (`__DEV__ === true`)
- Ensure `EXPO_PUBLIC_USE_MOCK_DATA=false` in `.env`
- Ensure Firebase credentials are configured in `.env`
- Ensure you are signed in to Firebase Auth

### Permission denied errors
- Ensure Firestore security rules have been deployed
- Ensure your user UID is in the `memberUserIds` array of the home document
- Check Firebase Console for rule evaluation errors

### Seed completes but no data appears
- Check browser console for seed execution logs
- Verify Firebase Console shows the collections
- Check network connectivity to Firestore
