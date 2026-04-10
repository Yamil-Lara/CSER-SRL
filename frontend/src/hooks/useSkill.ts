// frontend/src/hooks/useSkill.ts

import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

export interface Skill {
  id: number;
  usuario_id?: number; // Generado por el backend generalmente
  name: string;        // Volvemos a usar 'name'
  type: 'tecnica' | 'blanda';
  level: number;       // Volvemos a usar 'level'
}

export function useSkill() {
  const { user } = useAuth();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSkills = useCallback(async () => {
    // if (!user) return;
    setLoading(true);
    try {
      const response = await api.get('/skills'); // Ruta confirmada
      const data = response.data.data || response.data;
      setSkills(data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar habilidades');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadSkills();
  }, [loadSkills]);

  const createSkill = async (skillData: Omit<Skill, 'id'>) => {
    try {
      const response = await api.post('/skills', skillData);
      await loadSkills();
      return response.data;
    } catch (err: any) {
      throw err;
    }
  };

  const updateSkill = async (id: number, skillData: Partial<Skill>) => {
    try {
      const response = await api.put(`/skills/${id}`, skillData);
      await loadSkills();
      return response.data;
    } catch (err: any) {
      throw err;
    }
  };

  const deleteSkill = async (id: number) => {
    try {
      await api.delete(`/skills/${id}`);
      await loadSkills();
    } catch (err: any) {
      throw err;
    }
  };

  return { skills, loading, error, createSkill, updateSkill, deleteSkill, refreshSkills: loadSkills };
}