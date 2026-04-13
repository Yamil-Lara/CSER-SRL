import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Code2, Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, isAdmin, logout, user } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };
  return (
    <header className="sticky top-0 z-50 w-full bg-card/80 backdrop-blur-md border-b border-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 cursor-pointer">
            <div className="bg-primary/10 p-2 rounded-lg text-primary">
              <Code2 className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-sidebar tracking-tight">
              DevFolio
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {!isAuthenticated &&
            <>
                <a
                href="#features"
                className="text-sm font-medium text-sidebar/80 hover:text-primary transition-colors">
                
                  Características
                </a>
                <Link
                to="/explorar"
                className="text-sm font-medium text-sidebar/80 hover:text-primary transition-colors">
                
                  Explorar
                </Link>
                <a
                href="#about"
                className="text-sm font-medium text-sidebar/80 hover:text-primary transition-colors">
                
                  Nosotros
                </a>
              </>
            }
            {isAuthenticated &&
            <>
                <Link
                to="/"
                className="text-sm font-medium text-sidebar/80 hover:text-primary transition-colors">
                
                  Inicio
                </Link>
                <Link
                to="/explorar"
                className="text-sm font-medium text-sidebar/80 hover:text-primary transition-colors">
                
                  Explorar
                </Link>
                {!isAdmin &&
              <Link
                to={`/portfolio/${user?.username}`}
                className="text-sm font-medium text-sidebar/80 hover:text-primary transition-colors">
                
                    Mi Portafolio
                  </Link>
              }
              </>
            }
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {!isAuthenticated ?
            <>
                <Link to="/login">
                  <Button variant="ghost">Iniciar Sesión</Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary">Regístrate Gratis</Button>
                </Link>
              </> :

            <>
                <Link to={isAdmin ? '/admin/dashboard' : '/dashboard'}>
                  <Button variant="ghost" className="gap-2">
                    <LayoutDashboard className="w-4 h-4" />
                    {isAdmin ? 'Panel Admin' : 'Mi Dashboard'}
                  </Button>
                </Link>
                <Button
                variant="ghost"
                onClick={handleLogout}
                className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10">
                
                  <LogOut className="w-4 h-4" />
                  Salir
                </Button>
              </>
            }
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-sidebar p-2 hover:bg-muted rounded-md transition-colors"
              aria-label="Toggle menu">
              
              {isMobileMenuOpen ?
              <X className="w-6 h-6" /> :

              <Menu className="w-6 h-6" />
              }
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen &&
      <div className="md:hidden bg-card border-b border-muted px-4 pt-2 pb-6 space-y-4 shadow-lg">
          <div className="flex flex-col space-y-3">
            {!isAuthenticated ?
          <>
                <a
              href="#features"
              className="text-base font-medium text-sidebar hover:text-primary px-2 py-1">
              
                  Características
                </a>
                <Link
              to="/explorar"
              className="text-base font-medium text-sidebar hover:text-primary px-2 py-1"
              onClick={() => setIsMobileMenuOpen(false)}>
              
                  Explorar
                </Link>
                <a
              href="#about"
              className="text-base font-medium text-sidebar hover:text-primary px-2 py-1">
              
                  Nosotros
                </a>
              </> :

          <>
                <Link
              to="/"
              className="text-base font-medium text-sidebar hover:text-primary px-2 py-1"
              onClick={() => setIsMobileMenuOpen(false)}>
              
                  Inicio
                </Link>
                <Link
              to="/explorar"
              className="text-base font-medium text-sidebar hover:text-primary px-2 py-1"
              onClick={() => setIsMobileMenuOpen(false)}>
              
                  Explorar
                </Link>
                {!isAdmin &&
            <Link
              to={`/portfolio/${user?.username}`}
              className="text-base font-medium text-sidebar hover:text-primary px-2 py-1"
              onClick={() => setIsMobileMenuOpen(false)}>
              
                    Mi Portafolio
                  </Link>
            }
              </>
          }
          </div>
          <div className="flex flex-col gap-3 pt-4 border-t border-muted">
            {!isAuthenticated ?
          <>
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" fullWidth>
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="primary" fullWidth>
                    Regístrate Gratis
                  </Button>
                </Link>
              </> :

          <>
                <Link
              to={isAdmin ? '/admin/dashboard' : '/dashboard'}
              onClick={() => setIsMobileMenuOpen(false)}>
              
                  <Button variant="outline" fullWidth className="gap-2">
                    <LayoutDashboard className="w-4 h-4" />
                    {isAdmin ? 'Panel Admin' : 'Mi Dashboard'}
                  </Button>
                </Link>
                <Button
              variant="ghost"
              fullWidth
              onClick={handleLogout}
              className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10">
              
                  <LogOut className="w-4 h-4" />
                  Salir
                </Button>
              </>
          }
          </div>
        </div>
      }
    </header>);

}