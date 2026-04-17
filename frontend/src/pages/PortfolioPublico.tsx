import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PublicPortfolio, { PortfolioData } from '../components/PublicPortfolio';

export default function PortfolioPublico() {
  const { username } = useParams();
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Aquí implementaremos a futuro:
    // axios.get(`/api/portafolio/${username}`)
    //   .then(res => setData(res.data))
    //   .catch(err => console.error(err))
    //   .finally(() => setLoading(false))

    // MOCK DATA (Para la HU-06 Demo)
    const mockData: PortfolioData = {
      name: username === 'kimuko' ? 'kumiko' : 'Ana García',
      profession: 'Desarrolladora Full Stack',
      technologies: username === 'kimuko' ? 'Backend PHP & React' : 'React & Node.js',
      bio: 'Apasionada por crear experiencias web increíbles',
      location: username === 'kimuko' ? 'Cochabamba, Bolivia' : 'La Paz, Bolivia',
      email: username === 'kimuko' ? 'kimuko78787222@gmail.com' : 'ana@example.com',
      socials: {
        linkedin: '#',
        github: '#',
      },
      skills: {
        technical: [
          { name: 'PHP', percentage: 80 }
        ],
        soft: [
          { name: 'Liderazgo', percentage: 90 }
        ]
      },
      experience: [
        {
          title: 'Desarrollador Full Stack',
          company: 'CodeHack',
          date: 'Mar 2024 — Presente',
          description: '– Lideré el desarrollo de la arquitectura de microservicios, mejorando la escalabilidad del sistema en un 30%.\n– Mentoricé a desarrolladores junior en buenas prácticas de código y pruebas unitarias.\n– Implementé pipelines de CI/CD utilizando Jenkins y Docker para optimizar los tiempos de despliegue.\n– Stack tecnológico: React, Node.js, AWS, Kubernetes.',
        },
        {
          title: 'Ingeniería Informática',
          company: 'Universidad Mayor de San Simón',
          date: 'Feb 2018 — oct 2022',
          description: 'Fui auxiliar de la Universidad',
          isAcademic: true
        }
      ]
    };

    // Simulamos carga para validar los layouts
    setTimeout(() => {
      setData(mockData);
      setLoading(false);
    }, 500);

  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-gray-500">Portafolio no encontrado.</p>
      </div>
    );
  }

  return <PublicPortfolio data={data} />;
}
