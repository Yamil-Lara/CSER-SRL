import React, { useState } from 'react';
import { Download, X, FileText, Eye } from 'lucide-react';
import api from '../utils/api';

interface Template {
  id: string;
  name: string;
  description: string;
  preview: string;
}

const templates: Template[] = [
  {
    id: 'moderna',
    name: 'Moderna',
    description: 'Diseño profesional con barra de progreso para habilidades',
    preview: '/templates/moderna.png'
  },
  {
    id: 'clasica',
    name: 'Clásica',
    description: 'Formato tradicional, ideal para entornos corporativos',
    preview: '/templates/clasica.png'
  },
  {
    id: 'minimalista',
    name: 'Minimalista',
    description: 'Diseño limpio y simple, sin distracciones',
    preview: '/templates/minimalista.png'
  },
  {
    id: 'creativa',
    name: 'Creativa',
    description: 'Diseño artístico con sidebar de colores',
    preview: '/templates/creativa.png'
  }
];

interface CVTemplateSelectorProps {
  userData: any;
  onClose: () => void;
}

export default function CVTemplateSelector({ userData, onClose }: CVTemplateSelectorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('moderna');
  const [loading, setLoading] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null);
  const [previewHtml, setPreviewHtml] = useState<string>('');
  const [previewLoading, setPreviewLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const response = await api.post('/download-cv', 
        { template: selectedTemplate },
        { responseType: 'blob' }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `cv_${userData.name}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading CV:', error);
      alert('Error al descargar el CV. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = async (templateId: string) => {
    setPreviewTemplate(templateId);
    setPreviewLoading(true);
    try {
      const response = await api.post('/preview-cv', { template: templateId });
      setPreviewHtml(response.data);
    } catch (error) {
      console.error('Error loading preview:', error);
      alert('Error al cargar la previsualización.');
    } finally {
      setPreviewLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Descargar CV</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {/* Instructions */}
          <p className="text-gray-600 mb-6">
            Selecciona una plantilla y descarga tu CV en PDF. Puedes previsualizar cada diseño antes de descargar.
          </p>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {templates.map((template) => (
              <div
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
                className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                  selectedTemplate === template.id 
                    ? 'border-primary bg-primary/10' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="aspect-video bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                  <FileText size={48} className="text-gray-400" />
                </div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">{template.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePreview(template.id);
                    }}
                    className="p-2 text-gray-500 hover:text-primary transition"
                    title="Ver preview"
                  >
                    <Eye size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Selected Template Info */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Plantilla seleccionada:</span> {' '}
              {templates.find(t => t.id === selectedTemplate)?.name}
            </p>
          </div>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            disabled={loading}
            className="w-full bg-primary text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generando PDF...
              </>
            ) : (
              <>
                <Download size={20} />
                Descargar CV en PDF
              </>
            )}
          </button>
        </div>
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-xl font-bold">
                Preview: {templates.find(t => t.id === previewTemplate)?.name}
              </h3>
              <button 
                onClick={() => {
                  setPreviewTemplate(null);
                  setPreviewHtml('');
                }}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-auto bg-gray-100 p-4">
              {previewLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div 
                    className="bg-white rounded-lg shadow-lg"
                    style={{ 
                      width: '210mm',
                      height: '297mm',
                      overflow: 'hidden',
                      margin: '0 auto',
                      position: 'relative'
                    }}
                  >
                    <div 
                      style={{
                        height: '100%',
                        overflow: 'auto',
                        padding: '0'
                      }}
                    >
                      <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
                    </div>
                  </div>
                  <div className="text-center text-sm text-gray-500">
                    Vista previa a escala real (A4)
                  </div>
                </div>
              )}
            </div>
            <div className="p-4 border-t flex gap-3">
              <button
                onClick={() => {
                  setSelectedTemplate(previewTemplate);
                  setPreviewTemplate(null);
                  setPreviewHtml('');
                }}
                className="flex-1 bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/90 transition"
              >
                Seleccionar esta plantilla
              </button>
              <button
                onClick={() => {
                  setPreviewTemplate(null);
                  setPreviewHtml('');
                }}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
