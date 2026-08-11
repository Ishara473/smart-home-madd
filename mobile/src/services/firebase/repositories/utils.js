import { serverTimestamp } from 'firebase/firestore';

export const mapDoc = (doc) => ({
  id: doc.id,
  ...doc.data()
});

export const withCreatedTimestamps = (data) => ({
  ...data,
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp()
});

export const withUpdatedTimestamps = (data) => ({
  ...data,
  updatedAt: serverTimestamp()
});