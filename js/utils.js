/**
 * utils.js — Utilidades globales de StrikeStore
 * Expone el objeto Utils en window.Utils
 */

const Utils = {

  /**
   * Formatea un número como precio: "$189.99"
   */
  formatPrice(n) {
    return '$' + Number(n).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  },

  /**
   * Genera un ID único: "prefix_timestamp_randomhex"
   */
  generateId(prefix = 'id') {
    const ts = Date.now().toString(36);
    const rand = Math.random().toString(16).slice(2, 8);
    return `${prefix}_${ts}_${rand}`;
  },

  /**
   * Muestra un toast notification en #toast-container.
   * Permite múltiples toasts apilados.
   * @param {string} message
   * @param {'success'|'error'|'warning'|'info'} type
   * @param {number} duration - ms hasta auto-cierre
   */
  showToast(message, type = 'success', duration = 4000) {
    // Crear contenedor si no existe
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.setAttribute('aria-live', 'polite');
      container.style.cssText = [
        'position:fixed', 'bottom:24px', 'right:24px',
        'z-index:9999', 'display:flex', 'flex-direction:column',
        'gap:10px', 'pointer-events:none'
      ].join(';');
      document.body.appendChild(container);
    }

    const iconMap = {
      success: 'fa-circle-check',
      error:   'fa-circle-xmark',
      warning: 'fa-triangle-exclamation',
      info:    'fa-circle-info'
    };

    const colorMap = {
      success: '#22c55e',
      error:   '#ef4444',
      warning: '#f59e0b',
      info:    '#3b82f6'
    };

    const icon = iconMap[type] || iconMap.info;
    const color = colorMap[type] || colorMap.info;

    const toast = document.createElement('div');
    toast.className = 'ss-toast';
    toast.style.cssText = [
      'display:flex', 'align-items:center', 'gap:10px',
      'background:#1e2a2b', 'color:#f1f5f9',
      'border-left:4px solid ' + color,
      'padding:12px 18px', 'border-radius:8px',
      'box-shadow:0 4px 20px rgba(0,0,0,0.4)',
      'font-size:0.9rem', 'max-width:340px',
      'pointer-events:auto', 'cursor:pointer',
      'opacity:0', 'transform:translateY(20px)',
      'transition:opacity 0.3s ease, transform 0.3s ease'
    ].join(';');

    toast.innerHTML = `
      <i class="fa-solid ${icon}" style="color:${color};font-size:1.1rem;flex-shrink:0"></i>
      <span style="flex:1">${message}</span>
      <i class="fa-solid fa-xmark" style="color:#94a3b8;font-size:0.85rem;flex-shrink:0"></i>
    `;

    container.appendChild(toast);

    // Animar entrada
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
      });
    });

    const remove = () => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(20px)';
      setTimeout(() => toast.remove(), 320);
    };

    toast.addEventListener('click', remove);
    setTimeout(remove, duration);
  },

  /**
   * Hash simple para demo: no es crypto real.
   */
  hashPassword(password) {
    const salted = password + 'ss_salt_2025';
    const b64 = btoa(unescape(encodeURIComponent(salted)));
    // Transformaciones simples: invertir + reemplazar caracteres
    return b64.split('').reverse().join('').replace(/=/g, '_').replace(/\+/g, '-').replace(/\//g, '.');
  },

  /**
   * Verifica una contraseña contra su hash.
   */
  checkPassword(password, hash) {
    return this.hashPassword(password) === hash;
  },

  /**
   * Trunca texto a 'length' caracteres añadiendo "..."
   */
  truncate(text, length = 100) {
    if (!text || text.length <= length) return text;
    return text.slice(0, length).trimEnd() + '...';
  },

  /**
   * Debounce estándar: retrasa 'fn' hasta que pase 'delay' ms sin llamadas.
   */
  debounce(fn, delay = 300) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  },

  /**
   * Genera HTML de estrellas para un rating numérico (1-5).
   * Usa iconos Font Awesome.
   */
  renderStars(rating) {
    const full  = Math.floor(rating);
    const half  = rating % 1 >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;

    let html = '<span class="stars" aria-label="Rating: ' + rating + ' de 5">';
    for (let i = 0; i < full;  i++) html += '<i class="fa-solid fa-star"></i>';
    if (half)                        html += '<i class="fa-solid fa-star-half-stroke"></i>';
    for (let i = 0; i < empty; i++) html += '<i class="fa-regular fa-star"></i>';
    html += '</span>';
    return html;
  },

  /**
   * Formatea una fecha ISO o string a "03 Jun 2026" en español.
   */
  formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    return d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })
            .replace('.', '');
  },

  /**
   * Obtiene las iniciales de un nombre. "John Doe" → "JD", "María" → "M"
   */
  getInitials(name) {
    if (!name) return '?';
    return name.trim().split(/\s+/).map(w => w[0].toUpperCase()).slice(0, 2).join('');
  },

  /**
   * Retorna la etiqueta en español para una clave de categoría.
   */
  getCategoryLabel(cat) {
    const labels = {
      bates:       'Bates',
      pelotas:     'Pelotas',
      guantes:     'Guantes',
      guantines:   'Guantines',
      cascos:      'Cascos',
      bases:       'Bases',
      tacos:       'Tacos',
      mangas:      'Mangas',
      lentes:      'Lentes',
      gorras:      'Gorras',
      ropa:        'Ropa',
      accesorios:  'Accesorios'
    };
    return labels[cat] || cat;
  },

  /**
   * Retorna la clase Font Awesome para cada categoría.
   */
  getCategoryIcon(cat) {
    const icons = {
      bates:      'fa-solid fa-baseball-bat-ball',
      pelotas:    'fa-solid fa-baseball',
      guantes:    'fa-solid fa-hand-back-fist',
      guantines:  'fa-solid fa-hand',
      cascos:     'fa-solid fa-helmet-safety',
      bases:      'fa-solid fa-diamond',
      tacos:      'fa-solid fa-shoe-prints',
      mangas:     'fa-solid fa-mitten',
      lentes:     'fa-solid fa-glasses',
      gorras:     'fa-solid fa-hat-cowboy',
      ropa:       'fa-solid fa-shirt',
      accesorios: 'fa-solid fa-bag-shopping'
    };
    return icons[cat] || 'fa-solid fa-tag';
  },

  /**
   * Retorna el gradiente CSS de la paleta StrikeStore para cada categoría.
   */
  getCategoryGradient(cat) {
    const gradients = {
      bates:      'linear-gradient(135deg, #de3a0d 0%, #3f4a4b 100%)',
      pelotas:    'linear-gradient(135deg, #e17605 0%, #df5911 100%)',
      guantes:    'linear-gradient(135deg, #114664 0%, #3f4a4b 100%)',
      guantines:  'linear-gradient(135deg, #df5911 0%, #e17605 100%)',
      cascos:     'linear-gradient(135deg, #3f4a4b 0%, #de3a0d 100%)',
      bases:      'linear-gradient(135deg, #114664 0%, #de3a0d 100%)',
      tacos:      'linear-gradient(135deg, #de3a0d 0%, #df5911 80%)',
      mangas:     'linear-gradient(135deg, #e17605 0%, #114664 100%)',
      lentes:     'linear-gradient(135deg, #3f4a4b 0%, #114664 80%)',
      gorras:     'linear-gradient(135deg, #114664 0%, #df5911 100%)',
      ropa:       'linear-gradient(135deg, #de3a0d 0%, #114664 100%)',
      accesorios: 'linear-gradient(135deg, #df5911 0%, #3f4a4b 100%)'
    };
    return gradients[cat] || 'linear-gradient(135deg, #3f4a4b 0%, #114664 100%)';
  },

  /**
   * Valida formato de email con regex.
   */
  validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());
  },

  /**
   * Valida contraseña: mínimo 8 chars y al menos 1 número.
   * @returns {{ valid: boolean, message: string }}
   */
  validatePassword(password) {
    if (!password || password.length < 8) {
      return { valid: false, message: 'La contraseña debe tener al menos 8 caracteres.' };
    }
    if (!/\d/.test(password)) {
      return { valid: false, message: 'La contraseña debe contener al menos un número.' };
    }
    return { valid: true, message: 'Contraseña válida.' };
  },

  /**
   * Escapa caracteres HTML básicos para prevenir XSS.
   */
  sanitizeInput(str) {
    if (typeof str !== 'string') return str;
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
};
