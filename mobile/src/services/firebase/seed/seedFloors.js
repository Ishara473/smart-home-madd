import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseApp';
import { withTimestamps, HOME_ID } from './seedUtils';
import { floorMockData } from '../../../features/floors/data/floorMockData';
import { floorMapMockData } from '../../../features/floorMap/data/floorMapMockData';

export const seedFloors = async () => {
  let order = 1;
  for (const floor of floorMockData) {
    const floorMap = floorMapMockData[floor.id] || null;
    let formattedFloorMap = null;

    if (floorMap) {
      // Remove deviceLocations if it exists and keep only rooms for spatial layout
      formattedFloorMap = {
        width: floorMap.width,
        height: floorMap.height,
        gridSize: floorMap.gridSize,
        rooms: floorMap.rooms
      };
    }

    const { id, rooms, ...data } = floor; // Remove nested room objects
    const seedData = {
      ...data,
      homeId: HOME_ID,
      order: order++,
      floorMap: formattedFloorMap
    };

    await setDoc(doc(db, 'floors', id), withTimestamps(seedData), { merge: false });
  }
};