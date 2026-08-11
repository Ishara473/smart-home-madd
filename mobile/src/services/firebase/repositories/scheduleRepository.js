import { collection, query, where, getDocs, doc, updateDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebaseApp';
import { mapDoc, withCreatedTimestamps, withUpdatedTimestamps } from './utils';

export const scheduleRepository = {
  async getSchedulesByHome(homeId) {
    try {
      const q = query(collection(db, 'schedules'), where('homeId', '==', homeId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(mapDoc);
    } catch (error) {
      console.error('[scheduleRepository] getSchedulesByHome error', error);
      throw error;
    }
  },

  async getEnabledSchedules(homeId) {
    try {
      const q = query(collection(db, 'schedules'), where('homeId', '==', homeId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(mapDoc).filter(s => s.enabled === true);
    } catch (error) {
      console.error('[scheduleRepository] getEnabledSchedules error', error);
      throw error;
    }
  },

  async getSchedulesByDevice(deviceId) {
    try {
      const q = query(collection(db, 'schedules'), where('deviceId', '==', deviceId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(mapDoc);
    } catch (error) {
      console.error('[scheduleRepository] getSchedulesByDevice error', error);
      throw error;
    }
  },

  async createSchedule(schedule) {
    try {
      const docRef = schedule.id ? doc(db, 'schedules', schedule.id) : doc(collection(db, 'schedules'));
      const { id, ...scheduleData } = schedule;
      await setDoc(docRef, withCreatedTimestamps(scheduleData));
      return docRef.id;
    } catch (error) {
      console.error('[scheduleRepository] createSchedule error', error);
      throw error;
    }
  },

  async updateSchedule(scheduleId, data) {
    try {
      const docRef = doc(db, 'schedules', scheduleId);
      await updateDoc(docRef, withUpdatedTimestamps(data));
    } catch (error) {
      console.error('[scheduleRepository] updateSchedule error', error);
      throw error;
    }
  },

  async deleteSchedule(scheduleId) {
    try {
      const docRef = doc(db, 'schedules', scheduleId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('[scheduleRepository] deleteSchedule error', error);
      throw error;
    }
  }
};