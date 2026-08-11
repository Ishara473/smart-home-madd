import { DEVICE_TYPES } from '../../../shared/constants/deviceTypes';
import { DEVICE_STATUS } from '../../../shared/constants/deviceStatus';

/**
 * Creates a normalized IoT device object structure matching real device configurations.
 */
export function createDevice({
  id,
  name,
  type = DEVICE_TYPES.LIGHT,
  location = { room: 'General', floor: 'ground-floor' },
  status = DEVICE_STATUS.ONLINE,
  state = {},
  powerConsumption = 0,
  isControllable = true,
  lastUpdated = new Date().toISOString(),
  ...extra
}) {
  const nonControllableTypes = [DEVICE_TYPES.CAMERA];
  const controllable = isControllable && !nonControllableTypes.includes(type);

  return {
    id,
    name,
    type,
    location,
    status,
    state,
    powerConsumption,
    isControllable: controllable,
    lastUpdated,
    ...extra
  };
}

export default {
  createDevice,
};
