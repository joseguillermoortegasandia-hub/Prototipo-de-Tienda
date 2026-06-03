/**
 * registro.js — Lógica de la página de registro de StrikeStore
 * Depende de: utils.js (Utils), auth.js (Auth)
 */

document.addEventListener('DOMContentLoaded', () => {
  // Si ya está autenticado, redirigir a index.html
  if (Auth.isAuthenticated()) {
    window.location.href = 'index.html';
    return;
  }

  setupForm();
  setupPasswordToggle();
  setupPasswordStrength();
  setupRealTimeValidation();
});

/* ─────────────────────────────────────────────────────────────────────────────
   Configuración del formulario
───────────────────────────────────────────────────────────────────────────── */
function setupForm() {
  const form = document.getElementById('registro-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();

    const data = {
      name:            document.getElementById('reg-name').value.trim(),
      email:           document.getElementById('reg-email').value.trim().toLowerCase(),
      password:        document.getElementById('reg-password').value,
      confirmPassword: document.getElementById('reg-confirm').value,
      phone:           document.getElementById('reg-phone').value.trim(),
      city:            document.getElementById('reg-city').value.trim(),
      terms:           document.getElementById('reg-terms').checked
    };

    // ── Validaciones del lado del cliente ──────────────────────────────────
    let valid = true;

    // Nombre: mínimo 2 caracteres
    if (!data.name) {
      showError('name-error', 'El nombre es requerido.');
      valid = false;
    } else if (data.name.length < 2) {
      showError('name-error', 'El nombre debe tener al menos 2 caracteres.');
      valid = false;
    }

    // Email válido
    if (!data.email) {
      showError('reg-email-error', 'El correo electrónico es requerido.');
      valid = false;
    } else if (!Utils.validateEmail(data.email)) {
      showError('reg-email-error', 'El formato del correo no es válido.');
      valid = false;
    }

    // Contraseña válida (Utils.validatePassword)
    if (!data.password) {
      showError('reg-password-error', 'La contraseña es requerida.');
      valid = false;
    } else {
      const pwValidation = Utils.validatePassword(data.password);
      if (!pwValidation.valid) {
        showError('reg-password-error', pwValidation.message);
        valid = false;
      }
    }

    // Confirmación de contraseña
    if (!data.confirmPassword) {
      showError('confirm-error', 'Por favor confirma tu contraseña.');
      valid = false;
    } else if (data.password && data.password !== data.confirmPassword) {
      showError('confirm-error', 'Las contraseñas no coinciden.');
      valid = false;
    }

    // Términos aceptados
    if (!data.terms) {
      showError('terms-error', 'Debes aceptar los términos y condiciones para continuar.');
      valid = false;
    }

    if (!valid) {
      // Hacer scroll al primer error visible
      const firstError = form.querySelector('.form-error:not([hidden])');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Estado de carga
    setLoading(true);

    // Simular delay de red (400ms)
    await new Promise(r => setTimeout(r, 400));

    const result = Auth.register(
      data.name,
      data.email,
      data.password,
      data.phone,
      data.city
    );

    setLoading(false);

    if (result.success) {
      Utils.showToast('¡Cuenta creada exitosamente! Bienvenido a StrikeStore 🎉', 'success', 5000);
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 1500);
    } else {
      Utils.showToast(result.message, 'error');
      // Mapear el mensaje de error al campo correspondiente si es posible
      const msg = result.message.toLowerCase();
      if (msg.includes('correo') || msg.includes('email') || msg.includes('cuenta')) {
        showError('reg-email-error', result.message);
      } else if (msg.includes('contraseña') || msg.includes('password')) {
        showError('reg-password-error', result.message);
      } else if (msg.includes('nombre')) {
        showError('name-error', result.message);
      }
    }
  });
}

/* ─────────────────────────────────────────────────────────────────────────────
   Estado de carga del botón
───────────────────────────────────────────────────────────────────────────── */
function setLoading(loading) {
  const btn     = document.getElementById('registro-btn');
  const btnText = document.getElementById('registro-btn-text');
  if (!btn) return;

  if (loading) {
    btn.disabled = true;
    btn.setAttribute('aria-busy', 'true');
    btnText.innerHTML = '<span class="btn-spinner" aria-hidden="true"></span> Creando cuenta...';
  } else {
    btn.disabled = false;
    btn.setAttribute('aria-busy', 'false');
    btnText.innerHTML = '<i class="fa-solid fa-user-plus" aria-hidden="true"></i> Crear Cuenta';
  }
}

/* ─────────────────────────────────────────────────────────────────────────────
   Mostrar / ocultar mensajes de error
───────────────────────────────────────────────────────────────────────────── */
function showError(id, msg) {
  const container = document.getElementById(id);
  if (!container) return;

  const span = container.querySelector('span');
  if (span) span.textContent = msg;
  container.hidden = false;

  // Marcar el campo correspondiente con clase error
  const fieldMap = {
    'name-error':         'reg-name',
    'reg-email-error':    'reg-email',
    'reg-password-error': 'reg-password',
    'confirm-error':      'reg-confirm',
    'terms-error':        'reg-terms'
  };
  const fieldId = fieldMap[id];
  if (fieldId) {
    const field = document.getElementById(fieldId);
    if (field) field.classList.add('error');
  }
}

function clearErrors() {
  const errorIds = [
    'name-error', 'reg-email-error', 'reg-password-error', 'confirm-error', 'terms-error'
  ];

  errorIds.forEach(id => {
    const container = document.getElementById(id);
    if (container) {
      container.hidden = true;
      const span = container.querySelector('span');
      if (span) span.textContent = '';
    }
  });

  const fieldIds = ['reg-name', 'reg-email', 'reg-password', 'reg-confirm', 'reg-terms'];
  fieldIds.forEach(id => {
    const field = document.getElementById(id);
    if (field) field.classList.remove('error');
  });
}

/* ─────────────────────────────────────────────────────────────────────────────
   Toggle mostrar / ocultar contraseña
───────────────────────────────────────────────────────────────────────────── */
function setupPasswordToggle() {
  // Toggle principal
  setupToggle('toggle-reg-password', 'reg-password');
  // Toggle confirmación
  setupToggle('toggle-confirm-password', 'reg-confirm');
}

function setupToggle(toggleId, inputId) {
  const toggleBtn = document.getElementById(toggleId);
  const inputEl   = document.getElementById(inputId);
  if (!toggleBtn || !inputEl) return;

  toggleBtn.addEventListener('click', () => {
    const isPassword = inputEl.type === 'password';
    inputEl.type = isPassword ? 'text' : 'password';

    const icon = toggleBtn.querySelector('i');
    if (icon) {
      icon.className = isPassword ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye';
    }

    toggleBtn.setAttribute('aria-label', isPassword ? 'Ocultar contraseña' : 'Mostrar contraseña');
    toggleBtn.setAttribute('aria-pressed', isPassword ? 'true' : 'false');
    inputEl.focus();
  });
}

/* ─────────────────────────────────────────────────────────────────────────────
   Indicador de fortaleza de contraseña
───────────────────────────────────────────────────────────────────────────── */
function setupPasswordStrength() {
  const passwordInput = document.getElementById('reg-password');
  if (!passwordInput) return;

  passwordInput.addEventListener('input', () => {
    const value    = passwordInput.value;
    const strength = calculateStrength(value);
    updateStrengthUI(strength, value.length > 0);
  });
}

/**
 * Calcula la fortaleza de la contraseña de 0 a 4.
 * Criterios: longitud >= 8, mayúsculas, números, caracteres especiales.
 * @param {string} password
 * @returns {number} 0-4
 */
function calculateStrength(password) {
  if (!password) return 0;

  let score = 0;

  // Longitud mínima
  if (password.length >= 8)  score++;
  if (password.length >= 12) score++;

  // Al menos una letra mayúscula
  if (/[A-Z]/.test(password)) score++;

  // Al menos un número
  if (/\d/.test(password)) score++;

  // Al menos un carácter especial
  if (/[^A-Za-z0-9]/.test(password)) score++;

  // Normalizar a escala 0-4
  return Math.min(4, Math.max(0, score > 4 ? 4 : score));
}

/**
 * Actualiza la UI del indicador de fortaleza.
 * @param {number} strength  0-4
 * @param {boolean} hasValue si el campo tiene contenido
 */
function updateStrengthUI(strength, hasValue) {
  const bars        = [1, 2, 3, 4].map(i => document.getElementById(`strength-bar-${i}`));
  const labelEl     = document.getElementById('password-strength-label');
  const indicator   = document.getElementById('password-strength-indicator');

  if (!bars[0] || !labelEl) return;

  // Mostrar u ocultar el indicador
  if (indicator) {
    indicator.setAttribute('aria-hidden', hasValue ? 'false' : 'true');
    indicator.style.display = hasValue ? 'block' : 'none';
  }

  // Mapas de nivel
  const strengthMap = {
    0: { label: '',          cls: '',              count: 0 },
    1: { label: 'Débil',     cls: 'active-weak',   count: 1 },
    2: { label: 'Regular',   cls: 'active-fair',   count: 2 },
    3: { label: 'Fuerte',    cls: 'active-good',   count: 3 },
    4: { label: 'Muy fuerte', cls: 'active-strong', count: 4 }
  };
  const labelClsMap = {
    0: '',
    1: 'strength-label--weak',
    2: 'strength-label--fair',
    3: 'strength-label--good',
    4: 'strength-label--strong'
  };

  const { label, cls, count } = strengthMap[strength] || strengthMap[0];

  // Actualizar barras
  bars.forEach((bar, idx) => {
    if (!bar) return;
    bar.className = 'strength-bar';
    if (hasValue && idx < count) {
      bar.classList.add(cls);
    }
  });

  // Actualizar etiqueta
  labelEl.textContent = hasValue ? label : '';
  labelEl.className   = 'password-strength__label';
  if (hasValue && labelClsMap[strength]) {
    labelEl.classList.add(labelClsMap[strength]);
  }
}

/* ─────────────────────────────────────────────────────────────────────────────
   Validación en tiempo real (al perder el foco)
───────────────────────────────────────────────────────────────────────────── */
function setupRealTimeValidation() {
  // ── Nombre ──────────────────────────────────────────────────────────────
  bindBlurValidation('reg-name', 'name-error', (val) => {
    if (!val) return 'El nombre es requerido.';
    if (val.length < 2) return 'El nombre debe tener al menos 2 caracteres.';
    return null;
  });

  // ── Email ────────────────────────────────────────────────────────────────
  bindBlurValidation('reg-email', 'reg-email-error', (val) => {
    if (!val) return 'El correo electrónico es requerido.';
    if (!Utils.validateEmail(val)) return 'El formato del correo no es válido.';
    return null;
  });

  // ── Password ─────────────────────────────────────────────────────────────
  bindBlurValidation('reg-password', 'reg-password-error', (val) => {
    if (!val) return 'La contraseña es requerida.';
    const result = Utils.validatePassword(val);
    if (!result.valid) return result.message;
    return null;
  });

  // ── Confirmar password ───────────────────────────────────────────────────
  bindBlurValidation('reg-confirm', 'confirm-error', (val) => {
    const pw = document.getElementById('reg-password');
    if (!val) return 'Por favor confirma tu contraseña.';
    if (pw && val !== pw.value) return 'Las contraseñas no coinciden.';
    return null;
  });

  // Si la contraseña principal cambia, re-validar confirmación si ya tiene valor
  const pwInput      = document.getElementById('reg-password');
  const confirmInput = document.getElementById('reg-confirm');
  if (pwInput && confirmInput) {
    pwInput.addEventListener('input', () => {
      if (confirmInput.value) {
        const errorEl = document.getElementById('confirm-error');
        if (confirmInput.value !== pwInput.value) {
          showError('confirm-error', 'Las contraseñas no coinciden.');
        } else if (errorEl && !errorEl.hidden) {
          errorEl.hidden = true;
          confirmInput.classList.remove('error');
        }
      }
    });
  }
}

/**
 * Asocia validación al evento blur de un campo.
 * @param {string} fieldId     ID del campo
 * @param {string} errorId     ID del span de error
 * @param {Function} validator función (value) => string|null
 */
function bindBlurValidation(fieldId, errorId, validator) {
  const field = document.getElementById(fieldId);
  if (!field) return;

  field.addEventListener('blur', () => {
    const msg = validator(field.value.trim());
    if (msg) {
      showError(errorId, msg);
    } else {
      const errorEl = document.getElementById(errorId);
      if (errorEl) {
        errorEl.hidden = true;
        field.classList.remove('error');
      }
    }
  });

  // Limpiar error mientras escribe si el campo ya tenía error visible
  field.addEventListener('input', () => {
    const errorEl = document.getElementById(errorId);
    if (errorEl && !errorEl.hidden) {
      const msg = validator(field.value.trim());
      if (!msg) {
        errorEl.hidden = true;
        field.classList.remove('error');
      }
    }
  });
}
