function validarContacto(event) {
    event.preventDefault();

    const nombre = document.getElementById("nombreContacto").value.trim();
    const correo = document.getElementById("correoContacto").value.trim();
    const motivo = document.getElementById("motivoContacto").value.trim();
    const comentario = document.getElementById("comentarioContacto").value.trim();
    let valido = true;

    Validaciones.limpiarErrores(["errorNombre", "errorCorreo", "errorMotivo", "errorComentario"]);

    if (nombre === "") {
        mostrarError("errorNombre", "Nombre obligatorio");
        valido = false;
    } else if (!Validaciones.esTextoHumanoValido(nombre, 2, 100)) {
        mostrarError("errorNombre", "Ingrese un nombre válido");
        valido = false;
    }

    if (correo === "") {
        mostrarError("errorCorreo", "Correo obligatorio");
        valido = false;
    } else if (!Validaciones.esCorreoValido(correo)) {
        mostrarError("errorCorreo", "Correo inválido");
        valido = false;
    }

    if (motivo === "") {
        mostrarError("errorMotivo", "Selecciona un motivo de contacto");
        valido = false;
    }

    if (comentario === "") {
        mostrarError("errorComentario", "Mensaje obligatorio");
        valido = false;
    } else if (comentario.length > 500) {
        mostrarError("errorComentario", "Máximo 500 caracteres");
        valido = false;
    }

    if (valido) {
        alert("Mensaje enviado. Nuestro equipo de soporte se pondrá en contacto contigo.");
        document.getElementById("formContacto").reset();
    }
}

const formContacto = document.getElementById("formContacto");
if (formContacto) {
    formContacto.addEventListener("submit", validarContacto);
}
