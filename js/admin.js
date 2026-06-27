function obtenerUsuarioActivo() {
    try {
        return JSON.parse(localStorage.getItem("usuarioActivo") || "null");
    } catch {
        return null;
    }
}

function esAdminUsuario(usuario) {
    return usuario?.rol === "admin" || ((usuario?.correo === "superusuario@gmail.com" || usuario?.correo === "admin") && usuario?.password === "admin1234");
}

document.addEventListener("DOMContentLoaded", () => {
    const usuario = obtenerUsuarioActivo();

    if (!esAdminUsuario(usuario)) {
        window.location.href = "login.html?redirect=admin.html";
        return;
    }

    renderAdminProductos();
    renderAdminResumen();

    const form = document.getElementById("formProductoAdmin");
    if (form) {
        form.addEventListener("submit", guardarProductoAdmin);
    }

    const nuevoProductoBtn = document.getElementById("nuevoProductoAdminBtn");
    if (nuevoProductoBtn) {
        nuevoProductoBtn.addEventListener("click", () => {
            limpiarFormularioAdmin();
            document.getElementById("codigoProductoAdmin")?.focus();
        });
    }

    const logoutBtn = document.getElementById("adminLogoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("usuarioActivo");
            window.location.href = "../../index.html";
        });
    }
});

function limpiarFormularioAdmin(limpiarMensaje = true) {
    const form = document.getElementById("formProductoAdmin");
    if (!form) return;
    form.reset();

    const modo = document.getElementById("modoEdicionAdmin");
    const codigo = document.getElementById("codigoProductoAdmin");
    const botonGuardar = document.getElementById("btnGuardarProductoAdmin");
    const mensaje = document.getElementById("mensajeAdmin");

    if (modo) {
        modo.value = "crear";
    }
    if (codigo) {
        codigo.disabled = false;
    }
    if (botonGuardar) {
        botonGuardar.textContent = "Guardar producto";
    }
    if (mensaje && limpiarMensaje) {
        mensaje.textContent = "";
        mensaje.classList.remove("success");
    }
}

function renderAdminProductos() {
    const contenedor = document.getElementById("listaProductosAdmin");
    if (!contenedor) return;

    if (productos.length === 0) {
        contenedor.innerHTML = "<p>No hay productos registrados.</p>";
        return;
    }

    contenedor.innerHTML = `
        <table class="admin-table">
            <thead>
                <tr>
                    <th>Código</th>
                    <th>Producto</th>
                    <th>Categoría</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                ${productos.map(producto => `
                    <tr>
                        <td>${escaparHtml(producto.codigo)}</td>
                        <td>${escaparHtml(producto.nombre)}</td>
                        <td>${escaparHtml(producto.categoria)}</td>
                        <td>$${Number(producto.precio).toLocaleString("es-CL")}</td>
                        <td>${Number(producto.stock)}</td>
                        <td class="admin-actions-cell">
                            <button type="button" onclick="editarProductoAdmin('${escaparHtml(producto.codigo)}')">Editar</button>
                            <button type="button" class="btn outline" onclick="eliminarProductoAdmin('${escaparHtml(producto.codigo)}')">Eliminar</button>
                        </td>
                    </tr>
                `).join("")}
            </tbody>
        </table>
    `;
}

function renderAdminResumen() {
    const totalProductos = document.getElementById("adminTotalProductos");
    const totalStock = document.getElementById("adminTotalStock");
    const totalCategorias = document.getElementById("adminTotalCategorias");
    const actividad = document.getElementById("adminActividad");

    const stock = productos.reduce((total, producto) => total + Number(producto.stock || 0), 0);
    const categorias = new Set(productos.map(producto => producto.categoria).filter(Boolean));

    if (totalProductos) totalProductos.textContent = productos.length;
    if (totalStock) totalStock.textContent = stock;
    if (totalCategorias) totalCategorias.textContent = categorias.size;

    if (actividad) {
        const ultimos = productos.slice(-3).reverse();
        actividad.innerHTML = ultimos.length
            ? ultimos.map(producto => `<li>${escaparHtml(producto.nombre)} · Stock ${Number(producto.stock || 0)}</li>`).join("")
            : "<li>Sin actividad registrada.</li>";
    }
}

function guardarProductoAdmin(event) {
    event.preventDefault();

    const codigoInput = document.getElementById("codigoProductoAdmin");
    const codigo = codigoInput.value.trim().toUpperCase();
    const nombre = document.getElementById("nombreProductoAdmin").value.trim();
    const categoria = document.getElementById("categoriaProductoAdmin").value.trim();
    const precio = Number(document.getElementById("precioProductoAdmin").value);
    const stock = Number(document.getElementById("stockProductoAdmin").value);
    const descripcion = document.getElementById("descripcionProductoAdmin").value.trim();
    const modo = document.getElementById("modoEdicionAdmin").value;

    if (!codigo || !nombre || !categoria || !descripcion || !Number.isFinite(precio) || !Number.isFinite(stock) || precio < 0 || stock < 0) {
        mostrarMensajeAdmin("Completa todos los campos con valores válidos.");
        return;
    }

    const productoExistente = productos.find(item => item.codigo === codigo);
    const nuevoProducto = {
        codigo,
        nombre,
        precio,
        categoria,
        descripcion,
        stock,
        imagenes: productoExistente?.imagenes || ["/./assets/favicon/favicon.png"]
    };

    const index = productos.findIndex(item => item.codigo === codigo);

    if (modo === "editar") {
        if (index === -1) {
            mostrarMensajeAdmin("No se encontró el producto a editar.");
            return;
        }
        productos[index] = nuevoProducto;
    } else {
        if (index !== -1) {
            mostrarMensajeAdmin("Ya existe ese código de producto.");
            codigoInput.focus();
            return;
        }
        productos.push(nuevoProducto);
    }

    guardarProductos();
    renderAdminProductos();
    renderAdminResumen();
    limpiarFormularioAdmin(false);
    mostrarMensajeAdmin("Producto guardado correctamente.", true);
}

function editarProductoAdmin(codigo) {
    const producto = productos.find(item => item.codigo === codigo);
    if (!producto) return;

    document.getElementById("modoEdicionAdmin").value = "editar";
    document.getElementById("codigoProductoAdmin").value = producto.codigo;
    document.getElementById("codigoProductoAdmin").disabled = true;
    document.getElementById("nombreProductoAdmin").value = producto.nombre;
    document.getElementById("categoriaProductoAdmin").value = producto.categoria;
    document.getElementById("precioProductoAdmin").value = producto.precio;
    document.getElementById("stockProductoAdmin").value = producto.stock;
    document.getElementById("descripcionProductoAdmin").value = producto.descripcion;
    document.getElementById("btnGuardarProductoAdmin").textContent = "Guardar cambios";
    mostrarMensajeAdmin("Editando " + producto.nombre + ".", true);
    document.getElementById("formProductoAdmin").scrollIntoView({ behavior: "smooth", block: "start" });
}

function eliminarProductoAdmin(codigo) {
    const producto = productos.find(item => item.codigo === codigo);
    if (!producto) return;

    if (!window.confirm("¿Eliminar " + producto.nombre + " del catálogo?")) return;

    productos = productos.filter(item => item.codigo !== codigo);
    guardarProductos();
    renderAdminProductos();
    renderAdminResumen();
    limpiarFormularioAdmin(false);
    mostrarMensajeAdmin("Producto eliminado correctamente.", true);
}

function mostrarMensajeAdmin(mensaje, exitoso = false) {
    const contenedor = document.getElementById("mensajeAdmin");
    if (!contenedor) return;

    contenedor.textContent = mensaje;
    contenedor.classList.toggle("success", exitoso);
}

window.guardarProductoAdmin = guardarProductoAdmin;
window.editarProductoAdmin = editarProductoAdmin;
window.eliminarProductoAdmin = eliminarProductoAdmin;
window.limpiarFormularioAdmin = limpiarFormularioAdmin;
