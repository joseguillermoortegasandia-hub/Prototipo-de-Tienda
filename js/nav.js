/**
 * nav.js — Barra de navegación dinámica de StrikeStore
 * Expone el objeto Nav en window.Nav
 * Depende de: utils.js (Utils), auth.js (Auth), data.js (Products)
 */

const Nav = {

  /**
   * Renderiza e inyecta el HTML del navbar en <nav id="navbar">.
   * @param {string} activePage - nombre del archivo activo, ej: 'catalogo.html'
   */
  render(activePage = '') {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    const user = Auth.getCurrentUser();
    const isAuth = Auth.isAuthenticated();
    const isAdmin = Auth.isAdmin();

    const isActive = (page) => activePage === page ? 'active' : '';

    // ── Bloque de autenticación del lado derecho ───────────────────────────
    let authBlock = '';

    if (!isAuth) {
      authBlock = `
        <a href="login.html" class="nav-btn nav-btn-ghost ${isActive('login.html')}">
          <i class="fa-solid fa-right-to-bracket"></i> Iniciar Sesión
        </a>
        <a href="registro.html" class="nav-btn nav-btn-primary ${isActive('registro.html')}">
          <i class="fa-solid fa-user-plus"></i> Registrarse
        </a>
      `;
    } else {
      const avatarHTML = this._getAvatarHTML(user);
      const profileLink = `
        <a href="perfil.html" class="nav-profile-link ${isActive('perfil.html')}" title="Mi Perfil">
          ${avatarHTML}
          <span class="nav-profile-name">${Utils.sanitizeInput(user.name.split(' ')[0])}</span>
        </a>
      `;

      const adminLink = isAdmin ? `
        <a href="admin.html" class="nav-btn nav-btn-admin ${isActive('admin.html')}">
          <i class="fa-solid fa-shield-halved"></i> Panel Admin
          <span class="nav-admin-badge">Admin</span>
        </a>
      ` : '';

      const logoutBtn = `
        <button class="nav-btn nav-btn-ghost nav-logout-btn" id="nav-logout-btn" title="Cerrar sesión">
          <i class="fa-solid fa-right-from-bracket"></i>
        </button>
      `;

      authBlock = profileLink + adminLink + logoutBtn;
    }

    // ── HTML completo del navbar ───────────────────────────────────────────
    navbar.innerHTML = `
      <div class="nav-inner">

        <!-- Logo -->
        <a href="index.html" class="nav-logo" aria-label="StrikeStore - Inicio">
          <span class="nav-logo-icon" aria-hidden="true">🥎</span>
          <span class="nav-logo-text">
            <span class="nav-logo-strike">Strike</span><span class="nav-logo-store">Store</span>
          </span>
        </a>

        <!-- Links de navegación (desktop) -->
        <nav class="nav-links" aria-label="Menú principal">
          <a href="index.html" class="nav-link ${isActive('index.html')}">
            <i class="fa-solid fa-house"></i> Inicio
          </a>
          <a href="catalogo.html" class="nav-link ${isActive('catalogo.html')}">
            <i class="fa-solid fa-store"></i> Catálogo
          </a>
        </nav>

        <!-- Bloque de autenticación (desktop) -->
        <div class="nav-auth" aria-label="Acciones de cuenta">
          ${authBlock}
        </div>

        <!-- Botón hamburger (móvil) -->
        <button class="nav-hamburger" id="nav-hamburger" aria-label="Abrir menú" aria-expanded="false" aria-controls="nav-mobile-menu">
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
        </button>

      </div>

      <!-- Menú móvil -->
      <div class="nav-mobile-menu" id="nav-mobile-menu" aria-hidden="true">
        <div class="nav-mobile-overlay" id="nav-mobile-overlay"></div>
        <div class="nav-mobile-drawer">

          <!-- Cabecera del drawer -->
          <div class="nav-mobile-header">
            <a href="index.html" class="nav-logo nav-logo-sm">
              <span>🥎</span>
              <span class="nav-logo-text">
                <span class="nav-logo-strike">Strike</span><span class="nav-logo-store">Store</span>
              </span>
            </a>
            <button class="nav-mobile-close" id="nav-mobile-close" aria-label="Cerrar menú">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <!-- Perfil en móvil (si autenticado) -->
          ${isAuth ? `
          <div class="nav-mobile-user">
            ${this._getAvatarHTML(user, 'lg')}
            <div>
              <div class="nav-mobile-user-name">${Utils.sanitizeInput(user.name)}</div>
              <div class="nav-mobile-user-email">${Utils.sanitizeInput(user.email)}</div>
            </div>
          </div>
          ` : ''}

          <!-- Links de navegación en móvil -->
          <nav class="nav-mobile-links" aria-label="Menú móvil">
            <a href="index.html" class="nav-mobile-link ${isActive('index.html')}">
              <i class="fa-solid fa-house"></i> Inicio
            </a>
            <a href="catalogo.html" class="nav-mobile-link ${isActive('catalogo.html')}">
              <i class="fa-solid fa-store"></i> Catálogo
            </a>
            ${isAuth ? `
            <a href="perfil.html" class="nav-mobile-link ${isActive('perfil.html')}">
              <i class="fa-solid fa-user"></i> Mi Perfil
            </a>
            ` : ''}
            ${isAdmin ? `
            <a href="admin.html" class="nav-mobile-link ${isActive('admin.html')}">
              <i class="fa-solid fa-shield-halved"></i> Panel Admin
            </a>
            ` : ''}
          </nav>

          <!-- Botones de auth en móvil -->
          <div class="nav-mobile-footer">
            ${!isAuth ? `
              <a href="login.html" class="nav-btn nav-btn-ghost nav-btn-full">
                <i class="fa-solid fa-right-to-bracket"></i> Iniciar Sesión
              </a>
              <a href="registro.html" class="nav-btn nav-btn-primary nav-btn-full">
                <i class="fa-solid fa-user-plus"></i> Registrarse
              </a>
            ` : `
              <button class="nav-btn nav-btn-ghost nav-btn-full nav-logout-btn" id="nav-logout-btn-mobile">
                <i class="fa-solid fa-right-from-bracket"></i> Cerrar Sesión
              </button>
            `}
          </div>

        </div>
      </div>
    `;

    // Adjuntar estilos base si no existen
    this._injectStyles();

    // Adjuntar event listeners
    this._attachListeners();
  },

  /**
   * Re-renderiza el nav (útil después de login/logout sin recargar página).
   */
  update() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    this.render(currentPage);
  },

  /**
   * Genera el HTML del avatar circular con iniciales.
   * @param {object} user
   * @param {'sm'|'md'|'lg'} size
   */
  _getAvatarHTML(user, size = 'md') {
    if (!user) return '';
    const initials = Utils.getInitials(user.name);
    const sizeClass = `nav-avatar-${size}`;
    // Generamos un color de fondo determinista basado en el nombre
    const colors = ['#de3a0d', '#df5911', '#e17605', '#114664', '#3f4a4b'];
    const colorIdx = user.name.charCodeAt(0) % colors.length;
    const bg = colors[colorIdx];

    return `
      <div class="nav-avatar ${sizeClass}" style="background:${bg}" aria-label="Avatar de ${Utils.sanitizeInput(user.name)}" title="${Utils.sanitizeInput(user.name)}">
        ${initials}
      </div>
    `;
  },

  /**
   * Adjunta los event listeners al navbar ya renderizado.
   */
  _attachListeners() {
    // Logout (desktop)
    const logoutBtn = document.getElementById('nav-logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => Auth.logout());
    }

    // Logout (móvil)
    const logoutBtnMobile = document.getElementById('nav-logout-btn-mobile');
    if (logoutBtnMobile) {
      logoutBtnMobile.addEventListener('click', () => Auth.logout());
    }

    // Hamburger y menú móvil
    this._setupMobileMenu();
  },

  /**
   * Configura la lógica del menú hamburger para móvil.
   */
  _setupMobileMenu() {
    const hamburger   = document.getElementById('nav-hamburger');
    const mobileMenu  = document.getElementById('nav-mobile-menu');
    const overlay     = document.getElementById('nav-mobile-overlay');
    const closeBtn    = document.getElementById('nav-mobile-close');

    if (!hamburger || !mobileMenu) return;

    const open = () => {
      mobileMenu.classList.add('open');
      mobileMenu.setAttribute('aria-hidden', 'false');
      hamburger.setAttribute('aria-expanded', 'true');
      hamburger.classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    const close = () => {
      mobileMenu.classList.remove('open');
      mobileMenu.setAttribute('aria-hidden', 'true');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.classList.remove('active');
      document.body.style.overflow = '';
    };

    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.contains('open');
      isOpen ? close() : open();
    });

    if (overlay)  overlay.addEventListener('click', close);
    if (closeBtn) closeBtn.addEventListener('click', close);

    // Cerrar con ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) close();
    });
  },

  /**
   * Inyecta los estilos CSS base del navbar en el <head> si no existen ya.
   * Los estilos completos deben estar en el CSS externo; estos son solo el mínimo funcional.
   */
  _injectStyles() {
    if (document.getElementById('nav-styles')) return;

    const style = document.createElement('style');
    style.id = 'nav-styles';
    style.textContent = `
      /* ── Navbar base ───────────────────────────────────────── */
      #navbar {
        position: sticky;
        top: 0;
        z-index: 1000;
        background: rgba(31, 41, 43, 0.96);
        backdrop-filter: blur(12px);
        border-bottom: 1px solid rgba(255,255,255,0.07);
      }
      .nav-inner {
        max-width: 1280px;
        margin: 0 auto;
        padding: 0 1.5rem;
        height: 64px;
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      /* ── Logo ──────────────────────────────────────────────── */
      .nav-logo {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        text-decoration: none;
        font-weight: 800;
        font-size: 1.25rem;
        letter-spacing: -0.02em;
        flex-shrink: 0;
      }
      .nav-logo-icon { font-size: 1.4rem; }
      .nav-logo-strike {
        background: linear-gradient(135deg, #de3a0d, #e17605);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      .nav-logo-store { color: #f1f5f9; }

      /* ── Links ─────────────────────────────────────────────── */
      .nav-links {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        flex: 1;
        margin-left: 1rem;
      }
      .nav-link {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        padding: 0.45rem 0.85rem;
        border-radius: 8px;
        color: #94a3b8;
        text-decoration: none;
        font-size: 0.9rem;
        font-weight: 500;
        transition: color 0.2s, background 0.2s;
      }
      .nav-link:hover,
      .nav-link.active {
        color: #f1f5f9;
        background: rgba(255,255,255,0.07);
      }
      .nav-link.active { color: #e17605; }

      /* ── Auth block ────────────────────────────────────────── */
      .nav-auth {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-left: auto;
      }

      /* ── Botones nav ───────────────────────────────────────── */
      .nav-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        padding: 0.45rem 1rem;
        border-radius: 8px;
        font-size: 0.875rem;
        font-weight: 600;
        text-decoration: none;
        cursor: pointer;
        border: none;
        transition: background 0.2s, color 0.2s, transform 0.15s;
        white-space: nowrap;
      }
      .nav-btn:active { transform: scale(0.97); }
      .nav-btn-ghost {
        background: transparent;
        color: #94a3b8;
        border: 1px solid rgba(148,163,184,0.25);
      }
      .nav-btn-ghost:hover { background: rgba(255,255,255,0.06); color: #f1f5f9; }
      .nav-btn-primary {
        background: linear-gradient(135deg, #de3a0d, #e17605);
        color: #fff;
      }
      .nav-btn-primary:hover { background: linear-gradient(135deg, #c9340b, #cb6b04); }
      .nav-btn-admin {
        background: rgba(17,70,100,0.5);
        color: #7dd3fc;
        border: 1px solid rgba(17,70,100,0.7);
        position: relative;
      }
      .nav-btn-admin:hover { background: rgba(17,70,100,0.8); }
      .nav-admin-badge {
        background: #de3a0d;
        color: #fff;
        font-size: 0.65rem;
        font-weight: 700;
        padding: 1px 5px;
        border-radius: 4px;
        letter-spacing: 0.05em;
        text-transform: uppercase;
      }
      .nav-btn-full { width: 100%; justify-content: center; }

      /* ── Avatar ────────────────────────────────────────────── */
      .nav-avatar {
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        color: #fff;
        flex-shrink: 0;
        text-transform: uppercase;
        letter-spacing: 0.02em;
      }
      .nav-avatar-sm  { width: 28px; height: 28px; font-size: 0.65rem; }
      .nav-avatar-md  { width: 34px; height: 34px; font-size: 0.8rem; }
      .nav-avatar-lg  { width: 44px; height: 44px; font-size: 1rem; }

      /* ── Profile link ──────────────────────────────────────── */
      .nav-profile-link {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.35rem 0.75rem 0.35rem 0.35rem;
        border-radius: 50px;
        text-decoration: none;
        border: 1px solid rgba(255,255,255,0.1);
        transition: background 0.2s, border-color 0.2s;
      }
      .nav-profile-link:hover { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.2); }
      .nav-profile-name { color: #e2e8f0; font-size: 0.875rem; font-weight: 600; }

      /* ── Hamburger ─────────────────────────────────────────── */
      .nav-hamburger {
        display: none;
        flex-direction: column;
        justify-content: center;
        gap: 5px;
        width: 40px;
        height: 40px;
        padding: 8px;
        border: none;
        background: transparent;
        cursor: pointer;
        border-radius: 8px;
        margin-left: auto;
        transition: background 0.2s;
      }
      .nav-hamburger:hover { background: rgba(255,255,255,0.07); }
      .hamburger-line {
        display: block;
        width: 100%;
        height: 2px;
        background: #cbd5e1;
        border-radius: 2px;
        transition: transform 0.3s, opacity 0.3s, width 0.3s;
        transform-origin: center;
      }
      .nav-hamburger.active .hamburger-line:nth-child(1) { transform: translateY(7px) rotate(45deg); }
      .nav-hamburger.active .hamburger-line:nth-child(2) { opacity: 0; transform: scaleX(0); }
      .nav-hamburger.active .hamburger-line:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

      /* ── Mobile menu ───────────────────────────────────────── */
      .nav-mobile-menu {
        display: none;
        position: fixed;
        inset: 0;
        z-index: 1001;
      }
      .nav-mobile-menu.open { display: flex; }
      .nav-mobile-overlay {
        position: absolute;
        inset: 0;
        background: rgba(0,0,0,0.6);
        backdrop-filter: blur(3px);
      }
      .nav-mobile-drawer {
        position: relative;
        margin-left: auto;
        width: min(320px, 88vw);
        height: 100%;
        background: #1a2526;
        border-left: 1px solid rgba(255,255,255,0.08);
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        padding: 1.25rem;
        gap: 1rem;
        animation: slideInRight 0.28s ease;
      }
      @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to   { transform: translateX(0);    opacity: 1; }
      }
      .nav-mobile-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-bottom: 1rem;
        border-bottom: 1px solid rgba(255,255,255,0.08);
      }
      .nav-mobile-close {
        width: 36px; height: 36px;
        display: flex; align-items: center; justify-content: center;
        border: none; background: rgba(255,255,255,0.06);
        border-radius: 8px; color: #94a3b8;
        cursor: pointer; font-size: 1rem;
        transition: background 0.2s;
      }
      .nav-mobile-close:hover { background: rgba(255,255,255,0.12); color: #f1f5f9; }
      .nav-mobile-user {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem;
        background: rgba(255,255,255,0.04);
        border-radius: 10px;
        border: 1px solid rgba(255,255,255,0.06);
      }
      .nav-mobile-user-name { color: #f1f5f9; font-weight: 600; font-size: 0.9rem; }
      .nav-mobile-user-email { color: #64748b; font-size: 0.78rem; }
      .nav-mobile-links {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        flex: 1;
      }
      .nav-mobile-link {
        display: flex;
        align-items: center;
        gap: 0.65rem;
        padding: 0.75rem 1rem;
        border-radius: 10px;
        color: #94a3b8;
        text-decoration: none;
        font-size: 0.95rem;
        font-weight: 500;
        transition: background 0.2s, color 0.2s;
      }
      .nav-mobile-link:hover,
      .nav-mobile-link.active {
        background: rgba(255,255,255,0.06);
        color: #f1f5f9;
      }
      .nav-mobile-link.active { color: #e17605; }
      .nav-mobile-link i { width: 18px; text-align: center; }
      .nav-mobile-footer {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding-top: 1rem;
        border-top: 1px solid rgba(255,255,255,0.08);
      }

      /* ── Responsive ────────────────────────────────────────── */
      @media (max-width: 768px) {
        .nav-links,
        .nav-auth { display: none; }
        .nav-hamburger { display: flex; }
      }
    `;
    document.head.appendChild(style);
  }
};

// ─── Auto-inicialización cuando el DOM esté listo ───────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Detectar la página actual desde el nombre del archivo
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  // Inicializar datos y autenticación
  Products.init();
  Auth.init();

  // Renderizar el navbar con la página activa detectada
  Nav.render(currentPage);

  // ── Intersection Observer para animaciones .reveal ──────────────────────
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Opcional: dejar de observar después de revelar para mejor rendimiento
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
});
