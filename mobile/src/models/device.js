import { DEVICE_TYPES } from '../shared/constants/deviceTypes';
import { DEVICE_STATUS } from '../shared/constants/deviceStatus';

/**
 * Firestore Device document model.
 * Collection: devices/{deviceId}
 */
export function createDevice({
  id,
  homeId,
  floorId,
  roomId,
  name,
  type = DEVICE_TYPES.LIGHT,
  status = DEVICE_STATUS.OFF,
  state = {},
  powerConsumption = 0,
  maxOnDuration = null,
  switches = null,
  cameraUri = null,
  createdAt,
  updatedAt,
  ...extra
}) {
  return {
    id,
    homeId,
    floorId,
    roomId,
    name,
    type,
    status,
    state,
    powerConsumption,
    maxOnDuration,
    switches,
    cameraUri,
    createdAt,
    updatedAt,
    ...extra,
  };
}

export default createDevice;
