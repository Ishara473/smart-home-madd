import MockScheduleRepository from './MockScheduleRepository';
import FirebaseScheduleRepository from './FirebaseScheduleRepository';
import { shouldUseMockData, isFirebaseConfigured } from '../../services/firebase';

export { MockScheduleRepository, FirebaseScheduleRepository };

const activeScheduleRepository = () => {
  if (isFirebaseConfigured() && !shouldUseMockData()) {
    return FirebaseScheduleRepository;
  }
  return MockScheduleRepository;
};

export default activeScheduleRepository();
