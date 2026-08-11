import { dashboardMockData } from '../data/dashboardMockData';
import { useHomeContext } from '../../home/context/HomeContext';

/**
 * Custom hook supplying dashboard data configuration.
 * Decouples visual presentation screens from backend data providers (e.g. mock vs Firebase).
 */
export function useDashboard() {
  const { home } = useHomeContext();

  const homeOverview = home ? {
    name: home.name,
    floorsCount: home.floorsCount,
    totalDevices: home.totalDevices,
    activeDevices: home.activeDevices,
    totalCameras: 2, // Could be derived from camera context later
  } : dashboardMockData.homeOverview;

  const quickStatus = home ? {
    security: home.securityStatus,
    powerUsage: '2.4 kW / hr (Normal)', // Simulation
    systemHealth: 'OPTIMAL (Cloud Sync Active)', // Simulation
  } : dashboardMockData.quickStatus;

  return {
    dashboardData: {
      ...dashboardMockData,
      homeOverview,
      quickStatus,
    }
  };
}

export default useDashboard;
