import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseApp';
import { withTimestamps, HOME_ID } from './seedUtils';
import { reportMockData } from '../../../features/reports/data/reportMockData';
import { Timestamp } from 'firebase/firestore';

export const seedReports = async () => {
  for (const report of reportMockData) {
    const { id, period, ...data } = report;
    
    // Parse ISO strings to Firestore Timestamps if available
    const start = period?.start ? Timestamp.fromDate(new Date(period.start)) : Timestamp.now();
    const end = period?.end ? Timestamp.fromDate(new Date(period.end)) : Timestamp.now();

    const seedData = {
      ...data,
      homeId: HOME_ID,
      period: { start, end }
    };
    await setDoc(doc(db, 'reports', id), withTimestamps(seedData), { merge: false });
  }
};