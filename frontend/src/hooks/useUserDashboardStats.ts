import { useState, useEffect } from 'react';
import api from '../utils/api';

export function useUserDashboardStats() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/user/dashboard/stats');
        setStats(response.data.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error fetching dashboard stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
}
