/**
 * Creates a normalized room object structure containing references to devices.
 */
export function createRoom({
  id,
  name,
  devices = [], // Array of device ID reference strings
  metadata = {},
  ...extra
}) {
  return {
    id,
    name,
    devices,
    metadata,
    ...extra
  };
}

export default {
  createRoom,
};
