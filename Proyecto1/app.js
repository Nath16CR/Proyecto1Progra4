new Vue({
  el: '#app',
  data: {
    // Formulario crear
    form: {
      nombre: '',
      apellido: '',
      email: '',
      clave: '',
      rol: 'usuario'
    },
    errors: {
      nombre: '',
      apellido: '',
      email: '',
      clave: ''
    },
    showPass: false,

    // Lista de usuarios
    usuarios: [],
    busqueda: '',

    // Estados de carga
    loading: false,
    loadingEdit: false,
    loadingDelete: false,

    // Modal editar
    showEditModal: false,
    editForm: {
      id: null,
      nombre: '',
      apellido: '',
      email: '',
      clave: '',
      rol: 'usuario'
    },

    // Modal confirmar eliminar
    showModal: false,
    usuarioAEliminar: null,

    // Toast
    toast: {
      visible: false,
      message: '',
      type: 'success'
    },
    toastTimer: null
  },

  computed: {
    usuariosFiltrados() {
      const q = this.busqueda.toLowerCase().trim();
      if (!q) return this.usuarios;
      return this.usuarios.filter(u =>
        (u.nombre + ' ' + u.apellido + ' ' + u.email).toLowerCase().includes(q)
      );
    }
  },

  methods: {
    // ─── Validaciones ───────────────────────────────────────
    validarForm() {
      let ok = true;
      this.errors = { nombre: '', apellido: '', email: '', clave: '' };

      if (!this.form.nombre.trim()) {
        this.errors.nombre = 'El nombre es obligatorio';
        ok = false;
      }
      if (!this.form.apellido.trim()) {
        this.errors.apellido = 'El apellido es obligatorio';
        ok = false;
      }
      if (!this.form.email.trim()) {
        this.errors.email = 'El email es obligatorio';
        ok = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email)) {
        this.errors.email = 'El email no tiene un formato válido';
        ok = false;
      }
      if (!this.form.clave.trim()) {
        this.errors.clave = 'La contraseña es obligatoria';
        ok = false;
      } else if (this.form.clave.length < 6) {
        this.errors.clave = 'Mínimo 6 caracteres';
        ok = false;
      }
      return ok;
    },

    // ─── Crear usuario ───────────────────────────────────────
    crearUsuario() {
      if (!this.validarForm()) return;
      this.loading = true;

      const formData = new FormData();
      formData.append('nombre',   this.form.nombre);
      formData.append('apellido', this.form.apellido);
      formData.append('email',    this.form.email);
      formData.append('clave',    this.form.clave);
      formData.append('rol',      this.form.rol);

      axios.post('crear.php', formData)
        .then(response => {
          const data = response.data;
          if (data.error) {
            this.mostrarToast(data.error, 'error');
          } else {
            this.mostrarToast(data.mensaje || 'Usuario creado correctamente', 'success');
            this.form = { nombre: '', apellido: '', email: '', clave: '', rol: 'usuario' };
            this.consultarUsuarios();
          }
        })
        .catch(() => {
          this.mostrarToast('Error de conexión con el servidor', 'error');
        })
        .finally(() => {
          this.loading = false;
        });
    },

    // ─── Consultar usuarios ──────────────────────────────────
    consultarUsuarios() {
      this.loading = true;
      axios.get('consultar.php')
        .then(response => {
          this.usuarios = response.data;
        })
        .catch(() => {
          this.mostrarToast('Error al cargar los usuarios', 'error');
        })
        .finally(() => {
          this.loading = false;
        });
    },

    // ─── Abrir modal editar ──────────────────────────────────
    abrirEditar(usuario) {
      this.editForm = {
        id:       usuario.id,
        nombre:   usuario.nombre,
        apellido: usuario.apellido,
        email:    usuario.email,
        clave:    '',
        rol:      usuario.rol || 'usuario'
      };
      this.showEditModal = true;
    },

    // ─── Actualizar usuario ──────────────────────────────────
    actualizarUsuario() {
      if (!this.editForm.nombre.trim() || !this.editForm.apellido.trim() || !this.editForm.email.trim()) {
        this.mostrarToast('Nombre, apellido y email son obligatorios', 'error');
        return;
      }
      this.loadingEdit = true;

      const formData = new FormData();
      formData.append('id',       this.editForm.id);
      formData.append('nombre',   this.editForm.nombre);
      formData.append('apellido', this.editForm.apellido);
      formData.append('email',    this.editForm.email);
      formData.append('rol',      this.editForm.rol);
      if (this.editForm.clave) {
        formData.append('clave', this.editForm.clave);
      }

      axios.post('actualizar.php', formData)
        .then(response => {
          const data = response.data;
          if (data.error) {
            this.mostrarToast(data.error, 'error');
          } else {
            this.mostrarToast(data.mensaje || 'Usuario actualizado', 'success');
            this.showEditModal = false;
            this.consultarUsuarios();
          }
        })
        .catch(() => {
          this.mostrarToast('Error de conexión con el servidor', 'error');
        })
        .finally(() => {
          this.loadingEdit = false;
        });
    },

    // ─── Confirmar eliminar ──────────────────────────────────
    confirmarEliminar(usuario) {
      this.usuarioAEliminar = usuario;
      this.showModal = true;
    },

    // ─── Eliminar usuario ────────────────────────────────────
    eliminarUsuario() {
      if (!this.usuarioAEliminar) return;
      this.loadingDelete = true;

      const formData = new FormData();
      formData.append('id', this.usuarioAEliminar.id);

      axios.post('eliminar.php', formData)
        .then(response => {
          const data = response.data;
          if (data.error) {
            this.mostrarToast(data.error, 'error');
          } else {
            this.mostrarToast(data.mensaje || 'Usuario eliminado', 'success');
            this.showModal = false;
            this.usuarioAEliminar = null;
            this.consultarUsuarios();
          }
        })
        .catch(() => {
          this.mostrarToast('Error de conexión con el servidor', 'error');
        })
        .finally(() => {
          this.loadingDelete = false;
        });
    },

    // ─── Toast ───────────────────────────────────────────────
    mostrarToast(message, type = 'success') {
      if (this.toastTimer) clearTimeout(this.toastTimer);
      this.toast = { visible: true, message, type };
      this.toastTimer = setTimeout(() => {
        this.toast.visible = false;
      }, 3500);
    },

    // ─── Helpers visuales ────────────────────────────────────
    getInitials(nombre, apellido) {
      return ((nombre?.[0] || '') + (apellido?.[0] || '')).toUpperCase();
    },

    getColor(nombre) {
      const colors = [
        '#6c63ff', '#ff6584', '#43e97b', '#f7971e',
        '#2193b0', '#ee0979', '#11998e', '#f953c6'
      ];
      let hash = 0;
      for (let c of (nombre || '')) hash = c.charCodeAt(0) + ((hash << 5) - hash);
      return colors[Math.abs(hash) % colors.length];
    },

    formatDate(dateStr) {
      if (!dateStr) return '';
      const d = new Date(dateStr);
      return d.toLocaleDateString('es-CR', { day: '2-digit', month: 'short', year: 'numeric' });
    }
  },

  mounted() {
    this.consultarUsuarios();
  }
});
