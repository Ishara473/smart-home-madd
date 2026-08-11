/**
 * Creates a normalized Notification model object.
 */
export function createNotification({
  id,
  title,
  message,
  type = 'DEVICE',
  severity = 'INFO',
  read = false,
  timestamp = new Date().toISOString(),
  source = { deviceId: null },
  ...extra
}) {
  return {
    id,
    title,
    message,
    type,
    severity,
    read,
    timestamp,
    source,
    ...extra
  };
}

export default { createNotification };
