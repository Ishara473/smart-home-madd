# Screen Specifications
## Smart Home Monitoring & Control System

**Course**: SCS 3311: Mobile Application Design & Development  
**Document Version**: 1.0  
**Date**: July 2026  

---

## Overview

This document specifies the screen layouts, functional requirements, component compositions, user interactions, and data model mappings for all 10 screens of the **Smart Home Monitoring & Control System** mobile application.

---

## Screen 1: Splash Screen

- **Screen Name**: `SplashScreen` (`app/splash.tsx`)
- **Purpose**: Initial application launch, brand presentation, Firebase authentication state check, and local configuration loading.
- **Navigation Entry Point**: App initial launch (Root entry).
- **Information Displayed**:
  - App Logo & Title ("Smart Home System")
  - Course identifier ("SCS 3311 Mini-Project")
  - System initialization loader / connection status spinner
- **User Actions**: None (automated transition).
- **Components Required**: `AppLogo`, `BrandHeader`, `LoadingSpinner`.
- **Related Data Entities**: `AppConfig`, `SessionState`.

---

## Screen 2: Dashboard Screen

- **Screen Name**: `DashboardScreen` (`app/(tabs)/index.tsx`)
- **Purpose**: High-level home command center displaying active device counts, floor summaries, quick controls, and critical safety alert banners.
- **Navigation Entry Point**: Automated redirect from Splash Screen; primary "Home" tab on Bottom Navigation.
- **Information Displayed**:
  - Home status header (total active devices, connected status)
  - Quick action floor selector chips (Ground Floor, 1st Floor)
  - Emergency safety alert banner (e.g., active hazard timers or warnings)
  - Favorite / High-priority device quick control cards
  - Operational status breakdown (`ON`: 5, `OFF`: 8, `ERROR`: 0, `DISCONNECTED`: 1)
- **User Actions**:
  - Tap floor chip to navigate to `FloorDetailScreen`
  - Quick-toggle favorite devices (`ON`/`OFF`)
  - Tap safety alert banner to open `NotificationsScreen`
- **Components Required**: `HomeHeader`, `StatusSummaryBar`, `AlertBanner`, `FloorChipSelector`, `QuickControlGrid`.
- **Related Data Entities**: `HomeSummary`, `Floor`, `Device`, `AlertNotification`.

---

## Screen 3: Floor Management Screen

- **Screen Name**: `FloorManagementScreen` (`app/(tabs)/floors/index.tsx`)
- **Purpose**: Administrative interface to list all registered house floor plans, view floor metadata, and add new floor layouts.
- **Navigation Entry Point**: "Floors" tab on Bottom Navigation or settings shortcut.
- **Information Displayed**:
  - List of created floors (Ground Floor, First Floor, Attic)
  - Thumbnail preview of floor plan base images
  - Count of assigned smart devices per floor
  - "Add New Floor" action button
- **User Actions**:
  - Select a floor card to open `FloorDetailScreen`
  - Tap "Add Floor" to trigger floor creation modal
  - Re-order or delete existing floor plans
- **Components Required**: `FloorListCard`, `AddFloorButton`, `FloorThumbnail`, `EmptyStateView`.
- **Related Data Entities**: `Floor`, `Device`.

---

## Screen 4: Floor Detail Screen

- **Screen Name**: `FloorDetailScreen` (`app/floor/[id].tsx`)
- **Purpose**: Interactive floor plan visualization overlaying an abstract matrix grid with draggable/clickable device nodes.
- **Navigation Entry Point**: Selected from `DashboardScreen` or `FloorManagementScreen`.
- **Information Displayed**:
  - High-resolution floor plan background image
  - Abstract grid overlay matrix
  - Interactive device nodes rendered at specific grid coordinates (`(x, y)`)
  - Status badges (`ON`, `OFF`, `ERROR`, `DISCONNECTED`) for each node
  - Selected device inspector preview card
- **User Actions**:
  - Pinch/pan to zoom floor map
  - Tap grid node to inspect or toggle device state
  - Long-press grid node to reposition device on matrix
- **Components Required**: `FloorPlanViewer`, `GridOverlay`, `DeviceGridNode`, `NodeInspectorSheet`.
- **Related Data Entities**: `Floor`, `Device`, `GridCoordinate`.

---

## Screen 5: Device Detail Screen

- **Screen Name**: `DeviceDetailScreen` (`app/device/[id].tsx`)
- **Purpose**: In-depth control, capability configuration, and operational status monitor for an individual smart device or multi-switch unit.
- **Navigation Entry Point**: Tapped from `FloorDetailScreen` inspector or device list.
- **Information Displayed**:
  - Device Name, Category, Location, and Status Badge
  - Master power toggle switch
  - *Multi-Switch Units*: Individual sub-switch controls (Switch 1, Switch 2, etc.)
  - *Hazard Appliances (Iron)*: Max active duration setting and live countdown timer
  - *Smart Lights*: Active automated schedule windows
- **User Actions**:
  - Toggle master power state or individual sub-switches
  - Configure `max_on_duration` timer limit for hazard appliances
  - Trigger manual fault reset or error diagnostics
- **Components Required**: `DeviceHeaderCard`, `MasterToggle`, `MultiSwitchGangControl`, `HazardTimerProgress`, `StatusBadge`.
- **Related Data Entities**: `Device`, `SwitchGangNode`, `HazardConfig`.

---

## Screen 6: Schedule Management Screen

- **Screen Name**: `ScheduleManagementScreen` (`app/(tabs)/schedules.tsx`)
- **Purpose**: Configuration hub for appliance operating schedules, automated lighting time windows, and hazard active duration cutoffs.
- **Navigation Entry Point**: "Schedules" tab on Bottom Navigation.
- **Information Displayed**:
  - List of active device schedules (e.g., "Living Room Lights: 18:00 - 22:00")
  - Safety hazard max duration rules (e.g., "Clothing Iron: Max 15 mins")
  - Automatic time-window toggle switches
- **User Actions**:
  - Create new schedule slot (time picker for `turn_on` / `turn_off`)
  - Edit max active duration limit for hazard devices
  - Enable/disable individual schedule triggers
- **Components Required**: `ScheduleListCard`, `TimeRangePicker`, `HazardDurationSlider`, `AddScheduleButton`.
- **Related Data Entities**: `ScheduleRule`, `HazardConfig`, `Device`.

---

## Screen 7: Camera Monitoring Screen

- **Screen Name**: `CameraMonitoringScreen` (`app/(tabs)/cameras.tsx`)
- **Purpose**: Dedicated surveillance viewport displaying mock security camera snapshot feeds and stream previews across house areas.
- **Navigation Entry Point**: "Cameras" tab on Bottom Navigation.
- **Information Displayed**:
  - Grid of camera feed cards (Front Door, Backyard, Garage)
  - Mock camera snapshot images / mock URI stream player
  - Connection status badge (`LIVE` green dot vs `DISCONNECTED`)
  - Snapshot timestamp ("Updated 5s ago")
- **User Actions**:
  - Tap camera card to expand full-screen live feed modal
  - Tap "Refresh Snapshot" to manually update frame
- **Components Required**: `CameraFeedCard`, `StreamPlayerModal`, `LiveBadge`, `RefreshButton`.
- **Related Data Entities**: `CameraDevice`, `StreamMetadata`.

---

## Screen 8: Reports Screen

- **Screen Name**: `ReportsScreen` (`app/(tabs)/reports.tsx`)
- **Purpose**: Historical analytics and data usage visualization showing operational runtime hours, device activity logs, and energy estimations.
- **Navigation Entry Point**: "Reports" tab on Bottom Navigation or Dashboard shortcut.
- **Information Displayed**:
  - Daily/Weekly active runtime bar charts by device category
  - Total active hours metric cards
  - Historical state transition log (activation time, deactivation time, trigger source)
  - Safety cutoff history event list
- **User Actions**:
  - Filter reports by date range (Today, 7 Days, 30 Days)
  - Filter log events by device type or safety cutoffs
- **Components Required**: `UsageBarChart`, `MetricSummaryCard`, `ActivityLogTable`, `DateRangeFilter`.
- **Related Data Entities**: `DeviceUsageLog`, `SafetyEventLog`.

---

## Screen 9: Notifications Screen

- **Screen Name**: `NotificationsScreen` (`app/notifications.tsx`)
- **Purpose**: Audit trail of safety alerts, automated cutoffs (`max_on_duration` breaches), state transitions, and hardware error logs.
- **Navigation Entry Point**: Top bell icon on Dashboard header; in-app alert banner tap.
- **Information Displayed**:
  - Categorized notification list (Safety Alerts, System Errors, Schedule Triggers)
  - Timestamped alert descriptions (e.g., *"Laundry Iron automatically turned OFF after 15 min max duration breach"*)
  - Read/Unread indicators
- **User Actions**:
  - Tap notification to navigate directly to affected `DeviceDetailScreen`
  - Mark all notifications as read / clear history
- **Components Required**: `NotificationItemCard`, `AlertSeverityBadge`, `FilterHeader`, `ClearAllButton`.
- **Related Data Entities**: `AlertNotification`, `Device`.

---

## Screen 10: Settings Screen

- **Screen Name**: `SettingsScreen` (`app/(tabs)/settings.tsx`)
- **Purpose**: System preferences, cloud connection configuration, team member evaluation info, and sample floor plan reset options.
- **Navigation Entry Point**: "Settings" tab on Bottom Navigation.
- **Information Displayed**:
  - User profile / Evaluation role info
  - Firebase connection status indicator
  - Global default safety threshold configurations
  - Demo reset triggers ("Reset Sample Floor Plans & Devices")
  - Project version ("SCS 3311 v1.0.0")
- **User Actions**:
  - Toggle global alert sound preferences
  - Execute "Reset Demo Data" to re-seed Firebase Firestore
- **Components Required**: `SettingRowToggle`, `ConnectionStatusTile`, `DangerZoneButton`, `VersionFooter`.
- **Related Data Entities**: `AppConfig`, `SystemInfo`.
