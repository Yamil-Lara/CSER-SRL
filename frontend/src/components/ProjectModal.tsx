import { useState, FormEvent } from 'react';
import { X } from 'lucide-react';
import { Project } from '../pages/ProjectsPage';

interface ProjectModalProps {
  onClose: () => void;
  onSave: (project: Project) => void;
}

export default function ProjectModal({ onClose, onSave }: ProjectModalProps) {
  // Estado inicial simulando la captura de pantalla
  const [formData, setFormData] = useState({
    title: 'Proyecto-1',
    description: 'Ejemplo del Primer Proyecto - 1',
    category: 'Desarrollo Web',
    date: '2026-04-09',
    technologies: 'React, Node.js',
    tools: 'VS Code, Git',
    client: 'Yamil Angelo Lara B.',
    githubUrl: 'https://github.com/yamil-lara',
    demoUrl: 'https://github.com/yamil-lara'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newProject: Project = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      category: formData.category,
      date: formData.date,
      technologies: formData.technologies.split(',').map(t => t.trim()).filter(Boolean),
      tools: formData.tools,
      client: formData.client,
      githubUrl: formData.githubUrl,
      demoUrl: formData.demoUrl,
      status: 'aprobado' // Estado por defecto según el diseño
    };
    onSave(newProject);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Nuevo Proyecto</h2>
          <button className="close-btn" onClick={onClose}><X size={24} /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Título del Proyecto <span>*</span></label>
              <input 
                type="text" name="title" className="form-input" 
                value={formData.title} onChange={handleChange} required 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Descripción <span>*</span></label>
              <textarea 
                name="description" className="form-textarea" 
                value={formData.description} onChange={handleChange} required 
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Categoría <span>*</span></label>
                <select 
                  name="category" className="form-select" 
                  value={formData.category} onChange={handleChange} required
                >
                  <option value="Desarrollo Web">Desarrollo Web</option>
                  <option value="Desarrollo Móvil">Desarrollo Móvil</option>
                  <option value="Diseño UI/UX">Diseño UI/UX</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Fecha de Realización <span>*</span></label>
                <input 
                  type="date" name="date" className="form-input" 
                  value={formData.date} onChange={handleChange} required 
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Tecnologías</label>
              <input 
                type="text" name="technologies" className="form-input" 
                value={formData.technologies} onChange={handleChange} 
              />
              <span className="form-hint">Separa las tecnologías con comas</span>
            </div>

            <div className="form-group">
              <label className="form-label">Herramientas</label>
              <input 
                type="text" name="tools" className="form-input" 
                value={formData.tools} onChange={handleChange} 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Cliente</label>
              <input 
                type="text" name="client" className="form-input" 
                value={formData.client} onChange={handleChange} 
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">URL de GitHub</label>
                <input 
                  type="url" name="githubUrl" className="form-input" 
                  value={formData.githubUrl} onChange={handleChange} 
                />
              </div>
              <div className="form-group">
                <label className="form-label">URL de Demo</label>
                <input 
                  type="url" name="demoUrl" className="form-input" 
                  value={formData.demoUrl} onChange={handleChange} 
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-outline" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-primary">Crear Proyecto</button>
          </div>
        </form>
      </div>
    </div>
  );
}