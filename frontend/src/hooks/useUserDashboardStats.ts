import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

export function useUserDashboardStats() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/user/dashboard/stats');
      setStats(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error fetching dashboard stats');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
}
