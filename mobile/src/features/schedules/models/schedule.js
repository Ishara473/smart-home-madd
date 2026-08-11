/**
 * Creates a normalized Schedule model object representation.
 */
export function createSchedule({
  id,
  name,
  enabled = true,
  trigger = { type: 'TIME', value: '12:00' },
  action = { deviceId: '', command: {} },
  lastExecuted = null,
  ...extra
}) {
  return {
    id,
    name,
    enabled,
    trigger,
    action,
    lastExecuted,
    ...extra
  };
}

export default {
  createSchedule,
};
