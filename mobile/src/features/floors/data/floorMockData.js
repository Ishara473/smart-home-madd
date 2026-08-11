import { createFloor } from '../models/floor';
import { createRoom } from '../models/room';

export const floorMockData = [
  createFloor({
    id: 'floor-ground',
    name: 'Ground Floor',
    rooms: [
      createRoom({
        id: 'room-living',
        name: 'Living Room',
        devices: ['dev-light-1', 'dev-fan-1'],
        metadata: { area: '32m²' }
      }),
      createRoom({
        id: 'room-kitchen',
        name: 'Kitchen',
        devices: ['dev-outlet-1'],
        metadata: { area: '18m²' }
      }),
      createRoom({
        id: 'room-garage',
        name: 'Garage',
        devices: ['dev-camera-1'],
        metadata: { area: '25m²' }
      }),
      createRoom({
        id: 'room-laundry',
        name: 'Laundry Room',
        devices: ['dev-iron-1'],
        metadata: { area: '12m²' }
      })
    ],
    roomCount: 4,
    deviceCount: 5,
    status: 'ON'
  }),
  createFloor({
    id: 'floor-first',
    name: 'First Floor',
    rooms: [
      createRoom({
        id: 'room-bedroom',
        name: 'Master Bedroom',
        devices: ['dev-switch-1', 'dev-thermostat-1'],
        metadata: { area: '28m²' }
      }),
      createRoom({
        id: 'room-bathroom',
        name: 'Bathroom',
        devices: ['dev-bathroom-outlet-1'],
        metadata: { area: '10m²' }
      })
    ],
    roomCount: 2,
    deviceCount: 3,
    status: 'ON'
  })
];

export default floorMockData;
