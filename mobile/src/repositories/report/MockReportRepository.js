import ReportRepository from '../../features/reports/repository/ReportRepository';

export const MockReportRepository = {
  getAll: async () => ReportRepository.getReports(),
  getById: async (id) => ReportRepository.getReportById(id),
  create: async (data) => ({ id: `rep_${Date.now()}`, ...data }),
  update: async (id, data) => ({ id, ...data }),
  remove: async (id) => true,
};

export default MockReportRepository;
