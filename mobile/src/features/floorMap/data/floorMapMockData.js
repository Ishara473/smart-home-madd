import { createFloorMap, createRoom, createDeviceLocation } from '../models/floorMap';

export const floorMapMockData = {
  'ground-floor': createFloorMap({
    floorId: 'ground-floor',
    width: 8,
    height: 8,
    gridSize: 40,
    rooms: [
      createRoom({ id: 'room-kitchen', name: 'Kitchen', position: { x: 0, y: 0 }, width: 4, height: 3 }),
      createRoom({ id: 'room-living', name: 'Living Room', position: { x: 4, y: 0 }, width: 4, height: 4 }),
      createRoom({ id: 'room-garage', name: 'Garage', position: { x: 0, y: 4 }, width: 8, height: 4 }),
    ],
    devices: [
      createDeviceLocation({ deviceId: 'dev-outlet-1', roomId: 'room-kitchen', position: { x: 1, y: 1 } }),
      createDeviceLocation({ deviceId: 'dev-light-2', roomId: 'room-kitchen', position: { x: 3, y: 1 } }),
      createDeviceLocation({ deviceId: 'dev-light-1', roomId: 'room-living', position: { x: 5, y: 1 } }),
      createDeviceLocation({ deviceId: 'dev-fan-1', roomId: 'room-living', position: { x: 7, y: 2 } }),
      createDeviceLocation({ deviceId: 'dev-iron-1', roomId: 'room-garage', position: { x: 1, y: 5 } }),
      createDeviceLocation({ deviceId: 'dev-camera-1', roomId: 'room-garage', position: { x: 7, y: 7 } }),
      createDeviceLocation({ deviceId: 'dev-camera-2', roomId: 'room-garage', position: { x: 4, y: 7 } }),
      // Simulator Mock ID Aliases
      createDeviceLocation({ deviceId: 'mock-dev-1', roomId: 'room-living', position: { x: 5, y: 1 } }),
      createDeviceLocation({ deviceId: 'mock-dev-2', roomId: 'room-kitchen', position: { x: 1, y: 1 } }),
      createDeviceLocation({ deviceId: 'mock-dev-3', roomId: 'room-living', position: { x: 7, y: 2 } }),
      createDeviceLocation({ deviceId: 'mock-dev-4', roomId: 'room-garage', position: { x: 1, y: 5 } }),
      createDeviceLocation({ deviceId: 'mock-dev-7', roomId: 'room-kitchen', position: { x: 3, y: 1 } }),
      createDeviceLocation({ deviceId: 'mock-cam-1', roomId: 'room-garage', position: { x: 7, y: 7 } }),
      createDeviceLocation({ deviceId: 'mock-cam-2', roomId: 'room-garage', position: { x: 4, y: 7 } }),
    ]
  }),
  'first-floor': createFloorMap({
    floorId: 'first-floor',
    width: 8,
    height: 8,
    gridSize: 40,
    rooms: [
      createRoom({ id: 'room-bedroom', name: 'Bedroom', position: { x: 0, y: 0 }, width: 8, height: 5 }),
      createRoom({ id: 'room-bathroom', name: 'Bathroom', position: { x: 0, y: 5 }, width: 8, height: 3 }),
    ],
    devices: [
      createDeviceLocation({ deviceId: 'dev-switch-1', roomId: 'room-bedroom', position: { x: 2, y: 2 } }),
      createDeviceLocation({ deviceId: 'dev-thermostat-1', roomId: 'room-bedroom', position: { x: 6, y: 3 } }),
      createDeviceLocation({ deviceId: 'dev-bathroom-outlet-1', roomId: 'room-bathroom', position: { x: 4, y: 6 } }),
      // Simulator Mock ID Aliases
      createDeviceLocation({ deviceId: 'mock-dev-5', roomId: 'room-bedroom', position: { x: 2, y: 2 } }),
      createDeviceLocation({ deviceId: 'mock-dev-6', roomId: 'room-bedroom', position: { x: 6, y: 3 } }),
      createDeviceLocation({ deviceId: 'mock-dev-8', roomId: 'room-bathroom', position: { x: 4, y: 6 } }),
    ]
  })
};

// Aliases for floor-ground and floor-first
floorMapMockData['floor-ground'] = floorMapMockData['ground-floor'];
floorMapMockData['floor-first'] = floorMapMockData['first-floor'];

export const getFloorMap = (floorId) => {
  if (!floorId) return floorMapMockData['ground-floor'];
  const normalized = String(floorId).toLowerCase();
  if (normalized.includes('first') || normalized.includes('1st')) {
    return floorMapMockData['first-floor'];
  }
  return floorMapMockData['ground-floor'];
};

export default floorMapMockData;
