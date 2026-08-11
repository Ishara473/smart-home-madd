import { createNotification } from '../models/notification';

export const notificationMockData = [
  createNotification({
    id: 'notification-motion-1',
    title: 'Motion Detected',
    message: 'Movement detected at Garage Entrance — Front Gate Security Camera triggered a motion event.',
    type: 'SECURITY',
    severity: 'WARNING',
    read: false,
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 minutes ago
    source: { deviceId: 'dev-camera-1' }
  }),
  createNotification({
    id: 'notification-device-1',
    title: 'Device Offline',
    message: 'Living Room Ceiling Light is no longer responding to hub command pings. Power cycle recommended.',
    type: 'DEVICE',
    severity: 'ERROR',
    read: false,
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
    source: { deviceId: 'dev-light-1' }
  }),
  createNotification({
    id: 'notification-schedule-1',
    title: 'Schedule Executed',
    message: 'Night Fan automation rule completed successfully. Bedroom Smart Fan powered off at 22:30.',
    type: 'AUTOMATION',
    severity: 'INFO',
    read: true,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    source: { deviceId: 'dev-fan-1' }
  })
];

export default notificationMockData;
