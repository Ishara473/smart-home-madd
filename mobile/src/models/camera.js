/**
 * Firestore Camera document model.
 * Collection: cameras/{cameraId}
 */
export function createCamera({
  id,
  homeId,
  deviceId,
  name,
  streamUrl = null,
  snapshotUrl = null,
  status = 'OFFLINE',
  recording = false,
  motionDetection = true,
  createdAt,
  updatedAt,
}) {
  return {
    id,
    homeId,
    deviceId,
    name,
    streamUrl,
    snapshotUrl,
    status,
    recording,
    motionDetection,
    createdAt,
    updatedAt,
  };
}

export default createCamera;
