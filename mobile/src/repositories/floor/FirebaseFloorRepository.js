import { floorRepository } from '../../services/firebase/repositories/floorRepository';
import { shouldUseMockData, isFirebaseConfigured } from '../../services/firebase';

/**
 * Firebase Firestore Floor Repository (src/repositories layer).
 */
export const FirebaseFloorRepository = {
  getAll: async (homeId) => {
    if (!isFirebaseConfigured() || shouldUseMockData()) return [];
    return floorRepository.getFloorsByHome(homeId);
  },

  getById: async (id, homeId) => {
    if (!isFirebaseConfigured() || shouldUseMockData()) return null;
    return floorRepository.getFloorById(id, homeId);
  },

  create: async (data) => {
    if (!isFirebaseConfigured() || shouldUseMockData()) return null;
    const { setDoc, doc, collection } = await import('firebase/firestore');
    const { db } = await import('../../services/firebase/firebaseApp');
    const docRef = data.id ? doc(db, 'floors', data.id) : doc(collection(db, 'floors'));
    const { id, ...floorData } = data;
    await setDoc(docRef, { ...floorData, createdAt: new Date(), updatedAt: new Date() });
    return docRef.id;
  },

  update: async (id, data) => {
    if (!isFirebaseConfigured() || shouldUseMockData()) return false;
    const { updateDoc, doc } = await import('firebase/firestore');
    const { db } = await import('../../services/firebase/firebaseApp');
    await updateDoc(doc(db, 'floors', id), { ...data, updatedAt: new Date() });
    return true;
  },

  remove: async (id) => {
    if (!isFirebaseConfigured() || shouldUseMockData()) return false;
    const { deleteDoc, doc } = await import('firebase/firestore');
    const { db } = await import('../../services/firebase/firebaseApp');
    await deleteDoc(doc(db, 'floors', id));
    return true;
  },
};

export default FirebaseFloorRepository;
