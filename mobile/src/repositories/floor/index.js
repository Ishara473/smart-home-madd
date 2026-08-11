import MockFloorRepository from './MockFloorRepository';
import FirebaseFloorRepository from './FirebaseFloorRepository';
import { shouldUseMockData, isFirebaseConfigured } from '../../services/firebase';

export { MockFloorRepository, FirebaseFloorRepository };

const activeFloorRepository = () => {
  if (isFirebaseConfigured() && !shouldUseMockData()) {
    return FirebaseFloorRepository;
  }
  return MockFloorRepository;
};

export default activeFloorRepository();
