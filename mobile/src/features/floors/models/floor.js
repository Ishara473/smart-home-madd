/**
 * Creates a normalized floor object structure matching clean databases profiles.
 */
export function createFloor({
  id,
  name,
  rooms = [],
  roomCount = 0,
  deviceCount = 0,
  status = 'ON',
  ...extra
}) {
  return {
    id,
    name,
    rooms,
    roomCount,
    deviceCount,
    status,
    ...extra
  };
}

export default {
  createFloor,
};
