import { useState, useEffect } from 'react';
import { ScheduleRepository } from '../repository/ScheduleRepository';

/**
 * Custom hook returning target schedule details, exposing state updates modifier callbacks.
 */
export function useSchedule(id) {
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const delay = setTimeout(() => {
      try {
        const data = ScheduleRepository.getScheduleById(id);
        if (data) {
          setSchedule(data);
        } else {
          setError('Automation rule details not found');
        }
      } catch (err) {
        setError('Failed to fetch schedule configuration');
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(delay);
  }, [id]);

  const updateScheduleState = (changes) => {
    try {
      const updated = ScheduleRepository.updateSchedule(id, changes);
      if (updated) {
        setSchedule(updated);
      }
    } catch (err) {
      console.warn('Failed to update memory schedule state details', err);
    }
  };

  return {
    schedule,
    loading,
    error,
    updateScheduleState,
  };
}

export default useSchedule;
