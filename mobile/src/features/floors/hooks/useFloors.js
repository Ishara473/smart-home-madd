import { useState, useEffect } from 'react';
import { FloorRepository as MockFloorRepository } from '../repository/FloorRepository';
import { floorRepository as firebaseFloorRepository } from '../../../services/firebase/repositories';
import { shouldUseMockData, isFirebaseConfigured } from '../../../services/firebase';
import { useHomeContext } from '../../home/context/HomeContext';

/**
 * Custom hook supplying floor lists.
 * Source: Firestore (production, homeId from AuthContext) or MockData.
 */
export function useFloors() {
  const { homeId, loading: homeLoading } = useHomeContext();
  const [floors, setFloors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (homeLoading) return;

    if (shouldUseMockData()) {
      setLoading(true);
      const delay = setTimeout(() => {
        try {
          setFloors(MockFloorRepository.getFloors());
        } catch (err) {
          setError('Failed to retrieve house floors');
        } finally {
          setLoading(false);
        }
      }, 500);
      return () => clearTimeout(delay);
    }

    if (!isFirebaseConfigured() || !homeId) {
      setFloors([]);
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError(null);

    firebaseFloorRepository.getFloorsByHome(homeId)
      .then(data => {
        if (isMounted) { setFloors(data); setError(null); }
      })
      .catch(err => {
        console.error('[useFloors] Firebase fetch failed', err);
        if (isMounted) setError('Unable to load floors. Check your connection.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [homeId, homeLoading]);

  return { floors, loading, error };
}

export default useFloors;
