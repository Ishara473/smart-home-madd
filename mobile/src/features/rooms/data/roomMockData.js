import { createRoom } from '../models/room';

export const roomMockData = [
  createRoom({
    id: 'room-living',
    name: 'Living Room',
    floorId: 'floor-ground',
    devices: ['dev-light-1', 'dev-fan-1'],
    metadata: { area: '32m²', icon: 'sofa' }
  }),
  createRoom({
    id: 'room-kitchen',
    name: 'Kitchen',
    floorId: 'floor-ground',
    devices: ['dev-outlet-1'],
    metadata: { area: '18m²', icon: 'fridge' }
  }),
  createRoom({
    id: 'room-garage',
    name: 'Garage',
    floorId: 'floor-ground',
    devices: ['dev-camera-1'],
    metadata: { area: '25m²', icon: 'garage' }
  }),
  createRoom({
    id: 'room-laundry',
    name: 'Laundry Room',
    floorId: 'floor-ground',
    devices: ['dev-iron-1'],
    metadata: { area: '12m²', icon: 'washing-machine' }
  }),
  createRoom({
    id: 'room-bedroom',
    name: 'Master Bedroom',
    floorId: 'floor-first',
    devices: ['dev-switch-1', 'dev-thermostat-1'],
    metadata: { area: '28m²', icon: 'bed-double' }
  }),
  createRoom({
    id: 'room-bathroom',
    name: 'Bathroom',
    floorId: 'floor-first',
    devices: ['dev-bathroom-outlet-1'],
    metadata: { area: '10m²', icon: 'shower-head' }
  })
];

export default roomMockData;
