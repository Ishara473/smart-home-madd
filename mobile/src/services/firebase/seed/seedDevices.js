import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseApp';
import { withTimestamps, HOME_ID } from './seedUtils';
import { deviceMockData } from '../../../features/devices/data/deviceMockData';
import { roomMockData } from '../../../features/rooms/data/roomMockData';

export const seedDevices = async () => {
  const roomNameToId = {
    'Bedroom': 'room-bedroom',
    'Master Bedroom': 'room-bedroom',
    'Living Room': 'room-living',
    'Kitchen': 'room-kitchen',
    'Garage': 'room-garage',
    'Garage Entrance': 'room-garage',
    'Laundry': 'room-laundry',
    'Laundry Room': 'room-laundry',
    'Bathroom': 'room-bathroom',
  };

  const roomToFloorId = {};
  for (const room of roomMockData) {
    roomNameToId[room.name] = room.id;
    roomToFloorId[room.id] = room.floorId;
  }

  for (const device of deviceMockData) {
    const { id, location, lastUpdated, ...data } = device;

    let roomId = null;
    let floorId = null;

    if (location && location.room) {
      roomId = roomNameToId[location.room] || (location.floor?.includes('first') ? 'room-bedroom' : 'room-living');
    }
    if (location && location.floor) {
      floorId = location.floor.includes('first') ? 'floor-first' : 'floor-ground';
    } else if (roomId) {
      floorId = roomToFloorId[roomId] || 'floor-ground';
    }

    const seedData = {
      ...data,
      homeId: HOME_ID,
      roomId,
      floorId,
      location
    };

    await setDoc(doc(db, 'devices', id), withTimestamps(seedData), { merge: false });
  }
};