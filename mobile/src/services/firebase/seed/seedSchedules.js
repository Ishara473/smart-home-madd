import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseApp';
import { withTimestamps, HOME_ID } from './seedUtils';
// Import from both schedule folders
import { scheduleMockData as namedSchedules } from '../../../features/schedules/data/scheduleMockData';
import { scheduleMockData as deviceSchedulesData } from '../../../features/scheduling/data/scheduleMockData';

export const seedSchedules = async () => {
  // Time Trigger named schedules
  for (const schedule of namedSchedules) {
    const { id, trigger, lastExecuted, ...data } = schedule;
    
    // Attempt to parse existing triggers, mock data might vary
    const seedData = {
      ...data,
      homeId: HOME_ID,
      scheduleType: 'TIME_TRIGGER',
      trigger: {
        type: 'TIME',
        value: trigger?.value || '08:00'
      },
      deviceId: data.action?.deviceId || 'dev-light-1'
    };
    await setDoc(doc(db, 'schedules', id), withTimestamps(seedData), { merge: false });
  }

  // Device schedules (TIME_RANGE / TIMER)
  if (deviceSchedulesData?.schedules) {
    for (const schedule of deviceSchedulesData.schedules) {
      const { id, startTime, endTime, ...data } = schedule;
      const seedData = {
        ...data,
        homeId: HOME_ID,
        timeRange: { startTime: startTime || '08:00', endTime: endTime || '17:00' }
      };
      await setDoc(doc(db, 'schedules', id), withTimestamps(seedData), { merge: false });
    }
  }

  // Safety Rules
  if (deviceSchedulesData?.safetyRules) {
    for (const rule of deviceSchedulesData.safetyRules) {
      const { id, maxOnDuration, action, ...data } = rule;
      const seedData = {
        ...data,
        homeId: HOME_ID,
        scheduleType: 'SAFETY_RULE',
        safetyRule: {
          maxOnDuration,
          action
        },
        action: { command: { power: false } }
      };
      await setDoc(doc(db, 'schedules', id), withTimestamps(seedData), { merge: false });
    }
  }
};