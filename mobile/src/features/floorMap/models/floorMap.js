export function createFloorMap({
  floorId,
  width = 8,
  height = 8,
  gridSize = 40, // Pixel size per grid cell
  rooms = [],
  devices = []
}) {
  return {
    floorId,
    width,
    height,
    gridSize,
    rooms,
    devices
  };
}

export function createRoom({ id, name, position: { x, y }, width, height }) {
  return { id, name, position: { x, y }, width, height };
}

export function createDeviceLocation({ deviceId, roomId, position: { x, y } }) {
  return { deviceId, roomId, position: { x, y } };
}

export default {
  createFloorMap,
  createRoom,
  createDeviceLocation
};
