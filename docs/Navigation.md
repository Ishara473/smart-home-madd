# Navigation Architecture & User Flow
## Smart Home Monitoring & Control System

**Course**: SCS 3311: Mobile Application Design & Development  
**Document Version**: 1.0  
**Date**: July 2026  

---

## 1. Navigation Hierarchy & Architecture

The mobile application utilizes a **Hybrid Navigation Architecture** leveraging **Expo Router** (file-based navigation). The structure combines a persistent **Bottom Tab Navigator** for primary top-level domains, embedded **Stack Navigators** for deep exploration, and full-screen **Modal Screens** for immediate actions and camera stream viewing.

```text
Root Stack Navigator (app/_layout.tsx)
├── Splash Screen (app/splash.tsx) [Initial Launch]
├── Notifications Screen (app/notifications.tsx) [Modal / Stack]
├── Device Detail Screen (app/device/[id].tsx) [Stack Push]
├── Floor Detail Screen (app/floor/[id].tsx) [Stack Push]
└── Main App Tabs (app/(tabs)/_layout.tsx) [Bottom Tabs]
    ├── Tab 1: Dashboard (app/(tabs)/index.tsx)
    ├── Tab 2: Floors (app/(tabs)/floors/index.tsx)
    ├── Tab 3: Schedules (app/(tabs)/schedules.tsx)
    ├── Tab 4: Cameras (app/(tabs)/cameras.tsx)
    ├── Tab 5: Reports (app/(tabs)/reports.tsx)
    └── Tab 6: Settings (app/(tabs)/settings.tsx)
```

---

## 2. Navigation Patterns & Justifications

| Navigation Pattern | Screens Utilizing Pattern | Justification & UX Purpose |
| :--- | :--- | :--- |
| **Bottom Tab Navigation** | `Dashboard`, `Floors`, `Schedules`, `Cameras`, `Reports`, `Settings` | Provides top-level access to core functional modules with a single thumb tap. Keeps key home control domains persistent. |
| **Stack Navigation (Push/Pop)** | `FloorDetailScreen`, `DeviceDetailScreen`, `NotificationsScreen` | Enforces hierarchical depth (Dashboard $\rightarrow$ Floor Detail $\rightarrow$ Device Detail). Allows intuitive back-swipe gestures and standard header back buttons. |
| **Modal Navigation** | Full-Screen Camera View, Add Floor Form, Schedule Slot Picker | Interruptive focus for transient tasks (e.g., editing a schedule or inspecting a live camera feed) without losing primary screen navigation context. |

---

## 3. Screen Relationships & Flow Chart

```text
                    +--------------------+
                    |    Splash Screen   |
                    +---------+----------+
                              | Auto-redirect
                              v
                    +--------------------+
                    |  Dashboard Screen  | <====================┐
                    +----+----------+----+                      │
                         |          |                           │
        ┌────────────────┘          └───────────────┐           │
        v                                           v           │
+---------------+                           +---------------+   │
| Floor Detail  |                           | Notifications |   │
| (Grid View)   |                           | (Alert Logs)  |   │
+-------+-------+                           +---------------+   │
        |                                                       │
        v                                                       │
+---------------+                                               │
| Device Detail | ──────────────────────────────────────────────┘
| (Controls)    | (Navigate back or to related schedule)
+---------------+
```

---

## 4. User Journey Diagrams

### Journey 1: Monitoring Floor & Toggling Device State
```text
Dashboard Screen
  │
  ├─► Taps "Ground Floor" Chip
  │
  ▼
Floor Detail Screen (Grid Visualization)
  │
  ├─► Taps Grid Node (Living Room Light)
  │
  ▼
Device Detail Screen (Light Controls)
  │
  ├─► Toggles Light Switch to ON
  │   └── (State updates Firestore & Hardware Simulator in real time)
  │
  └─► Press Back Arrow ──► Returns to Floor Detail Screen
```

### Journey 2: Safety Cutoff & Alert Inspection
```text
Iron Turned ON in Mobile Client
  │
  ▼
Iron Exceeds `max_on_duration` (Triggered by Cloud Safety Worker)
  │
  ▼
Push Alert Notification Received on Mobile Device
  │
  ├─► Taps In-App Alert Banner / Bell Icon
  │
  ▼
Notifications Screen
  │
  ├─► Taps "Laundry Iron Safety Cutoff Alert"
  │
  ▼
Device Detail Screen (Iron)
  │   └── Displays "Status: OFF (Safety Cutoff Triggered)"
  │
  └─► Returns to Dashboard Screen
```

### Journey 3: Setting Smart Light Schedules
```text
Dashboard Screen
  │
  ├─► Selects "Schedules" Tab in Bottom Bar
  │
  ▼
Schedule Management Screen
  │
  ├─► Taps "Add Schedule" Button
  │
  ▼
Schedule Picker Modal
  │
  ├─► Sets Turn-ON Time (18:00) & Turn-OFF Time (22:00)
  ├─► Selects "Living Room Lamps"
  ├─► Taps "Save Schedule"
  │
  └─► Modal Dismisses ──► New Schedule listed in Schedule Management Screen
```

### Journey 4: Video Surveillance Check
```text
Dashboard Screen
  │
  ├─► Selects "Cameras" Tab in Bottom Bar
  │
  ▼
Camera Monitoring Screen
  │
  ├─► Views Front Door Mock Snapshot
  ├─► Taps Camera Card
  │
  ▼
Full-Screen Live Stream Modal
  │
  └─► Taps "Close" ──► Returns to Camera Monitoring Screen
```
