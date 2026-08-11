import { cameraRepository } from '../../services/firebase/repositories/cameraRepository';
import { shouldUseMockData, isFirebaseConfigured } from '../../services/firebase';

/**
 * Firebase Firestore Camera Repository (src/repositories layer).
 */
export const FirebaseCameraRepository = {
  getAll: async (homeId) => {
    if (!isFirebaseConfigured() || shouldUseMockData()) return [];
    return cameraRepository.getCamerasByHome(homeId);
  },

  getById: async (id) => {
    if (!isFirebaseConfigured() || shouldUseMockData()) return null;
    const { collection, query, where, getDocs } = await import('firebase/firestore');
    const { db } = await import('../../services/firebase/firebaseApp');
    const q = query(collection(db, 'cameras'), where('__name__', '==', id));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
  },

  getByDeviceId: async (deviceId) => {
    if (!isFirebaseConfigured() || shouldUseMockData()) return null;
    return cameraRepository.getCameraByDeviceId(deviceId);
  },

  create: async (data) => {
    if (!isFirebaseConfigured() || shouldUseMockData()) return null;
    const { setDoc, doc, collection } = await import('firebase/firestore');
    const { db } = await import('../../services/firebase/firebaseApp');
    const docRef = data.id ? doc(db, 'cameras', data.id) : doc(collection(db, 'cameras'));
    const { id, ...cameraData } = data;
    await setDoc(docRef, { ...cameraData, createdAt: new Date(), updatedAt: new Date() });
    return docRef.id;
  },

  update: async (id, data) => {
    if (!isFirebaseConfigured() || shouldUseMockData()) return false;
    const { updateDoc, doc } = await import('firebase/firestore');
    const { db } = await import('../../services/firebase/firebaseApp');
    await updateDoc(doc(db, 'cameras', id), { ...data, updatedAt: new Date() });
    return true;
  },

  remove: async (id) => {
    if (!isFirebaseConfigured() || shouldUseMockData()) return false;
    const { deleteDoc, doc } = await import('firebase/firestore');
    const { db } = await import('../../services/firebase/firebaseApp');
    await deleteDoc(doc(db, 'cameras', id));
    return true;
  },

  subscribe: (homeId, callback) => {
    if (!isFirebaseConfigured() || shouldUseMockData()) {
      return { unsubscribe: () => {} };
    }
    return cameraRepository.subscribeToCameras(homeId, callback);
  },
};

export default FirebaseCameraRepository;
