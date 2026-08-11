import React, { createContext, useState, useEffect, useRef } from 'react';
import { useDevices } from '../../devices';
import { scheduleMockData } from '../data/scheduleMockData';
import { checkSafetyBreaches } from '../utils/safetyTimer';
import { scheduleRepository as firebaseScheduleRepository } from '../../../services/firebase/repositories';
import { shouldUseMockData, isFirebaseConfigured } from '../../../services/firebase';
import { useHomeContext } from '../../home/context/HomeContext';

import { notificationRepository } from '../../../services/firebase/repositories/notificationRepository';

export const ScheduleContext = createContext({
  schedules: [],
  safetyRules: [],
  createSchedule: () => {},
  updateSchedule: () => {},
  deleteSchedule: () => {},
  enableSchedule: () => {},
  disableSchedule: () => {},
  updateSafetyRule: () => {},
});

export function ScheduleProvider({ children }) {
  const { homeId, loading: homeLoading } = useHomeContext();
  const [schedules, setSchedules] = useState([]);
  const [safetyRules, setSafetyRules] = useState([]);
  const { devices, updateDeviceStatus, updateDeviceState } = useDevices();

  useEffect(() => {
    if (homeLoading) return;

    if (shouldUseMockData()) {
      setSchedules(scheduleMockData.schedules);
      setSafetyRules(scheduleMockData.safetyRules);
      return;
    }

    if (!isFirebaseConfigured() || !homeId) return;

    let isMounted = true;
    firebaseScheduleRepository.getSchedulesByHome(homeId)
      .then((allSchedules) => {
        if (!isMounted) return;
        setSchedules(allSchedules.filter(s => s.scheduleType === 'TIME_TRIGGER' || s.scheduleType === 'TIME_RANGE'));
        setSafetyRules(allSchedules.filter(s => s.scheduleType === 'SAFETY_RULE'));
      })
      .catch(err => console.error('[ScheduleContext] Failed to load schedules', err));

    return () => { isMounted = false; };
  }, [homeId, homeLoading]);

  // Safety timer — polls every 1 second, always active
  useEffect(() => {
    const interval = setInterval(() => {
      checkSafetyBreaches(devices, safetyRules, (deviceId, rule) => {
        // Turn OFF both status and state.power so Firebase + simulator both see it
        updateDeviceStatus(deviceId, 'OFF');
        updateDeviceState(deviceId, { power: false });

        const device = devices.find(d => d.id === deviceId);
        const deviceName = device?.name || 'Appliance';

        if (!shouldUseMockData() && homeId) {
          notificationRepository.createNotification({
            homeId,
            title: `⚠️ ${deviceName} Safety Cutoff`,
            message: `${deviceName} exceeded maximum active duration (${rule?.maxOnDuration || 15}s) and was automatically shut off.`,
            type: 'SAFETY',
            severity: 'HIGH',
          });
        }
        if (__DEV__) console.warn(`[SAFETY CUTOFF]: Device ${deviceId} (${deviceName}) forcibly turned OFF.`);
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [devices, safetyRules, updateDeviceStatus, updateDeviceState, homeId]);

  // Time-based schedule executor — checks every minute
  const lastExecutedRef = useRef({});
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });

      schedules.forEach((schedule) => {
        if (!schedule.enabled || !schedule.deviceId) return;

        const { startTime, endTime, daysOfWeek, scheduleType } = schedule;
        const execKey = `${schedule.id}-${currentTime}`;

        // Skip if already executed this minute
        if (lastExecutedRef.current[execKey]) return;

        // Check day filter
        if (daysOfWeek && daysOfWeek.length > 0 && !daysOfWeek.includes(currentDay)) return;

        const device = devices.find(d =>
          d.id === schedule.deviceId ||
          (schedule.deviceId === 'dev-light-1' && (d.id === 'mock-dev-1' || d.type === 'LIGHT')) ||
          (schedule.deviceId === 'dev-iron-1' && (d.id === 'mock-dev-4' || d.type === 'IRON'))
        );
        if (!device) return;

        const targetDeviceId = device.id;

        if (scheduleType === 'TIME_RANGE' || scheduleType === 'TIMER') {
          const inRange = startTime && endTime && currentTime >= startTime && currentTime < endTime;
          const isOn = device.state?.power === true || device.status === 'ON';

          if (inRange && !isOn) {
            lastExecutedRef.current[execKey] = true;
            updateDeviceStatus(targetDeviceId, 'ON');
            updateDeviceState(targetDeviceId, { power: true });
            if (__DEV__) console.log(`[SCHEDULE ON]: ${targetDeviceId} (${startTime}–${endTime})`);
          } else if (!inRange && isOn && scheduleType === 'TIME_RANGE') {
            lastExecutedRef.current[execKey] = true;
            updateDeviceStatus(targetDeviceId, 'OFF');
            updateDeviceState(targetDeviceId, { power: false });
            if (__DEV__) console.log(`[SCHEDULE OFF]: ${targetDeviceId} (outside range ${startTime}–${endTime})`);
          }
        }

        if (scheduleType === 'TIME_TRIGGER') {
          if (startTime && currentTime === startTime) {
            lastExecutedRef.current[execKey] = true;
            updateDeviceStatus(targetDeviceId, 'ON');
            updateDeviceState(targetDeviceId, { power: true });
            if (__DEV__) console.log(`[SCHEDULE TRIGGER ON]: ${targetDeviceId} at ${startTime}`);
          }
          if (endTime && currentTime === endTime) {
            lastExecutedRef.current[execKey] = true;
            updateDeviceStatus(targetDeviceId, 'OFF');
            updateDeviceState(targetDeviceId, { power: false });
            if (__DEV__) console.log(`[SCHEDULE TRIGGER OFF]: ${targetDeviceId} at ${endTime}`);
          }
        }
      });

      // Cleanup old execution keys (older than 2 minutes)
      const cutoff = Date.now() - 120000;
      Object.keys(lastExecutedRef.current).forEach(key => {
        if (lastExecutedRef.current[key] < cutoff) delete lastExecutedRef.current[key];
      });
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [schedules, devices, updateDeviceStatus]);

  const createSchedule = async (newSchedule) => {
    if (shouldUseMockData()) { setSchedules(prev => [...prev, newSchedule]); return; }
    try {
      const id = await firebaseScheduleRepository.createSchedule({ ...newSchedule, homeId });
      setSchedules(prev => [...prev, { ...newSchedule, id }]);
    } catch (err) { console.error('[ScheduleContext] createSchedule failed', err); }
  };

  const updateSchedule = async (id, updated) => {
    setSchedules(prev => prev.map(s => s.id === id ? { ...s, ...updated } : s));
    if (shouldUseMockData()) return;
    try { await firebaseScheduleRepository.updateSchedule(id, updated); }
    catch (err) { console.error('[ScheduleContext] updateSchedule failed', err); }
  };

  const deleteSchedule = async (id) => {
    setSchedules(prev => prev.filter(s => s.id !== id));
    if (shouldUseMockData()) return;
    try { await firebaseScheduleRepository.deleteSchedule(id); }
    catch (err) { console.error('[ScheduleContext] deleteSchedule failed', err); }
  };

  const enableSchedule = (id) => updateSchedule(id, { enabled: true });
  const disableSchedule = (id) => updateSchedule(id, { enabled: false });

  const updateSafetyRule = async (id, updated) => {
    setSafetyRules(prev => prev.map(r => r.id === id ? { ...r, ...updated } : r));
    if (shouldUseMockData()) return;
    try { await firebaseScheduleRepository.updateSchedule(id, updated); }
    catch (err) { console.error('[ScheduleContext] updateSafetyRule failed', err); }
  };

  return (
    <ScheduleContext.Provider value={{
      schedules, safetyRules,
      createSchedule, updateSchedule, deleteSchedule,
      enableSchedule, disableSchedule, updateSafetyRule,
    }}>
      {children}
    </ScheduleContext.Provider>
  );
}

export default ScheduleProvider;
