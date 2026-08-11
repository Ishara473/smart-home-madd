export const dashboardMockData = {
  homeOverview: {
    name: 'Smart Villa Residency',
    floorsCount: 2,
    totalDevices: 14,
    activeDevices: 5,
    totalCameras: 2,
  },
  floorsSummary: [
    {
      id: 'ground-floor',
      name: 'Ground Floor',
      roomCount: 3,
      deviceCount: 8,
      activeDevicesCount: 3,
      status: 'ON',
    },
    {
      id: 'first-floor',
      name: 'First Floor',
      roomCount: 2,
      deviceCount: 6,
      activeDevicesCount: 2,
      status: 'ON',
    },
  ],
  deviceStatusSummary: {
    total: 14,
    on: 5,
    off: 7,
    error: 1,
    disconnected: 1,
  },
  safetyAlerts: [
    {
      id: 'alert-1',
      title: 'Safety Cutoff Alert: Laundry Iron',
      message: 'Iron exceeded recommended maximum active duration (15 min limit)',
      severity: 'HIGH',
      timestamp: '2 mins ago',
    },
    {
      id: 'alert-2',
      title: 'Connectivity Alert: Garage Camera',
      message: 'Security Camera stream disconnected from network listener',
      severity: 'MEDIUM',
      timestamp: '14 mins ago',
    },
  ],
  recentActivity: [
    {
      id: 'act-1',
      type: 'TOGGLE',
      deviceName: 'Living Room Light',
      action: 'Turned ON',
      timestamp: '5 mins ago',
    },
    {
      id: 'act-2',
      type: 'SAFETY',
      deviceName: 'Laundry Iron',
      action: 'Auto Cutoff Triggered',
      timestamp: '12 mins ago',
    },
    {
      id: 'act-3',
      type: 'STATUS',
      deviceName: 'Garage Gate Lock',
      action: 'Locked',
      timestamp: '1 hr ago',
    },
    {
      id: 'act-4',
      type: 'CONNECT',
      deviceName: 'Kitchen smart Outlet',
      action: 'Connected',
      timestamp: '2 hrs ago',
    }
  ],
  quickStatus: {
    security: 'ARMED',
    powerUsage: '2.4 kW / hr (Normal)',
    systemHealth: 'OPTIMAL (Cloud Sync Active)',
  },
};

export default dashboardMockData;
