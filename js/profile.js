/**
 * profile.js — Página de perfil de usuario StrikeStore
 * Depende de: utils.js, data.js, auth.js, nav.js
 */

document.addEventListener('DOMContentLoaded', () => {
  Auth.requireAuth();

  loadUserData();
  setupProfileForm();
  setupPasswordForm();
  setupBioCounter();
  setupPasswordToggles();
});

// ═══════════════════════════════════════════════════════════════════════
// CARGAR DATOS DEL USUARIO
// ═══════════════════════════════════════════════════════════════════════

function loadUserData() {
  const user = Auth.getCurrentUser();
  if (!user) return;

  const initials = Utils.getInitials(user.name);

  // ── Header banner ──
  const avatarDisplay = document.getElementById('profile-avatar-display');
  if (avatarDisplay) {
    avatarDisplay.innerHTML = `<div class="avatar-circle avatar-xl">${initials}</div>`;
  }

  const nameDisplay = document.getElementById('profile-name-display');
  if (nameDisplay) nameDisplay.textContent = user.name;

  const emailDisplay = document.getElementById('profile-email-display');
  if (emailDisplay) emailDisplay.textContent = user.email;

  const roleBadge = document.getElementById('profile-role-badge');
  if (roleBadge) {
    const isAdmin = user.role === 'admin';
    roleBadge.textContent = isAdmin ? 'Administrador' : 'Usuario';
    roleBadge.className = `badge ${isAdmin ? 'badge-primary' : 'badge-info'}`;
    roleBadge.innerHTML = isAdmin
      ? '<i class="fa-solid fa-crown" style="font-size:.65rem;margin-right:.2rem;"></i> Administrador'
      : '<i class="fa-solid fa-user" style="font-size:.65rem;margin-right:.2rem;"></i> Usuario';
  }

  const memberSince = document.getElementById('profile-member-since');
  if (memberSince) {
    memberSince.innerHTML = `<i class="fa-solid fa-calendar-check" style="font-size:.65rem;margin-right:.2rem;"></i> Miembro desde ${Utils.formatDate(user.createdAt)}`;
  }

  // ── Sidebar ──
  const sidebarAvatar = document.getElementById('sidebar-avatar');
  if (sidebarAvatar) {
    sidebarAvatar.innerHTML = `<div class="avatar-circle">${initials}</div>`;
  }

  const sidebarName = document.getElementById('sidebar-name');
  if (sidebarName) sidebarName.textContent = user.name;

  const sidebarRole = document.getElementById('sidebar-role');
  if (sidebarRole) sidebarRole.textContent = user.role === 'admin' ? 'Administrador' : 'Usuario';

  const statMemberSince = document.getElementById('stat-member-since');
  if (statMemberSince) statMemberSince.textContent = Utils.formatDate(user.createdAt);

  // Mostrar enlace de admin si aplica
  const adminLink = document.getElementById('admin-link-wrapper');
  if (adminLink) {
    adminLink.style.display = user.role === 'admin' ? 'block' : 'none';
  }

  // ── Formulario ──
  const nameInput = document.getElementById('prof-name');
  if (nameInput) nameInput.value = user.name;

  const emailInput = document.getElementById('prof-email');
  if (emailInput) emailInput.value = user.email;

  const phoneInput = document.getElementById('prof-phone');
  if (phoneInput) phoneInput.value = user.phone || '';

  const cityInput = document.getElementById('prof-city');
  if (cityInput) cityInput.value = user.city || '';

  const bioInput = document.getElementById('prof-bio');
  if (bioInput) {
    bioInput.value = user.bio || '';
    updateBioCount();
  }
}

// ═══════════════════════════════════════════════════════════════════════
// FORMULARIO DE PERFIL
// ═══════════════════════════════════════════════════════════════════════

function setupProfileForm() {
  const form = document.getElementById('profile-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();

    const name = document.getElementById('prof-name').value.trim();

    // Validaciones
    if (!name || name.length < 2) {
      showError('prof-name-error', 'El nombre debe tener al menos 2 caracteres');
      document.getElementById('prof-name').focus();
      return;
    }

    const updates = {
      name,
      phone: document.getElementById('prof-phone').value.trim(),
      city:  document.getElementById('prof-city').value.trim(),
      bio:   document.getElementById('prof-bio').value.trim()
    };

    setButtonLoading('profile-submit-btn', true, 'Guardando...');
    await delay(300);

    const result = Auth.updateProfile(updates);
    setButtonLoading('profile-submit-btn', false, '<i class="fa-solid fa-floppy-disk"></i> Guardar Cambios');

    if (result.success) {
      Utils.showToast('Perfil actualizado correctamente', 'success');
      loadUserData(); // Recargar para reflejar cambios en header y sidebar
    } else {
      Utils.showToast(result.message || 'Error al actualizar el perfil', 'error');
    }
  });
}

// ═══════════════════════════════════════════════════════════════════════
// FORMULARIO DE CONTRASEÑA
// ═══════════════════════════════════════════════════════════════════════

function setupPasswordForm() {
  const form = document.getElementById('password-form');
  if (!form) return;

  // Actualizar fortaleza en tiempo real
  const newPwdInput = document.getElementById('new-pwd');
  if (newPwdInput) {
    newPwdInput.addEventListener('input', (e) => {
      updateStrengthIndicator(e.target.value);
      updateRequirements(e.target.value);
    });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();

    const current = document.getElementById('current-pwd').value;
    const newPwd  = document.getElementById('new-pwd').value;
    const confirm = document.getElementById('confirm-pwd').value;

    let valid = true;

    if (!current) {
      showError('current-pwd-error', 'Ingresa tu contraseña actual');
      valid = false;
    }

    const pwdValidation = Utils.validatePassword(newPwd);
    if (!pwdValidation.valid) {
      showError('new-pwd-error', pwdValidation.message);
      valid = false;
    }

    if (newPwd && confirm && newPwd !== confirm) {
      showError('confirm-pwd-error', 'Las contraseñas no coinciden');
      valid = false;
    }

    if (!valid) return;

    setButtonLoading('pwd-submit-btn', true, 'Cambiando...');
    await delay(300);

    const result = Auth.changePassword(current, newPwd);
    setButtonLoading('pwd-submit-btn', false, '<i class="fa-solid fa-key"></i> Cambiar Contraseña');

    if (result.success) {
      Utils.showToast('Contraseña cambiada exitosamente', 'success');
      document.getElementById('password-form').reset();
      updateStrengthIndicator('');
      updateRequirements('');
    } else {
      Utils.showToast(result.message || 'Error al cambiar la contraseña', 'error');
      if (result.message && result.message.toLowerCase().includes('actual')) {
        showError('current-pwd-error', result.message);
      }
    }
  });
}

// ═══════════════════════════════════════════════════════════════════════
// INDICADOR DE FORTALEZA DE CONTRASEÑA
// ═══════════════════════════════════════════════════════════════════════

function updateStrengthIndicator(password) {
  let score = 0;
  if (password.length >= 8)          score++;
  if (/[A-Z]/.test(password))        score++;
  if (/\d/.test(password))           score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const labels = ['', 'Débil', 'Regular', 'Fuerte', 'Muy Fuerte'];
  const colors = ['', '#de3a0d', '#e17605', '#3b82f6', '#22c55e'];
  const widths = ['0%', '25%', '50%', '75%', '100%'];

  const fill  = document.getElementById('strength-fill');
  const label = document.getElementById('strength-label');

  if (fill) {
    fill.style.width      = password.length === 0 ? '0%' : widths[score];
    fill.style.background = colors[score] || 'transparent';
  }

  if (label) {
    label.textContent  = password.length === 0 ? '' : labels[score];
    label.style.color  = colors[score] || '';
  }
}

function updateRequirements(password) {
  const checks = {
    'req-length':  password.length >= 8,
    'req-number':  /\d/.test(password),
    'req-upper':   /[A-Z]/.test(password),
    'req-special': /[^A-Za-z0-9]/.test(password)
  };

  Object.entries(checks).forEach(([id, met]) => {
    const el = document.getElementById(id);
    if (!el) return;

    const icon = el.querySelector('i');
    if (met) {
      el.style.color = '#16a34a';
      if (icon) { icon.className = 'fa-solid fa-circle-check'; icon.style.fontSize = '.65rem'; }
    } else {
      el.style.color = password.length === 0 ? 'var(--color-gray-400)' : '#dc2626';
      if (icon) { icon.className = 'fa-regular fa-circle-dot'; icon.style.fontSize = '.65rem'; }
    }
  });
}

// ═══════════════════════════════════════════════════════════════════════
// CONTADOR DE BIO
// ═══════════════════════════════════════════════════════════════════════

function setupBioCounter() {
  const bioInput = document.getElementById('prof-bio');
  if (bioInput) {
    bioInput.addEventListener('input', updateBioCount);
  }
}

function updateBioCount() {
  const bio  = document.getElementById('prof-bio');
  const counter = document.getElementById('bio-char-count');
  if (!bio || !counter) return;

  const len = bio.value.length;
  counter.textContent = len;
  counter.style.color = len >= 180 ? 'var(--color-primary)' : 'var(--color-gray-400)';
}

// ═══════════════════════════════════════════════════════════════════════
// TABS
// ═══════════════════════════════════════════════════════════════════════

function switchTab(tab) {
  // Actualizar botones de tab
  document.querySelectorAll('.profile-tab').forEach(t => {
    const isActive = t.dataset.tab === tab;
    t.classList.toggle('active', isActive);
    t.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });

  // Mostrar/ocultar paneles
  document.querySelectorAll('.profile-tab-content').forEach(c => {
    c.style.display = 'none';
  });

  const target = document.getElementById(`tab-${tab}`);
  if (target) target.style.display = 'block';

  // Limpiar errores al cambiar de tab
  clearErrors();
}

// ═══════════════════════════════════════════════════════════════════════
// MOSTRAR/OCULTAR CONTRASEÑAS
// ═══════════════════════════════════════════════════════════════════════

function setupPasswordToggles() {
  document.querySelectorAll('.toggle-pwd-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.target;
      const input = document.getElementById(targetId);
      if (!input) return;

      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';

      const icon = btn.querySelector('i');
      if (icon) {
        icon.className = isPassword ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye';
      }

      btn.setAttribute('aria-label', isPassword ? 'Ocultar contraseña' : 'Mostrar contraseña');
    });
  });
}

// ═══════════════════════════════════════════════════════════════════════
// UTILIDADES
// ═══════════════════════════════════════════════════════════════════════

function showError(id, msg) {
  const el = document.getElementById(id);
  if (el) el.textContent = msg;
}

function clearErrors() {
  document.querySelectorAll('.form-error').forEach(el => el.textContent = '');
}

function setButtonLoading(btnId, loading, htmlContent) {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  btn.disabled = loading;
  if (loading) {
    btn.innerHTML = `<span class="btn-spinner"></span> ${htmlContent}`;
  } else {
    btn.innerHTML = htmlContent;
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
