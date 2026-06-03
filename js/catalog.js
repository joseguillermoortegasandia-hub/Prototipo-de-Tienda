/**
 * catalog.js — Lógica del catálogo de productos de StrikeStore
 * Depende de: utils.js (Utils), data.js (Products), auth.js (Auth)
 */

// ── Estado del catálogo ──────────────────────────────────────────────────────

const catalogState = {
  allProducts:       [],
  filteredProducts:  [],
  activeCategory:    'all',
  searchQuery:       '',
  sortBy:            'default',
  specialFilter:     null   // 'sale' | 'new' | 'featured' | null
};

// ── IntersectionObserver para reveals dinámicos ───────────────────────────────

const catalogRevealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      catalogRevealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

// ── Inicialización ────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  // Leer parámetros de URL antes de cargar productos
  initFromURL();

  // Cargar catálogo desde Products
  catalogState.allProducts = Products.getAll();

  // Renderizar tabs y primer lote de productos
  renderFilterTabs();
  applyFilters();
  setupEventListeners();
  setupBackToTop();
  setupNavbarScroll();

  // Observar elementos estáticos con .reveal en el header
  document.querySelectorAll('.catalog-header .reveal, .catalog-header .reveal-down').forEach(el => {
    catalogRevealObserver.observe(el);
  });
});

// ── URL params ───────────────────────────────────────────────────────────────

function initFromURL() {
  const params = new URLSearchParams(window.location.search);
  const cat    = params.get('categoria');
  const tipo   = params.get('tipo');    // 'sale' | 'new' | 'featured'

  if (cat)  catalogState.activeCategory = cat;
  if (tipo) catalogState.specialFilter  = tipo;
}

// ── Filter Tabs ───────────────────────────────────────────────────────────────

function renderFilterTabs() {
  const container = document.getElementById('filter-tabs');
  if (!container) return;

  const all      = catalogState.allProducts;
  const cats     = Products.getCategories();

  // Construir botones
  const buttons = [];

  // Botón "Todos"
  const allCount = all.length;
  buttons.push(buildFilterBtn('all', 'Todos', allCount, catalogState.activeCategory === 'all'));

  // Botón por tipo especial
  if (catalogState.specialFilter) {
    const label = { sale: 'Ofertas', new: 'Nuevos', featured: 'Destacados' }[catalogState.specialFilter] || 'Especial';
    const count = getSpecialCount(catalogState.specialFilter);
    buttons.push(buildFilterBtn(`__${catalogState.specialFilter}`, label, count, false));
  }

  // Botones por categoría
  cats.forEach(cat => {
    const count  = all.filter(p => p.category === cat).length;
    const active = catalogState.activeCategory === cat;
    buttons.push(buildFilterBtn(cat, Utils.getCategoryLabel(cat), count, active));
  });

  container.innerHTML = buttons.join('');

  // Añadir listeners
  container.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.dataset.category;
      if (cat.startsWith('__')) {
        // Tipo especial
        const tipo = cat.replace('__', '');
        catalogState.specialFilter  = tipo;
        catalogState.activeCategory = 'all';
      } else {
        catalogState.specialFilter  = null;
        setCategory(cat);
      }
      applyFilters();
      updateFilterTabsActive();
    });
  });
}

function buildFilterBtn(cat, label, count, active) {
  const icon = cat === 'all' ? 'fa-solid fa-layer-group' : Utils.getCategoryIcon(cat);
  return `
    <button
      class="filter-btn${active ? ' active' : ''}"
      data-category="${cat}"
      role="tab"
      aria-selected="${active}"
      aria-label="${label} (${count} productos)"
    >
      <i class="${icon}" aria-hidden="true"></i>
      ${label}
      <span style="
        background:${active ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.06)'};
        color:inherit;
        font-size:0.7rem;
        font-weight:700;
        padding:1px 6px;
        border-radius:999px;
        min-width:18px;
        text-align:center;
      ">${count}</span>
    </button>
  `;
}

function updateFilterTabsActive() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    const cat    = btn.dataset.category;
    let isActive = false;

    if (catalogState.specialFilter && cat === `__${catalogState.specialFilter}`) {
      isActive = true;
    } else if (!catalogState.specialFilter && cat === catalogState.activeCategory) {
      isActive = true;
    }

    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-selected', isActive);

    // Actualizar color del contador interno
    const countBadge = btn.querySelector('span');
    if (countBadge) {
      countBadge.style.background = isActive ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.06)';
    }
  });
}

// ── Setters de estado ─────────────────────────────────────────────────────────

function setCategory(cat) {
  catalogState.activeCategory = cat;
  updateFilterTabsActive();
  applyFilters();

  // Actualizar URL sin recargar
  const url = new URL(window.location.href);
  if (cat === 'all') {
    url.searchParams.delete('categoria');
  } else {
    url.searchParams.set('categoria', cat);
  }
  if (catalogState.specialFilter) {
    url.searchParams.set('tipo', catalogState.specialFilter);
  } else {
    url.searchParams.delete('tipo');
  }
  history.pushState({ cat, tipo: catalogState.specialFilter }, '', url.toString());
}

// ── Filtros y ordenamiento ────────────────────────────────────────────────────

function applyFilters() {
  let products = [...catalogState.allProducts];

  // 1) Filtro especial (sale/new/featured)
  if (catalogState.specialFilter) {
    products = products.filter(p => p.badge === catalogState.specialFilter);
  }

  // 2) Filtro por categoría
  if (catalogState.activeCategory !== 'all' && !catalogState.specialFilter) {
    products = products.filter(p => p.category === catalogState.activeCategory);
  }

  // 3) Búsqueda de texto
  if (catalogState.searchQuery) {
    const q = catalogState.searchQuery.toLowerCase();
    products = products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      (p.fullDescription && p.fullDescription.toLowerCase().includes(q)) ||
      Utils.getCategoryLabel(p.category).toLowerCase().includes(q)
    );
  }

  // 4) Ordenamiento
  switch (catalogState.sortBy) {
    case 'price-asc':
      products.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      products.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      products.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
      break;
    case 'name':
      products.sort((a, b) => a.name.localeCompare(b.name, 'es'));
      break;
    case 'new': {
      // Nuevos primero, luego resto por fecha de creación
      const newOnes  = products.filter(p => p.badge === 'new');
      const rest     = products.filter(p => p.badge !== 'new');
      rest.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      products = [...newOnes, ...rest];
      break;
    }
    default:
      // Sin ordenamiento especial — mantener orden original
      break;
  }

  catalogState.filteredProducts = products;
  renderProducts();
  updateCount();
}

// ── Renderizado de productos ──────────────────────────────────────────────────

function renderProducts() {
  const skeleton  = document.getElementById('loading-skeleton');
  const grid      = document.getElementById('products-grid');
  const empty     = document.getElementById('no-products');

  // Ocultar skeleton siempre
  if (skeleton) skeleton.style.display = 'none';

  if (catalogState.filteredProducts.length === 0) {
    grid.style.display  = 'none';
    empty.style.display = 'flex';
    return;
  }

  empty.style.display = 'none';
  grid.style.display  = '';

  grid.innerHTML = catalogState.filteredProducts
    .map((p, idx) => renderProductCard(p, idx))
    .join('');

  // Re-observar los elementos reveal recién renderizados
  grid.querySelectorAll('.reveal').forEach(el => {
    el.classList.remove('visible');
    catalogRevealObserver.observe(el);
  });
}

function renderProductCard(product, idx = 0) {
  const discount = product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  const badgeHTML = product.badge
    ? `<span class="product-card__badge badge badge-${product.badge}">${getBadgeLabel(product.badge)}</span>`
    : '';

  const discountTag = discount > 0
    ? `<div class="discount-tag" style="
        position:absolute;
        bottom:0.75rem;
        right:0.75rem;
        background:var(--color-primary);
        color:#fff;
        font-size:0.75rem;
        font-weight:800;
        padding:0.25rem 0.6rem;
        border-radius:var(--radius-full);
        letter-spacing:0.03em;
        box-shadow:0 2px 8px rgba(222,58,13,0.4);
      ">-${discount}%</div>`
    : '';

  const originalPriceHTML = product.originalPrice > product.price
    ? `<span class="product-card__original-price">${Utils.formatPrice(product.originalPrice)}</span>`
    : '';

  const stockWarning = product.stock > 0 && product.stock < 5
    ? `<span style="
        font-size:0.7rem;
        color:#ef4444;
        font-weight:600;
        display:flex;
        align-items:center;
        gap:3px;
        margin-top:2px;
      "><i class="fa-solid fa-fire-flame-curved"></i> ¡Solo quedan ${product.stock}!</span>`
    : '';

  const outOfStock = product.stock === 0
    ? `<span style="
        font-size:0.7rem;
        color:var(--color-gray-400);
        font-weight:600;
        display:flex;
        align-items:center;
        gap:3px;
        margin-top:2px;
      "><i class="fa-solid fa-circle-xmark"></i> Sin stock</span>`
    : '';

  // Delay de animación según índice (stagger visual)
  const delay = Math.min(idx * 50, 500);

  return `
    <article
      class="product-card reveal"
      role="listitem"
      style="transition-delay:${delay}ms; cursor:pointer"
      onclick="viewProduct('${product.id}')"
      aria-label="${product.name} — ${Utils.formatPrice(product.price)}"
    >
      <!-- Imagen / icono con gradiente -->
      <div
        class="product-card__image"
        style="background:${product.gradient}; position:relative"
      >
        ${badgeHTML}
        <div class="product-card__image-inner">
          <i class="${product.icon}" aria-hidden="true"></i>
        </div>
        ${discountTag}
      </div>

      <!-- Cuerpo de la card -->
      <div class="product-card__body">

        <div style="display:flex; align-items:center; justify-content:space-between; gap:0.5rem">
          <span class="product-card__category tag tag-category">
            ${Utils.getCategoryLabel(product.category)}
          </span>
          ${product.stock === 0
            ? `<span class="badge badge-dark" style="font-size:0.65rem">Sin Stock</span>`
            : product.stock < 5
              ? `<span class="badge" style="background:#fef2f2;color:#ef4444;font-size:0.65rem">Pocas unidades</span>`
              : ''}
        </div>

        <h3 class="product-card__name">${product.name}</h3>

        <p class="product-card__brand" style="display:flex; align-items:center; gap:0.4rem;">
          <i class="fa-solid fa-tag" style="font-size:0.7rem; color:var(--color-gray-400)" aria-hidden="true"></i>
          ${product.brand}
        </p>

        <div class="product-card__stars">
          ${Utils.renderStars(product.rating)}
          <span class="product-card__rating-count">(${product.reviewCount})</span>
        </div>

        <div class="product-card__price">
          <div class="product-card__price-group" style="flex-direction:column; align-items:flex-start; gap:2px">
            <div style="display:flex; align-items:baseline; gap:0.4rem">
              <span class="product-card__current-price">${Utils.formatPrice(product.price)}</span>
              ${originalPriceHTML}
            </div>
            ${stockWarning}
            ${outOfStock}
          </div>
          <button
            class="btn btn-primary btn-sm"
            onclick="event.stopPropagation(); viewProduct('${product.id}')"
            aria-label="Ver detalle de ${product.name}"
            ${product.stock === 0 ? 'style="opacity:0.5"' : ''}
          >
            <i class="fa-solid fa-eye" aria-hidden="true"></i>
            <span class="sr-only">Ver</span>
          </button>
        </div>

      </div>

      <!-- Acciones rápidas en hover -->
      <div class="product-card__actions">
        <button
          class="btn btn-primary"
          onclick="event.stopPropagation(); viewProduct('${product.id}')"
          ${product.stock === 0 ? 'disabled aria-disabled="true"' : ''}
        >
          <i class="fa-solid fa-eye" aria-hidden="true"></i>
          Ver Detalle
        </button>
        <a
          href="catalogo.html?categoria=${product.category}"
          class="btn btn-outline btn-icon product-card__detail-btn"
          onclick="event.stopPropagation()"
          title="Ver categoría: ${Utils.getCategoryLabel(product.category)}"
          aria-label="Ver categoría ${Utils.getCategoryLabel(product.category)}"
          style="border-radius:var(--radius-md)"
        >
          <i class="${Utils.getCategoryIcon(product.category)}" aria-hidden="true"></i>
        </a>
      </div>

    </article>
  `;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getBadgeLabel(badge) {
  const labels = { new: 'Nuevo', sale: 'Oferta', featured: 'Destacado' };
  return labels[badge] || badge;
}

function getSpecialCount(tipo) {
  const map = { sale: 'getSaleItems', new: 'getNewArrivals', featured: 'getFeatured' };
  return map[tipo] ? Products[map[tipo]]().length : 0;
}

function updateCount() {
  const el = document.getElementById('products-count');
  if (!el) return;
  const n   = catalogState.filteredProducts.length;
  const tot = catalogState.allProducts.length;
  el.innerHTML = `<strong>${n}</strong> de ${tot} producto${tot !== 1 ? 's' : ''}`;
}

function clearFilters() {
  catalogState.activeCategory  = 'all';
  catalogState.searchQuery     = '';
  catalogState.sortBy          = 'default';
  catalogState.specialFilter   = null;

  // Resetear UI
  const searchInput = document.getElementById('search-input');
  if (searchInput) searchInput.value = '';

  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) sortSelect.value = 'default';

  updateFilterTabsActive();
  applyFilters();

  // Limpiar URL
  history.pushState({}, '', window.location.pathname);
}

function viewProduct(id) {
  window.location.href = `producto.html?id=${id}`;
}

// ── Event Listeners ───────────────────────────────────────────────────────────

function setupEventListeners() {
  // Búsqueda con debounce
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    const debouncedSearch = Utils.debounce((e) => {
      catalogState.searchQuery = e.target.value.trim();
      applyFilters();
    }, 300);
    searchInput.addEventListener('input', debouncedSearch);

    // Limpiar al presionar Escape
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        searchInput.value = '';
        catalogState.searchQuery = '';
        applyFilters();
        searchInput.blur();
      }
    });
  }

  // Selector de ordenamiento
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      catalogState.sortBy = e.target.value;
      applyFilters();
    });
  }

  // Manejar navegación del historial (botón atrás/adelante)
  window.addEventListener('popstate', () => {
    initFromURL();
    renderFilterTabs();
    applyFilters();
  });
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
