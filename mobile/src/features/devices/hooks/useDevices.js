import { useContext } from 'react';
import { DeviceContext } from '../context/DeviceContext';

export function useDevices() {
  const context = useContext(DeviceContext);
  if (!context) {
    throw new Error('useDevices must be used within a DeviceProvider');
  }
  return context;
}

export default useDevices;
