import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

export interface Experiencia {
  id: number;
  usuario_id: number;
  tipo: 'laboral' | 'academica';
  cargo_titulo: string;
  institucion_empresa: string;
  descripcion?: string;
  fecha_inicio: string;
  fecha_fin?: string;
  actual: number;
}

export function useExperience() {
  const { user } = useAuth();
  const [experiences, setExperiences] = useState<Experiencia[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadExperiences = useCallback(async () => {
    //if (!user) return;
    setLoading(true);
    try {
      const response = await api.get('/experiences');
      // Aseguramos obtener el array correcto dependiento de si Laravel devuelve { data: [...] }
      const data = response.data.data || response.data;
      
      // Ordenamos desde la más reciente a la más antigua
      const sortedData = data.sort((a: Experiencia, b: Experiencia) => {
        const dateA = a.actual ? new Date() : new Date(a.fecha_fin || a.fecha_inicio);
        const dateB = b.actual ? new Date() : new Date(b.fecha_fin || b.fecha_inicio);
        return dateB.getTime() - dateA.getTime();
      });
      
      setExperiences(sortedData);
      setError(null);
    } catch (err: any) {
      console.error('Error al cargar experiencias:', err);
      setError(err.response?.data?.message || 'Error al cargar experiencias');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadExperiences();
  }, [loadExperiences]);

  const createExperience = async (expData: Omit<Experiencia, 'id' | 'usuario_id'>) => {
    try {
      const response = await api.post('/experiences', expData);
      await loadExperiences(); // Recargamos la lista actualizada
      return response.data;
    } catch (err: any) {
      console.error('Error al crear experiencia:', err);
      throw err;
    }
  };

  const updateExperience = async (id: number, expData: Partial<Experiencia>) => {
    try {
      const response = await api.put(`/experiences/${id}`, expData);
      await loadExperiences(); // Recargamos la lista actualizada
      return response.data;
    } catch (err: any) {
      console.error('Error al actualizar experiencia:', err);
      throw err;
    }
  };

  const deleteExperience = async (id: number) => {
    try {
      await api.delete(`/experiences/${id}`);
      await loadExperiences(); // Recargamos la lista actualizada
    } catch (err: any) {
      console.error('Error al eliminar experiencia:', err);
      throw err;
    }
  };

  return {
    experiences,
    loading,
    error,
    createExperience,
    updateExperience,
    deleteExperience,
    refreshExperiences: loadExperiences
  };
}