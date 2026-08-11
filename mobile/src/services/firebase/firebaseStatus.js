import { app, db } from './firebaseApp';
import { firebaseConfig, isFirebaseConfigured } from './firebaseConfig';

/**
 * Returns whether the Firebase connection is considered online and usable.
 * Currently checks the initialization state. Future: can be extended
 * to use Firestore's .enableNetwork() / .disableNetwork() or
 * listen to the special `.info/connected` document.
 */
export const isFirebaseOnline = () => {
  return isFirebaseConfigured() && !!app && !!db;
};

/**
 * Returns a status object describing the current Firebase connection state.
 * Useful for debug screens, connection indicators, and diagnostics.
 *
 * @returns {{ connected: boolean, projectId: string | null, appName: string | null }}
 */
export const getFirebaseStatus = () => {
  const connected = isFirebaseOnline();

  return {
    connected,
    projectId: connected ? (firebaseConfig.projectId || null) : null,
    appName: connected ? (app?.name || null) : null,
  };
};
