/**
 * product.js — Página de detalle de producto StrikeStore
 * Depende de: utils.js (Utils), data.js (Products), auth.js (Auth)
 */

// ── Estado ───────────────────────────────────────────────────────────────────

let currentProduct = null;

// ── IntersectionObserver para reveals dinámicos ───────────────────────────────

const productRevealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      productRevealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

// ── Inicialización ────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  const params    = new URLSearchParams(window.location.search);
  const productId = params.get('id');

  if (!productId) {
    showNotFound();
    return;
  }

  loadProduct(productId);
  setupBackToTop();
  setupNavbarScroll();

  // Observar el header de la sección related (estático)
  document.querySelectorAll('#related-section .reveal').forEach(el => {
    productRevealObserver.observe(el);
  });
});

// ── Carga del producto ────────────────────────────────────────────────────────

function loadProduct(id) {
  const product = Products.getById(id);

  if (!product) {
    showNotFound();
    return;
  }

  currentProduct = product;

  // Actualizar meta tags
  document.getElementById('page-title').textContent = `${product.name} | StrikeStore`;
  document.getElementById('meta-description').setAttribute('content', product.description);
  document.getElementById('breadcrumb-product').textContent = Utils.truncate(product.name, 40);

  // Open Graph dinámico
  const ogTitle = document.getElementById('og-title');
  const ogDesc  = document.getElementById('og-description');
  if (ogTitle) ogTitle.setAttribute('content', `${product.name} | StrikeStore`);
  if (ogDesc)  ogDesc.setAttribute('content', product.description);

  // Actualizar breadcrumb a su categoría como enlace
  updateBreadcrumbCategory(product);

  renderProduct(product);
  renderRelated(product);
}

function updateBreadcrumbCategory(product) {
  // Añadir la categoría al breadcrumb entre Catálogo y el nombre del producto
  const breadcrumb = document.querySelector('.breadcrumb');
  if (!breadcrumb) return;

  const catLink = document.createElement('a');
  catLink.href      = `catalogo.html?categoria=${product.category}`;
  catLink.className = 'breadcrumb-item';
  catLink.textContent = Utils.getCategoryLabel(product.category);

  const sep = document.createElement('span');
  sep.className   = 'breadcrumb-sep';
  sep.innerHTML   = '<i class="fa-solid fa-chevron-right"></i>';

  const productSpan = document.getElementById('breadcrumb-product');
  breadcrumb.insertBefore(sep, productSpan);
  breadcrumb.insertBefore(catLink, sep);
}

// ── Render del producto ───────────────────────────────────────────────────────

function renderProduct(product) {
  const discount = product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  // Variaciones de gradiente para thumbnails
  const thumbGradients = buildThumbGradients(product);

  // Badge principal
  const badgeHTML = product.badge
    ? `<span class="badge badge-${product.badge}" style="
        position:absolute;
        top:1.25rem;
        left:1.25rem;
        font-size:0.8rem;
        padding:0.375rem 0.875rem;
        z-index:2;
        box-shadow:0 4px 16px rgba(0,0,0,0.25);
      ">${getBadgeLabel(product.badge)}</span>`
    : '';

  // Precios
  const discountHTML = discount > 0
    ? `<span class="product-detail__original-price">${Utils.formatPrice(product.originalPrice)}</span>
       <span class="product-detail__discount-badge">-${discount}%</span>`
    : '';

  // Stock
  const stockHTML = buildStockHTML(product);

  // Características
  const featuresHTML = product.features && product.features.length > 0
    ? product.features.map(f => `
        <li class="product-detail__feature">
          <i class="fa-solid fa-circle-check" style="color:var(--color-primary)" aria-hidden="true"></i>
          <span>${f}</span>
        </li>
      `).join('')
    : '<li class="product-detail__feature"><i class="fa-solid fa-circle-check" aria-hidden="true"></i><span>Alta calidad y durabilidad</span></li>';

  // Botones de acción
  const actionsHTML = Auth.isAuthenticated()
    ? `<button class="btn btn-primary btn-xl" onclick="addToCart()" ${product.stock === 0 ? 'disabled aria-disabled="true"' : ''}>
         <i class="fa-solid fa-cart-plus" aria-hidden="true"></i>
         ${product.stock === 0 ? 'Sin Stock' : 'Agregar al Carrito'}
       </button>`
    : `<a href="login.html?redirect=${encodeURIComponent('producto.html?id=' + product.id)}" class="btn btn-primary btn-xl">
         <i class="fa-solid fa-lock" aria-hidden="true"></i>
         Inicia Sesión para Comprar
       </a>`;

  const html = `
    <div class="product-detail reveal-slow">

      <!-- ── Columna imagen ──────────────────────────────────── -->
      <div class="product-detail__image-col" style="display:flex; flex-direction:column; gap:1rem">

        <!-- Imagen principal -->
        <div
          class="product-detail__image"
          id="main-product-image"
          style="background:${product.gradient}"
          aria-label="Imagen de ${product.name}"
        >
          ${badgeHTML}
          ${discount > 0
            ? `<div style="
                position:absolute;
                bottom:1.25rem;
                right:1.25rem;
                background:var(--color-primary);
                color:#fff;
                font-size:0.9rem;
                font-weight:800;
                padding:0.375rem 0.875rem;
                border-radius:var(--radius-full);
                box-shadow:0 4px 16px rgba(222,58,13,0.45);
                z-index:2;
              ">-${discount}%</div>`
            : ''}
          <i class="${product.icon} product-detail__icon" aria-hidden="true" style="font-size:8rem; color:rgba(255,255,255,0.9); filter:drop-shadow(0 8px 24px rgba(0,0,0,0.35))"></i>
        </div>

        <!-- Thumbnails -->
        <div class="product-detail__thumbnails" role="list" aria-label="Vistas del producto">
          ${thumbGradients.map((g, i) => `
            <div
              class="product-detail__thumb${i === 0 ? ' active' : ''}"
              style="background:${g.gradient}"
              role="listitem"
              onclick="switchThumb(this, '${g.gradient}')"
              tabindex="0"
              aria-label="Vista ${i + 1}"
              onkeydown="if(event.key==='Enter'||event.key===' ')switchThumb(this,'${g.gradient}')"
            >
              <i class="${product.icon}" aria-hidden="true"></i>
            </div>
          `).join('')}
        </div>

        <!-- Compartir -->
        <div style="display:flex; align-items:center; gap:0.5rem; padding-top:0.5rem">
          <span style="font-size:0.8rem; color:var(--color-gray-400); font-weight:500">Compartir:</span>
          <button
            class="social-link"
            onclick="shareProduct('facebook')"
            aria-label="Compartir en Facebook"
            title="Compartir en Facebook"
          ><i class="fa-brands fa-facebook-f"></i></button>
          <button
            class="social-link"
            onclick="shareProduct('twitter')"
            aria-label="Compartir en Twitter"
            title="Compartir en Twitter"
          ><i class="fa-brands fa-x-twitter"></i></button>
          <button
            class="social-link"
            onclick="shareProduct('whatsapp')"
            aria-label="Compartir por WhatsApp"
            title="Compartir por WhatsApp"
          ><i class="fa-brands fa-whatsapp"></i></button>
          <button
            class="social-link"
            onclick="copyProductLink()"
            aria-label="Copiar enlace"
            title="Copiar enlace del producto"
          ><i class="fa-solid fa-link"></i></button>
        </div>

      </div>

      <!-- ── Columna información ─────────────────────────────── -->
      <div class="product-detail__info">

        <!-- Categoría + marca -->
        <div style="display:flex; align-items:center; gap:0.75rem; flex-wrap:wrap">
          <a
            href="catalogo.html?categoria=${product.category}"
            class="tag tag-category"
            style="text-decoration:none"
            aria-label="Ver categoría ${Utils.getCategoryLabel(product.category)}"
          >
            <i class="${Utils.getCategoryIcon(product.category)}" aria-hidden="true"></i>
            ${Utils.getCategoryLabel(product.category)}
          </a>
          <span class="product-detail__brand">
            <i class="fa-solid fa-tag" style="font-size:0.8em; color:var(--color-gray-400)" aria-hidden="true"></i>
            ${product.brand}
          </span>
          <span style="font-size:0.75rem; color:var(--color-gray-400)">SKU: ${product.sku}</span>
        </div>

        <!-- Nombre -->
        <h1 class="product-detail__name">${product.name}</h1>

        <!-- Rating -->
        <div class="product-detail__stars">
          ${Utils.renderStars(product.rating)}
          <span class="rating-value" style="font-weight:700; font-size:0.95rem; color:var(--color-dark)">${product.rating}</span>
          <span style="color:var(--color-gray-400); font-size:0.875rem">(${product.reviewCount} reseñas)</span>
        </div>

        <!-- Precio -->
        <div class="product-detail__price-section">
          <div style="display:flex; align-items:baseline; gap:0.5rem; flex-wrap:wrap; margin-bottom:0.5rem">
            <span class="product-detail__current-price">${Utils.formatPrice(product.price)}</span>
            ${discountHTML}
          </div>
          ${discount > 0
            ? `<p style="font-size:0.8rem; color:var(--color-gray-600)">
                Ahorras <strong style="color:#16a34a">${Utils.formatPrice(product.originalPrice - product.price)}</strong> con esta oferta
               </p>`
            : ''}
        </div>

        <!-- Descripción corta -->
        <p style="font-size:0.95rem; color:var(--color-gray-600); line-height:1.7">
          ${product.description}
        </p>

        <!-- Descripción completa (expandible) -->
        <details style="border:1px solid var(--color-gray-200); border-radius:var(--radius-md); overflow:hidden">
          <summary style="
            padding:0.875rem 1.25rem;
            font-weight:600;
            color:var(--color-dark);
            cursor:pointer;
            font-size:0.9rem;
            list-style:none;
            display:flex;
            align-items:center;
            justify-content:space-between;
            background:var(--color-gray-50);
          ">
            <span><i class="fa-solid fa-align-left" style="margin-right:0.5rem; color:var(--color-secondary)" aria-hidden="true"></i>Descripción completa</span>
            <i class="fa-solid fa-chevron-down" style="font-size:0.8rem; color:var(--color-gray-400); transition:transform 0.3s" aria-hidden="true"></i>
          </summary>
          <p style="padding:1.25rem; font-size:0.9rem; color:var(--color-gray-600); line-height:1.75; border-top:1px solid var(--color-gray-200); margin:0">
            ${product.fullDescription || product.description}
          </p>
        </details>

        <!-- Características -->
        <div class="product-detail__features">
          <h3 style="font-family:var(--font-display); font-size:1.1rem; letter-spacing:0.02em; color:var(--color-black); margin-bottom:0.75rem">
            <i class="fa-solid fa-list-check" style="color:var(--color-secondary); margin-right:0.5rem" aria-hidden="true"></i>
            Características
          </h3>
          <ul style="display:flex; flex-direction:column; gap:0.5rem; list-style:none; padding:0; margin:0">
            ${featuresHTML}
          </ul>
        </div>

        <!-- Stock -->
        ${stockHTML}

        <!-- Acciones -->
        <div class="product-detail__actions">
          ${actionsHTML}
          <a href="catalogo.html" class="btn btn-outline btn-xl">
            <i class="fa-solid fa-arrow-left" aria-hidden="true"></i>
            Volver al Catálogo
          </a>
        </div>

        <!-- Garantías -->
        <div class="product-detail__guarantees" style="
          display:grid;
          grid-template-columns:repeat(3,1fr);
          gap:0.75rem;
          padding:1.25rem;
          background:var(--color-gray-50);
          border-radius:var(--radius-lg);
          border:1px solid var(--color-gray-100);
        ">
          <div style="display:flex; flex-direction:column; align-items:center; gap:0.4rem; text-align:center">
            <div style="
              width:40px; height:40px;
              background:rgba(222,58,13,0.08);
              border-radius:var(--radius-md);
              display:flex; align-items:center; justify-content:center;
              font-size:1.1rem; color:var(--color-primary);
            "><i class="fa-solid fa-truck" aria-hidden="true"></i></div>
            <span style="font-size:0.75rem; font-weight:600; color:var(--color-dark)">Envío Gratis</span>
            <span style="font-size:0.68rem; color:var(--color-gray-400)">En pedidos +$150</span>
          </div>
          <div style="display:flex; flex-direction:column; align-items:center; gap:0.4rem; text-align:center">
            <div style="
              width:40px; height:40px;
              background:rgba(17,70,100,0.08);
              border-radius:var(--radius-md);
              display:flex; align-items:center; justify-content:center;
              font-size:1.1rem; color:var(--color-blue);
            "><i class="fa-solid fa-shield-halved" aria-hidden="true"></i></div>
            <span style="font-size:0.75rem; font-weight:600; color:var(--color-dark)">Garantía 1 Año</span>
            <span style="font-size:0.68rem; color:var(--color-gray-400)">En todos los productos</span>
          </div>
          <div style="display:flex; flex-direction:column; align-items:center; gap:0.4rem; text-align:center">
            <div style="
              width:40px; height:40px;
              background:rgba(22,163,74,0.08);
              border-radius:var(--radius-md);
              display:flex; align-items:center; justify-content:center;
              font-size:1.1rem; color:#16a34a;
            "><i class="fa-solid fa-rotate-left" aria-hidden="true"></i></div>
            <span style="font-size:0.75rem; font-weight:600; color:var(--color-dark)">30 Días</span>
            <span style="font-size:0.68rem; color:var(--color-gray-400)">Devolución fácil</span>
          </div>
        </div>

      </div>
    </div>
  `;

  document.getElementById('loading-state').style.display  = 'none';
  const contentEl = document.getElementById('product-content');
  contentEl.innerHTML = html;
  contentEl.style.display = 'block';

  // Observar los elementos reveal del producto
  contentEl.querySelectorAll('.reveal, .reveal-slow').forEach(el => {
    productRevealObserver.observe(el);
  });
}

// ── Thumbnails ────────────────────────────────────────────────────────────────

function buildThumbGradients(product) {
  // Variaciones visuales del gradiente del producto
  const base = product.gradient;

  // Extraer colores del gradiente base y crear 3 variaciones
  const variations = [
    { gradient: base },
    { gradient: base.replace('135deg', '225deg') },
    { gradient: base.replace('0%', '20%').replace('100%', '80%') },
  ];

  return variations;
}

function switchThumb(el, gradient) {
  // Actualizar imagen principal
  const mainImg = document.getElementById('main-product-image');
  if (mainImg) {
    mainImg.style.background = gradient;
  }

  // Actualizar active
  document.querySelectorAll('.product-detail__thumb').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
}

// ── Stock HTML ────────────────────────────────────────────────────────────────

function buildStockHTML(product) {
  if (product.stock === 0) {
    return `
      <div style="
        display:flex; align-items:center; gap:0.625rem;
        padding:0.875rem 1.25rem;
        background:#fef2f2;
        border:1px solid #fecaca;
        border-radius:var(--radius-md);
        font-size:0.9rem;
        font-weight:600;
        color:#dc2626;
      ">
        <i class="fa-solid fa-circle-xmark" aria-hidden="true"></i>
        <span>Sin stock — Producto agotado</span>
      </div>
    `;
  }

  if (product.stock < 5) {
    return `
      <div style="
        display:flex; align-items:center; gap:0.625rem;
        padding:0.875rem 1.25rem;
        background:#fff7ed;
        border:1px solid #fed7aa;
        border-radius:var(--radius-md);
        font-size:0.9rem;
        font-weight:600;
        color:#c2410c;
      ">
        <i class="fa-solid fa-fire-flame-curved" aria-hidden="true"></i>
        <span>¡Solo quedan <strong>${product.stock} unidades</strong>! Compra ahora.</span>
      </div>
    `;
  }

  return `
    <div style="
      display:flex; align-items:center; gap:0.625rem;
      padding:0.875rem 1.25rem;
      background:#f0fdf4;
      border:1px solid #bbf7d0;
      border-radius:var(--radius-md);
      font-size:0.9rem;
      font-weight:600;
      color:#15803d;
    ">
      <i class="fa-solid fa-warehouse" aria-hidden="true"></i>
      <span>En stock — <strong>${product.stock} disponibles</strong></span>
    </div>
  `;
}

// ── Productos relacionados ────────────────────────────────────────────────────

function renderRelated(product) {
  const related = Products.getByCategory(product.category)
    .filter(p => p.id !== product.id)
    .slice(0, 4);

  if (related.length === 0) return;

  // Actualizar el subtítulo de la sección
  const subtitleEl = document.getElementById('related-subtitle');
  if (subtitleEl) {
    subtitleEl.textContent = `Más productos de la categoría ${Utils.getCategoryLabel(product.category)}.`;
  }

  const relatedSection = document.getElementById('related-section');
  const relatedGrid    = document.getElementById('related-grid');

  relatedSection.style.display = 'block';
  relatedGrid.innerHTML = related.map((p, idx) => renderRelatedCard(p, idx)).join('');

  // Observar reveals
  relatedGrid.querySelectorAll('.reveal').forEach(el => {
    productRevealObserver.observe(el);
  });
}

function renderRelatedCard(product, idx = 0) {
  const discount = product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  const delay = idx * 80;

  return `
    <article
      class="product-card reveal"
      role="listitem"
      style="transition-delay:${delay}ms; cursor:pointer"
      onclick="window.location.href='producto.html?id=${product.id}'"
      aria-label="${product.name} — ${Utils.formatPrice(product.price)}"
    >
      <div class="product-card__image" style="background:${product.gradient}; position:relative">
        ${product.badge
          ? `<span class="product-card__badge badge badge-${product.badge}">${getBadgeLabel(product.badge)}</span>`
          : ''}
        <div class="product-card__image-inner">
          <i class="${product.icon}" aria-hidden="true"></i>
        </div>
        ${discount > 0
          ? `<div style="
              position:absolute; bottom:0.75rem; right:0.75rem;
              background:var(--color-primary); color:#fff;
              font-size:0.75rem; font-weight:800;
              padding:0.25rem 0.6rem; border-radius:var(--radius-full);
              box-shadow:0 2px 8px rgba(222,58,13,0.4);
            ">-${discount}%</div>`
          : ''}
      </div>

      <div class="product-card__body">
        <span class="product-card__category tag tag-category">
          ${Utils.getCategoryLabel(product.category)}
        </span>
        <h3 class="product-card__name">${product.name}</h3>
        <p class="product-card__brand">
          <i class="fa-solid fa-tag" style="font-size:0.7rem; color:var(--color-gray-400)" aria-hidden="true"></i>
          ${product.brand}
        </p>
        <div class="product-card__stars">
          ${Utils.renderStars(product.rating)}
          <span class="product-card__rating-count">(${product.reviewCount})</span>
        </div>
        <div class="product-card__price">
          <div class="product-card__price-group">
            <span class="product-card__current-price">${Utils.formatPrice(product.price)}</span>
            ${product.originalPrice > product.price
              ? `<span class="product-card__original-price">${Utils.formatPrice(product.originalPrice)}</span>`
              : ''}
          </div>
          <button
            class="btn btn-primary btn-sm"
            onclick="event.stopPropagation(); window.location.href='producto.html?id=${product.id}'"
            aria-label="Ver detalle de ${product.name}"
          >
            <i class="fa-solid fa-eye" aria-hidden="true"></i>
          </button>
        </div>
      </div>

      <div class="product-card__actions">
        <button
          class="btn btn-primary"
          onclick="event.stopPropagation(); window.location.href='producto.html?id=${product.id}'"
        >
          <i class="fa-solid fa-eye" aria-hidden="true"></i>
          Ver Detalle
        </button>
      </div>
    </article>
  `;
}

// ── Acciones del usuario ──────────────────────────────────────────────────────

function addToCart() {
  if (!currentProduct) return;

  if (!Auth.isAuthenticated()) {
    Utils.showToast('Inicia sesión para agregar productos al carrito', 'warning');
    return;
  }

  if (currentProduct.stock === 0) {
    Utils.showToast('Este producto está agotado', 'error');
    return;
  }

  Utils.showToast(
    `${Utils.truncate(currentProduct.name, 35)} agregado al carrito`,
    'success'
  );
}

function shareProduct(platform) {
  const url   = encodeURIComponent(window.location.href);
  const title = encodeURIComponent(currentProduct ? currentProduct.name : 'Producto StrikeStore');
  const text  = encodeURIComponent(
    currentProduct
      ? `${currentProduct.name} en StrikeStore — ${Utils.formatPrice(currentProduct.price)}`
      : 'Equipo de softball en StrikeStore'
  );

  const links = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    twitter:  `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
    whatsapp: `https://wa.me/?text=${text}%20${url}`
  };

  if (links[platform]) {
    window.open(links[platform], '_blank', 'width=600,height=450,noopener,noreferrer');
  }
}

function copyProductLink() {
  navigator.clipboard.writeText(window.location.href)
    .then(() => Utils.showToast('Enlace copiado al portapapeles', 'success'))
    .catch(() => Utils.showToast('No se pudo copiar el enlace', 'error'));
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getBadgeLabel(badge) {
  const labels = { new: 'Nuevo', sale: 'Oferta', featured: 'Destacado' };
  return labels[badge] || badge;
}

function showNotFound() {
  document.getElementById('loading-state').style.display = 'none';
  document.getElementById('not-found').style.display     = 'block';
}

// ── Back to Top ───────────────────────────────────────────────────────────────

function setupBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ── Navbar scroll effect ──────────────────────────────────────────────────────

function setupNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });
}
