/**
 * auth.js — Autenticación y gestión de usuarios StrikeStore
 * Expone el objeto Auth en window.Auth
 * Depende de: utils.js (Utils)
 */

const Auth = {
  _usersKey: 'ss_users',
  _currentKey: 'ss_current_user',

  // ─── Inicialización ───────────────────────────────────────────────────────

  /**
   * Crea la cuenta admin por defecto si no existe ningún usuario.
   */
  init() {
    const users = this._getUsers();
    const adminExists = users.some(u => u.email === 'admin@strikestore.com');
    if (!adminExists) {
      const admin = {
        id: Utils.generateId('usr'),
        name: 'Admin StrikeStore',
        email: 'admin@strikestore.com',
        password: Utils.hashPassword('Admin123!'),
        role: 'admin',
        phone: '+1 (555) 000-0000',
        city: 'Ciudad de México',
        bio: 'Administrador del sistema StrikeStore.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      users.push(admin);
      localStorage.setItem(this._usersKey, JSON.stringify(users));
    }
  },

  // ─── CRUD de usuarios (privado) ───────────────────────────────────────────

  /** Retorna el array completo de usuarios desde localStorage. */
  _getUsers() {
    try {
      return JSON.parse(localStorage.getItem(this._usersKey)) || [];
    } catch {
      return [];
    }
  },

  /** Persiste el array de usuarios en localStorage. */
  _saveUsers(users) {
    localStorage.setItem(this._usersKey, JSON.stringify(users));
  },

  /** Retorna una copia del usuario sin el campo password. */
  _sanitizeUser(user) {
    if (!user) return null;
    const { password, ...safeUser } = user;
    return safeUser;
  },

  // ─── Registro ────────────────────────────────────────────────────────────

  /**
   * Registra un nuevo usuario con role 'user'.
   * @returns {{ success: boolean, message: string }}
   */
  register(name, email, password, phone = '', city = '') {
    // Validaciones
    if (!name || name.trim().length < 2) {
      return { success: false, message: 'El nombre debe tener al menos 2 caracteres.' };
    }
    if (!Utils.validateEmail(email)) {
      return { success: false, message: 'El correo electrónico no es válido.' };
    }

    const passwordValidation = Utils.validatePassword(password);
    if (!passwordValidation.valid) {
      return { success: false, message: passwordValidation.message };
    }

    const users = this._getUsers();
    const emailLower = email.toLowerCase().trim();
    const exists = users.some(u => u.email === emailLower);
    if (exists) {
      return { success: false, message: 'Ya existe una cuenta con ese correo electrónico.' };
    }

    const user = {
      id: Utils.generateId('usr'),
      name: name.trim(),
      email: emailLower,
      password: Utils.hashPassword(password),
      role: 'user',
      phone: phone.trim(),
      city: city.trim(),
      bio: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    users.push(user);
    this._saveUsers(users);
    return { success: true, message: '¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.' };
  },

  // ─── Login / Logout ───────────────────────────────────────────────────────

  /**
   * Autentica un usuario por email y contraseña.
   * @returns {{ success: boolean, message: string, user?: object }}
   */
  login(email, password) {
    if (!email || !password) {
      return { success: false, message: 'Correo y contraseña son requeridos.' };
    }

    const users = this._getUsers();
    const emailLower = email.toLowerCase().trim();
    const user = users.find(u => u.email === emailLower);

    if (!user || !Utils.checkPassword(password, user.password)) {
      return { success: false, message: 'Credenciales incorrectas. Verifica tu correo y contraseña.' };
    }

    const safeUser = this._sanitizeUser(user);
    localStorage.setItem(this._currentKey, JSON.stringify(safeUser));
    return { success: true, message: `¡Bienvenido, ${user.name}!`, user: safeUser };
  },

  /**
   * Cierra la sesión actual y redirige al inicio.
   */
  logout() {
    localStorage.removeItem(this._currentKey);
    window.location.href = 'index.html';
  },

  // ─── Estado de sesión ─────────────────────────────────────────────────────

  /**
   * Retorna el usuario actual sin password, o null si no hay sesión.
   */
  getCurrentUser() {
    try {
      return JSON.parse(localStorage.getItem(this._currentKey)) || null;
    } catch {
      return null;
    }
  },

  /**
   * Retorna true si hay un usuario autenticado.
   */
  isAuthenticated() {
    return this.getCurrentUser() !== null;
  },

  /**
   * Retorna true si el usuario actual tiene role 'admin'.
   */
  isAdmin() {
    const user = this.getCurrentUser();
    return user !== null && user.role === 'admin';
  },

  // ─── Protección de rutas ──────────────────────────────────────────────────

  /**
   * Redirige a la página de login si no hay sesión activa.
   * Incluye parámetro ?redirect= con la página actual para volver después del login.
   * @returns {boolean} true si autenticado, false si redirigió
   */
  requireAuth(redirect = 'login.html') {
    if (!this.isAuthenticated()) {
      const currentPage = window.location.pathname.split('/').pop() || 'index.html';
      window.location.href = `${redirect}?redirect=${encodeURIComponent(currentPage)}`;
      return false;
    }
    return true;
  },

  /**
   * Redirige si el usuario no tiene permisos de admin.
   * @returns {boolean} true si es admin, false si redirigió
   */
  requireAdmin(redirect = 'catalogo.html') {
    if (!this.isAuthenticated()) {
      const currentPage = window.location.pathname.split('/').pop() || 'index.html';
      window.location.href = `login.html?redirect=${encodeURIComponent(currentPage)}`;
      return false;
    }
    if (!this.isAdmin()) {
      window.location.href = redirect;
      return false;
    }
    return true;
  },

  // ─── Actualización de perfil ──────────────────────────────────────────────

  /**
   * Actualiza los campos de perfil permitidos (name, phone, city, bio).
   * No permite cambiar email ni role.
   * @returns {{ success: boolean, message: string }}
   */
  updateProfile(updates) {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      return { success: false, message: 'No hay sesión activa.' };
    }

    // Validar nombre si se envía
    if (updates.name !== undefined && (!updates.name || updates.name.trim().length < 2)) {
      return { success: false, message: 'El nombre debe tener al menos 2 caracteres.' };
    }

    const users = this._getUsers();
    const idx = users.findIndex(u => u.id === currentUser.id);
    if (idx === -1) return { success: false, message: 'Usuario no encontrado.' };

    // Solo permitir campos seguros
    const allowedFields = ['name', 'phone', 'city', 'bio'];
    const safeUpdates = {};
    allowedFields.forEach(field => {
      if (updates[field] !== undefined) {
        safeUpdates[field] = typeof updates[field] === 'string'
          ? updates[field].trim()
          : updates[field];
      }
    });

    users[idx] = { ...users[idx], ...safeUpdates, updatedAt: new Date().toISOString() };
    this._saveUsers(users);

    // Actualizar sesión actual
    const updatedUser = this._sanitizeUser(users[idx]);
    localStorage.setItem(this._currentKey, JSON.stringify(updatedUser));

    return { success: true, message: 'Perfil actualizado correctamente.' };
  },

  /**
   * Cambia la contraseña del usuario actual.
   * @returns {{ success: boolean, message: string }}
   */
  changePassword(currentPassword, newPassword) {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      return { success: false, message: 'No hay sesión activa.' };
    }

    const users = this._getUsers();
    const user = users.find(u => u.id === currentUser.id);
    if (!user) return { success: false, message: 'Usuario no encontrado.' };

    if (!Utils.checkPassword(currentPassword, user.password)) {
      return { success: false, message: 'La contraseña actual no es correcta.' };
    }

    const validation = Utils.validatePassword(newPassword);
    if (!validation.valid) {
      return { success: false, message: validation.message };
    }

    if (currentPassword === newPassword) {
      return { success: false, message: 'La nueva contraseña debe ser diferente a la actual.' };
    }

    const idx = users.findIndex(u => u.id === currentUser.id);
    users[idx].password = Utils.hashPassword(newPassword);
    users[idx].updatedAt = new Date().toISOString();
    this._saveUsers(users);

    return { success: true, message: 'Contraseña cambiada correctamente.' };
  }
};
