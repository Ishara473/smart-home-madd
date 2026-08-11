import { useState, useEffect } from 'react';
import { ScheduleRepository } from '../repository/ScheduleRepository';

/**
 * Custom hook supplying schedules list after a simulated loading delay.
 */
export function useSchedules() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const delay = setTimeout(() => {
      try {
        const data = ScheduleRepository.getSchedules();
        setSchedules(data);
      } catch (err) {
        setError('Failed to retrieve automation rules');
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(delay);
  }, []);

  return {
    schedules,
    loading,
    error,
  };
}

export default useSchedules;
