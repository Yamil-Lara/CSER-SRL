import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, LogIn } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage] = useState(
    (location.state as any)?.message || ''
  );  
  // Para evitar actualizaciones en componente desmontado
  let isMounted = true;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(email, password);
      
      // Solo actualizar estado si el componente sigue montado
      if (!isMounted) return;
      
      if (result.success) {
        // Redirigir según el rol
        if (result.user?.rol === 'admin') {
          navigate('/gestion/dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError(result.message);
        setLoading(false);
      }
    } catch (err) {
      if (isMounted) {
        setError('Error al iniciar sesión. Intenta nuevamente.');
        setLoading(false);
      }
    }
  };

  // Limpiar el flag al desmontar
  React.useEffect(() => {
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-card p-8 rounded-xl shadow-lg border border-muted">
        {/* Logo */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="text-primary font-bold text-xl">&lt;/&gt;</span>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-sidebar">Iniciar Sesión</h2>
          <p className="mt-2 text-sm text-sidebar/60">
            Accede a tu portafolio profesional
          </p>
        </div>

        {/* Formulario */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {successMessage && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-600 px-4 py-3 rounded-lg text-sm">
              {successMessage}
            </div>
          )}

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-sidebar mb-1">
                Correo Electrónico *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-muted bg-card text-sidebar rounded-lg focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-sidebar mb-1">
                Contraseña *
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-2 border border-muted bg-card text-sidebar rounded-lg focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm pr-10"
                  placeholder="Tu contraseña"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sidebar/50 hover:text-sidebar"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || authLoading}
              className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Cargando...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn size={18} />
                  Iniciar Sesión
                </span>
              )}
            </button>
          </div>

          {/* Credenciales de prueba */}
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <p className="text-xs text-sidebar/60 text-center">
              <span className="font-semibold">Credenciales de prueba:</span><br />
              Admin: admin@cser.com / Admin@2026<br />
              Usuario: maria.garcia@cser.com / Usuario@2026
            </p>
          </div>

          <div className="text-center">
            <Link to="/register" className="text-sm text-primary hover:text-primary-hover">
              ¿No tienes una cuenta? Regístrate gratis
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}