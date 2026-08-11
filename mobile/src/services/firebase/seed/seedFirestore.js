import { db, auth } from '../firebaseApp';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { seedFloors } from './seedFloors';
import { seedRooms } from './seedRooms';
import { seedDevices } from './seedDevices';
import { seedCameras } from './seedCameras';
import { seedSchedules } from './seedSchedules';
import { seedNotifications } from './seedNotifications';
import { seedReports } from './seedReports';
import { HOME_ID } from './seedUtils';

export const seedFirestore = async () => {
  if (!__DEV__) {
    console.warn('Seed function can only run in development mode.');
    return;
  }

  const authUid = auth.currentUser?.uid;
  if (!authUid) {
    throw new Error('Seed requires an authenticated Firebase user. Please sign in before seeding the database.');
  }
  
  console.log('🔥 Starting Firestore seed...');
  console.log(`Seeding for authenticated user: ${authUid}`);
  
  try {
    // Step 1: Check user document and currentHomeId
    const userDocRef = doc(db, 'users', authUid);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      throw new Error('User document does not exist. AuthContext should have created it during authentication.');
    }
    
    const userData = userDoc.data();
    const currentHomeId = userData.currentHomeId;
    
    // Step 2: If user has no home, create it
    if (!currentHomeId) {
      console.log('User has no home assigned. Creating home...');
      
      const homeData = {
        name: 'Smart Villa Residency',
        address: '123 Tech Avenue, Colombo',
        timezone: 'Asia/Colombo',
        ownerId: authUid,
        memberUserIds: [authUid],
        floorsCount: 2,
        totalDevices: 8,
        activeDevices: 5,
        securityStatus: 'ARMED',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      
      await setDoc(doc(db, 'homes', HOME_ID), homeData);
      console.log('✓ Home created');
      
      // Update user document with currentHomeId
      await updateDoc(userDocRef, {
        currentHomeId: HOME_ID,
        updatedAt: serverTimestamp(),
      });
      console.log('✓ User document updated with currentHomeId');
    } else {
      console.log(`User already has home: ${currentHomeId}`);
      console.log('WARNING: This will overwrite existing home data');
      
      // Ensure current user is in memberUserIds even if home already exists
      const homeDocRef = doc(db, 'homes', HOME_ID);
      const homeDoc = await getDoc(homeDocRef);
      
      if (homeDoc.exists()) {
        const homeData = homeDoc.data();
        const memberUserIds = homeData.memberUserIds || [];
        
        if (!memberUserIds.includes(authUid)) {
          console.log('Adding current user to home memberUserIds...');
          await updateDoc(homeDocRef, {
            memberUserIds: [...memberUserIds, authUid],
            updatedAt: serverTimestamp(),
          });
          console.log('✓ User added to home memberUserIds');
        } else {
          console.log('✓ User already in home memberUserIds');
        }
      }
    }
    
    // Step 3: Seed remaining collections
    await seedFloors();
    console.log('✓ Floors seeded');
    await seedRooms();
    console.log('✓ Rooms seeded');
    await seedDevices();
    console.log('✓ Devices seeded');
    await seedCameras();
    console.log('✓ Cameras seeded');
    await seedSchedules();
    console.log('✓ Schedules seeded');
    await seedNotifications();
    console.log('✓ Notifications seeded');
    await seedReports();
    console.log('✓ Reports seeded');
    
    console.log('🔥 Firestore seed completed successfully');
  } catch (error) {
    console.error('🔥 Firestore seed failed:', error);
    throw error;
  }
};