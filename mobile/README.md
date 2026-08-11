# Smart Home Monitoring & Control System - Mobile Application

The primary mobile client for the Smart Home Monitoring & Control System, built with **React Native** and **Expo Router**.

---

## Purpose

The mobile application acts as the central user interface for monitoring and controlling smart home devices across multi-floor house layouts. It provides real-time status updates, grid-mapped floor plan interaction, device scheduling, safety hazard monitoring, and camera surveillance capabilities.

---

## Technology Stack

- **Framework**: React Native (Expo SDK 57)
- **Navigation**: Expo Router (File-based routing)
- **Language**: JavaScript (ES6+)
- **State & Sync**: Event-driven real-time integration (Firebase Firestore)

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
├── package.json      # NPM dependencies & scripts
└── README.md         # Documentation
```

---

## How to Run the Project

1. Navigate to the `mobile/` directory:
   ```bash
   cd mobile
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Expo development server:
   ```bash
   npm start
   ```

---

## Development Commands

- **`npm start`**: Starts the Expo development server.
- **`npm run android`**: Opens the app in an Android emulator or connected physical device.
- **`npm run ios`**: Opens the app in an iOS simulator (macOS required).
- **`npm run web`**: Runs the app in a web browser for rapid testing.
