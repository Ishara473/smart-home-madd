import { deviceRepository } from '../../services/firebase/repositories/deviceRepository';
import { shouldUseMockData, isFirebaseConfigured } from '../../services/firebase';

/**
 * Firebase Firestore Device Repository (src/repositories layer).
 * Delegates to the service-layer deviceRepository when Firebase is available,
 * otherwise falls back to mock data.
 */
export const FirebaseDeviceRepository = {
  getAll: async (homeId) => {
    if (!isFirebaseConfigured() || shouldUseMockData()) return [];
    return deviceRepository.getDevicesByHome(homeId);
  },

  getById: async (id) => {
    if (!isFirebaseConfigured() || shouldUseMockData()) return null;
    return deviceRepository.getDeviceById(id);
  },

  getByRoom: async (roomId) => {
    if (!isFirebaseConfigured() || shouldUseMockData()) return [];
    return deviceRepository.getDevicesByRoom(roomId);
  },

  getByFloor: async (floorId) => {
    if (!isFirebaseConfigured() || shouldUseMockData()) return [];
    return deviceRepository.getDevicesByFloor(floorId);
  },

  create: async (data) => {
    if (!isFirebaseConfigured() || shouldUseMockData()) return null;
    return deviceRepository.createDevice(data);
  },

  update: async (id, data) => {
    if (!isFirebaseConfigured() || shouldUseMockData()) return false;
    await deviceRepository.updateDeviceState(id, data);
    return true;
  },

  updateStatus: async (id, status) => {
    if (!isFirebaseConfigured() || shouldUseMockData()) return false;
    await deviceRepository.updateDeviceStatus(id, status);
    return true;
  },

  remove: async (id) => {
    if (!isFirebaseConfigured() || shouldUseMockData()) return false;
    await deviceRepository.deleteDevice(id);
    return true;
  },

  subscribe: (homeId, callback) => {
    if (!isFirebaseConfigured() || shouldUseMockData()) {
      return { unsubscribe: () => {} };
    }
    return deviceRepository.subscribeToDevices(homeId, callback);
  },
};

export default FirebaseDeviceRepository;
