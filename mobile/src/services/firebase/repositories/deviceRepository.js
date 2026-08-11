import { collection, query, where, getDocs, doc, getDoc, onSnapshot, updateDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebaseApp';
import { mapDoc, withCreatedTimestamps, withUpdatedTimestamps } from './utils';

export const deviceRepository = {
  async getDevicesByHome(homeId) {
    try {
      const q = query(collection(db, 'devices'), where('homeId', '==', homeId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(mapDoc);
    } catch (error) {
      console.error('[deviceRepository] getDevicesByHome error', error);
      throw error;
    }
  },

  async getDevicesByRoom(roomId) {
    try {
      const q = query(collection(db, 'devices'), where('roomId', '==', roomId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(mapDoc);
    } catch (error) {
      console.error('[deviceRepository] getDevicesByRoom error', error);
      throw error;
    }
  },

  async getDevicesByFloor(floorId) {
    try {
      const q = query(collection(db, 'devices'), where('floorId', '==', floorId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(mapDoc);
    } catch (error) {
      console.error('[deviceRepository] getDevicesByFloor error', error);
      throw error;
    }
  },

  async getDeviceById(deviceId) {
    try {
      const docRef = doc(db, 'devices', deviceId);
      const snapshot = await getDoc(docRef);
      if (!snapshot.exists()) return null;
      return mapDoc(snapshot);
    } catch (error) {
      console.error('[deviceRepository] getDeviceById error', error);
      throw error;
    }
  },

  subscribeToDevices(homeId, callback) {
    try {
      const q = query(collection(db, 'devices'), where('homeId', '==', homeId));
      return onSnapshot(q, (snapshot) => {
        callback(snapshot.docs.map(mapDoc));
      }, (error) => {
        console.error('[deviceRepository] subscribeToDevices error', error);
      });
    } catch (error) {
      console.error('[deviceRepository] subscribeToDevices setup error', error);
      throw error;
    }
  },

  async updateDeviceState(deviceId, stateChanges) {
    try {
      const docRef = doc(db, 'devices', deviceId);
      const flatUpdates = {};
      for (const key of Object.keys(stateChanges)) {
        flatUpdates[`state.${key}`] = stateChanges[key];
      }
      await updateDoc(docRef, withUpdatedTimestamps(flatUpdates));
    } catch (error) {
      console.error('[deviceRepository] updateDeviceState error', error);
      throw error;
    }
  },

  async updateDeviceStatus(deviceId, status) {
    try {
      const docRef = doc(db, 'devices', deviceId);
      await updateDoc(docRef, withUpdatedTimestamps({ status }));
    } catch (error) {
      console.error('[deviceRepository] updateDeviceStatus error', error);
      throw error;
    }
  },

  async createDevice(device) {
    try {
      // Auto-generate ID if not provided, else use the provided one
      const docRef = device.id ? doc(db, 'devices', device.id) : doc(collection(db, 'devices'));
      const { id, ...deviceData } = device;
      await setDoc(docRef, withCreatedTimestamps(deviceData));
      return docRef.id;
    } catch (error) {
      console.error('[deviceRepository] createDevice error', error);
      throw error;
    }
  },

  async deleteDevice(deviceId) {
    try {
      const docRef = doc(db, 'devices', deviceId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('[deviceRepository] deleteDevice error', error);
      throw error;
    }
  }
};