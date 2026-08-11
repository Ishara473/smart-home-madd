export function createSchedule({
  id,
  deviceId,
  scheduleType = 'TIME_RANGE', // 'TIMER' | 'TIME_RANGE'
  startTime,
  endTime,
  enabled = true
}) {
  return {
    id,
    deviceId,
    scheduleType,
    startTime,
    endTime,
    enabled
  };
}

export default {
  createSchedule,
};
