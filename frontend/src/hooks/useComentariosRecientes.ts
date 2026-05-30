import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

export interface ComentarioReciente {
  id: number;
  contenido: string;
  aprobado: number;
  tiempo: string;
  proyecto: {
    id: number;
    titulo: string;
  };
  autor: {
    nombre: string;
    username: string;
    avatarLetter: string;
  } | null;
}

export function useComentariosRecientes() {
  const [comentarios, setComentarios] = useState<ComentarioReciente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComentarios = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/profile/comentarios-recientes');
      setComentarios(response.data.data ?? []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar comentarios');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComentarios();
  }, [fetchComentarios]);

  return { comentarios, loading, error };
}
