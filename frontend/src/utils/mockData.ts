export interface User {
  id: number;
  nombre: string;
  email: string;
  rol: 'admin' | 'usuario';
  activo: number;
  estado: 'pendiente' | 'aprobado' | 'rechazado';
  username: string;
  fecha_registro: string;
  profesion?: string;
  especialidad?: string;
  biografia?: string;
  ubicacion?: string;
  telefono?: string;
  foto_perfil?: string;
  linkedin_url?: string;
  github_url?: string;
  website_url?: string;
  universidad?: string;
  carrera?: string;
}

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

export interface Proyecto {
  id: number;
  usuario_id: number;
  titulo: string;
  descripcion: string;
  imagen_url?: string;
  categoria_id: number;
  categoria_nombre?: string;
  tecnologias: string[];
  herramientas?: string[];
  cliente?: string;
  fecha_realizacion: string;
  github_url?: string;
  demo_url?: string;
  estado: 'pendiente' | 'aprobado' | 'rechazado';
  visible: number;
  fecha_creacion: string;
}

export interface Habilidad {
  id: number;
  usuario_id: number;
  nombre: string;
  nivel: number;
  tipo: 'tecnica' | 'blanda';
}

export interface Comentario {
  id: number;
  proyecto_id: number;
  usuario_id: number;
  comentario: string;
  aprobado: number;
  fecha: string;
}

export interface Categoria {
  id: number;
  nombre: string;
  icono: string;
  descripcion?: string;
}

export const STORAGE_KEYS = {
  AUTH_USER: 'devfolio_auth_user',
  USERS: 'devfolio_users',
  EXPERIENCIAS: 'devfolio_experiencias'
};

export function initializeMockData() {
  // Sin hacer nada - para desarrollo local
}

export function getStorageData<T>(key: string): T[] {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function setStorageData<T>(key: string, data: T[]) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    console.error('Error al guardar datos');
  }
}

export function generateUsername(nombre: string): string {
  return nombre
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

export const mockUsers: User[] = [
  {
    id: 1,
    nombre: 'Usuario Test',
    email: 'test@example.com',
    rol: 'usuario',
    activo: 1,
    estado: 'aprobado',
    username: 'usuario-test',
    fecha_registro: '2026-04-09'
  }
];

export const mockCategorias: Categoria[] = [
  {
    id: 1,
    nombre: 'Desarrollo Web',
    icono: 'Code'
  }
];