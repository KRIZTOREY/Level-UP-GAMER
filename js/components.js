const siteHeader = document.getElementById("siteHeader");
const siteFooter = document.getElementById("siteFooter");

async function cargarComponente(element, ruta) {
    if (!element) {
        return;
    }

    try {
        const response = await fetch(`/./components/${ruta}`);
        if (!response.ok) {
            throw new Error(`Error ${response.status}`);
        }

        element.innerHTML = await response.text();
    } catch (error) {
        console.error(`No se pudo cargar ${ruta}:`, error);
    }
}

function resaltarNavActivo() {
    const ruta = window.location.pathname.toLowerCase();
    const links = document.querySelectorAll(".main-nav a");

    links.forEach(link => {
        const href = link.getAttribute("href").toLowerCase();
        if (ruta.endsWith(href) || ruta.includes(href.replace("/./pages/", ""))) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });
}

function obtenerUsuarioActivo() {
    try {
        return JSON.parse(localStorage.getItem("usuarioActivo") || "null");
    } catch {
        return null;
    }
}

function esUsuarioAdmin(usuario) {
    return usuario?.rol === "admin" || ((usuario?.correo === "superusuario@gmail.com" || usuario?.correo === "admin") && usuario?.password === "admin1234");
}

function obtenerCarrito() {
    try {
        return JSON.parse(localStorage.getItem("carrito") || "[]") || [];
    } catch {
        return [];
    }
}

function actualizarContadorCarrito() {
    const contador = document.getElementById('cartCount');
    if (!contador) {
        return;
    }

    const totalItems = obtenerCarrito().reduce((sum, item) => sum + (Number(item.cantidad) || 1), 0);
    contador.textContent = totalItems;
}

function actualizarHeaderSegunRol() {
    const usuario = obtenerUsuarioActivo();
    const adminLink = document.querySelector('.main-nav a[href="/./pages/admin.html"]');
    const logoutBtn = document.getElementById('logoutBtn');
    const loginBtn = document.getElementById('loginLink');
    const registerBtn = document.getElementById('registerLink');

    if (adminLink) {
        adminLink.style.display = esUsuarioAdmin(usuario) ? "" : "none";
    }

    if (logoutBtn) {
        if (usuario) {
            logoutBtn.style.display = "inline-flex";
            if (loginBtn) loginBtn.style.display = "none";
            if (registerBtn) registerBtn.style.display = "none";
        } else {
            logoutBtn.style.display = "none";
            if (loginBtn) loginBtn.style.display = "inline-flex";
            if (registerBtn) registerBtn.style.display = "inline-flex";
        }
    }

    if (logoutBtn) {
        logoutBtn.onclick = () => {
            localStorage.removeItem('usuarioActivo');
            window.location.href = '/index.html';
        };
    }
}

async function compartirContenido({ titulo, texto, url }) {
    const data = {
        title: titulo,
        text: texto,
        url: url || window.location.href
    };

    try {
        if (navigator.share) {
            await navigator.share(data);
            return true;
        }

        if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(`${data.title}\n${data.text}\n${data.url}`);
            alert("Enlace copiado para compartir.");
            return true;
        }
    } catch (error) {
        console.error("No se pudo compartir el contenido:", error);
    }

    return false;
}

window.actualizarContadorCarrito = actualizarContadorCarrito;
window.compartirContenido = compartirContenido;

document.addEventListener("DOMContentLoaded", async () => {
    await cargarComponente(siteHeader, "header.html");
    await cargarComponente(siteFooter, "footer.html");
    resaltarNavActivo();
    actualizarHeaderSegunRol();
    actualizarContadorCarrito();
});
