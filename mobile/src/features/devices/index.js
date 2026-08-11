import DeviceDetailsScreen from './screens/DeviceDetailsScreen';
import DeviceListScreen from './screens/DeviceListScreen';
import DeviceCard from './components/DeviceCard';
import { deviceMockData, getDeviceById, getDevicesByFloor } from './data/deviceMockData';
import { DeviceProvider } from './context/DeviceContext';
import { useDevices } from './hooks/useDevices';
import { useDevice } from './hooks/useDevice';

export {
  DeviceDetailsScreen,
  DeviceListScreen,
  DeviceCard,
  deviceMockData,
  getDeviceById,
  getDevicesByFloor,
  DeviceProvider,
  useDevices,
  useDevice,
};

export default {
  DeviceDetailsScreen,
  DeviceListScreen,
  DeviceCard,
  deviceMockData,
  getDeviceById,
  getDevicesByFloor,
  DeviceProvider,
  useDevices,
  useDevice,
};
