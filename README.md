# Smart Home Monitoring & Control System

A comprehensive mobile and web IoT ecosystem for real-time smart home monitoring, interactive floor plan control, safety-critical automated cutoffs, and device analytics.

---

## Technical Architecture & Tech Stack

- **Mobile Client**: React Native with Expo (Cross-platform iOS & Android)
- **Hardware Simulator**: React.js Web Application
- **Cloud Infrastructure & Backend**: Firebase (Realtime Database / Firestore, Cloud Functions, Authentication)
- **State & Sync**: Bidirectional real-time listener synchronization
- **Build System**: EAS (Expo Application Services) for cloud-based APK builds

---

## Repository Structure

```text
Smart Home Monitoring System/
├── .github/              # GitHub Actions workflows and repository templates
├── assets/               # Shared static assets, diagrams, sample floor plans, icons
├── backend/              # Firebase Cloud Functions, safety listeners, DB rules, & indexes
├── docs/                 # Technical documentation, architectural design, and API specs
├── hardware-simulator/  # Web-based Hardware Simulator application (React.js)
├── meeting-notes/        # Team sync notes, sprint logs, and milestone records
├── mobile/               # Mobile Application codebase (React Native + Expo)
├── .gitignore            # Git ignore rules across environments and tools
├── CODE_OF_CONDUCT.md    # Community & team code of conduct
├── CONTRIBUTING.md       # Guidelines for team collaboration & contributions
├── LICENSE               # Open-source license (MIT)
└── README.md             # Project overview & documentation root
```

---

## Development Workflow

1. **Branching Strategy**:
   - `main`: Production-ready release code.
   - `develop`: Primary integration branch.
   - `feature/<feature-name>`: Isolated feature development branches.

2. **Setup Instructions**:
   - Refer to sub-directory READMEs (`mobile/README.md`, `hardware-simulator/README.md`, `backend/README.md`) for component-specific setup and setup commands once applications are initialized.

3. **Code Quality**:
   - Ensure linting and formatting rules are adhered to before submitting Pull Requests.

## Source Code & APK Delivery

- The source code is hosted in GitHub through the repository remote configured for this workspace.
- Android APK builds are generated automatically by GitHub Actions using EAS cloud builds (see `.github/workflows/build-apk.yml`).
- **Build Trigger**: Push to `main` branch or manually trigger via Actions tab
- **APK Download**: After build completes, check workflow logs for the EAS build URL or visit the EAS dashboard
- **EXPO_TOKEN Required**: The GitHub Actions workflow requires an `EXPO_TOKEN` secret to be configured in repository settings (Settings > Secrets and variables > Actions)

### Local APK Build

To build APKs locally using EAS:
```bash
cd mobile
npm install
eas login
eas build --platform android --profile preview --non-interactive
```

---

## Team Members

- **Member 1 (Lead / Mobile Developer)**: `[Name / Student ID]`
- **Member 2 (Backend & Cloud Architect)**: `[Name / Student ID]`
- **Member 3 (Simulator & QA Engineer)**: `[Name / Student ID]`

---

## License

This project is licensed under the [MIT License](LICENSE).
