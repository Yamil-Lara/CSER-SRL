import React from 'react';
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { Code2, X } from "lucide-react";
export function Footer() {
  const GithubIcon = FaGithub as any;
  const LinkedinIcon = FaLinkedin as any;
  return (
    <footer className="bg-card border-t border-muted pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-primary/10 p-1.5 rounded-lg text-primary">
                <Code2 className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-sidebar">DevFolio</span>
            </div>
            <p className="text-sm text-sidebar/70 mb-6 leading-relaxed">
              El sistema generador de portafolios digitales diseñado
              específicamente para profesionales del software.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-sidebar/50 hover:text-primary transition-colors">
                
                <X className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-sidebar/50 hover:text-primary transition-colors">
                
                // @ts-ignore
                <GithubIcon className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-sidebar/50 hover:text-primary transition-colors">
                
                // @ts-ignore
                <LinkedinIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-sidebar mb-4">Producto</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-sm text-sidebar/70 hover:text-primary transition-colors">
                  
                  Características
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-sidebar/70 hover:text-primary transition-colors">
                  
                  Explorar Portafolios
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-sidebar/70 hover:text-primary transition-colors">
                  
                  Precios
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-sidebar/70 hover:text-primary transition-colors">
                  
                  Actualizaciones
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sidebar mb-4">Recursos</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-sm text-sidebar/70 hover:text-primary transition-colors">
                  
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-sidebar/70 hover:text-primary transition-colors">
                  
                  Guías de Carrera
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-sidebar/70 hover:text-primary transition-colors">
                  
                  Centro de Ayuda
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-sidebar/70 hover:text-primary transition-colors">
                  
                  API
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sidebar mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-sm text-sidebar/70 hover:text-primary transition-colors">
                  
                  Términos de Servicio
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-sidebar/70 hover:text-primary transition-colors">
                  
                  Política de Privacidad
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-sidebar/70 hover:text-primary transition-colors">
                  
                  Cookies
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-muted flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-sidebar/60">
            © {new Date().getFullYear()} DevFolio. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>);

}