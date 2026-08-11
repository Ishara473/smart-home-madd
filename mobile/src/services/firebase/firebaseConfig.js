const REQUIRED_ENV_VARS = [
  { key: 'EXPO_PUBLIC_FIREBASE_API_KEY', prop: 'apiKey' },
  { key: 'EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN', prop: 'authDomain' },
  { key: 'EXPO_PUBLIC_FIREBASE_PROJECT_ID', prop: 'projectId' },
  { key: 'EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET', prop: 'storageBucket' },
  { key: 'EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID', prop: 'messagingSenderId' },
  { key: 'EXPO_PUBLIC_FIREBASE_APP_ID', prop: 'appId' },
];

export function validateFirebaseConfig() {
  const missingKeys = [];
  const config = {};

  REQUIRED_ENV_VARS.forEach(({ key, prop }) => {
    const value = process.env[key];
    if (!value || typeof value !== 'string' || value.trim() === '') {
      missingKeys.push(key);
      config[prop] = '';
    } else {
      config[prop] = value.trim();
    }
  });

  const isValid = missingKeys.length === 0;

  if (typeof __DEV__ !== 'undefined' && __DEV__ && !isValid) {
    console.warn(
      `[Firebase Config Validation Warning]\n` +
      `The following required Expo environment variable(s) are missing or unpopulated:\n` +
      missingKeys.map(k => `  • ${k}`).join('\n') + '\n\n' +
      `Firebase initialization has been safely bypassed to prevent runtime errors.\n` +
      `To resolve: Populate credentials from Firebase Console and restart Expo via 'npx expo start -c'.`
    );
  }

  return { isValid, missingKeys, config };
}

export const { config: firebaseConfig, isValid: isConfigValid, missingKeys } = validateFirebaseConfig();

export const isFirebaseConfigured = () => isConfigValid;

/**
 * Explicit mock data mode flag.
 * Set EXPO_PUBLIC_USE_MOCK_DATA=true in .env to force mock data in development.
 * Priority: USE_MOCK_DATA flag > Firebase config availability
 */
export const shouldUseMockData = () => {
  return process.env.EXPO_PUBLIC_USE_MOCK_DATA === 'true';
};

