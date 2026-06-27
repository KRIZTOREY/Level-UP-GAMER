document.addEventListener("DOMContentLoaded", () => {
    const usuario = Validaciones.leerJsonStorage("usuarioActivo", null);
    const form = document.getElementById("formPago");
    const mensaje = document.getElementById("mensajePago");
    const numeroTarjeta = document.getElementById("numeroTarjeta");
    const fechaExpiracion = document.getElementById("fechaExpiracion");
    const cvc = document.getElementById("cvc");

    if (!usuario) {
        window.location.href = "login.html?redirect=pago.html";
        return;
    }

    formatearCampoTarjeta(numeroTarjeta);
    formatearCampoExpiracion(fechaExpiracion);
    limitarCampoNumerico(cvc, 4);

    if (form) {
        form.addEventListener("submit", event => {
            event.preventDefault();

            const nombreTitular = document.getElementById("nombreTitular").value.trim();
            const tarjeta = numeroTarjeta.value.trim();
            const expiracion = fechaExpiracion.value.trim();
            const codigo = cvc.value.trim();

            limpiarMensajePago(mensaje);

            if (!Validaciones.esTextoHumanoValido(nombreTitular, 4, 80)) {
                mostrarMensajePago(mensaje, "Ingrese el nombre completo del titular.");
                marcarCampo("nombreTitular");
                return;
            }

            if (!Validaciones.esNumeroTarjetaValido(tarjeta)) {
                mostrarMensajePago(mensaje, "Ingrese un número de tarjeta válido.");
                marcarCampo("numeroTarjeta");
                return;
            }

            if (!Validaciones.esFechaExpiracionValida(expiracion)) {
                mostrarMensajePago(mensaje, "Ingrese una fecha vigente en formato MM/AA.");
                marcarCampo("fechaExpiracion");
                return;
            }

            if (!Validaciones.esCvcValido(codigo)) {
                mostrarMensajePago(mensaje, "Ingrese un CVC de 3 o 4 dígitos.");
                marcarCampo("cvc");
                return;
            }

            const carrito = Validaciones.leerJsonStorage("carrito", []);
            let productosPago = Validaciones.leerJsonStorage("catalogoProductos", []);
            const usuarios = Validaciones.leerJsonStorage("usuarios", []);
            const descuento = Number(usuario?.descuentoPermanente || (/@duoc\.cl$/i.test(String(usuario?.correo || "")) ? 20 : 0) || 0);
            const subtotal = carrito.reduce((total, item) => total + (Number(item.precio) || 0) * (Number(item.cantidad) || 1), 0);
            const descuentoMonto = Math.round(subtotal * (descuento / 100));
            const totalFinal = subtotal - descuentoMonto;
            const resumenCompra = Validaciones.obtenerCompraResumen(carrito);

            carrito.forEach(item => {

                const producto = productosPago.find(p => p.codigo === item.codigo);

                if (producto) {
                    producto.stock -= item.cantidad;

                    if (producto.stock < 0) {
                        producto.stock = 0;
                    }
                }

            });

            localStorage.setItem(
                "catalogoProductos",
                JSON.stringify(productosPago)
            );

            const compraRealizada = {
                fecha: new Date().toISOString(),
                subtotal,
                descuento,
                descuentoMonto,
                total: totalFinal,
                resumen: resumenCompra,
                productos: carrito
            };

            const usuarioActualizado = {
                ...usuario,
                descuentoPermanente: descuento,
                ultimaCompra: `${resumenCompra} - Total $${totalFinal.toLocaleString("es-CL")}`,
                historial: [
                    `${resumenCompra} - Total $${totalFinal.toLocaleString("es-CL")}`,
                    ...(Array.isArray(usuario.historial) ? usuario.historial : [])
                ].slice(0, 10),
                compras: [
                    compraRealizada,
                    ...(Array.isArray(usuario.compras) ? usuario.compras : [])
                ].slice(0, 10)
            };

            const indiceUsuario = usuarios.findIndex(item => item.correo?.toLowerCase() === String(usuario.correo || "").toLowerCase());
            if (indiceUsuario !== -1) {
                usuarios[indiceUsuario] = usuarioActualizado;
                localStorage.setItem("usuarios", JSON.stringify(usuarios));
            }

            localStorage.setItem("usuarioActivo", JSON.stringify(usuarioActualizado));

            localStorage.removeItem("carrito");

            alert(`Pago simulado completado. Gracias por tu compra. Total final: $${totalFinal.toLocaleString("es-CL")}${descuento > 0 ? " con descuento DUOC aplicado." : "."}`);

            window.location.href = "perfil.html";
        });
    }
});

function mostrarMensajePago(mensaje, texto) {
    if (mensaje) {
        mensaje.textContent = texto;
        mensaje.classList.add("visible");
    }
}

function limpiarMensajePago(mensaje) {
    if (mensaje) {
        mensaje.textContent = "";
        mensaje.classList.remove("visible");
    }

    ["nombreTitular", "numeroTarjeta", "fechaExpiracion", "cvc"].forEach(id => {
        document.getElementById(id)?.removeAttribute("aria-invalid");
    });
}

function marcarCampo(id) {
    const campo = document.getElementById(id);
    if (!campo) return;

    campo.setAttribute("aria-invalid", "true");
    campo.focus();
}

function formatearCampoTarjeta(campo) {
    if (!campo) return;

    campo.addEventListener("input", () => {
        const digitos = Validaciones.soloDigitos(campo.value).slice(0, 19);
        campo.value = digitos.replace(/(.{4})/g, "$1 ").trim();
    });
}

function formatearCampoExpiracion(campo) {
    if (!campo) return;

    campo.addEventListener("input", () => {
        const digitos = Validaciones.soloDigitos(campo.value).slice(0, 4);
        campo.value = digitos.length > 2 ? `${digitos.slice(0, 2)}/${digitos.slice(2)}` : digitos;
    });
}

function limitarCampoNumerico(campo, max) {
    if (!campo) return;

    campo.addEventListener("input", () => {
        campo.value = Validaciones.soloDigitos(campo.value).slice(0, max);
    });
}
