# UI/UX Design System & Specification
## Smart Home Monitoring & Control System

**Course**: SCS 3311: Mobile Application Design & Development  
**Document Version**: 1.0  
**Date**: July 2026  

---

## 1. Design Philosophy

The design philosophy for the **Smart Home Monitoring & Control System** centers around **Spatial Context, Immediate Feedback, and Safety-First Visibility**. 

Smart home interfaces must reduce cognitive load by presenting complex multi-room environments through intuitive floor plan overlays and visually distinct, glanceable device status badges (`ON`, `OFF`, `ERROR`, `DISCONNECTED`).

---

## 2. Target Users

1. **Primary Household Residents**: Users of varying technical expertise seeking quick, one-tap control of lights, outlets, and multi-switch units across house floors.
2. **Safety-Conscious Homeowners**: Users monitoring high-power hazard appliances (clothing irons) and safety schedules to prevent fire hazards and reduce energy waste.
3. **System Evaluators & Testers**: Technical evaluators monitoring real-time responsiveness and state synchronization between the mobile client and the hardware simulator.

---

## 3. Core Design Principles

1. **Spatial Clarity**: Overlay device nodes directly onto floor plan grid layouts so users control appliances in context with their physical location.
2. **Reactive Feedback Loop**: Every user interaction (toggle, schedule edit) must provide instantaneous visual feedback (<100ms UI response) followed by smooth cloud state confirmation.
3. **Status Uniformity**: Universal state color coding across mobile cards, floor plan icons, and the hardware simulator web dashboard.
4. **Minimal Touch Friction**: Provide large, thumb-friendly touch targets ($\ge 48\times48$ dp) tailored for one-handed mobile use.

---

## 4. Color Theme Recommendations

The system uses a modern dark-mode-first aesthetic with high-contrast functional accent colors to denote device operational states.

| Theme Role | Color Name | Hex Code | Purpose & Usage |
| :--- | :--- | :--- | :--- |
| **Primary Background** | Slate Dark | `#0F172A` | Mobile app & simulator background canvas |
| **Surface Elevation 1** | Navy Surface | `#1E293B` | Cards, floor plan container bounds, bottom sheets |
| **Surface Elevation 2** | Card Highlight | `#334155` | Active modal dialogs, focused input cards |
| **Status: ON** | Emerald Active | `#10B981` | Active power outlets, illuminated switches, active lights |
| **Status: OFF** | Muted Neutral | `#64748B` | Inactive devices, turned off switches |
| **Status: ERROR** | Hazard Amber | `#F59E0B` | Overheating iron alert, timer warning, fault state |
| **Status: DISCONNECTED** | Crimson Fault | `#EF4444` | Unreachable device, network fault state |
| **Primary Accent** | Cyber Blue | `#3B82F6` | Primary buttons, active tab indicators, grid lines |
| **Text Primary** | Pure White | `#F8FAFC` | Primary headings, active labels |
| **Text Secondary** | Slate Muted | `#94A3B8` | Subtitles, timestamps, device metadata |

---

## 5. Typography Recommendations

The design leverages clean, highly legible sans-serif typography (e.g., **Inter** or system default fonts `Roboto` / `SF Pro`).

- **Display Heading**: 24sp / Bold — Floor titles & Dashboard headers
- **Section Heading**: 18sp / Semi-Bold — Card titles, device group headers
- **Body Text**: 14sp / Regular — Device metadata, schedule descriptions
- **Caption / Status Badge**: 12sp / Medium (All Caps) — `ON`, `OFF`, `ERROR`, `DISCONNECTED` status labels
- **Numerical Timer**: 16sp / Monospace — Active duration countdowns for hazard appliances

---

## 6. Icon Guidelines

Icons provide immediate visual recognition for heterogeneous device categories.

- **Outlets**: Single plug icon (`power-plug`)
- **Multi-Switch Units**: Multi-toggle box icon (`view-dashboard-variant` or `toggle-switch-off/on`)
- **Hazard Appliances (Iron)**: Heating element / iron icon (`iron` or `fire-alert`)
- **Lighting**: Light bulb icon (`lightbulb-outline` / `lightbulb-on`)
- **Security Cameras**: Camera feed lens icon (`videocam` / `cameracontrol`)
- **Icon Sizing**: 24dp for device list tiles; 32dp for floor grid overlays.

---

## 7. Spacing & Grid Guidelines

- **Base Layout Grid**: 8dp spacing grid system (4dp, 8dp, 16dp, 24dp, 32dp padding/margins).
- **Floor Plan Abstract Grid**: Matrix grid system (e.g., $10 \times 10$ or $12 \times 8$ grid nodes) overlaid on floor plan images.
- **Card Padding**: 16dp internal padding for device cards; 12dp gap between adjacent grid tiles.

---

## 8. Accessibility Considerations (a11y)

1. **Dual Status Indicators**: Status indicators must not rely solely on color. Every status badge must include explicit text (`ON`, `OFF`, `ERROR`, `DISCONNECTED`) alongside color indicators to accommodate color-blind users.
2. **Contrast Ratio**: Text and interactive elements must maintain a minimum contrast ratio of **4.5:1** against surface backgrounds.
3. **Screen Reader Support**: Accessibility labels (`accessibilityLabel` and `accessibilityHint`) attached to interactive device nodes.

---

## 9. Responsive Design Considerations

1. **Aspect Ratio Scaling**: Floor plan background images scale proportionally with aspect ratio constraints to fit varied screen widths (compact smartphones to tablets).
2. **Flexible Grid Columns**: Device dashboard switches from a 1-column layout on portrait phones to a 2-column or 3-column grid on tablets or landscape views.

---

## 10. Material Design Principles for React Native

1. **Elevation & Depth**: Use subtle shadow layers and surface color shifts (`#1E293B` to `#334155`) to indicate card stack hierarchy and active focus.
2. **Touch Ripple & Feedback**: Utilize native touch feedback (`Pressable` with ripple effects) for physical press tactile feel.
3. **Motion & Transitions**: Smooth 200ms ease-in-out transitions when expanding floor tabs or opening device control drawers.

---

## 11. Dark Mode Considerations

- The application is natively designed with a **Dark Theme** to reduce battery drain on OLED mobile displays and reflect a sleek, modern IoT command center aesthetic.
- High-contrast neon accents (`#10B981` Emerald, `#F59E0B` Amber) stand out against dark surface backgrounds for instant glanceability.

---

## 12. Dashboard Layout Philosophy

The main dashboard is divided into three distinct functional zones:

1. **Floor Selection Bar (Top)**: Horizontal tab bar allowing rapid switching between house floors (Ground Floor, 1st Floor).
2. **Interactive Floor Plan Grid (Center)**: Visual floor plan background overlaid with an abstract coordinate grid displaying draggable/selectable device nodes.
3. **Device Quick Control Deck (Bottom)**: Scrollable list of active devices grouped by category for quick toggling without zooming into the map.

---

## 13. Device Card Design Philosophy

- **Single Outlets**: Binary card with prominent toggle switch, power icon, and current draw indicator.
- **Multi-Switch Gang-Box Units**: Unified card container holding 2, 3, or 5 individual addressable sub-switches with master toggle option.
- **Hazard Appliance (Iron) Card**: Dedicated card displaying active timer, `max_on_duration` progress bar, active countdown timer, and emergency override button.
- **Lighting Card**: Toggle card displaying configured automated `turn_on` and `turn_off` schedule time badges.

---

## 14. Camera Card Design Philosophy

- Aspect ratio fixed at $16:9$ rendering mock snapshot frames or URI stream previews.
- Overlay badge displaying camera location label and live status indicator (`LIVE` green dot vs `DISCONNECTED` red dot).
- Tap action opens full-screen camera view modal.

---

## 15. Report & Analytics Screen Design Philosophy

- Clean, card-based layout displaying daily/weekly active runtime hours for key devices.
- Visual bar charts illustrating power runtime distribution across device categories.
- Safety audit log listing automated cutoff events (e.g., *"Laundry Iron auto-off triggered at 14:32"*).

---

## 16. Notification Design Philosophy

- **In-App Toast Banners**: High-priority amber/red alert banners appearing at top of screen when a safety cutoff fires.
- **Push Notification Format**: Clear concise alert text:  
  *⚠️ Safety Cutoff Fired: "Clothing Iron" exceeded maximum active duration (15 min) and was automatically turned OFF.*

---

## 17. Settings Screen Design Philosophy

- Grouped list layout for system preferences:
  - Account & Firebase Connection Status
  - Default `max_on_duration` safety parameters
  - Sample Floor Plan re-initialization triggers
  - App Version & Evaluation Information
