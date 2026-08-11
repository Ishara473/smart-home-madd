import { serverTimestamp } from 'firebase/firestore';

export const withTimestamps = (data) => {
  return {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
};

export const HOME_ID = 'home-main';