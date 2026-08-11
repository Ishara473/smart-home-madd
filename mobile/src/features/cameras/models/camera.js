/**
 * Creates a normalized camera device capabilities model.
 */
export function createCamera({
  id,
  deviceId,
  name,
  location = { room: 'Garage', floor: 'Ground Floor' },
  state = { streaming: true, recording: false, motionDetection: true },
  snapshotUri = null,
  streamUri = null,
  lastUpdated = new Date().toISOString(),
  ...extra
}) {
  return {
    id,
    deviceId,
    name,
    location,
    state,
    snapshotUri,
    streamUri,
    lastUpdated,
    ...extra
  };
}

export default {
  createCamera,
};
