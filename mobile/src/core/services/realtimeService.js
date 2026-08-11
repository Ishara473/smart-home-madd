import { collection, query, where, onSnapshot, doc } from 'firebase/firestore';
import { db } from '../../services/firebase/firebaseApp';
import { shouldUseMockData, isFirebaseConfigured } from '../../services/firebase';

/**
 * Real-time sync service backed by Firestore onSnapshot listeners.
 * Provides bidirectional sync: local changes propagate to Firestore,
 * and external Firestore updates push to the mobile viewport.
 */
const realtimeService = {
  /**
   * Subscribe to a Firestore collection with optional filters.
   * Returns an unsubscribe function for cleanup.
   *
   * @param {string} collectionName - Firestore collection name
   * @param {Function} callback - Receives array of documents on each update
   * @param {Array} constraints - Optional Firestore query constraints
   * @returns {Function} unsubscribe function
   */
  subscribe: (collectionName, callback, constraints = []) => {
    if (!isFirebaseConfigured() || shouldUseMockData()) {
      if (typeof __DEV__ !== 'undefined' && __DEV__) {
        console.log(`[RealtimeService]: Mock mode — no listener for '${collectionName}'`);
      }
      return () => {};
    }

    try {
      let q;
      if (constraints.length > 0) {
        q = query(collection(db, collectionName), ...constraints);
      } else {
        q = collection(db, collectionName);
      }

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const documents = snapshot.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          }));
          callback(documents);
        },
        (error) => {
          console.error(`[RealtimeService]: onSnapshot error for '${collectionName}':`, error);
        }
      );

      return unsubscribe;
    } catch (error) {
      console.error(`[RealtimeService]: subscribe setup error for '${collectionName}':`, error);
      return () => {};
    }
  },

  /**
   * Subscribe to a single Firestore document.
   * Returns an unsubscribe function for cleanup.
   *
   * @param {string} collectionName - Firestore collection name
   * @param {string} documentId - Document ID
   * @param {Function} callback - Receives document data on each update
   * @returns {Function} unsubscribe function
   */
  subscribeToDoc: (collectionName, documentId, callback) => {
    if (!isFirebaseConfigured() || shouldUseMockData()) {
      return () => {};
    }

    try {
      const docRef = doc(db, collectionName, documentId);

      const unsubscribe = onSnapshot(
        docRef,
        (snapshot) => {
          if (snapshot.exists()) {
            callback({ id: snapshot.id, ...snapshot.data() });
          } else {
            callback(null);
          }
        },
        (error) => {
          console.error(`[RealtimeService]: onSnapshot error for doc '${collectionName}/${documentId}':`, error);
        }
      );

      return unsubscribe;
    } catch (error) {
      console.error(`[RealtimeService]: subscribeToDoc error:`, error);
      return () => {};
    }
  },

  /**
   * Unsubscribe from a listener (convenience wrapper).
   */
  unsubscribe: (unsubscribeFn) => {
    if (typeof unsubscribeFn === 'function') {
      unsubscribeFn();
    }
  },
};

export default realtimeService;
