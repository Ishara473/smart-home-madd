# Firestore Domain Model & Collection Architecture
## ✅ APPROVED — Prompt 032A Finalized

> **Status:** Architecture design complete. No implementation.
> **Next:** Prompt 032B — Firestore Document Schema Design (exact fields, types, defaults, validation rules).

---

## Refinements Applied

| # | Refinement |
| :--- | :--- |
| **R1** | Removed `deviceIds[]` from `rooms`. Room-to-device relationship owned exclusively by `devices.roomId`. |
| **R2** | User–home membership: `users` stores `currentHomeId`; `homes` stores `memberUserIds[]`. No duplicated ownership. |
| **R3** | `users` documents use **Firebase Authentication UID**. All other collections use **Firestore auto-generated IDs**. |
| **R4** | `createdAt` and `updatedAt` are **mandatory timestamp fields on every document in every collection**. |

---

## Project Analysis Summary

Every existing model, mock data file, repository, context, and service was inspected before proposing this architecture.

| Artifact | Key Findings |
| :--- | :--- |
| **Device Model** | `id`, `name`, `type` (LIGHT/OUTLET/SWITCH_PANEL/IRON/CAMERA/FAN/THERMOSTAT), `location` (`{room, floor}`), `status`, `state` (device-type-specific), `powerConsumption`, `lastUpdated`. Switch panels have nested `switches[]`. |
| **Floor Model** | `id`, `name`, `rooms[]`, `roomCount`, `deviceCount`, `status`. |
| **Room Model** | `id`, `name`, `floorId` (reference), `devices[]` (array of device ID strings), `metadata` (`area`, `icon`). Already uses `floorId` as foreign key. |
| **Camera Model** | Separate from devices. `id`, `deviceId` (reference), `name`, `location`, `state` (`streaming`, `recording`, `motionDetection`), `snapshotUri`, `streamUri`, `lastUpdated`. |
| **Schedule Model (features/schedules)** | Named automations: `id`, `name`, `enabled`, `trigger` (`{type, value}`), `action` (`{deviceId, command}`), `lastExecuted`. |
| **Schedule Model (features/scheduling)** | Device time schedules: `id`, `deviceId`, `scheduleType`, `startTime`, `endTime`, `enabled`. Also contains Safety Rules: `id`, `deviceId`, `maxOnDuration`, `enabled`, `action`. |
| **Notification Model** | `id`, `title`, `message`, `type` (SECURITY/DEVICE/AUTOMATION), `severity` (INFO/WARNING/ERROR), `read`, `timestamp`, `source` (`{deviceId}`). |
| **Report Model** | `id`, `type` (ENERGY/DEVICE_HEALTH/AUTOMATION), `title`, `period` (`{start, end}`), `data` (polymorphic). |
| **Floor Map Model** | `floorId`, `width`, `height`, `gridSize`, room grid positions, device grid positions. Embedded in `floors` documents. |
| **Dashboard Mock Data** | Defines a `home` concept: `'Smart Villa Residency'`, floor summaries, device status counts, safety alerts, recent activity, quick status. |
| **Device Constants** | Status: `ON/OFF/ERROR/DISCONNECTED`. Types: `LIGHT/OUTLET/SWITCH_PANEL/IRON/CAMERA` (+ `FAN/THERMOSTAT` in mock data). |
| **Realtime Service** | Placeholder `subscribe(channel, callback)` — explicitly designed for future `onSnapshot` replacement. |

---

## 1. Firestore Collection List

**8 top-level collections** — no more, no fewer.

```
Firestore Database
 ├── users
 ├── homes
 ├── floors
 ├── rooms
 ├── devices
 ├── cameras
 ├── schedules
 ├── notifications
 └── reports
```

> **Not a separate collection:** `safetyRules` — embedded as objects inside `schedules` documents.
> **Not a separate collection:** Floor map layout — embedded inside `floors` documents as a nested map.

---

## 2. Collection Responsibilities

### `users`

| Attribute | Detail |
| :--- | :--- |
| **Purpose** | Stores user account profiles and the user's currently active home selection. |
| **Document ID** | ⚠️ **Firebase Authentication UID** (not auto-generated). |
| **Ownership** | Root-level. Identity anchored to Firebase Auth. |
| **Relationships** | References one `homes` document via `currentHomeId`. |
| **Why it exists** | Enables multi-user auth, role-based access, and personalizing push notification targets. `currentHomeId` scopes all queries to the correct home on login. |

### `homes`

| Attribute | Detail |
| :--- | :--- |
| **Purpose** | Represents a physical smart home installation. Root ownership anchor for all physical assets. |
| **Document ID** | Firestore auto-generated. |
| **Ownership** | Root-level. Created by a `users` document (the owner). |
| **Relationships** | Has many `floors`, `devices`, `schedules`, `notifications`, `reports` (via `homeId`). Stores `memberUserIds[]` as the authoritative membership list. |
| **Membership model** | `homes` stores `memberUserIds[]`. A user joining a home = one write to `homes`. No write to `users` required. *(R2)* |

### `floors`

| Attribute | Detail |
| :--- | :--- |
| **Purpose** | Represents a physical floor level within a home. Contains floor metadata, derived summary counts, status, and embedded floor map layout. |
| **Document ID** | Firestore auto-generated. |
| **Ownership** | Root-level. References parent `homes` via `homeId`. |
| **Relationships** | Belongs to one `homes`. Has many `rooms` (via `rooms.floorId`). Has many `devices` (via `devices.floorId`). Floor map layout embedded directly. |

### `rooms`

| Attribute | Detail |
| :--- | :--- |
| **Purpose** | Represents a physical room within a floor. Contains room metadata and spatial context. |
| **Document ID** | Firestore auto-generated. |
| **Ownership** | Root-level. References `floors` via `floorId` and `homes` via `homeId`. |
| **Relationships** | Belongs to one `floors`. Belongs to one `homes`. Referenced by many `devices` via `devices.roomId`. |
| **⚠️ R1** | **Does NOT store `deviceIds[]`.** Devices in a room → query `devices WHERE roomId == X`. One source of truth; no dual-write on device moves. |

### `devices`

| Attribute | Detail |
| :--- | :--- |
| **Purpose** | Every IoT device registered in the home. The primary operational collection. |
| **Document ID** | Firestore auto-generated. |
| **Ownership** | Root-level. References `homes` (`homeId`), `floors` (`floorId`), `rooms` (`roomId`). |
| **Relationships** | Belongs to `homes`, `floors`, `rooms`. Has zero or one `cameras`. Referenced by `schedules`, `notifications`, `reports`. |

### `cameras`

| Attribute | Detail |
| :--- | :--- |
| **Purpose** | Streaming, recording, and motion-detection capabilities of camera-type devices. Extends a `devices` document with camera-specific state. |
| **Document ID** | Firestore auto-generated. |
| **Ownership** | Root-level. References its parent `devices` document via `deviceId` and `homes` via `homeId`. |
| **Relationships** | One-to-one with a `devices` document. Belongs to one `homes`. |
| **Why separated** | Camera model already separated in codebase. Different read patterns (streaming vs. control). Camera-specific fields (`snapshotUri`, `streamUri`, `streaming`, `recording`, `motionDetection`) don't apply to other device types. |

### `schedules`

| Attribute | Detail |
| :--- | :--- |
| **Purpose** | All automation rules, device time schedules, and safety rules. Unifies both schedule models from the codebase. |
| **Document ID** | Firestore auto-generated. |
| **Ownership** | Root-level. References `homes` via `homeId` and `devices` via `deviceId`. |
| **Unified model** | Merges `features/schedules` (named automation rules) and `features/scheduling` (time schedules + safety rules) under a single collection with a `scheduleType` discriminator (`TIME_RANGE`, `TIMER`, `TIME_TRIGGER`, `SAFETY_RULE`). |

### `notifications`

| Attribute | Detail |
| :--- | :--- |
| **Purpose** | System-generated events, alerts, and automation execution logs. |
| **Document ID** | Firestore auto-generated. |
| **Ownership** | Root-level. Scoped to `homes` via `homeId`. Optionally scoped to a user via `userId`. |
| **Relationships** | Belongs to `homes`. References `devices` via `source.deviceId`. Optionally references `schedules`. |

### `reports`

| Attribute | Detail |
| :--- | :--- |
| **Purpose** | Pre-computed analytics snapshots: energy consumption, device health, automation activity. |
| **Document ID** | Firestore auto-generated. |
| **Ownership** | Root-level. Belongs to `homes` via `homeId`. |
| **Relationships** | Belongs to `homes`. References `devices` and `schedules` by ID within embedded report data. |

---

## 3. Relationship Diagram

```
User (Firebase Auth UID)
 │
 │ currentHomeId →
 ▼
Home (auto-ID)
 │ homeId on all child documents
 │
 ├──────────────────────────────┐
 │                              │
 ▼                              ▼
Floor (auto-ID)            Notification (auto-ID)
 │ floorId                  source.deviceId →
 │                              │
 ▼                              │
Room (auto-ID)                  │
 │                              │
 │ roomId ←──────────────────── │
 ▼                              │
Device (auto-ID)  ──────────────┘
 │ deviceId
 │
 ├──────────────────┐
 │                  │
 ▼                  ▼
Camera (auto-ID)  Schedule (auto-ID)
                   │ scheduleId
                   │
                   ▼
              Notification (auto-ID)

Report (auto-ID)   [homeId only — references deviceIds within embedded data]
```

### Relationship Table

| Relationship | Type | Notes |
| :--- | :--- | :--- |
| `users` → `homes` | Many-to-many | `users.currentHomeId`; `homes.memberUserIds[]` |
| `homes` → `floors` | One-to-many | `floors.homeId` |
| `floors` → `rooms` | One-to-many | `rooms.floorId` |
| `rooms` → `devices` | One-to-many | `devices.roomId` — rooms do NOT store `deviceIds[]` *(R1)* |
| `homes` → `devices` | One-to-many | `devices.homeId` (primary query anchor) |
| `devices` → `cameras` | One-to-one | `cameras.deviceId` |
| `devices` → `schedules` | One-to-many | `schedules.deviceId` |
| `devices` → `notifications` | One-to-many | `notifications.source.deviceId` |
| `schedules` → `notifications` | One-to-many | Automation execution events |
| `homes` → `reports` | One-to-many | `reports.homeId` |

---

## 4. Document ID Strategy

*(R3)*

| Collection | ID Strategy | Rationale |
| :--- | :--- | :--- |
| `users` | **Firebase Authentication UID** | Security Rules use `auth.uid`. Any other ID requires a secondary lookup on every authenticated request. |
| `homes` | Firestore auto-generated | |
| `floors` | Firestore auto-generated | |
| `rooms` | Firestore auto-generated | |
| `devices` | Firestore auto-generated | |
| `cameras` | Firestore auto-generated | |
| `schedules` | Firestore auto-generated | |
| `notifications` | Firestore auto-generated | |
| `reports` | Firestore auto-generated | |

> **Migration note:** Mock data IDs (`dev-light-1`, `floor-ground`) exist for development clarity only. Initial seeding may preserve these for traceability; new documents will use auto-generated IDs.

---

## 5. Mandatory Timestamp Fields

*(R4)*

Every document in every collection must include:

| Field | Type | Rule |
| :--- | :--- | :--- |
| `createdAt` | Firestore `Timestamp` | Set once at creation. Never modified. |
| `updatedAt` | Firestore `Timestamp` | Updated on every document write. |

Enables `orderBy('updatedAt')` across all collections, auditing, and migration traceability. Exact defaults and server-side behavior defined in Prompt 032B.

---

## 6. Firestore Design Principles

### 6.1 Flat Collection Hierarchy
All 8 collections are top-level. No subcollections. Enables consistent `homeId`-scoped queries without Collection Group complexity.

### 6.2 References, Not Joins
Relationships are expressed as stored ID strings. Repositories resolve them via sequential or parallel reads. The UI never sees this.

### 6.3 Single Ownership of Relationships *(R1 + R2)*
- **Device location** → owned by `devices.roomId` only.
- **Home membership** → owned by `homes.memberUserIds[]` only.
- Moving a device = one write. A user joining a home = one write.

### 6.4 Controlled Denormalization
- `devices` stores both `roomId` AND `floorId` (avoids room traversal for floor-level queries).
- `floors` stores derived `roomCount` and `deviceCount` (avoids counting subcollection documents for dashboard).
- `rooms` stores `homeId` in addition to `floorId` (consistent tenant scoping).

### 6.5 Read-Optimized Query Patterns

| Common Read Pattern | Collection | Filter |
| :--- | :--- | :--- |
| All devices in a home | `devices` | `homeId == X` |
| All devices on a floor | `devices` | `floorId == X` |
| All devices in a room | `devices` | `roomId == X` |
| All devices by type | `devices` | `homeId == X, type == 'LIGHT'` |
| Unread notifications | `notifications` | `homeId == X, read == false` |
| Active schedules | `schedules` | `homeId == X, enabled == true` |
| Reports by type | `reports` | `homeId == X, type == 'ENERGY'` |

### 6.6 `homeId` as Universal Tenant Boundary
Every document (except `users`) carries `homeId`. Firestore Security Rules enforce home membership with one rule pattern.

### 6.7 Repository Independence
Firestore collection structure is invisible to UI and hooks. Repository interfaces (`getAll`, `getById`, `create`, `update`, `remove`) are the stable contract between layers.

---

## 7. Naming Conventions

| Convention | Rule |
| :--- | :--- |
| **Collection names** | Plural noun, all lowercase — `users`, `homes`, `floors`, `rooms`, `devices`, `cameras`, `schedules`, `notifications`, `reports` |
| **General fields** | `camelCase` |
| **Single ID references** | Suffix `Id` — `homeId`, `floorId`, `roomId`, `deviceId` |
| **Array ID references** | Suffix `Ids` — `memberUserIds` |
| **Timestamps** | Suffix `At` — `createdAt`, `updatedAt`, `lastExecutedAt` |
| **Booleans** | Prefix `is` or `has` — `isEnabled`, `isRead` |
| **Enum / status values** | `SCREAMING_SNAKE_CASE` matching existing app constants — `ON`, `OFF`, `ERROR`, `LIGHT`, `SECURITY` |

---

## 8. Scalability & Future Compatibility

| Future Feature | Architecture Support |
| :--- | :--- |
| Multiple homes | `homes` collection + `homeId` on every document |
| Multiple users & roles | `homes.memberUserIds[]` + Security Rules membership checks |
| Additional device types | `devices.type` discriminator — extend `DEVICE_TYPES` constant |
| Additional automation rules | `schedules.scheduleType` discriminator — no new collection |
| Future analytics | `reports` collection + Cloud Functions write snapshots |
| Real-time sync | `realtimeService.js` → `onSnapshot` on `devices` and `notifications` |
| Push notifications | `users` stores FCM tokens; Cloud Functions dispatch on `notifications` writes |
| Soft-delete (future) | Optional `isDeleted: boolean` + `deletedAt: Timestamp` on any collection — preserves historical references in reports and notifications |
| Firestore Security Rules | `request.auth.uid in home.memberUserIds` — supported by current architecture |

---

## 9. Design Decisions & Justifications

| Decision | Justification |
| :--- | :--- |
| Rooms do not store `deviceIds[]` *(R1)* | Eliminates dual-write inconsistency. Firestore optimized for `WHERE roomId == X`. One source of truth. |
| `homes` stores `memberUserIds[]` *(R2)* | Home owns membership. Adding a user = one write. No `users` document update required. |
| `users` use Firebase Auth UID *(R3)* | Security Rules match `auth.uid`. Any other ID requires a secondary lookup. |
| `createdAt` / `updatedAt` on every document *(R4)* | Enables `orderBy`, auditing, migration traceability, rule-enforced `createdAt` immutability. |
| Separate `cameras` collection | Camera model already separated in codebase. Different read patterns. Camera fields don't apply to other devices. |
| Unified `schedules` collection | Two schedule models in the codebase. Unifying avoids cross-collection joins for reports. `scheduleType` discriminator preserves both models. |
| Floor map embedded in `floors` | Read only when opening a specific floor. No document size risk. |
| Safety rules embedded in `schedules` | One safety rule per device currently. No separate collection needed. |
| Flat hierarchy over subcollections | `homeId` filtering outperforms subcollection traversal for cross-floor and cross-room queries. |

---

## Roadmap Status

| Prompt | Description | Status |
| :--- | :--- | :--- |
| 030 | Firebase Infrastructure | ✅ Complete |
| 031A | Validation & Safe Initialization | ✅ Complete |
| 031B | Firebase Console Setup | ✅ Complete |
| **032A** | **Firestore Domain Model & Collection Architecture** | **✅ Approved** |
| 032B | Firestore Document Schema Design | 🔜 Next |
| 032C | Firestore Query Design | ⬜ Pending |
| 032D | Indexes & Security Rules Planning | ⬜ Pending |
| 033 | Device Repository Migration | ⬜ Pending |
