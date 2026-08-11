import { useState, useEffect } from 'react';
import { RoomRepository } from '../repository/RoomRepository';

/**
 * Custom hook supplying single room mapping status.
 */
export function useRoom(id) {
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const delay = setTimeout(() => {
      try {
        const data = RoomRepository.getRoomById(id);
        if (data) {
          setRoom(data);
        } else {
          setError('Room layout details not found');
        }
      } catch (err) {
        setError('Failed to retrieve room spec details');
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(delay);
  }, [id]);

  return {
    room,
    loading,
    error,
  };
}

export default useRoom;
