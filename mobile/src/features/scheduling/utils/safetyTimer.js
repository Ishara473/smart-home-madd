const activeTimers = {};

/**
 * Checks running devices against active safety rules.
 * Triggers a callback if a device exceeds its maximum permissible active duration.
 */
export function checkSafetyBreaches(devices, safetyRules, onCutoffTriggered) {
  devices.forEach(device => {
    const isIron = device.type === 'IRON' || device.id === 'dev-iron-1' || device.id === 'mock-dev-4';

    // Find matching rule, or create a default one for any IRON device
    let rule = (safetyRules || []).find(r =>
      (r.deviceId === device.id || (isIron && (r.deviceId === 'dev-iron-1' || r.deviceId === 'mock-dev-4'))) && r.enabled !== false
    );
    if (!rule && isIron) {
      rule = { deviceId: device.id, maxOnDuration: 15, enabled: true, action: 'TURN_OFF' };
    }

    // Consider device active if power is true OR status is ON or ERROR (iron shows ERROR when on too long)
    const isDeviceActive = device.state?.power === true ||
      device.status === 'ON' ||
      (isIron && device.status === 'ERROR');

    if (isDeviceActive && rule) {
      if (!activeTimers[device.id]) {
        activeTimers[device.id] = Date.now();
        if (__DEV__) console.log(`[SAFETY] Started tracking ${device.name || device.id} — cutoff in ${rule.maxOnDuration}s`);
      } else {
        const elapsedSeconds = Math.floor((Date.now() - activeTimers[device.id]) / 1000);
        // maxOnDuration is always in SECONDS in this system
        if (elapsedSeconds >= (rule.maxOnDuration || 15)) {
          delete activeTimers[device.id];
          if (__DEV__) console.warn(`[SAFETY CUTOFF] ${device.name || device.id} exceeded ${rule.maxOnDuration}s — turning OFF`);
          onCutoffTriggered(device.id, rule);
        }
      }
    } else {
      delete activeTimers[device.id];
    }
  });
}

/**
 * Retrieves the elapsed runtime in seconds for an active device.
 */
export function getElapsedSeconds(deviceId) {
  if (!activeTimers[deviceId]) return 0;
  return Math.floor((Date.now() - activeTimers[deviceId]) / 1000);
}

export default {
  checkSafetyBreaches,
  getElapsedSeconds
};
