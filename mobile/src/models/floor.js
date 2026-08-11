/**
 * Firestore Floor document model.
 * Collection: floors/{floorId}
 */
export function createFloor({
  id,
  homeId,
  name,
  order = 0,
  imageUrl = null,
  gridWidth = 10,
  gridHeight = 8,
  createdAt,
  updatedAt,
}) {
  return {
    id,
    homeId,
    name,
    order,
    imageUrl,
    gridWidth,
    gridHeight,
    createdAt,
    updatedAt,
  };
}

export default createFloor;
