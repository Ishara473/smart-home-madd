import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseApp';
import { withTimestamps, HOME_ID } from './seedUtils';

export const seedUsers = async (authUid) => {
  const userMock = {
    uid: authUid,
    displayName: "Ishara",
    email: "ishara@example.com",
    photoURL: null,
    currentHomeId: HOME_ID,
    role: "OWNER",
    preferences: { temperatureUnit: "CELSIUS", theme: "DARK", language: "en" },
    notifications: { pushEnabled: true, securityAlerts: true, deviceAlerts: true, automationAlerts: false },
    fcmToken: null
  };
  
  await setDoc(doc(db, 'users', userMock.uid), withTimestamps(userMock), { merge: false });
};