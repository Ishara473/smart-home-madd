import MockDeviceRepository from './MockDeviceRepository';
import FirebaseDeviceRepository from './FirebaseDeviceRepository';
import { shouldUseMockData, isFirebaseConfigured } from '../../services/firebase';

export { MockDeviceRepository, FirebaseDeviceRepository };

/**
 * Returns the active device repository based on Firebase configuration.
 * Uses Firebase when configured and not in mock mode.
 */
const activeDeviceRepository = () => {
  if (isFirebaseConfigured() && !shouldUseMockData()) {
    return FirebaseDeviceRepository;
  }
  return MockDeviceRepository;
};

export default activeDeviceRepository();
