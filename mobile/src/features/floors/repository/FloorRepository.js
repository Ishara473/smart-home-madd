import { floorMockData } from '../data/floorMockData';

let localFloors = [...floorMockData];

/**
 * Floor Repository abstraction.
 * Decouples mock data from screens to support future Firebase integrations seamlessly.
 */
export const FloorRepository = {
  getFloors: () => {
    return [...localFloors];
  },

  getFloorById: (id) => {
    return localFloors.find(floor => floor.id === id);
  },

  addFloor: (floor) => {
    const newFloor = {
      ...floor,
      id: floor.id || `floor-${Date.now()}`,
      rooms: floor.rooms || [],
      roomCount: floor.roomCount || 0,
      deviceCount: floor.deviceCount || 0,
      status: floor.status || 'ON',
    };
    localFloors = [...localFloors, newFloor];
    return newFloor;
  }
};

export default FloorRepository;
