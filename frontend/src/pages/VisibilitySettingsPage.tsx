import React, { useEffect, useState } from 'react';
import { Eye, EyeOff, Save, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import api from '../utils/api';

interface VisibilitySettings {
  proyectos_visible: boolean;
  habilidades_visible: boolean;
  experiencia_visible: boolean;
  redes_visible: boolean;
}

export function VisibilitySettingsPage() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<VisibilitySettings | null>(null); // ← CAMBIADO: empieza en null
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // ← NUEVO: para saber si está cargando
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Cargar desde el backend al montar la página
  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/visibilidad');
        const data = response.data.data;
        
        setSettings({
          proyectos_visible: data.mostrar_proyectos ?? true,
          habilidades_visible: data.mostrar_habilidades ?? true,
          experiencia_visible: data.mostrar_experiencia ?? true,
          redes_visible: data.mostrar_redes ?? true,
        });
      } catch (error: any) {
        console.error('Error cargando configuración:', error);
        if (error.response?.status !== 401) {
          setErrorMessage('Error al cargar la configuración');
        }
        // Si hay error, mostrar valores por defecto
        setSettings({
          proyectos_visible: true,
          habilidades_visible: true,
          experiencia_visible: true,
          redes_visible: true,
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSettings();
  }, []);

  const handleToggle = (key: keyof VisibilitySettings) => {
    if (!settings) return;
    setSettings((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [key]: !prev[key]
      };
    });
  };

  const handleSave = async () => {
    if (!settings) return;
    
    setIsSaving(true);
    setSuccessMessage('');
    setErrorMessage('');
    
    try {
      const payload = {
        mostrar_proyectos: settings.proyectos_visible,
        mostrar_habilidades: settings.habilidades_visible,
        mostrar_experiencia: settings.experiencia_visible,
        mostrar_redes: settings.redes_visible,
      };
      
      await api.put('/visibilidad', payload);
      setSuccessMessage('Configuración guardada correctamente');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setErrorMessage('Error al guardar la configuración');
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const sections = [
    {
      key: 'proyectos_visible' as keyof VisibilitySettings,
      title: 'Proyectos',
      description: 'Muestra u oculta la sección de proyectos en tu portafolio público',
      icon: Eye
    },
    {
      key: 'habilidades_visible' as keyof VisibilitySettings,
      title: 'Habilidades',
      description: 'Muestra u oculta tus habilidades técnicas y blandas',
      icon: Eye
    },
    {
      key: 'experiencia_visible' as keyof VisibilitySettings,
      title: 'Experiencia',
      description: 'Muestra u oculta tu experiencia laboral y académica',
      icon: Eye
    },
    {
      key: 'redes_visible' as keyof VisibilitySettings,
      title: 'Redes Sociales',
      description: 'Muestra u oculta los enlaces a tus redes sociales',
      icon: Eye
    }
  ];

  // Mostrar pantalla de carga mientras se obtienen los datos
  if (isLoading) {
    return (
      <div>
        <header className="page-header">
          <div>
            <h1 className="page-title">Control de Visibilidad</h1>
            <p className="page-subtitle">
              Controla qué secciones de tu portafolio son visibles para el público
            </p>
          </div>
        </header>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-2 text-sidebar/70">Cargando configuración...</span>
        </div>
      </div>
    );
  }

  // Si no hay settings (error), no renderizar
  if (!settings) {
    return null;
  }

  return (
    <div>
      <header className="page-header">
        <div>
          <h1 className="page-title">
            Control de Visibilidad
          </h1>
          <p className="page-subtitle">
            Controla qué secciones de tu portafolio son visibles para el público
          </p>
        </div>
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={isSaving}
          className="gap-2"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Guardar Configuración
            </>
          )}
        </Button>
      </header>

      <div>
        {successMessage && (
          <Alert type="success" message={successMessage} className="mb-6" />
        )}
        {errorMessage && (
          <Alert type="error" message={errorMessage} className="mb-6" />
        )}

        <Card className="shadow-sm mb-6">
          <div className="space-y-6">
            {sections.map((section) => {
              const isVisible = settings[section.key];
              const Icon = isVisible ? Eye : EyeOff;
              return (
                <div
                  key={section.key}
                  className="flex items-start justify-between p-4 bg-background rounded-lg border border-muted"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`p-3 rounded-lg ${isVisible ? 'bg-primary/10' : 'bg-muted'}`}>
                      <Icon className={`w-6 h-6 ${isVisible ? 'text-primary' : 'text-sidebar/40'}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-sidebar mb-1">
                        {section.title}
                      </h3>
                      <p className="text-sm text-sidebar/70">
                        {section.description}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggle(section.key)}
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${isVisible ? 'bg-primary' : 'bg-muted'}`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${isVisible ? 'translate-x-6' : 'translate-x-1'}`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}