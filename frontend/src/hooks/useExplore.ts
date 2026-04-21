import { useState, useEffect } from 'react';
import api from '../utils/api';

interface User {
  id: number;
  nombre: string;
  username: string;
  foto: string | null;
  profesion: string;
  especialidad: string;
  ubicacion: string;
  universidad: string;
  carrera: string;
  proyectos_count: number;
  tipo_perfil: string;
}

interface Project {
  id: number;
  titulo: string;
  descripcion: string;
  tecnologias: string;
  imagen: string | null;
  categoria: {
    id: number;
    nombre: string;
    icono: string;
    color: string;
  };
  autor: {
    id: number;
    nombre: string;
    username: string;
    foto: string | null;
  };
}

interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export const useExplore = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usersPage, setUsersPage] = useState(1);
  const [projectsPage, setProjectsPage] = useState(1);
  const [usersPagination, setUsersPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 12,
    total: 0,
  });
  const [projectsPagination, setProjectsPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 12,
    total: 0,
  });

  const searchUsers = async (params: { search?: string; filter?: string; page?: number; per_page?: number }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<{ success: boolean; message: string; data: PaginatedResponse<User> }>('/explore/users', { params });
      setUsers(response.data.data.data);
      setUsersPagination({
        current_page: response.data.data.current_page,
        last_page: response.data.data.last_page,
        per_page: response.data.data.per_page,
        total: response.data.data.total,
      });
      if (params.page) setUsersPage(params.page);
    } catch (err) {
      setError('Error al buscar usuarios');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const searchProjects = async (params: { search?: string; categoria_id?: number; page?: number; per_page?: number }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<{ success: boolean; message: string; data: PaginatedResponse<Project> }>('/explore/projects', { params });
      setProjects(response.data.data.data);
      setProjectsPagination({
        current_page: response.data.data.current_page,
        last_page: response.data.data.last_page,
        per_page: response.data.data.per_page,
        total: response.data.data.total,
      });
      if (params.page) setProjectsPage(params.page);
    } catch (err) {
      setError('Error al buscar proyectos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUsersPageChange = (page: number) => {
    setUsersPage(page);
    searchUsers({ page });
  };

  const handleProjectsPageChange = (page: number) => {
    setProjectsPage(page);
    searchProjects({ page });
  };

  return {
    users,
    projects,
    loading,
    error,
    usersPage,
    projectsPage,
    usersPagination,
    projectsPagination,
    searchUsers,
    searchProjects,
    handleUsersPageChange,
    handleProjectsPageChange,
  };
};
