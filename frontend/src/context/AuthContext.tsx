

import React, { useEffect, useState, createContext, useContext, ReactNode } from 'react';
import api from '../utils/api';

interface User {
  id: number;
  nombre: string;
  email: string;
  rol: 'admin' | 'usuario' | 'moderador';
  activo: number;
  estado: 'pendiente' | 'aprobado' | 'rechazado';
  username: string;
  foto?: string | null;
  fecha_registro?: string;
  profesion?: string;
  especialidad?: string;
  biografia?: string;
  ubicacion?: string;
  telefono?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{
    success: boolean;
    message: string;
    user?: User;
  }>;
  register: (nombre: string, email: string, password: string, confirmPassword?: string) => Promise<{
    success: boolean;
    message: string;
  }>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Cargar sesión guardada al iniciar
  useEffect(() => {
    const loadStoredSession = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (token && storedUser) {
        try {
          // Verificar que el token sigue siendo válido
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const response = await api.get('/profile');
          if (response.data.data) {
            setUser(response.data.data);
            localStorage.setItem('user', JSON.stringify(response.data.data));
          } else {
            // Token inválido, limpiar sesión
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            delete api.defaults.headers.common['Authorization'];
          }
        } catch (error) {
          // Token inválido o expirado
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          delete api.defaults.headers.common['Authorization'];
        }
      }
      setLoading(false);
    };
    
    loadStoredSession();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/login', { email, password });
      const { access_token, user: userData } = response.data.data;
      
      // Guardar token en localStorage
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Configurar header por defecto
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      setUser(userData);
      
      return {
        success: true,
        message: 'Inicio de sesión exitoso',
        user: userData
      };
    } catch (error: any) {
      let message = 'Credenciales incorrectas';
      if (error.response?.data?.message) {
        message = error.response.data.message;
      }
      return {
        success: false,
        message
      };
    }
  };

  const register = async (nombre: string, email: string, password: string, confirmPassword?: string) => {
    try {
      // Generar username automáticamente desde el nombre con sufijo aleatorio para unicidad
      const baseUsername = nombre
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const username = `${baseUsername}-${randomSuffix}`;
      
      const response = await api.post('/register', {
        nombre,
        username,
        email,
        password,
        password_confirmation: confirmPassword || password
      });
      
      return {
        success: true,
        message: 'Registro exitoso. Ya puedes iniciar sesión.'
      };
    } catch (error: any) {
      let message = 'Error en el registro';
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        // Collect all validation error messages for clarity
        const allMessages = Object.values(errors).flat() as string[];
        message = allMessages.join('. ');
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      }
      return {
        success: false,
        message
      };
    }
  };

 const logout = async () => {
  try {
    // Esperar a que termine el logout del backend
    await api.post('/logout');
  } catch (error) {
    console.error('Error en logout del backend:', error);
  } finally {
    // Limpiar localStorage (esto siempre debe ejecutarse)
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Limpiar header de autorización de axios
    delete api.defaults.headers.common['Authorization'];
    
    // Limpiar el estado del usuario
    setUser(null);
  }
};

  const updateUser = (userData: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
    isAdmin: user?.rol === 'admin',
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}






































/*import React, { useEffect, useState, createContext, useContext, ReactNode } from 'react';
import {
  User,
  STORAGE_KEYS,
  initializeMockData,
  getStorageData } from
'../utils/mockData';
interface AuthContextType {
  user: User | null;
  login: (
  email: string,
  password: string)
  => Promise<{
    success: boolean;
    message: string;
  }>;
  register: (
  nombre: string,
  email: string,
  password: string)
  => Promise<{
    success: boolean;
    message: string;
  }>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export function AuthProvider({ children }: {children: ReactNode;}) {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    // Initialize mock data
    initializeMockData();
    // Check for existing session
    const storedUser = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  const login = async (
  email: string,
  password: string)
  : Promise<{
    success: boolean;
    message: string;
  }> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    const users = getStorageData<User>(STORAGE_KEYS.USERS);
    const foundUser = users.find((u) => u.email === email);
    if (!foundUser) {
      return {
        success: false,
        message: 'Credenciales incorrectas.'
      };
    }
    if (foundUser.activo === 0) {
      return {
        success: false,
        message: 'Tu cuenta está desactivada. Contacta al administrador.'
      };
    }
    if (foundUser.estado === 'rechazado') {
      return {
        success: false,
        message: 'Tu cuenta ha sido rechazada. Contacta al administrador.'
      };
    }
    // In real app, password would be verified here
    // For mock, we just accept any password
    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(foundUser));
    setUser(foundUser);
    return {
      success: true,
      message: 'Inicio de sesión exitoso'
    };
  };
  const register = async (
  nombre: string,
  email: string,
  password: string)
  : Promise<{
    success: boolean;
    message: string;
  }> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    const users = getStorageData<User>(STORAGE_KEYS.USERS);
    // Check if email already exists
    if (users.some((u) => u.email === email)) {
      return {
        success: false,
        message: 'Este correo electrónico ya está registrado.'
      };
    }
    // Generate username
    const baseUsername = nombre.
    toLowerCase().
    normalize('NFD').
    replace(/[\u0300-\u036f]/g, '').
    replace(/\s+/g, '-').
    replace(/[^a-z0-9-]/g, '');
    let username = baseUsername;
    let counter = 1;
    while (users.some((u) => u.username === username)) {
      username = `${baseUsername}-${counter}`;
      counter++;
    }
    const newUser: User = {
      id: users.length + 1,
      nombre,
      email,
      rol: 'usuario',
      activo: 1,
      estado: 'aprobado',
      username,
      fecha_registro: new Date().toISOString().split('T')[0]
    };
    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    return {
      success: true,
      message: 'Registro exitoso. Ya puedes iniciar sesión.'
    };
  };
  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    setUser(null);
  };
  const updateUser = (userData: Partial<User>) => {
    if (!user) return;
    const updatedUser = {
      ...user,
      ...userData
    };
    setUser(updatedUser);
    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(updatedUser));
    // Update in users list
    const users = getStorageData<User>(STORAGE_KEYS.USERS);
    const index = users.findIndex((u) => u.id === user.id);
    if (index !== -1) {
      users[index] = updatedUser;
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    }
  };
  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
    isAdmin: user?.rol === 'admin'
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}



*/