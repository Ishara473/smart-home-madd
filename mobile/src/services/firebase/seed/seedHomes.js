import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseApp';
import { withTimestamps, HOME_ID } from './seedUtils';

export const seedHomes = async (authUid) => {
  const homeMock = {
    id: HOME_ID,
    name: "Smart Villa Residency",
    address: "123 Tech Avenue, Colombo",
    timezone: "Asia/Colombo",
    ownerId: authUid,
    memberUserIds: [authUid],
    floorsCount: 2,
    totalDevices: 8,
    activeDevices: 5,
    securityStatus: "ARMED"
  };
  
  const { id, ...data } = homeMock;
  await setDoc(doc(db, 'homes', id), withTimestamps(data), { merge: false });
};