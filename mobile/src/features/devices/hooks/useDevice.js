import { useState, useEffect } from 'react';
import { useDevices } from './useDevices';

/**
 * Custom hook supplying single device data lookups and state modifiers.
 * Implements a simulated loading delay to prepare for asynchronous storage/network calls.
 */
export function useDevice(id) {
  const { devices, updateDeviceState } = useDevices();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const device = devices.find(d => d.id === id);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const delay = setTimeout(() => {
      setLoading(false);
      if (!device) {
        setError('Device not found');
      }
    }, 500);

    return () => clearTimeout(delay);
  }, [id, device]);

  return {
    device,
    loading,
    error: !loading ? error : null,
    updateDeviceState,
  };
}

export default useDevice;
