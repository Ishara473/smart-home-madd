/**
 * Repository Factory / Central Abstraction Index
 *
 * Dynamically selects between Mock and Firebase repository implementations
 * based on EXPO_PUBLIC_USE_MOCK_DATA and Firebase configuration state.
 */

export { default as DeviceRepository } from './device';
export { default as FloorRepository } from './floor';
export { default as RoomRepository } from './room';
export { default as CameraRepository } from './camera';
export { default as ScheduleRepository } from './schedule';
export { default as NotificationRepository } from './notification';
export { default as ReportRepository } from './report';
