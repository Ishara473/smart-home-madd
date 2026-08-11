import floorRepository from '../../core/repositories/floorRepository';

export const MockFloorRepository = {
  getAll: async () => floorRepository.getFloors(),
  getById: async (id) => floorRepository.getFloorById(id),
  create: async (data) => ({ id: `floor_${Date.now()}`, ...data }),
  update: async (id, data) => ({ id, ...data }),
  remove: async (id) => true,
};

export default MockFloorRepository;
