/**
 * Creates a normalized Room model object representation.
 */
export function createRoom({
  id,
  name,
  floorId,
  devices = [], // Array of device ID reference strings
  metadata = { area: 'General', icon: 'room' },
  ...extra
}) {
  return {
    id,
    name,
    floorId,
    devices,
    metadata,
    ...extra
  };
}

export default {
  createRoom,
};
