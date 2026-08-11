import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseApp';
import { withTimestamps, HOME_ID } from './seedUtils';
import { cameraMockData } from '../../../features/cameras/data/cameraMockData';

export const seedCameras = async () => {
  for (const camera of cameraMockData) {
    const { id, lastUpdated, ...data } = camera;
    const seedData = {
      ...data,
      homeId: HOME_ID
    };
    await setDoc(doc(db, 'cameras', id), withTimestamps(seedData), { merge: false });
  }
};