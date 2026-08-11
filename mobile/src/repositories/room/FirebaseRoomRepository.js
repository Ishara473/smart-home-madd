import { roomRepository } from '../../services/firebase/repositories/roomRepository';
import { shouldUseMockData, isFirebaseConfigured } from '../../services/firebase';

/**
 * Firebase Firestore Room Repository (src/repositories layer).
 */
export const FirebaseRoomRepository = {
  getAll: async (floorId, homeId) => {
    if (!isFirebaseConfigured() || shouldUseMockData()) return [];
    return roomRepository.getRoomsByFloor(floorId, homeId);
  },

  getById: async (id) => {
    if (!isFirebaseConfigured() || shouldUseMockData()) return null;
    return roomRepository.getRoomById(id);
  },

  create: async (data) => {
    if (!isFirebaseConfigured() || shouldUseMockData()) return null;
    const { setDoc, doc, collection } = await import('firebase/firestore');
    const { db } = await import('../../services/firebase/firebaseApp');
    const docRef = data.id ? doc(db, 'rooms', data.id) : doc(collection(db, 'rooms'));
    const { id, ...roomData } = data;
    await setDoc(docRef, { ...roomData, createdAt: new Date(), updatedAt: new Date() });
    return docRef.id;
  },

  update: async (id, data) => {
    if (!isFirebaseConfigured() || shouldUseMockData()) return false;
    const { updateDoc, doc } = await import('firebase/firestore');
    const { db } = await import('../../services/firebase/firebaseApp');
    await updateDoc(doc(db, 'rooms', id), { ...data, updatedAt: new Date() });
    return true;
  },

  remove: async (id) => {
    if (!isFirebaseConfigured() || shouldUseMockData()) return false;
    const { deleteDoc, doc } = await import('firebase/firestore');
    const { db } = await import('../../services/firebase/firebaseApp');
    await deleteDoc(doc(db, 'rooms', id));
    return true;
  },
};

export default FirebaseRoomRepository;
