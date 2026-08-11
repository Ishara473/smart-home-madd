import { createSchedule } from '../models/schedule';
import { createSafetyRule } from '../models/safetyRule';

export const scheduleMockData = {
  schedules: [
    createSchedule({
      id: 'sched-light-1',
      deviceId: 'dev-light-1',
      scheduleType: 'TIME_RANGE',
      startTime: '18:00',
      endTime: '23:00',
      enabled: true
    }),
    createSchedule({
      id: 'sched-iron-1',
      deviceId: 'dev-iron-1',
      scheduleType: 'TIMER',
      startTime: '08:00',
      endTime: '08:30',
      enabled: false
    })
  ],
  safetyRules: [
    createSafetyRule({
      id: 'rule-iron-1',
      deviceId: 'dev-iron-1',
      maxOnDuration: 15, // 15 seconds in demo mode (representing minutes) for instant cutoff checks
      enabled: true,
      action: 'TURN_OFF'
    })
  ]
};

export default scheduleMockData;
