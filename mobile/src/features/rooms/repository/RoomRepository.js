import { roomMockData } from '../data/roomMockData';

/**
 * Room repository layer decoupling components from mock databases files.
 */
export const RoomRepository = {
  getRooms: () => {
    return [...roomMockData];
  },

  getRoomById: (id) => {
    return roomMockData.find(room => room.id === id);
  }
};

export default RoomRepository;
