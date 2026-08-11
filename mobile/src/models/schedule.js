/**
 * Firestore Schedule document model.
 * Collection: schedules/{scheduleId}
 */
export function createSchedule({
  id,
  homeId,
  deviceId,
  name,
  type = 'TIME_BASED',
  enabled = true,
  startTime = null,
  endTime = null,
  daysOfWeek = [],
  maxOnDuration = null,
  action = 'TURN_ON',
  createdAt,
  updatedAt,
}) {
  return {
    id,
    homeId,
    deviceId,
    name,
    type,
    enabled,
    startTime,
    endTime,
    daysOfWeek,
    maxOnDuration,
    action,
    createdAt,
    updatedAt,
  };
}

export default createSchedule;
