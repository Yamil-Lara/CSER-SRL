import React, { useEffect, useState } from 'react';
import { Eye, EyeOff, Save, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
interface VisibilitySettings {
  proyectos_visible: boolean;
  habilidades_visible: boolean;
  experiencia_visible: boolean;
  redes_visible: boolean;
}
export function VisibilitySettingsPage() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<VisibilitySettings>({
    proyectos_visible: true,
    habilidades_visible: true,
    experiencia_visible: true,
    redes_visible: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  useEffect(() => {
    // Load saved settings from localStorage
    const saved = localStorage.getItem(`visibility_${user?.id}`);
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, [user]);
  const handleToggle = (key: keyof VisibilitySettings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  const handleSave = async () => {
    setIsLoading(true);
    setSuccessMessage('');
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      // Save to localStorage (in real app, would be API call)
      localStorage.setItem(`visibility_${user?.id}`, JSON.stringify(settings));
      setSuccessMessage('Configuración guardada correctamente');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const sections = [
  {
    key: 'proyectos_visible' as keyof VisibilitySettings,
    title: 'Proyectos',
    description:
    'Muestra u oculta la sección de proyectos en tu portafolio público',
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
  }];

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
          disabled={isLoading}
          className="gap-2"
        >
          {isLoading ? (
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

        {successMessage &&
        <Alert type="success" message={successMessage} className="mb-6" />
        }

        <Card className="shadow-sm mb-6">
          <div className="space-y-6">
            {sections.map((section) => {
              const isVisible = settings[section.key];
              const Icon = isVisible ? Eye : EyeOff;
              return (
                <div
                  key={section.key}
                  className="flex items-start justify-between p-4 bg-background rounded-lg border border-muted">
                  
                  <div className="flex items-start gap-4 flex-1">
                    <div
                      className={`p-3 rounded-lg ${isVisible ? 'bg-primary/10' : 'bg-muted'}`}>
                      
                      <Icon
                        className={`w-6 h-6 ${isVisible ? 'text-primary' : 'text-sidebar/40'}`} />
                      
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

                  {/* Toggle Switch */}
                  <button
                    onClick={() => handleToggle(section.key)}
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${isVisible ? 'bg-primary' : 'bg-muted'}`}>
                    
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${isVisible ? 'translate-x-6' : 'translate-x-1'}`} />
                    
                  </button>
                </div>);

            })}
          </div>
        </Card>

      </div>
    </div>
  );

}