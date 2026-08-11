import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseApp';
import { withTimestamps, HOME_ID } from './seedUtils';
import { notificationMockData } from '../../../features/notifications/data/notificationMockData';

export const seedNotifications = async () => {
  for (const notification of notificationMockData) {
    const { id, read, timestamp, ...data } = notification;
    const seedData = {
      ...data,
      homeId: HOME_ID,
      isRead: read || false
    };
    await setDoc(doc(db, 'notifications', id), withTimestamps(seedData), { merge: false });
  }
};