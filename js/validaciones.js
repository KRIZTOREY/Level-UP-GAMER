const Validaciones = (() => {
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const SOLO_TEXTO_REGEX = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/;

    function obtenerElemento(id) {
        return typeof id === "string" ? document.getElementById(id) : id;
    }

    function obtenerValor(id) {
        const elemento = obtenerElemento(id);
        return elemento ? elemento.value.trim() : "";
    }

    function mostrarError(id, mensaje) {
        const elemento = obtenerElemento(id);
        if (!elemento) return;

        elemento.textContent = mensaje;
        elemento.classList.add("visible");

        const campoId = elemento.dataset.for;
        const campo = campoId ? document.getElementById(campoId) : null;
        if (campo) {
            campo.setAttribute("aria-invalid", "true");
            campo.setAttribute("aria-describedby", elemento.id);
        }
    }

    function limpiarError(id) {
        const elemento = obtenerElemento(id);
        if (!elemento) return;

        elemento.textContent = "";
        elemento.classList.remove("visible");

        const campoId = elemento.dataset.for;
        const campo = campoId ? document.getElementById(campoId) : null;
        if (campo) {
            campo.removeAttribute("aria-invalid");
        }
    }

    function limpiarErrores(ids) {
        ids.forEach(limpiarError);
    }

    function esCorreoValido(correo) {
        const regex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|inacap\.cl|inacapmail\.cl|duoc\.cl)$/i;
        return correo.length <= 100 && regex.test(correo);
    }

    function esCorreoDuoc(correo) {
        return /@duoc\.cl$/i.test(String(correo).trim());
    }

    function obtenerDescuentoPermanente(correo) {
        return esCorreoDuoc(correo) ? 20 : 0;
    }

    function obtenerCompraResumen(carrito) {
        const items = Array.isArray(carrito) ? carrito : [];
        const totalProductos = items.reduce((total, item) => total + (Number(item.cantidad) || 1), 0);
        const nombres = items.map(item => item.nombre).filter(Boolean);
        return `Última compra: ${nombres.join(", ") || "Sin productos"} (${totalProductos} artículo${totalProductos === 1 ? "" : "s"})`;
    }

    function esTextoHumanoValido(texto, min = 2, max = 100) {
        const valor = String(texto).trim();
        return valor.length >= min && valor.length <= max && SOLO_TEXTO_REGEX.test(valor);
    }

    function validarEdad(fechaNacimiento, edadMinima = 18) {
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

    function esPasswordValida(password, min = 4, max = 10) {
        const valor = String(password);
        return valor.length >= min && valor.length <= max;
    }

    function soloDigitos(valor) {
        return String(valor).replace(/\D/g, "");
    }

    function esNumeroTarjetaValido(numero) {
        const digitos = soloDigitos(numero);
        if (digitos.length < 13 || digitos.length > 19) return false;

        let suma = 0;
        let duplicar = false;

        for (let i = digitos.length - 1; i >= 0; i--) {
            let digito = Number(digitos[i]);
            if (duplicar) {
                digito *= 2;
                if (digito > 9) digito -= 9;
            }
            suma += digito;
            duplicar = !duplicar;
        }

        return suma % 10 === 0;
    }

    function esCvcValido(cvc) {
        return /^\d{3,4}$/.test(String(cvc).trim());
    }

    function esFechaExpiracionValida(fecha) {
        const match = String(fecha).trim().match(/^(0[1-9]|1[0-2])\/(\d{2})$/);
        if (!match) return false;

        const mes = Number(match[1]);
        const anio = 2000 + Number(match[2]);
        const ultimoDiaMes = new Date(anio, mes, 0, 23, 59, 59);

        return ultimoDiaMes >= new Date();
    }

    function escaparHtml(valor) {
        return String(valor)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    function leerJsonStorage(clave, fallback) {
        try {
            const valor = JSON.parse(localStorage.getItem(clave) || "null");
            return valor ?? fallback;
        } catch {
            return fallback;
        }
    }

    return {
        obtenerValor,
        mostrarError,
        limpiarError,
        limpiarErrores,
        esCorreoValido,
        esCorreoDuoc,
        obtenerDescuentoPermanente,
        obtenerCompraResumen,
        esTextoHumanoValido,
        validarEdad,
        esPasswordValida,
        soloDigitos,
        esNumeroTarjetaValido,
        esCvcValido,
        esFechaExpiracionValida,
        escaparHtml,
        leerJsonStorage
    };
})();

window.Validaciones = Validaciones;
window.mostrarError = Validaciones.mostrarError;
window.limpiarError = Validaciones.limpiarError;
window.validarEdad = Validaciones.validarEdad;
