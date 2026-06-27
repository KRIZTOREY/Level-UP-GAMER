document.addEventListener("DOMContentLoaded", () => {
    const usuario = JSON.parse(localStorage.getItem("usuarioActivo") || "null");

    if (!usuario) {
        window.location.href = "/src/pages/login.html?redirect=perfil.html";
        return;
    }

    if (usuario.rol === "admin") {
        window.location.href = "/src/pages/admin.html";
        return;
    }

    const nombreEl = document.getElementById("perfilNombre");
    const emailEl = document.getElementById("perfilEmail");
    const nivelEl = document.getElementById("perfilNivel");
    const puntosEl = document.getElementById("perfilPuntos");
    const descuentoEl = document.getElementById("perfilDescuento");
    const historialEl = document.getElementById("perfilHistorial");
    const logoutPerfilBtn = document.getElementById("logoutPerfilBtn");

    function esCorreoDuoc(correo) {
        return /@duoc\.cl$/i.test(String(correo || "").trim());
    }

    if (nombreEl && usuario) {
        nombreEl.textContent = `${usuario.nombre} ${usuario.apellido}`;
    }

    if (emailEl && usuario) {
        emailEl.textContent = usuario.correo;
    }

    if (nivelEl && puntosEl) {
        const puntos = Number(usuario?.puntos || 0);
        if (puntos >= 5000) {
            nivelEl.textContent = "Dios del Gaming";
        } else if (puntos >= 500) {
            nivelEl.textContent = "Semi-Dios del Gaming";
        } else {
            nivelEl.textContent = "Mortal del Gaming";
        }
        puntosEl.textContent = `${puntos} puntos`;
    }

    if (descuentoEl) {
        const descuento = Number(usuario?.descuentoPermanente || (esCorreoDuoc(usuario?.correo) ? 20 : 0));
        descuentoEl.textContent = descuento > 0
            ? `${descuento}% de descuento permanente`
            : "Sin descuento permanente";
    }

    if (historialEl) {
        const historial = Array.isArray(usuario.historial) && usuario.historial.length > 0
            ? usuario.historial
            : [usuario.ultimaCompra || "Sin compras registradas"];
        historialEl.innerHTML = historial.map(item => `<li>${item}</li>`).join("");
    }

    if (logoutPerfilBtn) {
        logoutPerfilBtn.addEventListener("click", () => {
            localStorage.removeItem("usuarioActivo");
            window.location.href = "/index.html";
        });
    }
});
