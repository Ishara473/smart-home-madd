import { createSchedule } from '../models/schedule';

export const scheduleMockData = [
  createSchedule({
    id: 'schedule-morning-lights',
    name: 'Morning Lights',
    enabled: true,
    trigger: { type: 'TIME', value: '07:00' },
    action: {
      deviceId: 'dev-light-1',
      command: { power: true }
    },
    lastExecuted: new Date(Date.now() - 15 * 60 * 60 * 1000).toISOString() // 15 hours ago
  }),
  createSchedule({
    id: 'schedule-night-fan',
    name: 'Night Fan',
    enabled: true,
    trigger: { type: 'TIME', value: '22:30' },
    action: {
      deviceId: 'dev-fan-1',
      command: { power: false }
    },
    lastExecuted: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // Yesterday
  }),
  createSchedule({
    id: 'schedule-camera-security',
    name: 'Camera Security Mode',
    enabled: false,
    trigger: { type: 'TIME', value: '18:00' },
    action: {
      deviceId: 'dev-camera-1',
      command: { recording: true }
    },
    lastExecuted: null
  })
];

export default scheduleMockData;
