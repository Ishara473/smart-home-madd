import { scheduleRepository } from '../../services/firebase/repositories/scheduleRepository';
import { shouldUseMockData, isFirebaseConfigured } from '../../services/firebase';

/**
 * Firebase Firestore Schedule Repository (src/repositories layer).
 */
export const FirebaseScheduleRepository = {
  getAll: async (homeId) => {
    if (!isFirebaseConfigured() || shouldUseMockData()) return [];
    return scheduleRepository.getSchedulesByHome(homeId);
  },

  getById: async (id) => {
    if (!isFirebaseConfigured() || shouldUseMockData()) return null;
    const { doc, getDoc } = await import('firebase/firestore');
    const { db } = await import('../../services/firebase/firebaseApp');
    const snapshot = await getDoc(doc(db, 'schedules', id));
    if (!snapshot.exists()) return null;
    return { id: snapshot.id, ...snapshot.data() };
  },

  getEnabled: async (homeId) => {
    if (!isFirebaseConfigured() || shouldUseMockData()) return [];
    return scheduleRepository.getEnabledSchedules(homeId);
  },

  getByDevice: async (deviceId) => {
    if (!isFirebaseConfigured() || shouldUseMockData()) return [];
    return scheduleRepository.getSchedulesByDevice(deviceId);
  },

  create: async (data) => {
    if (!isFirebaseConfigured() || shouldUseMockData()) return null;
    return scheduleRepository.createSchedule(data);
  },

  update: async (id, data) => {
    if (!isFirebaseConfigured() || shouldUseMockData()) return false;
    await scheduleRepository.updateSchedule(id, data);
    return true;
  },

  remove: async (id) => {
    if (!isFirebaseConfigured() || shouldUseMockData()) return false;
    await scheduleRepository.deleteSchedule(id);
    return true;
  },
};

export default FirebaseScheduleRepository;
