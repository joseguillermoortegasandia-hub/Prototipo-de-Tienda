/**
 * login.js — Lógica de la página de inicio de sesión de StrikeStore
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
  setupRealTimeValidation();
});

/* ─────────────────────────────────────────────────────────────────────────────
   Configuración del formulario
───────────────────────────────────────────────────────────────────────────── */
function setupForm() {
  const form = document.getElementById('login-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email    = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    // Limpiar errores previos
    clearErrors();

    // Validaciones del lado del cliente
    let valid = true;

    if (!email) {
      showError('email-error', 'El correo electrónico es requerido.');
      valid = false;
    } else if (!Utils.validateEmail(email)) {
      showError('email-error', 'El formato del correo no es válido.');
      valid = false;
    }

    if (!password) {
      showError('password-error', 'La contraseña es requerida.');
      valid = false;
    }

    if (!valid) return;

    // Estado de carga
    setLoading(true);

    // Simular delay de red (300ms)
    await new Promise(r => setTimeout(r, 300));

    const result = Auth.login(email, password);

    setLoading(false);

    if (result.success) {
      Utils.showToast(`¡Bienvenido, ${result.user.name}! 🎯`, 'success');

      // Redirigir según rol o al parámetro redirect
      setTimeout(() => {
        const params   = new URLSearchParams(window.location.search);
        const redirect = params.get('redirect') ||
          (result.user.role === 'admin' ? 'admin.html' : 'catalogo.html');
        window.location.href = redirect;
      }, 1000);
    } else {
      Utils.showToast(result.message, 'error');
      showError('password-error', result.message);
    }
  });
}

/* ─────────────────────────────────────────────────────────────────────────────
   Estado de carga del botón
───────────────────────────────────────────────────────────────────────────── */
function setLoading(loading) {
  const btn     = document.getElementById('login-btn');
  const btnText = document.getElementById('login-btn-text');
  if (!btn) return;

  if (loading) {
    btn.disabled = true;
    btn.setAttribute('aria-busy', 'true');
    btnText.innerHTML = '<span class="btn-spinner" aria-hidden="true"></span> Verificando...';
  } else {
    btn.disabled = false;
    btn.setAttribute('aria-busy', 'false');
    btnText.textContent = 'Iniciar Sesión';
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
  const fieldId = id === 'email-error' ? 'login-email' : 'login-password';
  const field   = document.getElementById(fieldId);
  if (field) field.classList.add('error');
}

function clearErrors() {
  ['email-error', 'password-error'].forEach(id => {
    const container = document.getElementById(id);
    if (container) {
      container.hidden = true;
      const span = container.querySelector('span');
      if (span) span.textContent = '';
    }
  });

  ['login-email', 'login-password'].forEach(id => {
    const field = document.getElementById(id);
    if (field) field.classList.remove('error');
  });
}

/* ─────────────────────────────────────────────────────────────────────────────
   Toggle mostrar / ocultar contraseña
───────────────────────────────────────────────────────────────────────────── */
function setupPasswordToggle() {
  const toggleBtn  = document.getElementById('toggle-password');
  const passwordInput = document.getElementById('login-password');
  if (!toggleBtn || !passwordInput) return;

  toggleBtn.addEventListener('click', () => {
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';

    const icon = toggleBtn.querySelector('i');
    if (icon) {
      icon.className = isPassword ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye';
    }

    toggleBtn.setAttribute('aria-label', isPassword ? 'Ocultar contraseña' : 'Mostrar contraseña');
    toggleBtn.setAttribute('aria-pressed', isPassword ? 'true' : 'false');

    // Mantener foco en el campo de contraseña
    passwordInput.focus();
  });
}

/* ─────────────────────────────────────────────────────────────────────────────
   Validación en tiempo real (al perder el foco)
───────────────────────────────────────────────────────────────────────────── */
function setupRealTimeValidation() {
  // Validar email al salir del campo
  const emailInput = document.getElementById('login-email');
  if (emailInput) {
    emailInput.addEventListener('blur', () => {
      const val = emailInput.value.trim();
      if (val && !Utils.validateEmail(val)) {
        showError('email-error', 'El formato del correo no es válido.');
      } else {
        // Limpiar error si el usuario corrigió
        const container = document.getElementById('email-error');
        if (container) {
          container.hidden = true;
          emailInput.classList.remove('error');
        }
      }
    });

    // Limpiar error mientras escribe
    emailInput.addEventListener('input', () => {
      const container = document.getElementById('email-error');
      if (container && !container.hidden) {
        if (Utils.validateEmail(emailInput.value.trim())) {
          container.hidden = true;
          emailInput.classList.remove('error');
        }
      }
    });
  }

  // Validar password al salir del campo
  const passwordInput = document.getElementById('login-password');
  if (passwordInput) {
    passwordInput.addEventListener('blur', () => {
      if (!passwordInput.value) {
        showError('password-error', 'La contraseña es requerida.');
      } else {
        const container = document.getElementById('password-error');
        if (container) {
          container.hidden = true;
          passwordInput.classList.remove('error');
        }
      }
    });

    // Limpiar error mientras escribe
    passwordInput.addEventListener('input', () => {
      const container = document.getElementById('password-error');
      if (container && !container.hidden && passwordInput.value) {
        container.hidden = true;
        passwordInput.classList.remove('error');
      }
    });
  }
}
