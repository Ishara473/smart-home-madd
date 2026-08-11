import RoomRepository from '../../features/rooms/repository/RoomRepository';

export const MockRoomRepository = {
  getAll: async () => RoomRepository.getRooms(),
  getById: async (id) => RoomRepository.getRoomById(id),
  create: async (data) => ({ id: `room_${Date.now()}`, ...data }),
  update: async (id, data) => ({ id, ...data }),
  remove: async (id) => true,
};

export default MockRoomRepository;
