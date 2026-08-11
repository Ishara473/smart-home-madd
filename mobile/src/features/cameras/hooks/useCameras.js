import { useState, useEffect } from 'react';
import { useDevices } from '../../devices';
import { CameraRepository as MockCameraRepository } from '../repository/CameraRepository';
import { cameraRepository as firebaseCameraRepository } from '../../../services/firebase/repositories';
import { shouldUseMockData, isFirebaseConfigured } from '../../../services/firebase';
import { useHomeContext } from '../../home/context/HomeContext';

/**
 * Custom hook returning camera list, dynamically mapping status from DeviceContext.
 * Source: Firestore realtime (production, homeId from AuthContext) or MockData.
 */
export function useCameras() {
  const { homeId, loading: homeLoading } = useHomeContext();
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { devices } = useDevices();

  const mapStatus = (rawCameras) =>
    rawCameras.map((cam) => {
      const device = devices.find((d) => d.id === cam.deviceId);
      const isConnected = device && device.status !== 'DISCONNECTED';
      return {
        ...cam,
        status: isConnected ? 'ONLINE' : 'OFFLINE',
        state: { ...cam.state, streaming: isConnected ? cam.state?.streaming : false },
      };
    });

  useEffect(() => {
    if (homeLoading) return;

    if (shouldUseMockData()) {
      setLoading(true);
      const delay = setTimeout(() => {
        try {
          setCameras(mapStatus(MockCameraRepository.getCameras()));
        } catch (err) {
          setError('Failed to retrieve security camera logs');
        } finally {
          setLoading(false);
        }
      }, 500);
      return () => clearTimeout(delay);
    }

    if (!isFirebaseConfigured() || !homeId) {
      setCameras([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = firebaseCameraRepository.subscribeToCameras(homeId, (rawCameras) => {
      setCameras(mapStatus(rawCameras));
      setError(null);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [homeId, homeLoading, devices]);

  return { cameras, loading, error };
}

export default useCameras;
