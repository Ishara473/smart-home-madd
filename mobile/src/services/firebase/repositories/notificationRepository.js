import { collection, query, where, getDocs, onSnapshot, doc, updateDoc, addDoc } from 'firebase/firestore';
import { db } from '../firebaseApp';
import { mapDoc, withCreatedTimestamps, withUpdatedTimestamps } from './utils';

export const notificationRepository = {
  async createNotification(notification) {
    try {
      const ref = await addDoc(collection(db, 'notifications'), withCreatedTimestamps({
        isRead: false,
        severity: 'HIGH',
        type: 'SAFETY',
        ...notification,
      }));
      return ref.id;
    } catch (error) {
      console.error('[notificationRepository] createNotification error', error);
    }
  },
  async getRecentNotifications(homeId, limitCount = 20) {
    try {
      const q = query(
        collection(db, 'notifications'),
        where('homeId', '==', homeId)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(mapDoc)
        .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
        .slice(0, limitCount);
    } catch (error) {
      console.error('[notificationRepository] getRecentNotifications error', error);
      throw error;
    }
  },

  subscribeToNotifications(homeId, callback, limitCount = 20) {
    try {
      const q = query(
        collection(db, 'notifications'),
        where('homeId', '==', homeId)
      );
      return onSnapshot(q, (snapshot) => {
        const docs = snapshot.docs.map(mapDoc)
          .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
          .slice(0, limitCount);
        callback(docs);
      }, (error) => {
        console.error('[notificationRepository] subscribeToNotifications error', error);
      });
    } catch (error) {
      console.error('[notificationRepository] subscribeToNotifications setup error', error);
      throw error;
    }
  },

  async markNotificationRead(notificationId) {
    try {
      const docRef = doc(db, 'notifications', notificationId);
      await updateDoc(docRef, withUpdatedTimestamps({ isRead: true }));
    } catch (error) {
      console.error('[notificationRepository] markNotificationRead error', error);
      throw error;
    }
  },

  async getUnreadCount(homeId) {
    try {
      const q = query(
        collection(db, 'notifications'),
        where('homeId', '==', homeId)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.filter(d => d.data().isRead === false).length;
    } catch (error) {
      console.error('[notificationRepository] getUnreadCount error', error);
      throw error;
    }
  }
};