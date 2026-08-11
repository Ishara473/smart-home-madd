import cameraRepository from '../../core/repositories/cameraRepository';

export const MockCameraRepository = {
  getAll: async () => cameraRepository.getCameras(),
  getById: async (id) => cameraRepository.getCameraById(id),
  create: async (data) => ({ id: `cam_${Date.now()}`, ...data }),
  update: async (id, data) => ({ id, ...data }),
  remove: async (id) => true,
};

export default MockCameraRepository;
