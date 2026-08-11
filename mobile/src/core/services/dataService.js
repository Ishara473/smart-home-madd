import { deviceMockData } from '../../features/devices/data/deviceMockData';
import { floorMockData } from '../../features/floors/data/floorMockData';
import { cameraMockData } from '../../features/cameras/data/cameraMockData';
import { shouldUseMockData, isFirebaseConfigured } from '../../services/firebase';
import { deviceRepository } from '../../services/firebase/repositories/deviceRepository';
import { collection, query, where, getDocs, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../services/firebase/firebaseApp';

/**
 * Core Data Service.
 * Routes to Firestore when Firebase is configured and not in mock mode.
 * Falls back to local mock data otherwise.
 */
export const dataService = {
  getDevices: async (homeId) => {
    if (isFirebaseConfigured() && !shouldUseMockData() && homeId) {
      return deviceRepository.getDevicesByHome(homeId);
    }
    return [...deviceMockData];
  },

  getDeviceById: async (id) => {
    if (isFirebaseConfigured() && !shouldUseMockData()) {
      return deviceRepository.getDeviceById(id);
    }
    return deviceMockData.find((d) => d.id === id) || null;
  },

  getFloors: async (homeId) => {
    if (isFirebaseConfigured() && !shouldUseMockData() && homeId) {
      const { floorRepository } = await import('../../services/firebase/repositories/floorRepository');
      return floorRepository.getFloorsByHome(homeId);
    }
    return [...floorMockData];
  },

  getCameras: async (homeId) => {
    if (isFirebaseConfigured() && !shouldUseMockData() && homeId) {
      const { cameraRepository } = await import('../../services/firebase/repositories/cameraRepository');
      return cameraRepository.getCamerasByHome(homeId);
    }
    return [...cameraMockData];
  },

  updateDevice: async (deviceId, updatedFields) => {
    if (isFirebaseConfigured() && !shouldUseMockData()) {
      const docRef = doc(db, 'devices', deviceId);
      const flatUpdates = {};
      for (const key of Object.keys(updatedFields)) {
        flatUpdates[`state.${key}`] = updatedFields[key];
      }
      if (updatedFields.status) {
        flatUpdates.status = updatedFields.status;
      }
      flatUpdates.updatedAt = serverTimestamp();
      await updateDoc(docRef, flatUpdates);
      return true;
    }
    if (typeof __DEV__ !== 'undefined' && __DEV__) {
      console.log(`[DataService]: Simulating field updates for device ${deviceId}`, updatedFields);
    }
    return true;
  },

  updateDeviceStatus: async (deviceId, status) => {
    if (isFirebaseConfigured() && !shouldUseMockData()) {
      await deviceRepository.updateDeviceStatus(deviceId, status);
      return true;
    }
    return true;
  },
};

export default dataService;
