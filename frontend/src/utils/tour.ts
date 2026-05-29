import { driver, DriveStep } from 'driver.js';
import 'driver.js/dist/driver.css';

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

  const steps: DriveStep[] = [
    {
      // Paso de BIENVENIDA — sin element, se centra en la pantalla
      popover: {
        title: '¡Bienvenido a DevFolio! 🚀',
        description: 'La plataforma definitiva para mostrar tu talento y código al mundo. Te guiaremos por las secciones principales de la página.',
        align: 'center',
        side: 'over',
      }
    },
    {
      element: '#tour-hero',
      popover: {
        title: 'Página Principal',
        description: 'Aquí encontrarás la presentación de DevFolio. Desde aquí puedes registrarte y comenzar a construir tu portafolio profesional.',
        side: 'bottom',
        align: 'center'
      }
    },
    {
      element: '#tour-features',
      popover: {
        title: 'Todo lo que necesitas',
        description: 'Descubre las herramientas diseñadas específicamente para ingenieros de software: gestión de proyectos, habilidades técnicas, portafolio público y más.',
        side: 'top',
        align: 'center'
      }
    },
    {
      element: '#tour-how-it-works',
      popover: {
        title: '¿Cómo funciona?',
        description: 'Son solo tres simples pasos: crea tu cuenta, añade tu experiencia y comparte tu enlace público al mundo.',
        side: 'top',
        align: 'center'
      }
    },
    {
      element: '#tour-cta',
      popover: {
        title: '¡Crea tu cuenta gratis!',
        description: 'Regístrate ahora y empieza a construir tu marca personal como desarrollador. ¡Es completamente gratis!',
        side: 'top',
        align: 'center'
      }
    },
  ];

  const driverObj = driver({
    showProgress: false,       // Desactivamos el progreso por defecto (usamos dots custom)
    animate: true,
    smoothScroll: true,        // Scroll suave al elemento
    allowClose: true,
    overlayColor: 'rgba(0, 0, 0, 0.65)',
    stagePadding: 8,
    stageRadius: 12,
    popoverClass: 'tour-popover-custom',
    nextBtnText: '→',
    prevBtnText: '←',
    doneBtnText: '¡Entendido!',
    steps,
    onPopoverRender: (popover, { state }) => {
      // Inyectar los puntitos de progreso en el footer del popover
      const currentIndex = state.activeIndex ?? 0;
      const totalSteps = steps.length;
      const dotsHtml = createProgressDots(currentIndex, totalSteps);

      // Insertar dots antes de los botones de navegación
      const footerEl = popover.footerButtons;
      if (footerEl) {
        const dotsContainer = document.createElement('div');
        dotsContainer.innerHTML = dotsHtml;
        dotsContainer.className = 'tour-dots-wrapper';
        footerEl.parentElement?.insertBefore(dotsContainer, footerEl);
      }
    },
    onDestroyStarted: () => {
      localStorage.setItem('cser_landing_tour_seen', 'true');
      driverObj.destroy();
    }
  });

  // Pequeño retraso para asegurar que el DOM cargó
  setTimeout(() => {
    driverObj.drive();
  }, 600);
};

// ─── TOUR DE DASHBOARD ───────────────────────────────────────────────────────

export const startDashboardTour = (isAdmin: boolean, force = false) => {
  if (!force && localStorage.getItem('cser_dashboard_tour_seen')) return;

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
    nextBtnText: '→',
    prevBtnText: '←',
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
    },
    onDestroyStarted: () => {
      localStorage.setItem('cser_dashboard_tour_seen', 'true');
      driverObj.destroy();
    }
  });

  // Retraso para asegurar que el sidebar cargó completamente
  setTimeout(() => {
    driverObj.drive();
  }, 700);
};
