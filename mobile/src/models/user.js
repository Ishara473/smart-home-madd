/**
 * Firestore User document model.
 * Collection: users/{uid}
 */
export function createUser({
  uid,
  displayName = '',
  email = '',
  photoURL = null,
  currentHomeId = null,
  role = 'OWNER',
  preferences = {
    temperatureUnit: 'CELSIUS',
    theme: 'DARK',
    language: 'en',
  },
  notifications = {
    pushEnabled: true,
    securityAlerts: true,
    deviceAlerts: true,
    automationAlerts: false,
  },
  fcmToken = null,
  createdAt,
  updatedAt,
}) {
  return {
    uid,
    displayName,
    email,
    photoURL,
    currentHomeId,
    role,
    preferences,
    notifications,
    fcmToken,
    createdAt,
    updatedAt,
  };
}

export default createUser;
