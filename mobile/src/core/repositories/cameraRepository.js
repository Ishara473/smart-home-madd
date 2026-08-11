import dataService from '../services/dataService';

export const cameraRepository = {
  getCameras: async (homeId) => {
    return dataService.getCameras(homeId);
  },

  getCameraById: async (id) => {
    const cameras = await dataService.getCameras();
    return cameras.find((c) => c.id === id) || null;
  },
};

export default cameraRepository;
