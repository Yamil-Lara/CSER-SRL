import React, { useState, useEffect } from 'react';
import { Briefcase, Building, Mail, MapPin, CheckCircle, XCircle, Search, Clock, ExternalLink } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

import { useUserDashboardStats } from '../hooks/useUserDashboardStats';

export function UserOffersPage() {
  const [ofertas, setOfertas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Todos');
  const [modalidadFilter, setModalidadFilter] = useState('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { stats: dashboardStats, refetch: refetchStats } = useUserDashboardStats();

  const fetchOfertas = async () => {
    try {
      setLoading(true);
      const res = await api.get('/user/ofertas', {
        params: { estado: filter, modalidad: modalidadFilter, search: searchQuery }
      });
      setOfertas(res.data.data || []);
    } catch (err) {
      toast.error('Error al cargar ofertas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOfertas();
  }, [filter, modalidadFilter, searchQuery]);

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      await api.put(`/user/ofertas/${id}/estado`, { estado: newStatus });
      toast.success('Estado actualizado');
      fetchOfertas();
      if (refetchStats) refetchStats();
    } catch (err) {
      toast.error('Error al actualizar');
    }
  };

  const handleReplyClick = async (oferta: any) => {
    if (oferta.estado !== 'en_conversacion') {
      await updateStatus(oferta.id, 'en_conversacion');
    }
  };

  const getMailtoLink = (oferta: any) => {
    const subject = encodeURIComponent(`Respuesta a oferta para: ${oferta.titulo_puesto}`);
    const body = encodeURIComponent(`Hola ${oferta.nombre},\n\nHe visto tu oferta de trabajo para la posición de ${oferta.titulo_puesto} en ${oferta.empresa} a través de mi portafolio.\n\n`);
    const email = (oferta.email_contacto || '').trim();
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`;
  };

  return (
    <div className="space-y-6">
      <header className="page-header flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="page-title">Solicitudes de Reclutadores</h1>
          <p className="page-subtitle">Gestiona las ofertas de trabajo y contactos de empresas</p>
        </div>
        <div className="flex bg-white dark:bg-card border border-muted rounded-xl p-2 shadow-sm shrink-0">
           <div className="flex flex-col items-center justify-center px-4 border-r border-muted">
             <span className="text-xl font-bold text-primary">{dashboardStats?.mensajes_reclutadores_nuevos || 0}</span>
             <span className="text-[10px] font-bold text-sidebar/50 uppercase tracking-wider">NUEVOS</span>
           </div>
           <div className="flex flex-col items-center justify-center px-4 border-r border-muted">
             <span className="text-xl font-bold text-emerald-500">{dashboardStats?.mensajes_reclutadores_aceptados || 0}</span>
             <span className="text-[10px] font-bold text-sidebar/50 uppercase tracking-wider">ACEPTADOS</span>
           </div>
           <div className="flex flex-col items-center justify-center px-4">
             <span className="text-xl font-bold text-sidebar">{dashboardStats?.mensajes_reclutadores_total || 0}</span>
             <span className="text-[10px] font-bold text-sidebar/50 uppercase tracking-wider">TOTAL</span>
           </div>
        </div>
      </header>

      <Card className="!p-5">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="relative w-full md:flex-1 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-sidebar/40 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar por empresa, puesto o reclutador..."
              className="w-full pl-9 pr-4 py-2 bg-muted/30 border border-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-3 w-full md:w-auto">
             <select 
               className="px-4 py-2 w-full md:w-auto bg-white border border-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sidebar cursor-pointer"
               value={filter}
               onChange={(e) => setFilter(e.target.value)}
             >
               <option value="Todos">Todos los estados</option>
               <option value="nuevo">Nuevos</option>
               <option value="visto">Vistos</option>
               <option value="aceptado">Aceptados</option>
               <option value="en_conversacion">En Conversación</option>
               <option value="rechazado">Rechazados</option>
             </select>
             
             <select 
               className="px-4 py-2 w-full md:w-auto bg-white border border-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sidebar cursor-pointer"
               value={modalidadFilter}
               onChange={(e) => setModalidadFilter(e.target.value)}
             >
               <option value="Todas">Todas las modalidades</option>
               <option value="Remoto">Remoto</option>
               <option value="Presencial">Presencial</option>
               <option value="Híbrido">Híbrido</option>
             </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : ofertas.filter(o => {
          if (filter === 'Todos') return o.estado !== 'rechazado';
          return o.estado === filter;
        }).length > 0 ? (
          <div className="space-y-4">
            {ofertas.filter(o => {
              if (filter === 'Todos') return o.estado !== 'rechazado';
              return o.estado === filter;
            }).map((oferta) => (
              <div key={oferta.id} className={`border ${oferta.estado === 'aceptado' ? 'border-emerald-200 bg-emerald-50/10' : oferta.estado === 'en_conversacion' ? 'border-blue-200 bg-blue-50/10' : 'border-muted bg-white'} rounded-xl p-5 hover:border-primary/40 transition-colors group relative overflow-hidden dark:bg-card`}>
                
                {/* Nuevo indicador */}
                {oferta.estado === 'nuevo' && (
                  <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none">
                     <div className="absolute top-3 -right-6 bg-primary text-white text-[10px] font-bold py-1 px-8 rotate-45 shadow-sm">
                       NUEVO
                     </div>
                  </div>
                )}

                <div className="flex flex-col xl:flex-row gap-6">
                  {/* Left Column: Info Básica */}
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xl shrink-0">
                         {oferta.empresa.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-sidebar group-hover:text-primary transition-colors">{oferta.titulo_puesto}</h3>
                        <p className="text-sm font-medium text-sidebar/70">{oferta.empresa} • {oferta.nombre}</p>
                        
                        <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 text-xs text-sidebar/60">
                          <span className="flex items-center gap-1.5"><MapPin size={14} /> {oferta.ciudad}, {oferta.pais}</span>
                          <span className="flex items-center gap-1.5"><Briefcase size={14} /> {oferta.modalidad}</span>
                          <span className="flex items-center gap-1.5"><Clock size={14} /> {oferta.tipo_contrato}</span>
                          {oferta.salario && <span className="flex items-center gap-1.5 font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">💰 {oferta.salario}</span>}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 text-sm text-sidebar/70 bg-muted/20 p-4 rounded-lg border border-muted/50 whitespace-pre-line">
                       {oferta.mensaje}
                    </div>
                  </div>

                  {/* Right Column: Match & Acciones */}
                  <div className="w-full xl:w-72 shrink-0 flex flex-col gap-4">
                    {/* Match Score */}
                    <div className="bg-sidebar/5 rounded-xl p-4 border border-muted/50">
                       <div className="flex justify-between items-end mb-2">
                         <span className="text-xs font-bold text-sidebar/50 uppercase tracking-wider">Compatibilidad</span>
                         <span className={`text-xl font-bold ${oferta.match_score >= 70 ? 'text-emerald-500' : oferta.match_score >= 40 ? 'text-amber-500' : 'text-rose-500'}`}>
                           {oferta.match_score}%
                         </span>
                       </div>
                       <div className="w-full bg-muted rounded-full h-1.5 mb-3">
                         <div
                           className={`h-1.5 rounded-full ${oferta.match_score >= 70 ? 'bg-emerald-500' : oferta.match_score >= 40 ? 'bg-amber-500' : 'bg-rose-500'}`}
                           style={{ width: `${oferta.match_score}%` }}
                         />
                       </div>
                       
                       {/* Tecnologías que hicieron match */}
                       <div className="text-[10px] text-sidebar/60 mb-1">Tecnologías encontradas en tu perfil:</div>
                       <div className="flex flex-wrap gap-1">
                          {oferta.matched_techs.length > 0 ? (
                            oferta.matched_techs.map((tech: string, i: number) => (
                              <span key={i} className="px-1.5 py-0.5 bg-primary/10 text-primary rounded text-[10px] capitalize">✓ {tech}</span>
                            ))
                          ) : (
                            <span className="text-[10px] italic text-sidebar/40">Ninguna de las requeridas ({oferta.tecnologias})</span>
                          )}
                       </div>
                    </div>

                    <div className="flex flex-col gap-2 mt-auto">
                       <a href={getMailtoLink(oferta)} target="_blank" rel="noopener noreferrer" onClick={() => handleReplyClick(oferta)} className="w-full block">
                         <Button variant={oferta.estado === 'en_conversacion' ? 'outline' : 'primary'} className={`w-full gap-2 shadow-sm cursor-pointer ${oferta.estado === 'en_conversacion' ? 'border-blue-200 text-blue-600 bg-blue-50 hover:bg-blue-100' : ''}`}>
                            <Mail size={16} /> {oferta.estado === 'en_conversacion' ? '✓ Ya Respondiste' : 'Responder vía Email'}
                         </Button>
                       </a>
                       
                       {oferta.estado !== 'en_conversacion' && oferta.estado !== 'rechazado' && (
                         <div className="grid grid-cols-2 gap-2 mt-2">
                            <Button 
                              variant="ghost" 
                              className={`w-full text-xs font-semibold ${oferta.estado === 'aceptado' ? 'bg-emerald-100 text-emerald-700' : 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'}`}
                              onClick={() => updateStatus(oferta.id, 'aceptado')}
                            >
                               {oferta.estado === 'aceptado' ? '✓ Guardado' : 'Aceptar'}
                            </Button>
                            <Button 
                              variant="ghost" 
                              className="w-full text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100"
                              onClick={() => updateStatus(oferta.id, 'rechazado')}
                            >
                               Rechazar
                            </Button>
                         </div>
                       )}
                       {oferta.estado === 'rechazado' && (
                          <div className="mt-2 text-center text-xs text-rose-500 font-medium">
                            Oferta rechazada.
                          </div>
                       )}
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-10 h-10 text-sidebar/30" />
            </div>
            <h3 className="text-xl font-semibold text-sidebar mb-1">
              No se encontraron ofertas
            </h3>
            <p className="text-sm text-sidebar/60 max-w-sm mx-auto">
              Intenta cambiar el filtro de estado o espera a que los reclutadores se contacten contigo.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
