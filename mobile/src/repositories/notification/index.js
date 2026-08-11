import MockNotificationRepository from './MockNotificationRepository';
import FirebaseNotificationRepository from './FirebaseNotificationRepository';
import { shouldUseMockData, isFirebaseConfigured } from '../../services/firebase';

export { MockNotificationRepository, FirebaseNotificationRepository };

const activeNotificationRepository = () => {
  if (isFirebaseConfigured() && !shouldUseMockData()) {
    return FirebaseNotificationRepository;
  }
  return MockNotificationRepository;
};

export default activeNotificationRepository();
