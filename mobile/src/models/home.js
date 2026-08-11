/**
 * Firestore Home document model.
 * Collection: homes/{homeId}
 */
export function createHome({
  id,
  name,
  address = '',
  timezone = 'UTC',
  ownerId,
  memberUserIds = [],
  floorsCount = 0,
  totalDevices = 0,
  activeDevices = 0,
  securityStatus = 'DISARMED',
  createdAt,
  updatedAt,
}) {
  return {
    id,
    name,
    address,
    timezone,
    ownerId,
    memberUserIds,
    floorsCount,
    totalDevices,
    activeDevices,
    securityStatus,
    createdAt,
    updatedAt,
  };
}

export default createHome;
