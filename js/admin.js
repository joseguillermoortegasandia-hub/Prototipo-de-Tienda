/**
 * admin.js — Panel de Administración StrikeStore
 * Depende de: utils.js, data.js, auth.js, nav.js
 */

document.addEventListener('DOMContentLoaded', () => {
  Auth.requireAdmin();

  initAdmin();
  setupAdminUser();
  loadDashboard();
  setupProductForm();
  setupAdminFilters();

  // Fecha actual en el dashboard
  document.getElementById('current-date').textContent = Utils.formatDate(new Date().toISOString());
});

// ── Estado global ──────────────────────────────────────────────────────────
let productToDelete = null;
let isEditMode = false;

// ═══════════════════════════════════════════════════════════════════════
// INICIALIZACIÓN
// ═══════════════════════════════════════════════════════════════════════

function initAdmin() {
  // Llenar opciones del filtro de categorías
  const catFilter = document.getElementById('admin-filter-cat');
  if (!catFilter) return;

  const categories = Products.getCategories();
  categories.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = Utils.getCategoryLabel(cat);
    catFilter.appendChild(opt);
  });
}

function setupAdminUser() {
  const user = Auth.getCurrentUser();
  if (!user) return;

  const initials = Utils.getInitials(user.name);

  // Avatar en sidebar
  const avatarEl = document.getElementById('admin-user-avatar');
  if (avatarEl) {
    avatarEl.innerHTML = `<div class="admin-avatar-circle">${initials}</div>`;
  }

  // Info nombre / rol
  const infoEl = document.getElementById('admin-user-info');
  if (infoEl) {
    infoEl.innerHTML = `
      <div class="name">${user.name}</div>
      <div class="role">Administrador</div>
    `;
  }
}

// ═══════════════════════════════════════════════════════════════════════
// NAVEGACIÓN DE SECCIONES
// ═══════════════════════════════════════════════════════════════════════

function showSection(section) {
  // Ocultar todas las secciones
  document.querySelectorAll('.admin-section').forEach(s => s.style.display = 'none');

  // Mostrar la sección activa
  const target = document.getElementById(`section-${section}`);
  if (target) target.style.display = 'block';

  // Actualizar estado activo en nav
  document.querySelectorAll('.admin-nav-item[data-section]').forEach(item => {
    item.classList.toggle('active', item.dataset.section === section);
  });

  // Acciones según sección
  if (section === 'productos') loadProductsTable();
  if (section === 'dashboard') loadDashboard();
  if (section === 'nuevo-producto' && !isEditMode) {
    resetForm();
    document.getElementById('product-form-title').textContent = 'Nuevo Producto';
    document.getElementById('product-submit-btn').innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Guardar Producto';
  }

  // Scroll al inicio
  const main = document.getElementById('admin-main');
  if (main) main.scrollTop = 0;
}

// ═══════════════════════════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════════════════════════

function loadDashboard() {
  const products = Products.getAll();

  // Stat cards
  const stats = [
    {
      label: 'Total Productos',
      value: products.length,
      icon: 'fa-solid fa-box',
      wrap: 'primary',
      change: `${products.length} en inventario`,
      changeClass: 'up'
    },
    {
      label: 'Categorías',
      value: Products.getCategories().length,
      icon: 'fa-solid fa-tags',
      wrap: 'blue',
      change: '12 categorías activas',
      changeClass: ''
    },
    {
      label: 'Destacados',
      value: products.filter(p => p.badge === 'featured').length,
      icon: 'fa-solid fa-star',
      wrap: 'accent',
      change: 'En portada del catálogo',
      changeClass: ''
    },
    {
      label: 'En Oferta',
      value: products.filter(p => p.badge === 'sale').length,
      icon: 'fa-solid fa-tag',
      wrap: 'success',
      change: 'Con descuento activo',
      changeClass: ''
    }
  ];

  const statContainer = document.getElementById('stat-cards');
  if (statContainer) {
    statContainer.innerHTML = stats.map(s => `
      <div class="stat-card">
        <div class="stat-card__info">
          <div class="stat-card__label">${s.label}</div>
          <div class="stat-card__value">${s.value}</div>
          <div class="stat-card__change ${s.changeClass}">${s.change}</div>
        </div>
        <div class="stat-card__icon-wrap stat-card__icon-wrap--${s.wrap}">
          <i class="${s.icon}"></i>
        </div>
      </div>
    `).join('');
  }

  // Últimos 5 productos
  const recent = [...products].reverse().slice(0, 5);
  const recentContainer = document.getElementById('recent-products-table');
  if (recentContainer) {
    if (recent.length === 0) {
      recentContainer.innerHTML = `
        <div style="text-align:center;padding:3rem;color:var(--color-gray-400);">
          <i class="fa-solid fa-box-open" style="font-size:2rem;margin-bottom:.75rem;display:block;opacity:.4;"></i>
          <p>No hay productos aún. <button class="btn btn-primary btn-sm" onclick="showSection('nuevo-producto')">Crear el primero</button></p>
        </div>
      `;
    } else {
      recentContainer.innerHTML = renderCompactTable(recent);
    }
  }
}

function renderCompactTable(products) {
  return `
    <div style="overflow-x:auto;">
      <table class="data-table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Badge</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          ${products.map(p => buildProductRow(p)).join('')}
        </tbody>
      </table>
    </div>
  `;
}

// ═══════════════════════════════════════════════════════════════════════
// TABLA DE PRODUCTOS
// ═══════════════════════════════════════════════════════════════════════

function loadProductsTable() {
  let products = Products.getAll();

  const searchVal  = (document.getElementById('admin-search')?.value || '').toLowerCase().trim();
  const catFilter  = document.getElementById('admin-filter-cat')?.value || '';
  const badgeFilter = document.getElementById('admin-filter-badge')?.value || '';

  if (searchVal) {
    products = products.filter(p =>
      p.name.toLowerCase().includes(searchVal) ||
      p.brand.toLowerCase().includes(searchVal) ||
      (p.sku || '').toLowerCase().includes(searchVal)
    );
  }
  if (catFilter)   products = products.filter(p => p.category === catFilter);
  if (badgeFilter) products = products.filter(p => p.badge === badgeFilter);

  const tbody  = document.getElementById('products-tbody');
  const empty  = document.getElementById('products-empty');
  const countLabel = document.getElementById('products-count-label');

  if (countLabel) {
    countLabel.textContent = `${products.length} producto${products.length !== 1 ? 's' : ''} encontrado${products.length !== 1 ? 's' : ''}`;
  }

  if (!tbody) return;

  if (products.length === 0) {
    tbody.innerHTML = '';
    if (empty) empty.style.display = 'block';
    return;
  }

  if (empty) empty.style.display = 'none';
  tbody.innerHTML = products.map(p => buildProductRow(p, true)).join('');
}

function buildProductRow(p, showRating = false) {
  const safeName = (p.name || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');
  return `
    <tr>
      <td>
        <div class="table-product">
          <div class="product-thumb" style="background:${p.gradient}">
            <i class="${p.icon}" style="color:rgba(255,255,255,.85)"></i>
          </div>
          <div>
            <div class="table-product__name" title="${p.name}">${p.name}</div>
            <div class="table-product__brand">${p.brand}</div>
          </div>
        </div>
      </td>
      <td><span class="tag-category">${Utils.getCategoryLabel(p.category)}</span></td>
      <td>
        <div class="table-price">
          <strong>${Utils.formatPrice(p.price)}</strong>
          ${p.originalPrice > p.price ? `<del>${Utils.formatPrice(p.originalPrice)}</del>` : ''}
        </div>
      </td>
      <td>
        <span class="stock-badge ${getStockClass(p.stock)}">${p.stock}</span>
      </td>
      <td>
        ${p.badge
          ? `<span class="badge badge-${p.badge}">${getBadgeLabel(p.badge)}</span>`
          : `<span class="text-muted">—</span>`}
      </td>
      ${showRating ? `
      <td>
        <div class="table-rating">
          <span>${p.rating}</span>
          <i class="fa-solid fa-star text-accent" style="font-size:.75rem;"></i>
          <span style="font-size:.72rem;color:var(--color-gray-400);">(${p.reviewCount || 0})</span>
        </div>
      </td>` : ''}
      <td>
        <div class="table-actions">
          <button class="table-action-btn btn-edit" onclick="editProduct('${p.id}')" title="Editar producto" aria-label="Editar ${p.name}">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button class="table-action-btn btn-delete" onclick="confirmDelete('${p.id}', '${safeName}')" title="Eliminar producto" aria-label="Eliminar ${p.name}">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  `;
}

function getStockClass(stock) {
  if (stock === 0) return 'stock-empty';
  if (stock < 5)  return 'stock-low';
  return 'stock-ok';
}

// ═══════════════════════════════════════════════════════════════════════
// FORMULARIO DE PRODUCTO
// ═══════════════════════════════════════════════════════════════════════

function setupProductForm() {
  const form = document.getElementById('product-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearFormErrors();

    const id = document.getElementById('edit-product-id').value;

    // Recopilar datos
    const category = document.getElementById('prod-category').value;
    const data = {
      name:            document.getElementById('prod-name').value.trim(),
      brand:           document.getElementById('prod-brand').value.trim(),
      category,
      sku:             document.getElementById('prod-sku').value.trim(),
      price:           parseFloat(document.getElementById('prod-price').value),
      originalPrice:   parseFloat(document.getElementById('prod-original-price').value) || parseFloat(document.getElementById('prod-price').value),
      stock:           parseInt(document.getElementById('prod-stock').value),
      description:     document.getElementById('prod-desc').value.trim(),
      fullDescription: document.getElementById('prod-full-desc').value.trim(),
      features:        document.getElementById('prod-features').value
                         .split('\n')
                         .map(f => f.trim())
                         .filter(f => f.length > 0),
      badge:           document.getElementById('prod-badge').value || null,
      rating:          parseFloat(document.getElementById('prod-rating').value) || 4.5,
      icon:            Utils.getCategoryIcon(category),
      gradient:        Utils.getCategoryGradient(category)
    };

    // Validaciones
    let valid = true;

    if (!data.name) {
      showFormError('prod-name-error', 'El nombre del producto es requerido');
      valid = false;
    } else if (data.name.length < 3) {
      showFormError('prod-name-error', 'El nombre debe tener al menos 3 caracteres');
      valid = false;
    }

    if (!data.brand) {
      showFormError('prod-brand-error', 'La marca es requerida');
      valid = false;
    }

    if (!data.category) {
      showFormError('prod-category-error', 'Selecciona una categoría');
      valid = false;
    }

    if (isNaN(data.price) || data.price <= 0) {
      showFormError('prod-price-error', 'Ingresa un precio válido mayor a 0');
      valid = false;
    }

    if (isNaN(data.stock) || data.stock < 0) {
      showFormError('prod-stock-error', 'El stock no puede ser negativo');
      valid = false;
    }

    if (!data.description) {
      showFormError('prod-desc-error', 'La descripción corta es requerida');
      valid = false;
    }

    if (!valid) {
      // Scroll al primer error
      const firstError = document.querySelector('.form-error:not(:empty)');
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // Submit
    setSubmitLoading(true);

    setTimeout(() => {
      let result;

      if (isEditMode && id) {
        result = Products.update(id, data);
        setSubmitLoading(false);
        if (result.success) {
          Utils.showToast('Producto actualizado exitosamente', 'success');
          showSection('productos');
        } else {
          Utils.showToast(result.message || 'Error al actualizar el producto', 'error');
        }
      } else {
        data.reviewCount = Math.floor(Math.random() * 150) + 20;
        result = Products.add(data);
        setSubmitLoading(false);
        if (result.success) {
          Utils.showToast('Producto creado exitosamente', 'success');
          resetForm();
          showSection('productos');
        } else {
          Utils.showToast(result.message || 'Error al crear el producto', 'error');
        }
      }
    }, 280);
  });
}

function setSubmitLoading(loading) {
  const btn = document.getElementById('product-submit-btn');
  if (!btn) return;
  if (loading) {
    btn.disabled = true;
    btn.innerHTML = '<span style="display:inline-block;width:16px;height:16px;border:2px solid rgba(255,255,255,.35);border-top-color:#fff;border-radius:50%;animation:spin .65s linear infinite;"></span> Guardando...';
  } else {
    btn.disabled = false;
    btn.innerHTML = isEditMode
      ? '<i class="fa-solid fa-floppy-disk"></i> Actualizar Producto'
      : '<i class="fa-solid fa-floppy-disk"></i> Guardar Producto';
  }
}

// ═══════════════════════════════════════════════════════════════════════
// EDITAR PRODUCTO
// ═══════════════════════════════════════════════════════════════════════

function editProduct(id) {
  const product = Products.getById(id);
  if (!product) {
    Utils.showToast('Producto no encontrado', 'error');
    return;
  }

  isEditMode = true;

  // Llenar formulario
  document.getElementById('edit-product-id').value    = product.id;
  document.getElementById('prod-name').value          = product.name;
  document.getElementById('prod-brand').value         = product.brand;
  document.getElementById('prod-category').value      = product.category;
  document.getElementById('prod-sku').value           = product.sku || '';
  document.getElementById('prod-price').value         = product.price;
  document.getElementById('prod-original-price').value = product.originalPrice !== product.price ? product.originalPrice : '';
  document.getElementById('prod-stock').value         = product.stock;
  document.getElementById('prod-desc').value          = product.description;
  document.getElementById('prod-full-desc').value     = product.fullDescription || '';
  document.getElementById('prod-features').value      = (product.features || []).join('\n');
  document.getElementById('prod-badge').value         = product.badge || '';
  document.getElementById('prod-rating').value        = product.rating;

  // Actualizar título y botón
  document.getElementById('product-form-title').textContent = 'Editar Producto';
  document.getElementById('product-submit-btn').innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Actualizar Producto';

  clearFormErrors();
  showSection('nuevo-producto');
}

// ═══════════════════════════════════════════════════════════════════════
// ELIMINAR PRODUCTO
// ═══════════════════════════════════════════════════════════════════════

function confirmDelete(id, name) {
  productToDelete = id;
  document.getElementById('delete-product-name').textContent = name;
  document.getElementById('confirm-delete-btn').onclick = () => executeDelete(id);
  document.getElementById('delete-modal').classList.add('active');
}

function executeDelete(id) {
  const result = Products.delete(id);
  closeDeleteModal();

  if (result.success) {
    Utils.showToast('Producto eliminado correctamente', 'success');
    loadProductsTable();
    loadDashboard();
  } else {
    Utils.showToast(result.message || 'Error al eliminar el producto', 'error');
  }
}

function closeDeleteModal() {
  document.getElementById('delete-modal').classList.remove('active');
  productToDelete = null;
}

// Cerrar modal con Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeDeleteModal();
});

// ═══════════════════════════════════════════════════════════════════════
// FILTROS ADMIN
// ═══════════════════════════════════════════════════════════════════════

function setupAdminFilters() {
  const searchInput = document.getElementById('admin-search');
  if (searchInput) {
    searchInput.addEventListener('input', Utils.debounce(() => loadProductsTable(), 280));
  }

  const catFilter = document.getElementById('admin-filter-cat');
  if (catFilter) {
    catFilter.addEventListener('change', () => loadProductsTable());
  }

  const badgeFilter = document.getElementById('admin-filter-badge');
  if (badgeFilter) {
    badgeFilter.addEventListener('change', () => loadProductsTable());
  }
}

// ═══════════════════════════════════════════════════════════════════════
// UTILIDADES DE FORMULARIO
// ═══════════════════════════════════════════════════════════════════════

function resetForm() {
  const form = document.getElementById('product-form');
  if (form) form.reset();
  document.getElementById('edit-product-id').value = '';
  document.getElementById('prod-rating').value = '4.5';
  isEditMode = false;
  clearFormErrors();
  document.getElementById('product-submit-btn').innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Guardar Producto';
  if (document.getElementById('product-submit-btn')) {
    document.getElementById('product-submit-btn').disabled = false;
  }
}

function showFormError(id, msg) {
  const el = document.getElementById(id);
  if (el) el.textContent = msg;
}

function clearFormErrors() {
  document.querySelectorAll('.form-error').forEach(el => el.textContent = '');
}

// ═══════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════

function getBadgeLabel(badge) {
  const labels = { new: 'Nuevo', sale: 'Oferta', featured: 'Destacado' };
  return labels[badge] || badge;
}
