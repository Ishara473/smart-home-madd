import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseApp';
import { withTimestamps, HOME_ID } from './seedUtils';
import { roomMockData } from '../../../features/rooms/data/roomMockData';

export const seedRooms = async () => {
  for (const room of roomMockData) {
    const { id, devices, ...data } = room; // Remove devices array
    const seedData = {
      ...data,
      homeId: HOME_ID
    };
    await setDoc(doc(db, 'rooms', id), withTimestamps(seedData), { merge: false });
  }
};