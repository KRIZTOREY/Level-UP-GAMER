function validarEdad(fechaNacimiento, edadMinima = 18) {
    if (window.Validaciones?.validarEdad) {
        return window.Validaciones.validarEdad(fechaNacimiento, edadMinima);
    }

    if (!fechaNacimiento) return false;

    const nacimiento = new Date(`${fechaNacimiento}T00:00:00`);
    if (Number.isNaN(nacimiento.getTime())) return false;

    const hoy = new Date();
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();

    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
    }

    return edad >= edadMinima;
}
