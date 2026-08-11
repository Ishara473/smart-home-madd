import MockReportRepository from './MockReportRepository';
import FirebaseReportRepository from './FirebaseReportRepository';
import { shouldUseMockData, isFirebaseConfigured } from '../../services/firebase';

export { MockReportRepository, FirebaseReportRepository };

const activeReportRepository = () => {
  if (isFirebaseConfigured() && !shouldUseMockData()) {
    return FirebaseReportRepository;
  }
  return MockReportRepository;
};

export default activeReportRepository();
