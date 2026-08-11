/**
 * Firestore Notification document model.
 * Collection: notifications/{notificationId}
 */
export function createNotification({
  id,
  homeId,
  title,
  message,
  type = 'INFO',
  severity = 'LOW',
  deviceId = null,
  isRead = false,
  createdAt,
  updatedAt,
}) {
  return {
    id,
    homeId,
    title,
    message,
    type,
    severity,
    deviceId,
    isRead,
    createdAt,
    updatedAt,
  };
}

export default createNotification;
