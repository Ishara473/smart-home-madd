# Firebase Infrastructure - Smart Home Monitoring System

This module establishes the foundational Firebase service layer, defensive environment validation, and configuration management for the Smart Home Monitoring System React Native application.

---

## 📌 Architecture Overview

The system adheres to **Clean Architecture** principles, ensuring that UI components and React hooks remain completely decoupled from underlying database and infrastructure details.

```text
Today (Mock Phase)

UI
 ↓
Hooks
 ↓
Mock Repository
 ↓
Mock Data


Tomorrow (Firebase Migration Phase)

UI
 ↓
Hooks
 ↓
Repository Interface
 ↓
Firebase Repository
 ↓
Firestore
```

---

## 🛠️ Service Components & Responsibilities

| File | Primary Responsibility |
| :--- | :--- |
| `validateFirebaseConfig.js` | Utility that checks for presence of required `EXPO_PUBLIC_FIREBASE_*` env vars. Logs helpful dev warnings if missing without crashing the application. |
| `firebaseConfig.js` | Uses validation utility to safely initialize root Firebase App singleton. Prevents duplicate initializations during Fast Refresh. Exports `app`, `isConfigValid`, and `missingKeys`. |
| `firestore.js` | Exports `db` Firestore database instance with a null guard if `app` is uninitialized. |
| `auth.js` | Exports `auth` Firebase Authentication instance with a null guard. |
| `storage.js` | Exports `storage` Firebase Storage instance with a null guard. |
| `index.js` | Unified barrel export for all Firebase services and validation utilities. |

---

## 🔐 Environment Setup Guide

### 1. Creating a Firebase Project
1. Navigate to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project** (or **Create a project**).
3. Enter your project name (e.g., `smart-home-monitoring`).
4. (Optional) Configure Google Analytics according to project needs.
5. Click **Create project** and wait for provisioning to finish.

---

### 2. Obtaining Firebase Configuration Credentials
1. In the Firebase Console, go to **Project Settings** (gear icon near top-left).
2. Under the **General** tab, scroll down to **Your apps**.
3. Select the **Web (`</>`)** platform icon to register a web app.
4. Enter an app nickname (e.g., `Smart Home Mobile`) and click **Register app**.
5. Copy the configuration object provided:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "smart-home-monitoring.firebaseapp.com",
     projectId: "smart-home-monitoring",
     storageBucket: "smart-home-monitoring.appspot.com",
     messagingSenderId: "1234567890",
     appId: "1:1234567890:web:abcdef..."
   };
   ```

---

### 3. Populating `.env`
1. Duplicate `.env.example` to create a local `.env` file inside the `mobile/` directory:
   ```bash
   cp .env.example .env
   ```
2. Fill in your credentials:
   ```env
   EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSy...
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=smart-home-monitoring.firebaseapp.com
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=smart-home-monitoring
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=smart-home-monitoring.appspot.com
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1234567890
   EXPO_PUBLIC_FIREBASE_APP_ID=1:1234567890:web:abcdef...
   ```

---

### 4. Restarting Expo
Expo loads `EXPO_PUBLIC_*` environment variables at start time. When creating or modifying `.env`, restart the Expo development server with cache clearing:

```bash
npx expo start -c
```
or
```bash
npm start -- -c
```

---

## 🧪 Verification Checklists

### Before `.env` Population (Current Phase)
- ✅ App starts and bundles successfully without crashing.
- ✅ Clear dev console warning appears listing missing `EXPO_PUBLIC_FIREBASE_*` keys.
- ✅ `db === null`, `auth === null`, `storage === null`.
- ✅ All existing UI screens, hooks, and mock data function normally.

### After `.env` Population (Prompt 031B)
- ✅ Expo bundles successfully without any console warnings.
- ✅ `isConfigValid === true`.
- ✅ `db`, `auth`, and `storage` initialize correctly as valid Firebase SDK instances.
