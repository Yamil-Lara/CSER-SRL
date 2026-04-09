import React, { useEffect, useState, createContext, useContext, ReactNode } from 'react';
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