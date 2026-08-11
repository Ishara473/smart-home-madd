import { createDevice } from '../models/device';
import { DEVICE_TYPES } from '../../../shared/constants/deviceTypes';
import { DEVICE_STATUS } from '../../../shared/constants/deviceStatus';

const getPastTimestampISO = (offsetMs) => {
  return new Date(Date.now() - offsetMs).toISOString();
};

export const deviceMockData = [
  createDevice({
    id: 'dev-light-1',
    name: 'Living Room Ceiling Light',
    type: DEVICE_TYPES.LIGHT,
    status: DEVICE_STATUS.ON,
    location: { room: 'Living Room', floor: 'ground-floor' },
    state: { power: true, brightness: 80 },
    powerConsumption: 12,
    lastUpdated: getPastTimestampISO(2 * 60 * 1000)
  }),
  createDevice({
    id: 'dev-outlet-1',
    name: 'Kitchen Main Outlet',
    type: DEVICE_TYPES.OUTLET,
    status: DEVICE_STATUS.OFF,
    location: { room: 'Kitchen', floor: 'ground-floor' },
    state: { power: false },
    powerConsumption: 0,
    lastUpdated: getPastTimestampISO(15 * 60 * 1000)
  }),
  createDevice({
    id: 'dev-switch-1',
    name: 'Bedroom Smart Switch Panel',
    type: DEVICE_TYPES.SWITCH_PANEL,
    status: DEVICE_STATUS.ON,
    location: { room: 'Bedroom', floor: 'first-floor' },
    state: { power: true },
    powerConsumption: 45,
    switches: [
      { id: 1, name: 'Ceiling Fan', status: DEVICE_STATUS.ON },
      { id: 2, name: 'Reading Lamp', status: DEVICE_STATUS.OFF },
      { id: 3, name: 'Wall Lights', status: DEVICE_STATUS.ON }
    ],
    lastUpdated: getPastTimestampISO(45 * 1000)
  }),
  createDevice({
    id: 'dev-iron-1',
    name: 'Smart Laundry Iron',
    type: DEVICE_TYPES.IRON,
    status: DEVICE_STATUS.ERROR,
    location: { room: 'Laundry Room', floor: 'ground-floor' },
    state: { power: true },
    powerConsumption: 1800,
    maxOnDuration: 15,
    lastUpdated: getPastTimestampISO(2 * 60 * 60 * 1000)
  }),
  createDevice({
    id: 'dev-camera-1',
    name: 'Front Gate Security Camera',
    type: DEVICE_TYPES.CAMERA,
    status: DEVICE_STATUS.DISCONNECTED,
    location: { room: 'Garage Entrance', floor: 'ground-floor' },
    state: { power: false },
    powerConsumption: 0,
    cameraUri: 'mock://camera/front-gate',
    lastUpdated: getPastTimestampISO(24 * 60 * 60 * 1000)
  }),
  createDevice({
    id: 'dev-camera-2',
    name: 'Backyard Garden Camera',
    type: DEVICE_TYPES.CAMERA,
    status: DEVICE_STATUS.ON,
    location: { room: 'Patio', floor: 'ground-floor' },
    state: { power: true },
    powerConsumption: 8,
    cameraUri: 'mock://camera/backyard',
    lastUpdated: getPastTimestampISO(5 * 60 * 1000)
  }),
  createDevice({
    id: 'dev-fan-1',
    name: 'Living Room Smart Fan',
    type: 'FAN',
    status: DEVICE_STATUS.ON,
    location: { room: 'Living Room', floor: 'ground-floor' },
    state: { power: true, speed: 'MEDIUM' },
    powerConsumption: 45,
    lastUpdated: getPastTimestampISO(5 * 60 * 1000)
  }),
  createDevice({
    id: 'dev-light-2',
    name: 'Kitchen Ceiling Light',
    type: DEVICE_TYPES.LIGHT,
    status: DEVICE_STATUS.ON,
    location: { room: 'Kitchen', floor: 'ground-floor' },
    state: { power: true, brightness: 100 },
    powerConsumption: 15,
    lastUpdated: getPastTimestampISO(3 * 60 * 1000)
  }),
  createDevice({
    id: 'dev-thermostat-1',
    name: 'Master Bed Thermostat',
    type: 'THERMOSTAT',
    status: DEVICE_STATUS.ON,
    location: { room: 'Master Bedroom', floor: 'first-floor' },
    state: { power: true, targetTemperature: 22 },
    powerConsumption: 350,
    lastUpdated: getPastTimestampISO(10 * 60 * 1000)
  }),
  createDevice({
    id: 'dev-bathroom-outlet-1',
    name: 'Bathroom Outlet',
    type: DEVICE_TYPES.OUTLET,
    status: DEVICE_STATUS.OFF,
    location: { room: 'Bathroom', floor: 'first-floor' },
    state: { power: false },
    powerConsumption: 0,
    lastUpdated: getPastTimestampISO(20 * 60 * 1000)
  }),
];

export const getDeviceById = (id) => {
  return deviceMockData.find(dev => dev.id === id) || deviceMockData[0];
};

export const getDevicesByFloor = (floorId) => {
  return deviceMockData.filter(dev => dev.location.floor === floorId);
};

export default deviceMockData;
