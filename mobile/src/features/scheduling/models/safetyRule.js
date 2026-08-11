export function createSafetyRule({
  id,
  deviceId,
  maxOnDuration = 15, // in minutes (or seconds in demo mode)
  enabled = true,
  action = 'TURN_OFF'
}) {
  return {
    id,
    deviceId,
    maxOnDuration,
    enabled,
    action
  };
}

export default {
  createSafetyRule,
};
