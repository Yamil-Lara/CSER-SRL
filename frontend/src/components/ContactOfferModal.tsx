import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

interface ContactOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  fullName: string;
}

export default function ContactOfferModal({ isOpen, onClose, username, fullName }: ContactOfferModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    empresa: '',
    email_contacto: '',
    ciudad: '',
    pais: '',
    titulo_puesto: '',
    modalidad: '',
    tipo_contrato: '',
    salario: '',
    tecnologias: '',
    mensaje: ''
  });
  const [isCustomSalary, setIsCustomSalary] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post(`/portafolio/${username}/oferta`, formData);
      toast.success('Oferta enviada con éxito');
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al enviar la oferta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-start pt-10 pb-10 px-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl relative my-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold">Contactar a {fullName}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="bg-blue-50 text-blue-700 p-4 rounded-lg mb-6 text-sm border border-blue-100">
            Al enviar esta oferta, {fullName} podrá ver tu propuesta y el nivel de compatibilidad con su perfil.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo <span className="text-red-500">*</span></label>
              <input required type="text" name="nombre" value={formData.nombre} onChange={handleChange} pattern="^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$" title="Solo letras y espacios" maxLength={255} className="w-full rounded-lg border-gray-300 border p-2 focus:ring-primary focus:border-primary" placeholder="Ej. Laura Méndez" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Empresa <span className="text-red-500">*</span></label>
              <input required type="text" name="empresa" value={formData.empresa} onChange={handleChange} pattern="^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s\.\-&]+$" title="Solo letras, números, espacios, puntos, guiones y &" maxLength={255} className="w-full rounded-lg border-gray-300 border p-2 focus:ring-primary focus:border-primary" placeholder="Ej. TechCorp Solutions" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email de contacto <span className="text-red-500">*</span></label>
              <input required type="email" name="email_contacto" value={formData.email_contacto} onChange={handleChange} maxLength={255} className="w-full rounded-lg border-gray-300 border p-2 focus:ring-primary focus:border-primary" placeholder="tu@empresa.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad <span className="text-red-500">*</span></label>
              <input required type="text" name="ciudad" value={formData.ciudad} onChange={handleChange} className="w-full rounded-lg border-gray-300 border p-2 focus:ring-primary focus:border-primary" placeholder="Ej. Santa Cruz" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">País <span className="text-red-500">*</span></label>
              <input required type="text" name="pais" value={formData.pais} onChange={handleChange} className="w-full rounded-lg border-gray-300 border p-2 focus:ring-primary focus:border-primary" placeholder="Ej. Bolivia" />
            </div>
          </div>

          <h3 className="font-bold text-gray-800 mb-4">Detalles de la Oferta</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título del Puesto <span className="text-red-500">*</span></label>
              <input required type="text" name="titulo_puesto" value={formData.titulo_puesto} onChange={handleChange} className="w-full rounded-lg border-gray-300 border p-2 focus:ring-primary focus:border-primary" placeholder="Ej. Frontend Developer" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Modalidad <span className="text-red-500">*</span></label>
              <select required name="modalidad" value={formData.modalidad} onChange={handleChange} className="w-full rounded-lg border-gray-300 border p-2 focus:ring-primary focus:border-primary">
                <option value="" disabled>Seleccione una opción</option>
                <option value="Remoto">Remoto</option>
                <option value="Presencial">Presencial</option>
                <option value="Híbrido">Híbrido</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Contrato <span className="text-red-500">*</span></label>
              <select required name="tipo_contrato" value={formData.tipo_contrato} onChange={handleChange} className="w-full rounded-lg border-gray-300 border p-2 focus:ring-primary focus:border-primary">
                <option value="" disabled>Seleccione una opción</option>
                <option value="Tiempo Completo">Tiempo Completo</option>
                <option value="Medio Tiempo">Medio Tiempo</option>
                <option value="Freelance">Freelance</option>
                <option value="Por Proyecto">Por Proyecto</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Tecnologías Buscadas (separadas por coma) <span className="text-red-500">*</span></label>
            <input required type="text" name="tecnologias" value={formData.tecnologias} onChange={handleChange} pattern="^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s\.\,\-\+\#\(\)]+$" title="Solo caracteres válidos para tecnologías (letras, números, espacios, comas, puntos, paréntesis y símbolos como +, -, #)" className="w-full rounded-lg border-gray-300 border p-2 focus:ring-primary focus:border-primary" placeholder="Ej. React, Node.js, TypeScript" />
            <p className="text-xs text-gray-500 mt-1">Usaremos esto para calcular el % de compatibilidad con el perfil.</p>
          </div>

          <div className="mb-4">
             <label className="block text-sm font-medium text-gray-700 mb-1">Salario Ofrecido (USD) <span className="text-gray-500 text-xs font-normal">(Opcional)</span></label>
             {!isCustomSalary ? (
               <div className="flex gap-2">
                 <select 
                   name="salario" 
                   value={formData.salario} 
                   onChange={(e) => {
                     if (e.target.value === 'custom') {
                       setIsCustomSalary(true);
                       setFormData({ ...formData, salario: '' });
                     } else {
                       handleChange(e);
                     }
                   }} 
                   className="w-full rounded-lg border-gray-300 border p-2 focus:ring-primary focus:border-primary"
                 >
                   <option value="">No especificar / A convenir</option>
                   <option value="500 - 1000">500 USD - 1,000 USD</option>
                   <option value="1000 - 2000">1,000 USD - 2,000 USD</option>
                   <option value="2000 - 4000">2,000 USD - 4,000 USD</option>
                   <option value="4000 - 6000">4,000 USD - 6,000 USD</option>
                   <option value="6000+">Más de 6,000 USD</option>
                   <option value="custom">Monto Personalizado...</option>
                 </select>
               </div>
             ) : (
               <div className="flex gap-2 items-center">
                 <input 
                   type="number" 
                   step="1" 
                   min="0" 
                   max="100000" 
                   name="salario" 
                   value={formData.salario} 
                   onChange={(e) => {
                     if (e.target.value.length > 6) {
                       e.target.value = e.target.value.slice(0, 6);
                     }
                     handleChange(e);
                   }} 
                   className="w-full rounded-lg border-gray-300 border p-2 focus:ring-primary focus:border-primary" 
                   placeholder="Monto en USD (Máx. 100,000)" 
                 />
                 <button 
                   type="button" 
                   onClick={() => {
                     setIsCustomSalary(false);
                     setFormData({ ...formData, salario: '' });
                   }}
                   className="text-sm text-primary hover:underline whitespace-nowrap"
                 >
                   Volver a opciones
                 </button>
               </div>
             )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje / Descripción de la Oferta <span className="text-red-500">*</span></label>
            <textarea required rows={4} name="mensaje" value={formData.mensaje} onChange={handleChange} className="w-full rounded-lg border-gray-300 border p-2 focus:ring-primary focus:border-primary" placeholder="Describe brevemente la oportunidad y por qué te interesó el perfil..." />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2">
              {loading ? (
                 <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send size={18} />
                  Enviar Oferta
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
