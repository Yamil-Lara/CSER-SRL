import React, { useState, useMemo } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, KeyRound, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../utils/api';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';

  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Validación de fortaleza simple
  const passwordStrength = useMemo(() => {
    if (!password) return { level: 0, label: '', color: '' };
    let level = 0;
    if (password.length >= 8) level++;
    if (/[A-Z]/.test(password)) level++;
    if (/[0-9]/.test(password)) level++;
    if (/[^A-Za-z0-9]/.test(password)) level++;

    const map = [
      { label: 'Muy débil', color: 'bg-red-500' },
      { label: 'Débil', color: 'bg-orange-500' },
      { label: 'Aceptable', color: 'bg-yellow-500' },
      { label: 'Buena', color: 'bg-blue-500' },
      { label: 'Fuerte', color: 'bg-green-500' },
    ];
    return { level, ...map[level] };
  }, [password]);

  const passwordsMatch = password && passwordConfirmation && password === passwordConfirmation;

  if (!token || !email) {
    return (
      <div className="min-h-screen  flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full space-y-6 card p-8 rounded-xl shadow-lg border border-muted text-center">
          <div className="mx-auto h-14 w-14 bg-destructive/10 rounded-full flex items-center justify-center">
            <AlertCircle className="text-destructive" size={32} />
          </div>
          <h2 className="text-2xl font-bold ">Enlace inválido</h2>
          <p className="text-sm opacity-70">
            El enlace de recuperación no es válido o está incompleto.
          </p>
          <Link
            to="/forgot-password"
            className="inline-block text-sm text-primary hover:text-primary-hover"
          >
            Solicitar un nuevo enlace
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    if (password !== passwordConfirmation) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);

    try {
      await api.post('/reset-password', {
        email,
        token,
        password,
        password_confirmation: passwordConfirmation,
      });
      setSuccess(true);
      setTimeout(() => navigate('/login', { state: { message: 'Contraseña restablecida exitosamente. Inicia sesión.' } }), 2500);
    } catch (err: any) {
      const status = err.response?.status;
      const msg = err.response?.data?.message;
      if (status === 429) {
        setError('Demasiados intentos. Espera un minuto e inténtalo de nuevo.');
      } else if (msg) {
        setError(msg);
      } else {
        setError('No se pudo restablecer la contraseña. Intenta más tarde.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen  flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full space-y-6 card p-8 rounded-xl shadow-lg border border-muted text-center">
          <div className="mx-auto h-14 w-14 bg-green-500/10 rounded-full flex items-center justify-center">
            <CheckCircle2 className="text-green-600" size={32} />
          </div>
          <h2 className="text-2xl font-bold ">¡Contraseña actualizada!</h2>
          <p className="text-sm opacity-70">
            Serás redirigido al inicio de sesión en unos segundos...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8 card p-8 rounded-xl shadow-lg border border-muted">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
            <KeyRound className="text-primary" size={24} />
          </div>
          <h2 className="mt-6 text-2xl font-extrabold ">Restablecer contraseña</h2>
          <p className="mt-2 text-sm opacity-60">
            Crea una nueva contraseña segura para tu cuenta.
          </p>
          <p className="mt-1 text-xs opacity-50">
            Cuenta: <span className="font-medium">{email}</span>
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="password" className="block text-sm font-medium  mb-1">
              Nueva contraseña *
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-muted card  rounded-lg focus:outline-none focus:ring-primary focus:border-primary sm:text-sm pr-10"
                placeholder="Mínimo 8 caracteres"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center opacity-50 hover:"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Indicador de fortaleza */}
            {password && (
              <div className="mt-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded ${
                        i <= passwordStrength.level ? passwordStrength.color : 'bg-muted'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs opacity-60 mt-1">
                  Fortaleza: <span className="font-medium">{passwordStrength.label}</span>
                </p>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="password_confirmation" className="block text-sm font-medium  mb-1">
              Confirmar contraseña *
            </label>
            <input
              id="password_confirmation"
              type={showPassword ? 'text' : 'password'}
              required
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border border-muted card  rounded-lg focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="Repite la contraseña"
            />
            {passwordConfirmation && (
              <p className={`text-xs mt-1 ${passwordsMatch ? 'text-green-600' : 'text-destructive'}`}>
                {passwordsMatch ? '✓ Las contraseñas coinciden' : '✗ Las contraseñas no coinciden'}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !passwordsMatch || password.length < 8}
            className="w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Actualizando...
              </span>
            ) : (
              'Restablecer contraseña'
            )}
          </button>

          <div className="text-center">
            <Link to="/login" className="text-sm text-primary hover:text-primary-hover">
              Volver al inicio de sesión
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}


