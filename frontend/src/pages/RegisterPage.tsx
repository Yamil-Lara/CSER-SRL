import React, { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Loader2, Camera, MapPin, Briefcase, ArrowLeft, ArrowRight, UserPlus, Check } from 'lucide-react'
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'

export function RegisterPage() {
  const navigate = useNavigate()
  const { register, isAuthenticated, isAdmin, loading: authLoading } = useAuth()

  // Si el usuario ya está autenticado, redirigir al dashboard
  React.useEffect(() => {
    if (!authLoading && isAuthenticated) {
      if (isAdmin) {
        navigate('/gestion/dashboard', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [authLoading, isAuthenticated, isAdmin, navigate]);

  const [step, setStep] = useState<1 | 2>(1)

  // Paso 1
  const [step1, setStep1] = useState({ nombre: '', email: '', password: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors1, setErrors1] = useState<Record<string, string>>({})

  // Paso 2
  const [step2, setStep2] = useState({ profesion: '', ubicacion: '', telefono: '' })
  const [foto, setFoto] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [errors2, setErrors2] = useState<Record<string, string>>({})
  const fileRef = useRef<HTMLInputElement>(null)

  const [isLoading, setIsLoading] = useState(false)
  const [generalError, setGeneralError] = useState('')

  // ── Validación paso 1 ──────────────────────────────────────────────
  const validateStep1 = () => {
    const e: Record<string, string> = {}
    if (!step1.nombre.trim()) e.nombre = 'El nombre completo es obligatorio'
    if (!step1.email.trim()) e.email = 'El correo electrónico es obligatorio'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(step1.email)) e.email = 'Ingresa un correo válido'
    if (!step1.password) e.password = 'La contraseña es obligatoria'
    else if (step1.password.length < 8) e.password = 'Mínimo 8 caracteres'
    else if (!/[a-z]/.test(step1.password)) e.password = 'Debe contener al menos una minúscula'
    else if (!/[A-Z]/.test(step1.password)) e.password = 'Debe contener al menos una mayúscula'
    else if (!/[0-9]/.test(step1.password)) e.password = 'Debe contener al menos un número'
    else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(step1.password))
      e.password = 'Debe contener al menos un símbolo'
    if (!step1.confirmPassword) e.confirmPassword = 'Confirma tu contraseña'
    else if (step1.password !== step1.confirmPassword) e.confirmPassword = 'Las contraseñas no coinciden'
    setErrors1(e)
    return Object.keys(e).length === 0
  }

  // ── Validación paso 2 ──────────────────────────────────────────────
  const validateStep2 = () => {
    const e: Record<string, string> = {}
    if (step2.profesion && /[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g.test(step2.profesion)) {
      e.profesion = 'La profesión solo debe contener letras y espacios.'
    }
    if (step2.telefono && !isValidPhoneNumber(step2.telefono)) {
      e.telefono = 'El número de teléfono no es válido para el código de país seleccionado'
    }
    setErrors2(prev => ({ ...prev, ...e }))
    return Object.keys(e).length === 0
  }

  // ── Foto ──────────────────────────────────────────────────────────
  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    if (!file) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setErrors2(prev => ({ ...prev, foto: 'Solo JPG, PNG o WEBP' }))
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrors2(prev => ({ ...prev, foto: 'Máximo 10 MB' }))
      return
    }
    setErrors2(prev => { const n = { ...prev }; delete n.foto; return n })
    setFoto(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  // ── Navegar al paso 2 ─────────────────────────────────────────────
  const goToStep2 = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep1()) return
    setStep(2)
  }

  // ── Enviar formulario completo ────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep2()) return
    setGeneralError('')
    setIsLoading(true)
    try {
      const result = await register(
        step1.nombre, step1.email, step1.password, step1.confirmPassword,
        { profesion: step2.profesion, ubicacion: step2.ubicacion, telefono: step2.telefono, foto }
      )
      if (result.success) {
        navigate('/login', { state: { message: result.message } })
      } else {
        setGeneralError(result.message)
      }
    } catch {
      setGeneralError('Ocurrió un error. Intenta nuevamente.')
    } finally {
      setIsLoading(false)
    }
  }

  // ── Indicador de pasos ────────────────────────────────────────────
  const StepIndicator = () => (
    <div className="flex items-center justify-center gap-0 mb-8">
      {/* Paso 1 */}
      <div className="flex flex-col items-center gap-1">
        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all
          ${step === 1
            ? 'bg-primary border-primary text-white'
            : 'bg-primary/10 border-primary text-primary'}`}>
          {step > 1 ? <Check className="w-4 h-4" /> : '1'}
        </div>
        <span className={`text-xs font-medium ${step === 1 ? 'text-primary' : 'text-sidebar/50'}`}>
          Cuenta
        </span>
      </div>

      {/* Línea conectora */}
      <div className={`w-16 h-0.5 mb-4 mx-1 transition-all ${step > 1 ? 'bg-primary' : 'bg-muted'}`} />

      {/* Paso 2 */}
      <div className="flex flex-col items-center gap-1">
        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all
          ${step === 2
            ? 'bg-primary border-primary text-white'
            : 'bg-card border-muted text-sidebar/40'}`}>
          2
        </div>
        <span className={`text-xs font-medium ${step === 2 ? 'text-primary' : 'text-sidebar/40'}`}>
          Perfil
        </span>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen  flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary-hover transition-colors"
          >
            <ArrowLeft size={16} />
            Volver atrás
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
            <UserPlus className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-sidebar mb-2">Crear Cuenta</h1>
          <p className="text-sidebar/70 text-sm">
            {step === 1
              ? 'Ingresa tus datos de acceso'
              : 'Completa tu perfil para que los administradores puedan verificarte'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-card rounded-2xl shadow-soft p-8 border border-muted">
          <StepIndicator />
          {generalError && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive">{generalError}</p>
            </div>
          )}

          {/* ══════════════ PASO 1 ══════════════ */}
          {step === 1 && (
            <form onSubmit={goToStep2} className="space-y-5">
              <Input
                label="Nombre Completo"
                name="nombre"
                type="text"
                placeholder="Ej: Ana García"
                value={step1.nombre}
                onChange={e => {
                  setStep1(p => ({ ...p, nombre: e.target.value }))
                  if (errors1.nombre) setErrors1(p => ({ ...p, nombre: '' }))
                }}
                error={errors1.nombre}
                required
                disabled={isLoading}
              />


              <Input
                label="Correo Electrónico"
                name="email"
                type="email"
                placeholder="tu@email.com"
                value={step1.email}
                onChange={e => {
                  setStep1(p => ({ ...p, email: e.target.value }))
                  if (errors1.email) setErrors1(p => ({ ...p, email: '' }))
                }}
                error={errors1.email}
                required
                disabled={isLoading}
              />


              <div className="relative">
                <Input
                  label="Contraseña"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mín. 8 car., mayúscula, número y símbolo"
                  value={step1.password}
                  onChange={e => {
                    setStep1(p => ({ ...p, password: e.target.value }))
                    if (errors1.password) setErrors1(p => ({ ...p, password: '' }))
                  }}
                  error={errors1.password}
                  required
                  disabled={isLoading}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[38px] text-sidebar/50 hover:text-sidebar transition-colors" tabIndex={-1}>
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <div className="relative">
                <Input
                  label="Confirmar Contraseña"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Repite tu contraseña"
                  value={step1.confirmPassword}
                  onChange={e => {
                    setStep1(p => ({ ...p, confirmPassword: e.target.value }))
                    if (errors1.confirmPassword) setErrors1(p => ({ ...p, confirmPassword: '' }))
                  }}
                  error={errors1.confirmPassword}
                  required
                  disabled={isLoading}
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-[38px] text-sidebar/50 hover:text-sidebar transition-colors" tabIndex={-1}>
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <Button type="submit" variant="primary" size="lg" fullWidth className="mt-6 gap-2">
                Siguiente <ArrowRight className="w-4 h-4" />
              </Button>
            </form>
          )}

          {/* ══════════════ PASO 2 ══════════════ */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Foto de perfil */}
              <div className="flex flex-col items-center gap-3">
                <label className="block text-sm font-medium text-sidebar self-start">
                  Foto de perfil <span className="text-sidebar/40 font-normal">(opcional)</span>
                </label>
                <div
                  onClick={() => fileRef.current?.click()}
                  className="relative w-24 h-24 rounded-full border-2 border-dashed border-muted hover:border-primary cursor-pointer transition-colors overflow-hidden bg-muted/30 flex items-center justify-center group"
                >
                  {previewUrl ? (
                    <img src={previewUrl} alt="preview" className="w-full h-full object-cover" />
                  ) : (
                    <Camera className="w-8 h-8 text-sidebar/30 group-hover:text-primary transition-colors" />
                  )}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </div>
                <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFotoChange} />
                {errors2.foto && <p className="text-sm text-destructive">{errors2.foto}</p>}
                <p className="text-xs text-sidebar/40">JPG, PNG o WEBP · máx. 10 MB</p>
              </div>

              {/* Profesión */}
              <div className="relative">
                <Input
                  label="Profesión"
                  name="profesion"
                  type="text"
                  placeholder="Ej: Desarrollador de Software"
                  value={step2.profesion}
                  onChange={e => {
                    setStep2(p => ({ ...p, profesion: e.target.value }))
                    if (errors2.profesion) setErrors2(p => ({ ...p, profesion: '' }))
                  }}
                  error={errors2.profesion}
                  disabled={isLoading}
                />
                <Briefcase className="absolute right-3 top-[38px] w-4 h-4 text-sidebar/30 pointer-events-none" />
              </div>

              {/* Ubicación */}
              <div className="relative">
                <Input
                  label="Ubicación"
                  name="ubicacion"
                  type="text"
                  placeholder="Ej: Cochabamba, Bolivia"
                  value={step2.ubicacion}
                  onChange={e => setStep2(p => ({ ...p, ubicacion: e.target.value }))}
                  disabled={isLoading}
                />
                <MapPin className="absolute right-3 top-[38px] w-4 h-4 text-sidebar/30 pointer-events-none" />
              </div>

              {/* Teléfono */}
              <div className="w-full">
                <label className="block text-sm font-medium text-sidebar mb-1.5">
                  Teléfono / Celular <span className="text-sidebar/40 font-normal">(opcional)</span>
                </label>
                <PhoneInput
                  international
                  defaultCountry="BO"
                  value={step2.telefono}
                  onChange={value => {
                    setStep2(p => ({ ...p, telefono: value || '' }))
                    if (errors2.telefono) setErrors2(p => ({ ...p, telefono: '' }))
                  }}
                  disabled={isLoading}
                  placeholder="Ej: 70000000"
                  className={`w-full px-4 py-2.5 bg-card border rounded-lg text-sidebar placeholder:text-sidebar/40
                    focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent
                    transition-all ${errors2.telefono ? 'border-destructive focus-within:ring-destructive' : 'border-muted'}`}
                />
                <style dangerouslySetInnerHTML={{__html: `
                  .PhoneInputInput { border: none !important; outline: none !important; background: transparent !important; flex: 1; }
                  .PhoneInput { display: flex; align-items: center; }
                `}} />
                {errors2.telefono && (
                  <p className="mt-1 text-sm text-destructive">{errors2.telefono}</p>
                )}
              </div>

              <p className="text-xs text-sidebar/50 text-center">
                Estos datos ayudan al administrador a verificar que eres una persona real.
              </p>

              <div className="flex gap-3 mt-6">
                <Button
                  type="button"
                  variant="ghost"
                  size="lg"
                  className="flex-1 gap-2"
                  onClick={() => setStep(1)}
                  disabled={isLoading}
                >
                  <ArrowLeft className="w-4 h-4" /> Volver
                </Button>
                <Button type="submit" variant="primary" size="lg" className="flex-1" disabled={isLoading}>
                  {isLoading ? (
                    <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Creando...</>
                  ) : (
                    'Crear Cuenta'
                  )}
                </Button>
              </div>
            </form>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm opacity-70">
              ¿Ya tienes una cuenta?{' '}
              <Link to="/login" className="text-primary font-medium hover:underline">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}


