/**
 * Firestore Room document model.
 * Collection: rooms/{roomId}
 */
export function createRoom({
  id,
  homeId,
  floorId,
  name,
  type = 'GENERAL',
  gridX = 0,
  gridY = 0,
  gridWidth = 2,
  gridHeight = 2,
  color = '#E8E8E8',
  createdAt,
  updatedAt,
}) {
  return {
    id,
    homeId,
    floorId,
    name,
    type,
    gridX,
    gridY,
    gridWidth,
    gridHeight,
    color,
    createdAt,
    updatedAt,
  };
}

export default createRoom;
