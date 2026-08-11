# Firebase Console Setup & Installation Guide

This document describes how to configure the Firebase connection for the Smart Home Monitoring System. The codebase already includes the initialization logic; you only need to create a project in the Firebase Console and provide the credentials.

## Step 1: Create Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project**.
3. Name the project (e.g., `SmartHomeApp`).
4. Disable Google Analytics (optional, for development).
5. Click **Create project**.

## Step 2: Register Application
1. In the project dashboard, click the **Web** (`</>`) icon to add a web app (Expo uses the web configuration for React Native JS SDK).
2. Register app with a nickname (e.g., `SmartHomeApp-Web`).
3. Click **Register app**.

## Step 3: Obtain Configuration Values
Firebase will display a `firebaseConfig` object like this:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "smarthomeapp-xxx.firebaseapp.com",
  projectId: "smarthomeapp-xxx",
  storageBucket: "smarthomeapp-xxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

## Step 4: Add Environment Variables
In your local `mobile` directory, create a `.env` file (copy from `.env.example`).
Map the values from the Firebase console to these keys:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key_here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Step 5: Restart Expo
Stop your running Expo server and clear the cache to ensure the new environment variables are loaded:

```bash
npx expo start -c
```

## Troubleshooting
If you see the `[Firebase Config Validation Warning]` in your terminal, it means your `.env` file is missing one or more required keys. The app will fall back to local mock data to prevent crashes, but Firebase features will not work until the variables are populated.
