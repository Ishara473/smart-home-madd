import { notificationRepository } from '../../services/firebase/repositories/notificationRepository';
import { shouldUseMockData, isFirebaseConfigured } from '../../services/firebase';

/**
 * Firebase Firestore Notification Repository (src/repositories layer).
 */
export const FirebaseNotificationRepository = {
  getAll: async (homeId, limitCount = 20) => {
    if (!isFirebaseConfigured() || shouldUseMockData()) return [];
    return notificationRepository.getRecentNotifications(homeId, limitCount);
  },

  getById: async (id) => {
    if (!isFirebaseConfigured() || shouldUseMockData()) return null;
    const { doc, getDoc } = await import('firebase/firestore');
    const { db } = await import('../../services/firebase/firebaseApp');
    const snapshot = await getDoc(doc(db, 'notifications', id));
    if (!snapshot.exists()) return null;
    return { id: snapshot.id, ...snapshot.data() };
  },

  create: async (data) => {
    if (!isFirebaseConfigured() || shouldUseMockData()) return null;
    const { setDoc, doc, collection } = await import('firebase/firestore');
    const { db } = await import('../../services/firebase/firebaseApp');
    const docRef = data.id ? doc(db, 'notifications', data.id) : doc(collection(db, 'notifications'));
    const { id, ...notifData } = data;
    await setDoc(docRef, { ...notifData, isRead: false, createdAt: new Date(), updatedAt: new Date() });
    return docRef.id;
  },

  markRead: async (id) => {
    if (!isFirebaseConfigured() || shouldUseMockData()) return false;
    await notificationRepository.markNotificationRead(id);
    return true;
  },

  getUnreadCount: async (homeId) => {
    if (!isFirebaseConfigured() || shouldUseMockData()) return 0;
    return notificationRepository.getUnreadCount(homeId);
  },

  subscribe: (homeId, callback, limitCount = 20) => {
    if (!isFirebaseConfigured() || shouldUseMockData()) {
      return { unsubscribe: () => {} };
    }
    return notificationRepository.subscribeToNotifications(homeId, callback, limitCount);
  },
};

export default FirebaseNotificationRepository;
