import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

export interface Visitor {
  id: string;
  nombre: string;
  cargo: string;
  especialidad: string;
  tiempo: string;
  avatarLetter: string;
  bgColor: string;
  username: string;
}

export function useVisitas() {
  const [visitasEsteMes, setVisitasEsteMes] = useState<number>(0);
  const [visitantesRecientes, setVisitantesRecientes] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVisitas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/profile/visitas');
      const data = response.data.data ?? response.data;
      setVisitasEsteMes(data.visitas_este_mes ?? 0);
      setVisitantesRecientes(data.visitantes_recientes ?? []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar visitas');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVisitas();
  }, [fetchVisitas]);

  return { visitasEsteMes, visitantesRecientes, loading, error };
}
