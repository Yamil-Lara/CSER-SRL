import { useState, useEffect } from 'react';
import {
  Experiencia,
  STORAGE_KEYS,
  getStorageData,
  setStorageData } from
'../utils/mockData';
import { useAuth } from '../context/AuthContext';

export function useExperience() {
  const { user } = useAuth();
  const [experiences, setExperiences] = useState<Experiencia[]>([]);

  useEffect(() => {
    loadExperiences();
  }, [user]);

  const loadExperiences = () => {
    const allExperiences = getStorageData<Experiencia>(
      STORAGE_KEYS.EXPERIENCIAS
    );
    const userExperiences = user ?
    allExperiences.filter((e) => e.usuario_id === user.id) :
    [];
    // Sort by date descending
    userExperiences.sort((a, b) => {
      const dateA = a.actual ?
      new Date() :
      new Date(a.fecha_fin || a.fecha_inicio);
      const dateB = b.actual ?
      new Date() :
      new Date(b.fecha_fin || b.fecha_inicio);
      return dateB.getTime() - dateA.getTime();
    });
    setExperiences(userExperiences);
  };

  const createExperience = (
  expData: Omit<Experiencia, 'id' | 'usuario_id'>) =>
  {
    if (!user) return;

    const allExperiences = getStorageData<Experiencia>(
      STORAGE_KEYS.EXPERIENCIAS
    );
    const newExperience: Experiencia = {
      ...expData,
      id: allExperiences.length + 1,
      usuario_id: user.id
    };

    allExperiences.push(newExperience);
    setStorageData(STORAGE_KEYS.EXPERIENCIAS, allExperiences);
    loadExperiences();
    return newExperience;
  };

  const updateExperience = (id: number, expData: Partial<Experiencia>) => {
    const allExperiences = getStorageData<Experiencia>(
      STORAGE_KEYS.EXPERIENCIAS
    );
    const index = allExperiences.findIndex((e) => e.id === id);

    if (index !== -1) {
      allExperiences[index] = { ...allExperiences[index], ...expData };
      setStorageData(STORAGE_KEYS.EXPERIENCIAS, allExperiences);
      loadExperiences();
    }
  };

  const deleteExperience = (id: number) => {
    const allExperiences = getStorageData<Experiencia>(
      STORAGE_KEYS.EXPERIENCIAS
    );
    const filtered = allExperiences.filter((e) => e.id !== id);
    setStorageData(STORAGE_KEYS.EXPERIENCIAS, filtered);
    loadExperiences();
  };

  return {
    experiences,
    createExperience,
    updateExperience,
    deleteExperience,
    refreshExperiences: loadExperiences
  };
}