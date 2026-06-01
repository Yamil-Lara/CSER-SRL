import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Send, CheckCircle2 } from 'lucide-react';
import api from '../utils/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/forgot-password', { email });
      setSent(true);
    } catch (err: any) {
      const status = err.response?.status;
      if (status === 429) {
        setError('Demasiados intentos. Espera un minuto e inténtalo de nuevo.');
      } else if (status === 422) {
        setError('El correo electrónico no es válido.');
      } else {
        setError('No se pudo procesar la solicitud. Intenta más tarde.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-6 bg-card p-8 rounded-xl shadow-lg border border-muted">
          <div className="text-center">
            <div className="mx-auto h-14 w-14 bg-green-500/10 rounded-full flex items-center justify-center">
              <CheckCircle2 className="text-green-600" size={32} />
            </div>
            <h2 className="mt-6 text-2xl font-extrabold text-sidebar">Email enviado</h2>
            <p className="mt-3 text-sm text-sidebar/70">
              Si el correo <span className="font-semibold">{email}</span> está registrado,
              recibirás un enlace para restablecer tu contraseña.
            </p>
            <p className="mt-3 text-xs text-sidebar/60">
              Revisa tu bandeja de entrada y la carpeta de spam. El enlace expira en 60 minutos.
            </p>
          </div>

          <div className="pt-4 border-t border-muted">
            <Link
              to="/login"
              className="flex items-center justify-center gap-2 text-sm text-primary hover:text-primary-hover"
            >
              <ArrowLeft size={16} />
              Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-card p-8 rounded-xl shadow-lg border border-muted">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Mail className="text-primary" size={24} />
          </div>
          <h2 className="mt-6 text-2xl font-extrabold text-sidebar">¿Olvidaste tu contraseña?</h2>
          <p className="mt-2 text-sm text-sidebar/60">
            Ingresa tu correo y te enviaremos un enlace para restablecerla.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

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

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Enviando...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Send size={18} />
                Enviar enlace de recuperación
              </span>
            )}
          </button>

          <div className="text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary-hover"
            >
              <ArrowLeft size={16} />
              Volver al inicio de sesión
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
