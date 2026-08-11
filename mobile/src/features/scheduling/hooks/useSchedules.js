import { useContext } from 'react';
import { ScheduleContext } from '../context/ScheduleContext';

export function useSchedules() {
  const context = useContext(ScheduleContext);
  if (!context) {
    throw new Error('useSchedules must be used within a ScheduleProvider');
  }
  return context;
}

export default useSchedules;
