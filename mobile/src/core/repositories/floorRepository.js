import dataService from '../services/dataService';

export const floorRepository = {
  getFloors: async (homeId) => {
    return dataService.getFloors(homeId);
  },

  getFloorById: async (id) => {
    const floors = await dataService.getFloors();
    return floors.find((f) => f.id === id) || null;
  },
};

export default floorRepository;
