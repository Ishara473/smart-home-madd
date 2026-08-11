/**
 * Decoupled utility to aggregate operational statistics for a room's resolved devices list.
 * Returns: { total, online, active } counts.
 */
export function getRoomStatistics(devices = []) {
  const total = devices.length;
  const online = devices.filter(d => d.status !== 'DISCONNECTED').length;
  const active = devices.filter(d => d.status === 'ON').length;

  return {
    total,
    online,
    active
  };
}

export default getRoomStatistics;
