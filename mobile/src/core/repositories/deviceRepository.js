import dataService from '../services/dataService';
import realtimeService from '../services/realtimeService';
import { collection, where } from 'firebase/firestore';
import { shouldUseMockData, isFirebaseConfigured } from '../../services/firebase';

export const deviceRepository = {
  getDevices: async (homeId) => {
    return dataService.getDevices(homeId);
  },

  getDeviceById: async (id) => {
    return dataService.getDeviceById(id);
  },

  updateDeviceStatus: async (id, status) => {
    return dataService.updateDeviceStatus(id, status);
  },

  subscribeToDevices: (homeId, callback) => {
    if (isFirebaseConfigured() && !shouldUseMockData() && homeId) {
      return realtimeService.subscribe('devices', callback, [
        where('homeId', '==', homeId),
      ]);
    }
    return realtimeService.subscribe('devices', callback);
  },
};

export default deviceRepository;
