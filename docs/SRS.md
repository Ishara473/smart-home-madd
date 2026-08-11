# Software Requirements Specification (SRS)
## Smart Home Monitoring & Control System

**Course**: SCS 3311: Mobile Application Design & Development  
**Project**: Mini-Project Deliverable  
**Document Version**: 1.0  
**Date**: July 2026  

---

## 1. Introduction

### 1.1 Purpose
This Software Requirements Specification (SRS) document provides a detailed and comprehensive definition of the functional and non-functional requirements for the **Smart Home Monitoring & Control System**. It establishes the technical baseline for system development, verification, and evaluation.

### 1.2 Scope
The system consists of three interconnected subsystems:
1. **Mobile Application Client (React Native + Expo)**: A cross-platform mobile interface enabling users to manage multi-floor house layouts, view abstract grid-mapped floor overlays, interactively toggle heterogeneous home appliances, set hazard safety schedules, monitor security camera streams, and view usage reporting.
2. **Backend & Safety Cloud Infrastructure (Firebase Firestore, Storage, Cloud Functions)**: Cloud-based database, storage, and server-side safety listeners enforcing automated safety cutoffs (`max_on_duration` breaches) and pushing alert notifications.
3. **Companion Hardware Simulator (React.js Web App)**: A web-based application simulating physical home appliances in real time by listening to database updates and visually reflecting physical states and error conditions online.

### 1.3 Intended Users
- **Homeowners / Residents**: Primary end-users of the mobile application who configure layouts, control devices, monitor spaces, and view device analytics.
- **System Administrators / Evaluators**: Technical evaluators and developers monitoring cloud synchronization, safety rule compliance, and hardware simulator behavior.

### 1.4 Definitions & Abbreviations
| Term | Definition |
| :--- | :--- |
| **SRS** | Software Requirements Specification |
| **IoT** | Internet of Things |
| **Firestore** | Firebase NoSQL Realtime Cloud Database |
| **Gang-Box** | A single physical electrical wall enclosure housing multiple individual light or power switches |
| **Max On Duration** | Maximum permissible contiguous time duration a high-power/hazard-prone appliance is allowed to remain ON |
| **Grid Mapping** | An abstract matrix coordinate system overlaid onto floor plan images to position and locate appliances |

---

## 2. Problem Statement

Modern residential environments feature an increasing array of smart appliances and electrical fixtures. Managing these devices across multiple house floors often suffers from disjointed user interfaces and a lack of spatial context. Crucially, high-power or fire-hazard-prone devices (such as clothing irons and space heaters) pose severe safety risks if left active indefinitely due to human oversight.

Additionally, physical IoT hardware prototyping presents hardware availability and deployment constraints during software development. There is a need for a unified multi-floor mobile management platform paired with automated server-side safety enforcement and a real-time hardware simulator to ensure safety, responsiveness, and seamless online synchronization.

---

## 3. Project Objectives

1. **Interactive Multi-Floor Management**: Deliver a mobile client featuring interactive multi-floor layouts overlaid with an abstract grid mapping system for intuitive device placement and control.
2. **Heterogeneous Device Control**: Support varied device profiles including binary outlets, multi-switch gang units, timed light schedules, hazard-monitored appliances, and mock security camera streams.
3. **Automated Safety Enforcement**: Implement server-side safety cutoffs that automatically turn off high-risk devices when maximum operational limits are exceeded and send instant alert notifications.
4. **Bidirectional Real-Time Synchronization**: Ensure state changes propagate seamlessly within sub-second thresholds across the mobile client, cloud database, and hardware simulator.
5. **Hardware Simulation**: Provide a companion web dashboard emulating physical home appliances to validate IoT interaction patterns without physical hardware constraints.
6. **Device Usage Reporting**: Offer analytical insights into appliance operational history and energy/time usage patterns.

---

## 4. Functional Requirements

### 4.1 Multi-Floor & Grid Mapping Management
| Requirement ID | Description | Priority |
| :--- | :--- | :--- |
| **FR-1.1** | The system shall allow users to create, view, edit, and delete multiple house floor plans (e.g., Ground Floor, First Floor). | High |
| **FR-1.2** | The system shall render an abstract grid overlay (matrix grid) on top of selected floor plan background images for spatial device positioning. | High |
| **FR-1.3** | The system shall allow users to place, position, and reassign smart devices to specific coordinates on the floor plan grid. | High |
| **FR-1.4** | The system shall provide pre-loaded sample floor plans for demonstration and evaluation purposes. | Medium |

### 4.2 Heterogeneous Device Profiles & Management
| Requirement ID | Description | Priority |
| :--- | :--- | :--- |
| **FR-2.1** | The system shall support **Single Electrical Outlets** representing binary continuous power supply nodes (`ON` / `OFF`). | High |
| **FR-2.2** | The system shall support **Multi-Switch Gang-Box Units** managing a variable number of separate, individually addressable switches (e.g., 2, 3, or 5 switches within a single physical entity). | High |
| **FR-2.3** | The system shall support **Safety-Critical Appliances** (e.g., Clothing Irons) with configurable `max_permissible_active_duration` parameters. | High |
| **FR-2.4** | The system shall support **Smart Lighting** with automated time-window scheduling (configuring automated `turn_on_time` and `turn_off_time`). | High |
| **FR-2.5** | The system shall support **Security Cameras** displaying mock camera snapshots and mock video/stream URIs. | Medium |

### 4.3 Device Operational Status Tracking
| Requirement ID | Description | Priority |
| :--- | :--- | :--- |
| **FR-3.1** | The system shall reactively display the current state of every registered device on the mobile UI. | High |
| **FR-3.2** | The system shall support four distinct operational status states for devices: `ON`, `OFF`, `ERROR`, and `DISCONNECTED`. | High |
| **FR-3.3** | The system shall visually distinguish each operational status state using dedicated color indicators and icons on the floor map and device lists. | High |

### 4.4 Real-Time Bidirectional Synchronization
| Requirement ID | Description | Priority |
| :--- | :--- | :--- |
| **FR-4.1** | Any state change initiated from the mobile application shall be written to the cloud database immediately without requiring manual submit triggers. | High |
| **FR-4.2** | State updates driven by external sources (cloud functions or hardware simulator) shall instantly reflect on the mobile viewport without requiring manual screen refresh. | High |

### 4.5 Server-Side Safety Cutoffs & Automated Rules
| Requirement ID | Description | Priority |
| :--- | :--- | :--- |
| **FR-5.1** | A cloud background listener or worker process shall continuously monitor active durations for safety-critical appliances. | High |
| **FR-5.2** | If an active device breaches its configured `max_permissible_active_duration`, the server worker shall automatically update the device state to `OFF` in the database. | High |
| **FR-5.3** | Upon triggering an automated safety cutoff, the system shall generate an alert notification log and push a push/in-app notification to the mobile client. | High |
| **FR-5.4** | The background safety worker shall process automated schedule triggers for smart lighting based on preset time windows. | Medium |

### 4.6 Reporting & Usage Analytics
| Requirement ID | Description | Priority |
| :--- | :--- | :--- |
| **FR-6.1** | The system shall log device operational state transition events with timestamps (activation time, deactivation time, duration). | Medium |
| **FR-6.2** | The mobile application shall display historical usage data and active duration metrics for key devices in a visual reporting interface (e.g., charts/metrics). | Medium |

### 4.7 Companion Hardware Simulator
| Requirement ID | Description | Priority |
| :--- | :--- | :--- |
| **FR-7.1** | The hardware simulator shall provide a web dashboard representing physical home appliances linked to the shared cloud database. | High |
| **FR-7.2** | The simulator shall listen to cloud database updates in real time and visually reflect physical state changes (e.g., bulb light up, outlet active glow). | High |
| **FR-7.3** | The simulator shall allow manual toggling of simulated physical states, including injecting `ERROR` and `DISCONNECTED` fault conditions for testing. | High |

---

## 5. Non-Functional Requirements

### 5.1 Performance
- **NFR-1.1 (Latency)**: End-to-end state synchronization latency between mobile client, cloud database, and hardware simulator shall not exceed **500 milliseconds** under normal network conditions.
- **NFR-1.2 (UI Responsiveness)**: Mobile UI interactions (button toggles, floor tab switches) shall execute with zero perceptible UI freezing (frame rate $\ge 50$ fps).

### 5.2 Security
- **NFR-2.1 (Authentication)**: Access to device control and home configuration shall require user authentication via Firebase Auth.
- **NFR-2.2 (Data Protection)**: Cloud Firestore database access shall be enforced using strict Firestore Security Rules preventing unauthorized read/write access across user tenants.

### 5.3 Reliability & Fault Tolerance
- **NFR-3.1 (State Consistency)**: The cloud database shall serve as the single source of truth; transient offline states shall automatically sync upon network reconnection.
- **NFR-3.2 (Safety Fail-Safe)**: In cases where a device enters an `ERROR` state, the server worker shall automatically transition the device to a safe `OFF` operational state.

### 5.4 Maintainability
- **NFR-4.1 (Modular Architecture)**: Codebases for mobile client, backend cloud functions, and hardware simulator shall remain strictly separated in dedicated directories.
- **NFR-4.2 (Code Standards)**: Code shall follow ES6+/TypeScript formatting conventions and clear module boundary separation.

### 5.5 Scalability
- **NFR-5.1 (Device Expansion)**: Database schema and UI grids shall support adding up to 50 individual devices per floor without UI breakdown or structural schema changes.

### 5.6 Availability
- **NFR-6.1 (System Uptime)**: Backend cloud services shall leverage high-availability cloud infrastructure targeting 99.9% uptime.

### 5.7 Usability
- **NFR-7.1 (Mobile UX)**: Mobile application touch controls shall adhere to modern mobile design ergonomics with touch targets $\ge 48\times48$ dp.
- **NFR-7.2 (Accessibility)**: Status indicators shall combine color coding with explicit textual labels (`ON`, `OFF`, `ERROR`, `DISCONNECTED`) for clarity.

---

## 6. Assumptions

1. **Network Connectivity**: Mobile client and hardware simulator have active internet connectivity to communicate with Firebase cloud services.
2. **Mock Media Streams**: Security camera feeds use publicly accessible static image URLs or mock streaming URIs for demonstration.
3. **Sample Layouts**: Pre-packaged floor plan images are hosted on Firebase Storage or bundled statically within the mobile application.

---

## 7. Constraints

1. **Academic Project Scope**: Designed and built within the parameters and timeline of the SCS 3311 Mini-Project curriculum.
2. **Simulation Boundaries**: Physical IoT hardware (e.g., physical ESP32 microcontrollers or relays) is emulated via the Web Hardware Simulator.
3. **Video Presentation**: The project demonstration video must involve all three team members and not exceed 25 minutes in duration.

---

## 8. System Actors

| Actor | Type | Responsibilities & Description |
| :--- | :--- | :--- |
| **Resident / Homeowner** | Human (Mobile Client) | Interacts with mobile app to view floor plans, toggle switches/outlets, set schedules, view camera feeds, and inspect usage reports. |
| **Safety Cloud Listener** | Automated (Backend Server Process) | Listens to database device active timers, enforces `max_on_duration` limits, executes automated shutoffs, and triggers safety alerts. |
| **Hardware Simulator Operator** | Human / Automated (Web Simulator) | Operates the web simulator to verify physical appliance reactions and inject hardware fault states (`ERROR`, `DISCONNECTED`). |

---

## 9. High-Level System Overview

```text
+------------------------------------+          +------------------------------------+
|       Mobile Application           |          |     Companion Hardware Simulator   |
|     (React Native + Expo Client)   |          |         (React.js Web App)         |
+-----------------+------------------+          +-----------------+------------------+
                  |                                               |
                  | Real-Time Sync                                | Real-Time Sync
                  v                                               v
+------------------------------------------------------------------------------------+
|                            Firebase Cloud Platform                                 |
|                                                                                    |
|   +--------------------------+                   +-----------------------------+   |
|   |    Cloud Firestore DB    |                   |       Firebase Storage      |   |
|   | (Single Source of Truth) |                   |  (Floor Plans / Snapshots)  |   |
|   +------------+-------------+                   +-----------------------------+   |
|                |                                                                   |
+----------------|-------------------------------------------------------------------+
                 |
                 v Trigger / Listen
+----------------------------------------------------+
|             Firebase Cloud Functions               |
|  - Active Duration Safety Cutoff Worker            |
|  - Time-Window Light Schedule Automation           |
|  - Push Alert Notification Dispatcher              |
+----------------------------------------------------+
```

---

## 10. Future Enhancements

1. **Hardware Bridge Integration**: Physical microcontrollers (ESP32/ESP8266 via MQTT/WebSockets) replacing or supplementing the web simulator.
2. **Voice Assistant Integration**: Alexa and Google Assistant skill integration for hands-free voice commands.
3. **AI Power Anomaly Detection**: Machine learning algorithms analyzing device power consumption spikes to predict appliance degradation before catastrophic failure.
4. **Geofencing & Proximity Automation**: Automated device shutdown when all registered residents exit the physical geofence.
