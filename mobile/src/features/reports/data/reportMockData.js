import { createReport } from '../models/report';

export const reportMockData = [
  createReport({
    id: 'energy-report-weekly',
    type: 'ENERGY',
    title: 'Weekly Energy Usage',
    period: { start: '2026-07-01', end: '2026-07-07' },
    data: {
      totalConsumption: 2450,
      unit: 'Wh',
      // Daily breakdown for chart bars (Mon → Sun)
      dailyBreakdown: [
        { day: 'Mon', value: 320 },
        { day: 'Tue', value: 415 },
        { day: 'Wed', value: 280 },
        { day: 'Thu', value: 390 },
        { day: 'Fri', value: 460 },
        { day: 'Sat', value: 310 },
        { day: 'Sun', value: 275 },
      ],
      // Reference device IDs only — do not duplicate device data
      topConsumers: ['dev-fan-1', 'dev-light-1', 'dev-outlet-1'],
    },
  }),

  createReport({
    id: 'device-health-report',
    type: 'DEVICE_HEALTH',
    title: 'Device Health Summary',
    period: { start: '2026-07-07', end: '2026-07-07' },
    data: {
      totalDevices: 8,
      onlineDevices: 7,
      offlineDevices: 1,
      // Offline device IDs only — resolved via DeviceContext
      offlineDeviceIds: ['dev-camera-2'],
    },
  }),

  createReport({
    id: 'automation-activity-report',
    type: 'AUTOMATION',
    title: 'Automation Activity',
    period: { start: '2026-07-01', end: '2026-07-07' },
    data: {
      executedRules: 25,
      successful: 24,
      failed: 1,
      // Schedule IDs only — resolved via ScheduleRepository
      activeScheduleIds: ['schedule-morning-lights', 'schedule-night-fan'],
    },
  }),
];

export default reportMockData;
