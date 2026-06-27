function validarRegistro(event) {
    event.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const apellido = document.getElementById("apellido").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();
    const fechaNacimiento = document.getElementById("fechaNacimiento").value;
    let valido = true;

    Validaciones.limpiarErrores([
        "errorNombre",
        "errorApellido",
        "errorFecha",
        "errorCorreo",
        "errorPassword",
        "errorConfirm"
    ]);

    if (nombre === "") {
        mostrarError("errorNombre", "Nombre obligatorio");
        valido = false;
    } else if (!Validaciones.esTextoHumanoValido(nombre, 2, 60)) {
        mostrarError("errorNombre", "Ingrese un nombre válido");
        valido = false;
    }

    if (apellido === "") {
        mostrarError("errorApellido", "Apellido obligatorio");
        valido = false;
    } else if (!Validaciones.esTextoHumanoValido(apellido, 2, 60)) {
        mostrarError("errorApellido", "Ingrese un apellido válido");
        valido = false;
    }

    if (!validarEdad(fechaNacimiento)) {
        mostrarError("errorFecha", "Debe ser mayor de 18 años");
        valido = false;
    }
    
    if (correo === "") {
        mostrarError("errorCorreo", "Correo obligatorio");
        valido = false;
    } else if (!Validaciones.esCorreoValido(correo)) {
        mostrarError("errorCorreo", "Ingrese un correo válido");
        valido = false;
    }

    if (password === "") {
        mostrarError("errorPassword", "La contraseña es obligatoria");
        valido = false;
    } else if (!Validaciones.esPasswordValida(password)) {
        mostrarError("errorPassword", "Debe tener entre 4 y 10 caracteres");
        valido = false;
    }

    if (confirmPassword === "") {
        mostrarError("errorConfirm", "Debe confirmar la contraseña");
        valido = false;
    } else if (password !== confirmPassword) {
        mostrarError("errorConfirm", "Las contraseñas no coinciden");
        valido = false;
    }

    if (!valido) {
        return;
    }

    const usuarios = Validaciones.leerJsonStorage("usuarios", []);
    const existe = usuarios.some(item => item.correo?.toLowerCase() === correo.toLowerCase());

    if (existe) {
        mostrarError("errorCorreo", "Este correo ya está registrado");
        return;
    }

    usuarios.push({
        nombre,
        apellido,
        correo: correo.toLowerCase(),
        password,
        fechaNacimiento,
        puntos: 0,
        descuentoPermanente: Validaciones.obtenerDescuentoPermanente(correo),
        ultimaCompra: "Sin compras registradas",
        historial: []
    });

    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    localStorage.setItem("usuarioActivo", JSON.stringify(usuarios[usuarios.length - 1]));
    alert("Usuario registrado con éxito");
    document.getElementById("formRegistro").reset();
    window.location.href = "perfil.html";
}

document
    .getElementById("formRegistro")
    .addEventListener("submit", validarRegistro);
