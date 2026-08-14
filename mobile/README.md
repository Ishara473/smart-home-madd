# Smart Home Monitoring & Control System - Mobile Application

The primary mobile client for the Smart Home Monitoring & Control System, built with **React Native** and **Expo Router**.

---

## Purpose

The mobile application acts as the central user interface for monitoring and controlling smart home devices across multi-floor house layouts. It provides real-time status updates, grid-mapped floor plan interaction, device scheduling, safety hazard monitoring, and camera surveillance capabilities.

---

## Technology Stack

- **Framework**: React Native (Expo SDK 52)
- **Navigation**: Expo Router (File-based routing)
- **Language**: JavaScript (ES6+)
- **State & Sync**: Event-driven real-time integration (Firebase Firestore)
- **Build System**: EAS (Expo Application Services) for cloud builds

---

## Project Structure

```text
mobile/
├── src/
│   ├── app/          # Expo Router file-based screens and layouts
│   ├── components/   # Presentational UI components
│   ├── features/     # Feature-specific modules (floors, devices, timers)
│   ├── services/     # Firebase SDK and API services
│   ├── hooks/        # Custom React hooks
│   ├── constants/    # Theme tokens, colors, and configuration constants
│   ├── utils/        # Helper utility functions
│   ├── context/      # React Context state providers
│   └── models/       # Data models and schemas
├── assets/           # App icons, splash screens, static assets
├── app.json          # Expo configuration
├── eas.json          # EAS build configuration
├── package.json      # NPM dependencies & scripts
├── .env.example      # Environment variables template
└── README.md         # Documentation
```

---

## Setup Instructions

### 1. Environment Configuration

1. Copy the environment variables template:
   ```bash
   cp .env.example .env
   ```

2. Fill in your Firebase credentials in `.env`:
   - Get these from your Firebase Console project settings
   - Required variables: `EXPO_PUBLIC_FIREBASE_API_KEY`, `EXPO_PUBLIC_FIREBASE_PROJECT_ID`, etc.
   - Set `EXPO_PUBLIC_USE_MOCK_DATA=true` for development without Firebase

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm start
```

---

## Development Commands

- **`npm start`**: Starts the Expo development server
- **`npm run android`**: Opens the app in an Android emulator or connected physical device
- **`npm run ios`**: Opens the app in an iOS simulator (macOS required)
- **`npm run web`**: Runs the app in a web browser for rapid testing
- **`npm run build:android`**: Build Android APK using EAS (preview profile)
- **`npm run build:apk`**: Alias for `npm run build:android`

---

## Building APK with EAS

### Local Build

1. Login to EAS (first time only):
   ```bash
   eas login
   ```

2. Build APK with preview profile:
   ```bash
   eas build --platform android --profile preview --non-interactive
   ```

3. The build will run on Expo's servers and provide a download link when complete

### GitHub Actions Build

The project includes automated EAS builds via GitHub Actions:

1. **Setup EXPO_TOKEN secret** (required):
   - Go to GitHub repository Settings > Secrets and variables > Actions
   - Click "New repository secret"
   - Name: `EXPO_TOKEN`
   - Value: Get your token from https://expo.dev/accounts/[username]/settings/access-tokens
   - Click "Add secret"

2. **Trigger build**:
   - **Automatic**: Push to `main` branch triggers build automatically
   - **Manual**: Go to Actions tab, select "Build Android APK" workflow, click "Run workflow"

3. **Download APK**:
   - Check the workflow run logs for the build URL
   - Or visit EAS dashboard: https://expo.dev/accounts/[your-account]/projects/smart-home-monitoring-system/builds

---

## Firebase Configuration

The app uses Firebase for real-time data synchronization. Configure your Firebase project:

1. Create a Firebase project at https://console.firebase.google.com/
2. Enable Firestore Database and Storage
3. Copy your Firebase config to `.env` file
4. For development, set `EXPO_PUBLIC_USE_MOCK_DATA=true` to use mock data

---

## Troubleshooting

### Build Failures

- **EXPO_TOKEN missing**: Ensure you've added the EXPO_TOKEN secret in GitHub repo settings
- **Firebase credentials**: Verify your `.env` file has all required Firebase variables
- **Node modules**: Try `rm -rf node_modules && npm install` if you encounter dependency issues

### Development Issues

- **Metro bundler**: Clear cache with `npx expo start -c`
- **iOS builds**: Requires macOS with Xcode installed
- **Android builds**: Ensure Android Studio and emulator are properly configured

---

## Security Notes

- **Never commit** `.env` file or any credentials to git
- **`.env.example`** contains the template for required environment variables
- **API keys** are loaded from environment variables using `EXPO_PUBLIC_*` prefix
- **`.easignore`** excludes development files from EAS builds

---

## License

This project is part of the Smart Home Monitoring & Control System.
