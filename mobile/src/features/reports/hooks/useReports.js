import { useState, useEffect } from 'react';
import { ReportRepository } from '../repository/ReportRepository';
import { useDevices } from '../../devices';

export function useReports() {
  const { devices } = useDevices();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const delay = setTimeout(() => {
      try {
        const baseReports = ReportRepository.getReports();
        
        // Enrich device health report with live devices state
        if (devices && devices.length > 0) {
          const activeCount = devices.filter(d => d.status === 'ON').length;
          const errorCount = devices.filter(d => d.status === 'ERROR').length;
          const offlineCount = devices.filter(d => d.status === 'DISCONNECTED').length;
          const total = devices.length;

          const updated = baseReports.map(r => {
            if (r.type === 'DEVICE_HEALTH') {
              return {
                ...r,
                data: {
                  ...r.data,
                  totalDevices: total,
                  healthyDevices: total - errorCount - offlineCount,
                  errorDevices: errorCount,
                  offlineDevices: offlineCount,
                  healthScore: Math.round(((total - errorCount - offlineCount) / total) * 100),
                }
              };
            }
            if (r.type === 'ENERGY') {
              const currentkW = (activeCount * 0.18).toFixed(1);
              return {
                ...r,
                data: {
                  ...r.data,
                  currentUsageKw: currentkW,
                }
              };
            }
            return r;
          });
          setReports(updated);
        } else {
          setReports(baseReports);
        }
      } catch (err) {
        setError('Failed to load analytics reports');
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [devices]);

  return { reports, loading, error };
}

export default useReports;
