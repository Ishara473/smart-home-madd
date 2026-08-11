import { useState, useEffect } from 'react';
import { FloorRepository as MockFloorRepository } from '../repository/FloorRepository';
import { floorRepository as firebaseFloorRepository } from '../../../services/firebase/repositories';
import { shouldUseMockData, isFirebaseConfigured } from '../../../services/firebase';
import { useAuth } from '../../auth/context/AuthContext';
import { useHomeContext } from '../../home/context/HomeContext';

/**
 * Custom hook supplying single floor layout lookup status.
 * Waits for Firebase Auth to resolve before fetching to avoid permissions errors.
 */
export function useFloor(id) {
  const { loading: authLoading, user } = useAuth();
  const { homeId, loading: homeLoading } = useHomeContext();
  const [floor, setFloor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Wait for auth and home context to resolve before fetching
    if (authLoading || homeLoading) return;

    setLoading(true);
    setError(null);

    if (shouldUseMockData()) {
      const delay = setTimeout(() => {
        try {
          const data = MockFloorRepository.getFloorById(id);
          if (data) {
            setFloor(data);
          } else {
            setError('Floor not found');
          }
        } catch (err) {
          setError('Failed to retrieve floor details');
        } finally {
          setLoading(false);
        }
      }, 500);
      return () => clearTimeout(delay);
    }

    if (!isFirebaseConfigured() || !id || !user) {
      setFloor(null);
      setLoading(false);
      return;
    }

    let isMounted = true;
    firebaseFloorRepository.getFloorById(id, homeId)
      .then(data => {
        if (isMounted) {
          setFloor(data);
          setError(null);
        }
      })
      .catch(err => {
        console.error('[useFloor] Firebase fetch failed', err);
        if (isMounted) setError('Unable to load floor. Check your connection.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [id, authLoading, homeLoading, user, homeId]);

  return {
    floor,
    loading,
    error,
  };
}

export default useFloor;
