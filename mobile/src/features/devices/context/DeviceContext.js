import React, { createContext, useState, useEffect } from 'react';
import { deviceRepository as mockDeviceRepository } from '../../../core/repositories/deviceRepository';
import { deviceRepository as firebaseDeviceRepository } from '../../../services/firebase/repositories';
import { shouldUseMockData, isFirebaseConfigured } from '../../../services/firebase';
import { useHomeContext } from '../../home/context/HomeContext';
import { DEVICE_STATUS } from '../../../shared/constants/deviceStatus';
import { DEVICE_TYPES } from '../../../shared/constants/deviceTypes';

export const DeviceContext = createContext({
  devices: [],
  toggleDevice: () => {},
  toggleSubSwitch: () => {},
  updateDeviceStatus: () => {},
  updateDeviceState: () => {},
  getDevice: () => {},
  loading: true,
  error: null,
});

export function DeviceProvider({ children }) {
  const { homeId, loading: homeLoading } = useHomeContext();
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (homeLoading) return;

    if (shouldUseMockData()) {
      setDevices(mockDeviceRepository.getDevices());
      setLoading(false);
      return;
    }

    if (!isFirebaseConfigured() || !homeId) {
      setDevices([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = firebaseDeviceRepository.subscribeToDevices(homeId, (fetchedDevices) => {
      setDevices(fetchedDevices);
      setError(null);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [homeId, homeLoading]);

  const getDevice = (deviceId) => devices.find(d => d.id === deviceId);

  const toggleDevice = async (deviceId) => {
    const device = getDevice(deviceId);
    if (!device || device.type === DEVICE_TYPES.CAMERA) return;

    const nextPower = !device.state.power;
    const nextStatus = nextPower ? DEVICE_STATUS.ON : DEVICE_STATUS.OFF;
    const nextPowerConsumption = nextPower ? (device.type === DEVICE_TYPES.IRON ? 1800 : 12) : 0;

    if (shouldUseMockData()) {
      setDevices(prev => prev.map(d => d.id !== deviceId ? d : {
        ...d, status: nextStatus,
        state: { ...d.state, power: nextPower },
        powerConsumption: nextPowerConsumption,
        lastUpdated: new Date().toISOString()
      }));
      return;
    }

    try {
      await firebaseDeviceRepository.updateDeviceState(deviceId, { power: nextPower });
      await firebaseDeviceRepository.updateDeviceStatus(deviceId, nextStatus);
    } catch (err) {
      console.error('[DeviceContext] toggleDevice failed', err);
      setError('Unable to toggle device. Check your connection.');
    }
  };

  const toggleSubSwitch = async (deviceId, switchId) => {
    const device = getDevice(deviceId);
    if (!device || device.type !== DEVICE_TYPES.SWITCH_PANEL) return;

    const currentSwitches = device.state?.switches || device.switches || [];
    const updatedSwitches = currentSwitches.map((s, idx) => {
      const isMatch = s.id === switchId || String(s.id) === String(switchId) || s.name === switchId || (idx + 1) === switchId || idx === switchId;
      if (!isMatch) return s;
      const currentStatus = s.status || s.state || DEVICE_STATUS.OFF;
      const nextStatus = currentStatus === DEVICE_STATUS.ON ? DEVICE_STATUS.OFF : DEVICE_STATUS.ON;
      return { ...s, id: s.id || (idx + 1), status: nextStatus, state: nextStatus };
    });

    const activeCount = updatedSwitches.filter(s => s.status === DEVICE_STATUS.ON || s.state === 'ON').length;
    const nextStatus = activeCount > 0 ? DEVICE_STATUS.ON : DEVICE_STATUS.OFF;
    const nextPower = activeCount > 0;

    setDevices(prev => prev.map(d => d.id !== deviceId ? d : {
      ...d,
      switches: updatedSwitches,
      status: nextStatus,
      state: { ...d.state, power: nextPower, switches: updatedSwitches },
      powerConsumption: activeCount * 15,
      lastUpdated: new Date().toISOString()
    }));

    if (!shouldUseMockData()) {
      try {
        await firebaseDeviceRepository.updateDeviceState(deviceId, {
          switches: updatedSwitches,
          power: nextPower
        });
        await firebaseDeviceRepository.updateDeviceStatus(deviceId, nextStatus);
        const docRef = doc(db, 'devices', deviceId);
        await updateDoc(docRef, { switches: updatedSwitches });
      } catch (err) {
        console.error('[DeviceContext] toggleSubSwitch Firebase update failed', err);
      }
    }
  };

  const updateDeviceStatus = async (deviceId, status) => {
    const powerValue = status === DEVICE_STATUS.ON;
    if (shouldUseMockData()) {
      setDevices(prev => prev.map(d => d.id !== deviceId ? d : {
        ...d,
        status,
        state: { ...d.state, power: powerValue },
        lastUpdated: new Date().toISOString()
      }));
      return;
    }
    try {
      await firebaseDeviceRepository.updateDeviceStatus(deviceId, status);
      // Also sync state.power so the visual toggle always matches the status
      await firebaseDeviceRepository.updateDeviceState(deviceId, { power: powerValue });
    } catch (err) {
      console.error('[DeviceContext] updateDeviceStatus failed', err);
      setError('Unable to update device status.');
    }
  };

  const updateDeviceState = async (deviceId, stateChanges) => {
    if (shouldUseMockData()) {
      setDevices(prev => prev.map(d => {
        if (d.id !== deviceId) return d;
        const nextState = { ...d.state, ...stateChanges };
        let nextStatus = d.status;
        if (Object.prototype.hasOwnProperty.call(stateChanges, 'power')) {
          nextStatus = stateChanges.power ? DEVICE_STATUS.ON : DEVICE_STATUS.OFF;
        }
        return { ...d, state: nextState, status: nextStatus, lastUpdated: new Date().toISOString() };
      }));
      return;
    }
    try {
      await firebaseDeviceRepository.updateDeviceState(deviceId, stateChanges);
      if (Object.prototype.hasOwnProperty.call(stateChanges, 'power')) {
        const nextStatus = stateChanges.power ? DEVICE_STATUS.ON : DEVICE_STATUS.OFF;
        await firebaseDeviceRepository.updateDeviceStatus(deviceId, nextStatus);
      }
    } catch (err) {
      console.error('[DeviceContext] updateDeviceState failed', err);
      setError('Unable to update device state.');
    }
  };

  return (
    <DeviceContext.Provider value={{
      devices, toggleDevice, toggleSubSwitch,
      updateDeviceStatus, updateDeviceState, getDevice,
      loading, error,
    }}>
      {children}
    </DeviceContext.Provider>
  );
}

export default DeviceProvider;
