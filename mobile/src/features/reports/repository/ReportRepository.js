import { reportMockData } from '../data/reportMockData';

export const ReportRepository = {
  getReports: () => {
    return [...reportMockData];
  },

  getReportById: (id) => {
    return reportMockData.find(r => r.id === id) || null;
  },
};

export default ReportRepository;
