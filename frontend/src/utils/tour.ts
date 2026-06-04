import { driver, DriveStep } from 'driver.js';
import 'driver.js/dist/driver.css';

// ─── Variable global para controlar la instancia del tour activo ──────────────
let activeTourInstance: ReturnType<typeof driver> | null = null;

// ─── Destruir tour activo (se usa cuando el usuario navega durante el tour) ──
export const destroyActiveTour = () => {
  if (activeTourInstance) {
    try {
      activeTourInstance.destroy();
    } catch (_) {
      // Ignorar errores si ya estaba destruido
    }
    activeTourInstance = null;
  }
};

// ─── UTILIDAD: Crear indicadores de puntitos (dots) ─────────────────────────
const createProgressDots = (current: number, total: number): string => {
  let dots = '<div class="tour-dots">';
  for (let i = 0; i < total; i++) {
    dots += `<span class="tour-dot ${i === current ? 'tour-dot-active' : ''}"></span>`;
  }
  dots += '</div>';
  return dots;
};

// ─── TOUR DE LANDING PAGE ────────────────────────────────────────────────────

export const startLandingTour = (force = false) => {
  if (!force && localStorage.getItem('cser_landing_tour_seen')) return;

  // Destruir cualquier tour previo
  destroyActiveTour();

  // Scroll al inicio antes de empezar el tour
  window.scrollTo({ top: 0, behavior: 'smooth' });

  const steps: DriveStep[] = [
    {
      // Paso 0: BIENVENIDA — sin element, centrado en pantalla
      popover: {
        title: 'Bienvenido a DevFolio',
        description: 'La plataforma definitiva para mostrar tu talento y código al mundo. Te guiaremos por las secciones principales.',
        align: 'center',
        side: 'over',
      }
    },
    {
      // Paso 1: Enfocar solo el título y subtítulo del hero (no toda la sección gigante)
      element: '#tour-hero-content',
      popover: {
        title: 'Página Principal',
        description: 'Aquí encontrarás la presentación de DevFolio. Desde aquí puedes registrarte y comenzar a construir tu portafolio profesional.',
        side: 'bottom',
        align: 'center'
      }
    },
    {
      // Paso 2: Enfocar el título de la sección de features (no toda la sección)
      element: '#tour-features-header',
      popover: {
        title: 'Todo lo que necesitas',
        description: 'Descubre las herramientas diseñadas específicamente para ingenieros de software: gestión de proyectos, habilidades técnicas, portafolio público y más.',
        side: 'bottom',
        align: 'center'
      }
    },
    {
      // Paso 3: Cómo funciona — el título + pasos
      element: '#tour-how-it-works',
      popover: {
        title: '¿Cómo funciona?',
        description: 'Son solo tres simples pasos: crea tu cuenta, añade tu experiencia y comparte tu enlace público al mundo.',
        side: 'top',
        align: 'center'
      }
    },
    {
      // Paso 4: Enfocar la sección CTA completa (título + botones juntos)
      element: '#tour-cta-section',
      popover: {
        title: 'Crea tu cuenta gratis',
        description: 'Regístrate ahora y empieza a construir tu marca personal como desarrollador. ¡Es completamente gratis!',
        side: 'top',
        align: 'center'
      }
    },
  ];

  const driverObj = driver({
    showProgress: false,
    animate: true,
    smoothScroll: true,
    allowClose: true,
    overlayColor: 'rgba(0, 0, 0, 0.65)',
    stagePadding: 10,
    stageRadius: 12,
    popoverClass: 'tour-popover-custom',
    nextBtnText: 'Siguiente',
    prevBtnText: 'Atrás',
    doneBtnText: 'Entendido',
    disableActiveInteraction: true,  // Impide que clicks en el elemento activo naveguen
    steps,
    onPopoverRender: (popover, { state }) => {
      const currentIndex = state.activeIndex ?? 0;
      const totalSteps = steps.length;
      const dotsHtml = createProgressDots(currentIndex, totalSteps);

      // Inyectar puntitos
      const footerEl = popover.footerButtons;
      if (footerEl) {
        const dotsContainer = document.createElement('div');
        dotsContainer.innerHTML = dotsHtml;
        dotsContainer.className = 'tour-dots-wrapper';
        footerEl.parentElement?.insertBefore(dotsContainer, footerEl);
      }

      // Ocultar botón "Atrás" en el primer paso (bienvenida)
      if (currentIndex === 0) {
        const prevBtn = popover.previousButton;
        if (prevBtn) {
          (prevBtn as HTMLElement).style.display = 'none';
        }
      }
    },
    onDestroyStarted: () => {
      localStorage.setItem('cser_landing_tour_seen', 'true');
      driverObj.destroy();
      activeTourInstance = null;
      // Volver al inicio de la página al terminar el tour
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  activeTourInstance = driverObj;

  // Pequeño retraso para asegurar que el DOM y el scroll terminaron
  setTimeout(() => {
    driverObj.drive();
  }, 800);
};

// ─── TOUR DE DASHBOARD ───────────────────────────────────────────────────────

export const startDashboardTour = (isAdmin: boolean, force = false) => {
  if (!force && localStorage.getItem('cser_dashboard_tour_seen')) return;

  destroyActiveTour();

  const welcomeStep: DriveStep = {
    popover: {
      title: isAdmin ? '¡Bienvenido, Administrador! 🛡️' : '¡Bienvenido a tu Panel! 🎯',
      description: isAdmin
        ? 'Este es tu centro de control. Desde aquí puedes gestionar usuarios, aprobar contenido, moderar comentarios y generar reportes del sistema.'
        : 'Este es tu espacio personal. Aquí puedes gestionar tu portafolio, proyectos, habilidades y experiencia profesional.',
      align: 'center',
      side: 'over',
    }
  };

  const adminSteps: DriveStep[] = [
    welcomeStep,
    {
      element: '#tour-sidebar-nav',
      popover: {
        title: 'Panel de Navegación',
        description: 'Aquí encontrarás todas las herramientas para gestionar la plataforma: usuarios, aprobaciones, moderación y reportes.',
        side: 'right',
        align: 'start'
      }
    },
    {
      element: '#tour-sidebar-collapse',
      popover: {
        title: 'Colapsar menú',
        description: 'Si necesitas más espacio para visualizar reportes o tablas, puedes ocultar este panel lateral.',
        side: 'right',
        align: 'start'
      }
    },
    {
      element: '#tour-sidebar-logout',
      popover: {
        title: 'Cerrar sesión',
        description: 'Cuando termines tu trabajo administrativo, puedes cerrar sesión de forma segura aquí.',
        side: 'right',
        align: 'start'
      }
    }
  ];

  const userSteps: DriveStep[] = [
    welcomeStep,
    {
      element: '#tour-sidebar-nav',
      popover: {
        title: 'Tu Menú Personal',
        description: 'Desde aquí puedes acceder a tus proyectos, configurar tus habilidades, experiencia laboral y controlar tu privacidad.',
        side: 'right',
        align: 'start'
      }
    },
    {
      element: '#tour-user-portfolio',
      popover: {
        title: 'Vista previa de Portafolio',
        description: 'Haz clic aquí en cualquier momento para ver cómo luce tu portafolio público.',
        side: 'right',
        align: 'start'
      }
    },
    {
      element: '#tour-sidebar-logout',
      popover: {
        title: 'Cerrar sesión',
        description: 'Cuando termines, puedes salir de forma segura desde aquí.',
        side: 'right',
        align: 'start'
      }
    }
  ];

  const steps = isAdmin ? adminSteps : userSteps;

  const driverObj = driver({
    showProgress: false,
    animate: true,
    smoothScroll: true,
    allowClose: true,
    overlayColor: 'rgba(0, 0, 0, 0.65)',
    stagePadding: 8,
    stageRadius: 12,
    popoverClass: 'tour-popover-custom',
    nextBtnText: 'Siguiente',
    prevBtnText: 'Atrás',
    doneBtnText: '¡Comenzar!',
    steps,
    onPopoverRender: (popover, { state }) => {
      const currentIndex = state.activeIndex ?? 0;
      const totalSteps = steps.length;
      const dotsHtml = createProgressDots(currentIndex, totalSteps);

      const footerEl = popover.footerButtons;
      if (footerEl) {
        const dotsContainer = document.createElement('div');
        dotsContainer.innerHTML = dotsHtml;
        dotsContainer.className = 'tour-dots-wrapper';
        footerEl.parentElement?.insertBefore(dotsContainer, footerEl);
      }

      // Ocultar botón "Atrás" en el primer paso
      if (currentIndex === 0) {
        const prevBtn = popover.previousButton;
        if (prevBtn) {
          (prevBtn as HTMLElement).style.display = 'none';
        }
      }
    },
    onDestroyStarted: () => {
      localStorage.setItem('cser_dashboard_tour_seen', 'true');
      driverObj.destroy();
      activeTourInstance = null;
    }
  });

  activeTourInstance = driverObj;

  setTimeout(() => {
    driverObj.drive();
  }, 700);
};
