// frontend/src/hooks/useProjects.ts

import { useState, useEffect, useCallback } from 'react';
import api, { buildUrl } from '../utils/api';

export interface Project {
  id: string;
  titulo: string;
  descripcion: string;
  categoria?: string;
  categoria_id?: string;
  fecha_proyecto?: string;
  tecnologias: string[];
  herramientas?: string;
  cliente?: string;
  github?: string;
  demo?: string;
  estado: string;
  imagen_url: string | null;
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/proyectos');
      const projectsData = response.data.data || response.data;

      const formattedProjects: Project[] = projectsData.map((item: any) => ({
        id: item.id.toString(),
        titulo: item.titulo,
        descripcion: item.descripcion,
        categoria: item.categoria?.nombre || 'Sin categoría',
        categoria_id: item.categoria_id?.toString(),
        fecha_proyecto: item.fecha_proyecto || item.created_at,
        tecnologias: typeof item.tecnologias === 'string'
            ? item.tecnologias.split(',').map((t: string) => t.trim())
            : (item.tecnologias || []),
        herramientas: item.herramientas,
        cliente: item.cliente,
        github: item.github,
        demo: item.demo,
        estado: item.estado,
        imagen_url: item.imagen ? buildUrl(item.imagen) : null
      }));

      setProjects(formattedProjects);
    } catch (err: any) {
      console.error('Error al cargar proyectos:', err);
      setError(err.response?.data?.message || 'Error al cargar proyectos');
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteProject = async (id: string) => {
    try {
      await api.delete(`/proyectos/${id}`);
      setProjects(prev => prev.filter(p => p.id !== id));
      return true;
    } catch (err: any) {
      console.error('Error al eliminar proyecto:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return {
    projects,
    loading,
    error,
    refetch: fetchProjects,
    deleteProject
  };
}
