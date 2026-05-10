new Vue({
    el: '#app',

    data: {
        nombre: '',
        apellido: '',
        email: '',
        clave: '',
        usuarios: []
    },

    methods: {

        crearUsuario() {
            let formData = new FormData();

            formData.append('nombre', this.nombre);
            formData.append('apellido', this.apellido);
            formData.append('email', this.email);
            formData.append('clave', this.clave);

            axios.post('crear.php', formData)
                .then(response => {
                    alert(response.data);
                    this.consultarUsuarios();

                    this.nombre = '';
                    this.apellido = '';
                    this.email = '';
                    this.clave = '';
                });
        },

        consultarUsuarios() {
            axios.get('consultar.php')
                .then(response => {
                    this.usuarios = response.data;
                });
        },

        eliminarUsuario(id) {
            let formData = new FormData();
            formData.append('id', id);

            axios.post('eliminar.php', formData)
                .then(response => {
                    alert(response.data);
                    this.consultarUsuarios();
                });
        }
    },

    mounted() {
        this.consultarUsuarios();
    }
});