document.addEventListener("DOMContentLoaded", () => {
    cargarProductos();
    prepararEditorCatalogo();

    const buscador = document.getElementById("buscadorProductos");
    if (buscador) {
        buscador.addEventListener("input", event => {
            filtrarProductos(event.target.value);
        });
    }

    const contenedor = document.getElementById("productos");
    if (contenedor) {
        contenedor.addEventListener("click", manejarAccionProducto);
    }
});

function filtrarProductos(texto) {
    const filtro = texto.trim().toLowerCase();
    const contenedor = document.getElementById("productos");
    if (!contenedor) {
        return;
    }

    const listaFiltrada = productos.filter(producto => {
        return (
            producto.nombre.toLowerCase().includes(filtro) ||
            producto.codigo.toLowerCase().includes(filtro) ||
            producto.categoria.toLowerCase().includes(filtro)
        );
    });

    if (listaFiltrada.length === 0) {
        contenedor.innerHTML = "<p>No se encontraron productos.</p>";
        return;
    }

    contenedor.innerHTML = listaFiltrada
        .map(producto => crearTarjetaProducto(producto))
        .join("");
}

function prepararEditorCatalogo() {
    const editor = document.getElementById("catalogoEditor");
    const form = document.getElementById("formProducto");
    const btnNuevo = document.getElementById("btnNuevoProducto");
    const btnCancelar = document.getElementById("btnCancelarEdicion");

    if (!form || !esAdminActual()) {
        if (editor) {
            editor.hidden = true;
        }
        return;
    }

    if (editor) {
        editor.hidden = false;
    }

    form.addEventListener("submit", guardarProductoDesdeFormulario);

    if (btnNuevo) {
        btnNuevo.addEventListener("click", limpiarFormularioProducto);
    }

    if (btnCancelar) {
        btnCancelar.addEventListener("click", limpiarFormularioProducto);
    }
}

function manejarAccionProducto(event) {
    const control = event.target.closest("[data-action]");
    if (!control) {
        return;
    }

    const codigo = control.dataset.codigo;
    const producto = buscarProductoPorCodigo(codigo);

    if (!producto) {
        mostrarMensajeCatalogo("Producto no encontrado.");
        return;
    }

    if (control.dataset.action === "carrito") {
        agregarAlCarrito(producto);
        return;
    }

    if (control.dataset.action === "compartir") {
        if (typeof compartirContenido === "function") {
            compartirContenido({
                titulo: producto.nombre,
                texto: `Mira este producto de Level-Up Gamer: ${producto.nombre} por $${Number(producto.precio).toLocaleString("es-CL")}.`,
                url: `${window.location.origin}/src/pages/producto.html?code=${encodeURIComponent(producto.codigo)}`
            });
        }
        return;
    }

    if (control.dataset.action === "editar") {
        cargarProductoEnFormulario(producto);
        return;
    }

    if (control.dataset.action === "eliminar") {
        eliminarProductoCatalogo(producto.codigo);
    }
}

function guardarProductoDesdeFormulario(event) {
    event.preventDefault();

    const modoEdicion = document.getElementById("modoEdicion");
    const codigoInput = document.getElementById("codigoProducto");
    const producto = obtenerProductoDesdeFormulario();

    if (!producto) {
        return;
    }

    const indiceExistente = productos.findIndex(item => item.codigo === producto.codigo);
    const editando = modoEdicion.value === "editar";

    if (!editando && indiceExistente !== -1) {
        mostrarMensajeCatalogo("Ya existe un producto con ese código.");
        codigoInput.focus();
        return;
    }

    if (editando) {
        const codigoOriginal = codigoInput.dataset.codigoOriginal;
        const indiceOriginal = productos.findIndex(item => item.codigo === codigoOriginal);
        const codigoDuplicado = productos.some((item, indice) => item.codigo === producto.codigo && indice !== indiceOriginal);

        if (indiceOriginal === -1) {
            mostrarMensajeCatalogo("No se pudo encontrar el producto original.");
            return;
        }

        if (codigoDuplicado) {
            mostrarMensajeCatalogo("Ya existe otro producto con ese código.");
            codigoInput.focus();
            return;
        }

        productos[indiceOriginal] = producto;
        mostrarMensajeCatalogo("Producto actualizado.");
    } else {
        productos.push(producto);
        mostrarMensajeCatalogo("Producto agregado.");
    }

    guardarProductos();
    limpiarFormularioProducto(false);
    refrescarCatalogo();
}

function obtenerProductoDesdeFormulario() {
    const codigo = document.getElementById("codigoProducto").value.trim().toUpperCase();
    const nombre = document.getElementById("nombreProducto").value.trim();
    const categoria = document.getElementById("categoriaProducto").value.trim();
    const descripcion = document.getElementById("descripcionProducto").value.trim();
    const precio = Number(document.getElementById("precioProducto").value);
    const stock = Number(document.getElementById("stockProducto").value);

    if (!codigo || !nombre || !categoria || !descripcion || !Number.isFinite(precio) || !Number.isFinite(stock) || precio < 0 || stock < 0) {
        mostrarMensajeCatalogo("Completa todos los campos con valores válidos.");
        return null;
    }

    const productoExistente = buscarProductoPorCodigo(codigo);

    return {
        codigo,
        nombre,
        precio,
        categoria,
        descripcion,
        stock,
        imagenes: productoExistente?.imagenes || ["/src/assets/favicon/favicon.png"]
    };
}

function cargarProductoEnFormulario(producto) {
    document.getElementById("modoEdicion").value = "editar";
    document.getElementById("codigoProducto").value = producto.codigo;
    document.getElementById("codigoProducto").dataset.codigoOriginal = producto.codigo;
    document.getElementById("nombreProducto").value = producto.nombre;
    document.getElementById("categoriaProducto").value = producto.categoria;
    document.getElementById("precioProducto").value = producto.precio;
    document.getElementById("stockProducto").value = producto.stock;
    document.getElementById("descripcionProducto").value = producto.descripcion;
    document.getElementById("btnGuardarProducto").textContent = "Guardar cambios";
    mostrarMensajeCatalogo("Editando " + producto.nombre + ".");
    document.getElementById("formProducto").scrollIntoView({ behavior: "smooth", block: "start" });
}

function limpiarFormularioProducto(limpiarMensaje = true) {
    const form = document.getElementById("formProducto");
    form.reset();
    document.getElementById("modoEdicion").value = "crear";
    document.getElementById("codigoProducto").dataset.codigoOriginal = "";
    document.getElementById("btnGuardarProducto").textContent = "Guardar producto";

    if (limpiarMensaje) {
        mostrarMensajeCatalogo("");
    }
}

function eliminarProductoCatalogo(codigo) {
    const producto = buscarProductoPorCodigo(codigo);
    const confirmado = window.confirm("¿Eliminar " + producto.nombre + " del catálogo?");

    if (!confirmado) {
        return;
    }

    productos = productos.filter(item => item.codigo !== codigo);
    guardarProductos();
    limpiarFormularioProducto(false);
    refrescarCatalogo();
    mostrarMensajeCatalogo("Producto eliminado.");
}

function refrescarCatalogo() {
    const buscador = document.getElementById("buscadorProductos");

    if (buscador && buscador.value.trim()) {
        filtrarProductos(buscador.value);
        return;
    }

    cargarProductos();
}

function mostrarMensajeCatalogo(mensaje) {
    const contenedor = document.getElementById("mensajeCatalogo");
    if (contenedor) {
        contenedor.textContent = mensaje;
    }
}
