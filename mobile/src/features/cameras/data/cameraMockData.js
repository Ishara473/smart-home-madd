import { createCamera } from '../models/camera';

export const cameraMockData = [
  createCamera({
    id: 'camera-front-gate',
    deviceId: 'dev-camera-1',
    name: 'Front Gate Security Camera',
    location: { room: 'Garage Entrance', floor: 'Ground Floor' },
    state: { streaming: false, recording: false, motionDetection: true },
    snapshotUri: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=400&q=80',
    streamUri: 'mock://camera/front-gate',
    lastUpdated: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  }),
  createCamera({
    id: 'camera-backyard',
    deviceId: 'dev-camera-2',
    name: 'Backyard Garden Camera',
    location: { room: 'Patio', floor: 'Ground Floor' },
    state: { streaming: true, recording: true, motionDetection: true },
    snapshotUri: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=400&q=80',
    streamUri: 'mock://camera/backyard',
    lastUpdated: new Date(Date.now() - 5 * 60 * 1000).toISOString()
  })
];

export const getCameraById = (id) => {
  return cameraMockData.find(cam => cam.id === id) || cameraMockData[0];
};

export const getCameraByDeviceId = (deviceId) => {
  return cameraMockData.find(cam => cam.deviceId === deviceId);
};

export default cameraMockData;
