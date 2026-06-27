function esCredencialAdmin(email, password) {
    const usuario = email.trim().toLowerCase();
    return (usuario === "superusuario@gmail.com" || usuario === "admin") && password === "admin1234";
}

function iniciarSesion(event) {
    event.preventDefault();

    const email = document.getElementById("emailLogin").value.trim().toLowerCase();
    const password = document.getElementById("passLogin").value.trim();
    Validaciones.limpiarErrores(["errorEmail", "errorPassword"]);
    console.log(email);
    let valido = true;
    
    if (email === "") {
        mostrarError("errorEmail", "El correo o usuario es obligatorio");
        valido = false;
    } else if (email !== "admin" && !Validaciones.esCorreoValido(email)) {
        mostrarError("errorEmail", "Ingrese un correo válido (Gmail, INACAP o DUOC) o el usuario admin");
        valido = false;
    }

    if (password === "") {
        mostrarError("errorPassword", "La contraseña es obligatoria");
        valido = false;
    } else if (!Validaciones.esPasswordValida(password)) {
        mostrarError("errorPassword", "Debe tener entre 4 y 10 caracteres");
        valido = false;
    }

    if (!valido) {
        return;
    }

    const usuarios = Validaciones.leerJsonStorage("usuarios", []);
    const usuarioRegistrado = usuarios.find(item => item.correo?.toLowerCase() === email && item.password === password);

    const params = new URLSearchParams(window.location.search);
    const redirect = params.get("redirect");

    if (esCredencialAdmin(email, password)) {
        const adminUser = {
            nombre: "Administrador",
            apellido: "",
            correo: email,
            password: password,
            puntos: 9999,
            rol: "admin"
        };
        localStorage.setItem("usuarioActivo", JSON.stringify(adminUser));
        window.location.href = "admin.html";
        return;
    }

    if (!usuarioRegistrado) {
        mostrarError("errorEmail", "Credenciales inválidas");
        return;
    }

    const usuarioActivo = {
        ...usuarioRegistrado,
        descuentoPermanente: Validaciones.obtenerDescuentoPermanente(usuarioRegistrado.correo),
        ultimaCompra: usuarioRegistrado.ultimaCompra || "Sin compras registradas",
        historial: Array.isArray(usuarioRegistrado.historial) ? usuarioRegistrado.historial : []
    };

    const indiceUsuario = usuarios.findIndex(item => item.correo?.toLowerCase() === email && item.password === password);
    if (indiceUsuario !== -1) {
        usuarios[indiceUsuario] = usuarioActivo;
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
    }

    localStorage.setItem("usuarioActivo", JSON.stringify(usuarioActivo));
    window.location.href = redirect === "admin.html" ? "perfil.html" : (redirect || "perfil.html");
}

document
    .getElementById("formLogin")
    .addEventListener("submit", iniciarSesion);
