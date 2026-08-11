import deviceRepository from '../../core/repositories/deviceRepository';

export const MockDeviceRepository = {
  getAll: async () => deviceRepository.getDevices(),
  getById: async (id) => deviceRepository.getDeviceById(id),
  create: async (data) => ({ id: `dev_${Date.now()}`, ...data }),
  update: async (id, data) => deviceRepository.updateDeviceStatus(id, data?.status),
  remove: async (id) => true,
};

export default MockDeviceRepository;
