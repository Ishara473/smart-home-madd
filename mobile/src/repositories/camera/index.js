import MockCameraRepository from './MockCameraRepository';
import FirebaseCameraRepository from './FirebaseCameraRepository';
import { shouldUseMockData, isFirebaseConfigured } from '../../services/firebase';

export { MockCameraRepository, FirebaseCameraRepository };

const activeCameraRepository = () => {
  if (isFirebaseConfigured() && !shouldUseMockData()) {
    return FirebaseCameraRepository;
  }
  return MockCameraRepository;
};

export default activeCameraRepository();
