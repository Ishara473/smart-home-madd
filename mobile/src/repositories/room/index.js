import MockRoomRepository from './MockRoomRepository';
import FirebaseRoomRepository from './FirebaseRoomRepository';
import { shouldUseMockData, isFirebaseConfigured } from '../../services/firebase';

export { MockRoomRepository, FirebaseRoomRepository };

const activeRoomRepository = () => {
  if (isFirebaseConfigured() && !shouldUseMockData()) {
    return FirebaseRoomRepository;
  }
  return MockRoomRepository;
};

export default activeRoomRepository();
