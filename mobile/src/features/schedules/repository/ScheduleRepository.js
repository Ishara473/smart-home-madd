import { scheduleMockData } from '../data/scheduleMockData';

// Local mutable memory store mirroring a cloud collection
let schedules = [...scheduleMockData];

export const ScheduleRepository = {
  getSchedules: () => {
    return [...schedules];
  },

  getScheduleById: (id) => {
    return schedules.find(s => s.id === id);
  },

  updateSchedule: (id, changes) => {
    schedules = schedules.map(s => {
      if (s.id !== id) return s;
      return {
        ...s,
        ...changes
      };
    });
    return schedules.find(s => s.id === id);
  }
};

export default ScheduleRepository;
