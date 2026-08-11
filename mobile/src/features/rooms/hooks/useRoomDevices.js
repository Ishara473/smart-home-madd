import { useDevices } from '../../devices';

/**
 * Custom hook resolving detailed device state objects for a room dynamically from Device module context.
 */
export function useRoomDevices(room) {
  const { devices } = useDevices();

  if (!room || !room.devices) return [];

  return room.devices
    .map(deviceId => devices.find(d => d.id === deviceId))
    .filter(Boolean);
}

export default useRoomDevices;
