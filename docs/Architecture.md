# Software Architecture Document (SAD)
## Smart Home Monitoring & Control System

**Course**: SCS 3311: Mobile Application Design & Development  
**Project**: Mini-Project Architecture Deliverable  
**Document Version**: 1.0  
**Date**: July 2026  

---

## 1. Executive Summary

This document describes the high-level software architecture, data flow patterns, component structures, and security model of the **Smart Home Monitoring & Control System**. The system uses a multi-tier, event-driven, layered architecture designed to ensure sub-second synchronization across mobile clients, cloud infrastructure, and a companion web hardware simulator.

---

## 2. Overall Architectural Style

The application enforces a **Layered Architecture (N-Tier Pattern)** to decouple user interface concerns from business logic, data persistence, and cloud synchronization.

```text
+------------------------------------------------------------------+
|                     PRESENTATION LAYER                           |
|  Mobile Client (React Native / Expo UI) | Hardware Simulator UI  |
+--------------------------------+---------------------------------+
                                 |
                                 v
+------------------------------------------------------------------+
|                    BUSINESS LOGIC LAYER                          |
|  Custom Hooks | Safety Duration Rules | Time Schedule Engine     |
+--------------------------------+---------------------------------+
                                 |
                                 v
+------------------------------------------------------------------+
|                         DATA LAYER                               |
|  Device Service Repositories | Realtime Data Listeners / Sync    |
+--------------------------------+---------------------------------+
                                 |
                                 v
+------------------------------------------------------------------+
|                   FIREBASE CLOUD SERVICES                        |
|  Cloud Firestore  |  Firebase Storage  |  Cloud Functions        |
+------------------------------------------------------------------+
```

### Layer Responsibilities

| Layer | Primary Responsibilities | Components |
| :--- | :--- | :--- |
| **Presentation Layer** | Renders interactive floor plans, device tiles, status badges, camera views, and simulator controls; handles user gestures. | Expo Router Screens, React Components, Simulator Web UI |
| **Business Logic Layer** | Enforces device state transition rules, timer calculations, schedule validation, and active duration monitoring logic. | Custom Hooks (`useDevices`, `useFloorPlan`), Rule Validators |
| **Data Layer** | Encapsulates Firestore real-time subscriptions (`onSnapshot`), write operations, caching, and data mapper transforms. | `DeviceService`, `FloorService`, `NotificationService` |
| **Firebase Cloud Services** | Provides persistent cloud NoSQL storage, asset hosting, background triggers, and push alert infrastructure. | Firestore DB, Firebase Storage, Cloud Functions |

---

## 3. Mobile Application Architecture (React Native + Expo)

The mobile application is structured around **Expo** and **Expo Router** following a modular, component-driven design.

```text
mobile/
├── app/                      # Expo Router File-Based Navigation (Presentation)
│   ├── _layout.tsx           # Navigation Root Layout & Providers
│   ├── index.tsx             # Dashboard / Multi-Floor Overview Screen
│   ├── floor/[id].tsx        # Interactive Floor Plan Grid Screen
│   ├── analytics/            # Device Usage Reporting Screens
│   └── settings/             # System Preferences
├── components/               # Reusable UI Presentation Components
│   ├── floor/                # FloorPlanGrid, GridNode, LayoutOverlay
│   ├── devices/              # OutletTile, MultiSwitchCard, IronTimerWidget, CameraFeed
│   └── common/               # StatusBadge, Modal, Button, Header
├── hooks/                    # Business Logic Layer (Custom React Hooks)
│   ├── useFloorDevices.ts    # Real-time floor device subscription hook
│   ├── useDeviceControl.ts   # Device state toggling & optimistic update hook
│   └── useSafetyAlerts.ts    # Background cutoff listener hook
├── services/                 # Data Layer (Firebase API abstraction)
│   ├── firebase.ts           # Firebase SDK initialization
│   ├── deviceService.ts      # Firestore device reads/writes/listeners
│   └── floorService.ts       # Firestore floor plan metadata reads
└── types/                    # Domain Data Types & Heterogeneous Device Schemas
    └── device.ts             # Device, SwitchGang, Schedule, Status types
```

### Architectural Component Interaction

1. **Expo & Expo Router**: Manages native bridge lifecycle, file-based routing (`app/` directory), and deep-linking across floor plan views.
2. **React Components**: Pure presentational views receiving state via props and emitting user gesture callbacks.
3. **Custom Hooks**: Encapsulate component state management, local timer intervals (e.g., active countdown display), and Firebase subscription hooks.
4. **Service Layer**: Decouples the React components from Firebase SDK calls. Exposes clean async methods (`toggleDeviceState`, `updateDeviceTimer`) and observable snapshot streams.
5. **Firebase SDK**:
   - **Firestore**: Provides real-time websocket-based synchronization (`onSnapshot`) for device states and floor data.
   - **Storage**: Hosts high-resolution floor plan base images and mock camera snapshot assets.
   - **Cloud Functions**: Invokes background triggers for safety duration enforcement and schedule execution.

---

## 4. Hardware Simulator Architecture

The **Hardware Simulator** is a standalone **React.js Web Application** residing in the `hardware-simulator/` directory. It shares the same Firebase backend project, acting as a virtual representation of physical IoT hardware.

```text
+----------------------+          +----------------------+          +----------------------+          +----------------------+
|     End-User         |          |   Cloud Firestore    |          |  Hardware Simulator  |          |   Virtual Devices    |
| (Mobile App Client)  | -------> | (Database Document)  | -------> |   React Web App      | -------> | (Visual State Render)|
+----------------------+          +----------------------+          +----------------------+          +----------------------+
```

### Key Simulator Subsystems

1. **Cloud Firestore Connection**: Establishes direct `onSnapshot` listeners to the `/devices` Firestore collection using the shared Firebase configuration.
2. **Virtual Device Engine**: Maps incoming Firestore device documents to visual web components (e.g., glowing LEDs for switch states, animated iron temperature indicators, camera stream visualizers).
3. **Hardware Fault Simulator**: Enables testing operators to manually inject failure states (`ERROR`, `DISCONNECTED`) directly back to Firestore to test mobile app resilience and reactive badge updates.

---

## 5. End-to-End Data Flow

The following sequence details how a manual device toggle on the mobile application propagates through the system to the virtual hardware simulator:

```text
[ User Taps Switch ]
         │
         ▼
[ React Native UI Component ] ──(Emits onPress event)
         │
         ▼
[ Custom Hook: useDeviceControl ] ──(Trigger optimistic UI update)
         │
         ▼
[ Data Layer: deviceService.ts ] ──(Invokes updateDoc in Firestore)
         │
         ▼
[ Cloud Firestore Database ] ──(State updated: state = "ON")
         │
    ┌────┴───────────────────────────────┐
    │ Realtime WebSocket Push (`onSnapshot`)
    ▼                                    ▼
[ Mobile App Listeners ]       [ Hardware Simulator Web App ]
    │                                    │
    ▼                                    ▼
[ UI Badges Update (ON) ]      [ Virtual Appliance Visual State Updates ]
```

---

## 6. Server-Side Safety Cutoff & Automation Flow

To protect against fire hazards (e.g., clothing iron left on beyond `max_on_duration`), an automated cloud background process enforces safety cutoffs independently of the client application lifecycle.

```text
[ User Turns Iron ON ]
         │
         ▼
[ Firestore Updated ] ──(Document: state = "ON", lastTurnedOn = Timestamp)
         │
         ▼
[ Firebase Cloud Function Trigger / Worker Listener ]
         │
         ▼
[ Monitor Elapsed Duration vs max_on_duration ]
         │
         ▼ (If Duration > max_on_duration Limit)
         │
[ Cloud Function Writes to Firestore ] ──(Document: state = "OFF", status = "OFF")
         │
    ┌────┴──────────────────────────────────────┐
    ▼                                           ▼
[ Mobile Client Listener ]             [ Hardware Simulator Listener ]
    │                                           │
    ├──> Renders Status: OFF                   └──> Turns off Virtual Heating Element
    └──> Triggers In-App Alert Notification
```

---

## 7. Security Architecture

```text
+-----------------------------------------------------------------------+
|                       SECURITY ARCHITECTURE                           |
|                                                                       |
|   +-----------------------+                  +--------------------+   |
|   | Firebase Auth (Future)|                  | Firestore Rules    |   |
|   | - Token Validation    |                  | - Schema Checks    |   |
|   | - Role RBAC           |                  | - State Limits     |   |
|   +-----------+-----------+                  +---------+----------+   |
|               |                                        |              |
|               +-------------------+--------------------+              |
|                                   |                                   |
|                                   v                                   |
|                     +---------------------------+                     |
|                     | Cloud Functions Security  |                     |
|                     | - Admin Privilege Exec    |                     |
|                     | - Server-side Cutoffs     |                     |
|                     +---------------------------+                     |
+-----------------------------------------------------------------------+
```

1. **Authentication (Future Readiness)**: Architecture is designed for integration with Firebase Auth (Email/Password, Google Sign-In) issuing JWT tokens for authenticated API calls.
2. **Firestore Security Rules**: Strict server-enforced security rules validate database schema structure and restrict write access.
   - Example rule logic: Ensure `max_on_duration` cannot be set to a negative integer; restrict write access to valid device status values (`ON`, `OFF`, `ERROR`, `DISCONNECTED`).
3. **Cloud Functions Security**: Background worker functions execute using Firebase Admin SDK privileges, granting secure server-side authorization to override device states during safety cutoff events without exposing administrative keys to client devices.

---

## 8. Scalability & Extensibility Strategy

The system architecture utilizes the **Polymorphic Device Strategy Pattern** to allow adding new appliance types without modifying core UI rendering engines or database schemas.

### Device Data Model Schema (Extensible JSON Structure)

```json
{
  "id": "dev_iron_01",
  "floorId": "floor_ground",
  "name": "Laundry Room Iron",
  "type": "HAZARD_APPLIANCE",
  "gridPosition": { "x": 4, "y": 7 },
  "status": "ON",
  "capabilities": {
    "hasTimer": true,
    "maxOnDurationMinutes": 15,
    "lastTurnedOn": "2026-07-21T21:45:00Z"
  },
  "metadata": {
    "powerRatingWatts": 1800
  }
}
```

### Adding New Devices Without Major Code Changes

1. **Schema-Driven Rendering**: The mobile client's `DeviceFactory` component inspects the `type` and `capabilities` payload of incoming device documents and dynamically instantiates the appropriate control component (`OutletTile`, `MultiSwitchCard`, `TimerWidget`).
2. **Dynamic Grid Placement**: Floor plans render devices dynamically based on `gridPosition` coordinates, enabling users to add new devices to any floor without altering layout code.
3. **Generic Service Interface**: The `deviceService` exposes generic CRUD and subscription primitives (`subscribeToFloorDevices(floorId)`), making it agnostic to specific device capabilities.
