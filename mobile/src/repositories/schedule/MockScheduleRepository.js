import ScheduleRepository from '../../features/schedules/repository/ScheduleRepository';

export const MockScheduleRepository = {
  getAll: async () => ScheduleRepository.getSchedules(),
  getById: async (id) => ScheduleRepository.getScheduleById(id),
  create: async (data) => ({ id: `sch_${Date.now()}`, ...data }),
  update: async (id, data) => ScheduleRepository.updateSchedule(id, data),
  remove: async (id) => true,
};

export default MockScheduleRepository;
