import { useState, useEffect } from 'react';
import { useDevices } from '../../devices';
import { CameraRepository } from '../repository/CameraRepository';

/**
 * Custom hook returning a single camera detail lookup, dynamically resolving connection status.
 * Exposes a local updateCameraState dispatcher callback.
 */
export function useCamera(id) {
  const [camera, setCamera] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { devices } = useDevices();

  useEffect(() => {
    setLoading(true);
    setError(null);

    const delay = setTimeout(() => {
      try {
        const rawCamera = CameraRepository.getCameraById(id);
        if (rawCamera) {
          const device = devices.find((d) => d.id === rawCamera.deviceId);
          const isConnected = device && device.status !== 'DISCONNECTED';
          
          setCamera({
            ...rawCamera,
            status: isConnected ? 'ONLINE' : 'OFFLINE',
            state: {
              ...rawCamera.state,
              streaming: isConnected ? rawCamera.state.streaming : false,
            },
          });
        } else {
          setError('Camera not found');
        }
      } catch (err) {
        setError('Failed to load camera specifications');
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(delay);
  }, [id, devices]);

  const updateCameraState = (changes) => {
    setCamera((prevCam) => {
      if (!prevCam) return null;
      return {
        ...prevCam,
        state: {
          ...prevCam.state,
          ...changes,
        },
        lastUpdated: new Date().toISOString(),
      };
    });
  };

  return {
    camera,
    loading,
    error,
    updateCameraState,
  };
}

export default useCamera;
