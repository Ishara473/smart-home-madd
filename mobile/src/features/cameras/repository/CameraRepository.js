import { cameraMockData } from '../data/cameraMockData';

/**
 * Camera Repository layer.
 * Manages queries to mock surveillance sensor datasets.
 */
export const CameraRepository = {
  getCameras: () => {
    return [...cameraMockData];
  },

  getCameraById: (id) => {
    return cameraMockData.find(cam => cam.id === id);
  }
};

export default CameraRepository;
