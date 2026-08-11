import { useState, useEffect } from 'react';
import { RoomRepository as MockRoomRepository } from '../repository/RoomRepository';
import { roomRepository as firebaseRoomRepository, floorRepository as firebaseFloorRepository } from '../../../services/firebase/repositories';
import { shouldUseMockData, isFirebaseConfigured } from '../../../services/firebase';
import { useHomeContext } from '../../home/context/HomeContext';

/**
 * Custom hook supplying room listings.
 * Source: Firestore (production, homeId from AuthContext) or MockData.
 */
export function useRooms() {
  const { homeId, loading: homeLoading } = useHomeContext();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (homeLoading) return;

    if (shouldUseMockData()) {
      setLoading(true);
      const delay = setTimeout(() => {
        try {
          setRooms(MockRoomRepository.getRooms());
        } catch (err) {
          setError('Failed to retrieve room divisions');
        } finally {
          setLoading(false);
        }
      }, 500);
      return () => clearTimeout(delay);
    }

    if (!isFirebaseConfigured() || !homeId) {
      setRooms([]);
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError(null);

    const fetchAllRooms = async () => {
      try {
        const floors = await firebaseFloorRepository.getFloorsByHome(homeId);
        let allRooms = [];
        for (const floor of floors) {
          const floorRooms = await firebaseRoomRepository.getRoomsByFloor(floor.id);
          allRooms = [...allRooms, ...floorRooms];
        }
        if (isMounted) { setRooms(allRooms); setError(null); }
      } catch (err) {
        console.error('[useRooms] Firebase fetch failed', err);
        if (isMounted) setError('Unable to load rooms. Check your connection.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAllRooms();
    return () => { isMounted = false; };
  }, [homeId, homeLoading]);

  return { rooms, loading, error };
}

export default useRooms;
