/**
 * home.js — Lógica de la landing page de StrikeStore (index.html)
 * Depende de: utils.js (Utils), data.js (Products), auth.js (Auth)
 */

document.addEventListener('DOMContentLoaded', () => {
  renderCategories();
  renderFeaturedProducts();
  renderNewArrivals();
  setupNewsletter();
  initCounters();
  initBackToTop();
  initNavbarScroll();
});

// ─── CATEGORIES ──────────────────────────────────────────────────────────────

/**
 * Obtiene las categorías únicas y renderiza category-cards en #categories-grid.
 */
function renderCategories() {
  const grid = document.getElementById('categories-grid');
  if (!grid) return;

  const categories = Products.getCategories();
  if (!categories.length) {
    grid.innerHTML = '<p style="color:var(--color-gray-400);text-align:center;grid-column:1/-1">No hay categorías disponibles.</p>';
    return;
  }

  grid.innerHTML = '';

  categories.forEach(cat => {
    const products   = Products.getByCategory(cat);
    const count      = products.length;
    const label      = Utils.getCategoryLabel(cat);
    const icon       = Utils.getCategoryIcon(cat);
    const gradient   = Utils.getCategoryGradient(cat);

    const link = document.createElement('a');
    link.href  = `catalogo.html?categoria=${encodeURIComponent(cat)}`;
    link.className = 'category-card';
    link.setAttribute('aria-label', `${label} — ${count} productos`);
    link.style.background = gradient;

    link.innerHTML = `
      <span class="category-card__count">${count}</span>
      <i class="${icon} category-card__icon" aria-hidden="true"></i>
      <span class="category-card__name">${Utils.sanitizeInput(label)}</span>
    `;

    grid.appendChild(link);
  });

  // Disparar reveal una vez renderizado
  _triggerReveal(grid);
}

// ─── FEATURED PRODUCTS ───────────────────────────────────────────────────────

/**
 * Obtiene hasta 4 productos destacados y los renderiza en #featured-products.
 */
function renderFeaturedProducts() {
  const container = document.getElementById('featured-products');
  if (!container) return;

  const products = Products.getFeatured().slice(0, 4);
  if (!products.length) {
    container.innerHTML = '<p style="color:var(--color-gray-400);text-align:center;grid-column:1/-1">Sin productos destacados por el momento.</p>';
    return;
  }

  container.innerHTML = '';
  products.forEach(p => {
    const card = _createProductCard(p);
    container.appendChild(card);
  });

  _triggerReveal(container);
}

// ─── NEW ARRIVALS ─────────────────────────────────────────────────────────────

/**
 * Obtiene hasta 4 novedades y las renderiza en #new-arrivals.
 */
function renderNewArrivals() {
  const container = document.getElementById('new-arrivals');
  if (!container) return;

  const products = Products.getNewArrivals().slice(0, 4);
  if (!products.length) {
    container.innerHTML = '<p style="color:var(--color-gray-400);text-align:center;grid-column:1/-1">Sin novedades por el momento.</p>';
    return;
  }

  container.innerHTML = '';
  products.forEach(p => {
    const card = _createProductCard(p);
    container.appendChild(card);
  });

  _triggerReveal(container);
}

// ─── PRODUCT CARD ─────────────────────────────────────────────────────────────

/**
 * Genera un elemento DOM .product-card completo.
 * @param {object} product
 * @returns {HTMLElement}
 */
function _createProductCard(product) {
  const hasDiscount = product.originalPrice > product.price;
  const discountPct = hasDiscount
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Badge HTML
  let badgeHTML = '';
  if (product.badge === 'new') {
    badgeHTML = '<span class="badge badge-new"><i class="fa-solid fa-bolt" aria-hidden="true"></i> Nuevo</span>';
  } else if (product.badge === 'sale') {
    badgeHTML = `<span class="badge badge-sale"><i class="fa-solid fa-tag" aria-hidden="true"></i> -${discountPct}%</span>`;
  } else if (product.badge === 'featured') {
    badgeHTML = '<span class="badge badge-featured"><i class="fa-solid fa-star" aria-hidden="true"></i> Destacado</span>';
  }

  // Stars HTML
  const starsHTML = Utils.renderStars(product.rating);

  // Original price HTML
  const originalPriceHTML = hasDiscount
    ? `<span class="product-card__original-price" aria-label="Precio original">${Utils.formatPrice(product.originalPrice)}</span>`
    : '';

  const article = document.createElement('article');
  article.className = 'product-card';
  article.setAttribute('aria-label', product.name);

  article.innerHTML = `
    <!-- Image area -->
    <div class="product-card__image" style="background:${product.gradient || 'var(--gradient-dark)'}">
      <div class="product-card__image-inner">
        <i class="${product.icon || 'fa-solid fa-tag'}" aria-hidden="true"></i>
      </div>
      ${badgeHTML ? `<div class="product-card__badge">${badgeHTML}</div>` : ''}
      <button class="product-card__wishlist" aria-label="Agregar a favoritos" title="Favoritos">
        <i class="fa-regular fa-heart" aria-hidden="true"></i>
      </button>
    </div>

    <!-- Body -->
    <div class="product-card__body">
      <span class="product-card__category">${Utils.sanitizeInput(Utils.getCategoryLabel(product.category))}</span>
      <h3 class="product-card__name">${Utils.sanitizeInput(product.name)}</h3>
      <span class="product-card__brand">${Utils.sanitizeInput(product.brand)}</span>
      <div class="product-card__stars" aria-label="Calificación">
        ${starsHTML}
        <span class="product-card__rating-count">(${product.reviewCount})</span>
      </div>
      <div class="product-card__price">
        <div class="product-card__price-group">
          <span class="product-card__current-price">${Utils.formatPrice(product.price)}</span>
          ${originalPriceHTML}
        </div>
        <span class="badge badge-primary" style="font-size:.65rem">
          ${product.stock > 0 ? `${product.stock} disp.` : '<span style="color:#ef4444">Agotado</span>'}
        </span>
      </div>
    </div>

    <!-- Actions -->
    <div class="product-card__actions">
      <a href="producto.html?id=${encodeURIComponent(product.id)}"
         class="btn btn-primary"
         aria-label="Ver detalle de ${Utils.sanitizeInput(product.name)}">
        <i class="fa-solid fa-eye" aria-hidden="true"></i>
        Ver Detalle
      </a>
      <button
        class="btn btn-outline product-card__detail-btn"
        aria-label="Agregar al carrito"
        title="Agregar al carrito"
        onclick="Utils.showToast('Artículo agregado al carrito', 'success')">
        <i class="fa-solid fa-cart-plus" aria-hidden="true"></i>
      </button>
    </div>
  `;

  return article;
}

// ─── NEWSLETTER ───────────────────────────────────────────────────────────────

/**
 * Maneja el submit del formulario de newsletter.
 */
function setupNewsletter() {
  const form = document.getElementById('newsletter-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const emailInput = document.getElementById('newsletter-email');
    const email = emailInput ? emailInput.value.trim() : '';

    if (!email) {
      Utils.showToast('Por favor ingresa tu correo electrónico.', 'warning');
      return;
    }

    if (!Utils.validateEmail(email)) {
      Utils.showToast('El correo electrónico no es válido.', 'error');
      if (emailInput) emailInput.classList.add('error');
      return;
    }

    // UI success
    if (emailInput) {
      emailInput.classList.remove('error');
      emailInput.value = '';
    }

    Utils.showToast('¡Gracias por suscribirte! Pronto recibirás nuestras novedades.', 'success', 5000);

    // Disable briefly to prevent spam
    const btn = form.querySelector('button[type="submit"]');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-check"></i> ¡Suscrito!';
      setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Suscribirme';
      }, 3000);
    }
  });

  // Remove error class on input
  const emailInput = document.getElementById('newsletter-email');
  if (emailInput) {
    emailInput.addEventListener('input', () => emailInput.classList.remove('error'));
  }
}

// ─── HERO COUNTERS ────────────────────────────────────────────────────────────

/**
 * Anima los números del hero con efecto countUp usando IntersectionObserver.
 */
function initCounters() {
  const statsSection = document.getElementById('hero-stats');
  if (!statsSection) return;

  const counters = statsSection.querySelectorAll('.counter');
  if (!counters.length) return;

  const animateCounter = (el) => {
    const target   = parseInt(el.getAttribute('data-target'), 10);
    const duration = 1800; // ms
    const start    = performance.now();

    // Stagger based on DOM order
    const delay = Array.from(counters).indexOf(el) * 180;

    setTimeout(() => {
      const tick = (now) => {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Easing: ease-out cubic
        const eased    = 1 - Math.pow(1 - progress, 3);
        const value    = Math.floor(eased * target);

        el.textContent = value >= 1000
          ? value.toLocaleString('es-MX')
          : String(value);

        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          el.textContent = target >= 1000
            ? target.toLocaleString('es-MX')
            : String(target);
          el.classList.add('animate-count-up');
        }
      };
      requestAnimationFrame(tick);
    }, delay);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        counters.forEach(animateCounter);
        observer.disconnect();
      }
    });
  }, { threshold: 0.5 });

  observer.observe(statsSection);
}

// ─── BACK TO TOP ─────────────────────────────────────────────────────────────

/**
 * Muestra/oculta el botón "volver arriba" según el scroll.
 */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  const toggle = () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', toggle, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ─── NAVBAR SCROLL STATE ─────────────────────────────────────────────────────

/**
 * Añade clase .scrolled al navbar cuando el usuario hace scroll.
 */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Run once on load
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

/**
 * Dispara el IntersectionObserver de reveal sobre los hijos de un contenedor.
 * Complementa el observer global de nav.js para elementos renderizados tras el DOMContentLoaded.
 */
function _triggerReveal(container) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  // Observe the container itself if it has .stagger-children
  if (container.classList.contains('stagger-children')) {
    observer.observe(container);
  }

  // Also observe any .reveal children
  container.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}
