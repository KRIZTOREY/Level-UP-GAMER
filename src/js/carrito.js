function obtenerCarrito() {
    try {
        return JSON.parse(localStorage.getItem("carrito") || "[]") || [];
    } catch {
        return [];
    }
}

let carrito = obtenerCarrito();

function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
    if (typeof actualizarContadorCarrito === "function") {
        actualizarContadorCarrito();
    }
}

function obtenerImagenProducto(producto) {
    return producto.imagenes && producto.imagenes.length > 0
        ? encodeURI(producto.imagenes[0])
    : "/src/assets/favicon/favicon.png";
}

function obtenerUsuarioActivo() {
    try {
        return JSON.parse(localStorage.getItem("usuarioActivo") || "null");
    } catch {
        return null;
    }
}

function esCorreoDuoc(correo) {
    return /@duoc\.cl$/i.test(String(correo || "").trim());
}

function obtenerDescuentoCarrito(usuario) {
    return Number(usuario?.descuentoPermanente || (esCorreoDuoc(usuario?.correo) ? 20 : 0) || 0);
}

function agregarAlCarrito(producto) {

    const cantidad = Number(producto.cantidad) || 1;

    const catalogo = JSON.parse(
        localStorage.getItem("catalogoProductos") || "[]"
    );

    const productoReal = catalogo.find(
        item => item.codigo === producto.codigo
    );

    if (!productoReal) {
        alert("Producto no encontrado.");
        return;
    }


    const existente = carrito.find(
        item => item.codigo === producto.codigo
    );


    const cantidadTotal = existente
        ? existente.cantidad + cantidad
        : cantidad;


    if (cantidadTotal > productoReal.stock) {
        alert(`Solo hay ${productoReal.stock} unidades disponibles.`);
        return;
    }


    if (existente) {

        existente.cantidad = cantidadTotal;

    } else {

        carrito.push({
            ...productoReal,
            cantidad
        });

    }


    guardarCarrito();


    alert(`${producto.nombre} agregado al carrito.`);

    mostrarCarrito();
}

function mostrarCarrito() {
    const contenedor = document.getElementById("carritoContenido");
    const resumen = document.getElementById("carritoResumen");

    if (!contenedor) {
        return;
    }

    // 👇 AGREGA ESTO AQUÍ
    const catalogo = JSON.parse(localStorage.getItem("catalogoProductos") || "[]");

    carrito = carrito.filter(item =>
        catalogo.some(producto => producto.codigo === item.codigo)
    );

    guardarCarrito();
    // 👆 HASTA AQUÍ

    if (carrito.length === 0) {
        contenedor.innerHTML = "<p>El carrito está vacío.</p>";
        if (resumen) {
            resumen.innerHTML = "";
        }
        return;
    }

    let total = 0;
    const usuario = obtenerUsuarioActivo();
    const descuento = obtenerDescuentoCarrito(usuario);
    contenedor.innerHTML = carrito
        .map((producto, indice) => {
            const cantidad = Number(producto.cantidad) || 1;
            const subtotal = cantidad * Number(producto.precio);
            total += subtotal;
            return `
                <div class="carrito-item">
                    <div class="item-info">
                        <div>
                            <h3>${producto.nombre}</h3>
                            <p>Código: ${producto.codigo}</p>
                            <p>Cantidad: ${cantidad}</p>
                        </div>
                        <p class="item-price">$${subtotal.toLocaleString("es-CL")}</p>
                    </div>
                    <p>Precio unitario: $${Number(producto.precio).toLocaleString("es-CL")}</p>
                    <button type="button" onclick="eliminarProducto(${indice})">Eliminar</button>
                </div>
            `;
        })
        .join("");

    const descuentoMonto = descuento > 0 ? Math.round(total * (descuento / 100)) : 0;
    const totalFinal = total - descuentoMonto;

    if (resumen) {
        resumen.innerHTML = `
            <div class="resumen-card">
                <h3>Resumen</h3>
                <p>Subtotal: $${total.toLocaleString("es-CL")}</p>
                <p>Descuento permanente: ${descuento > 0 ? `${descuento}% (-$${descuentoMonto.toLocaleString("es-CL")})` : "0%"}</p>
                <p class="resumen-total">$${totalFinal.toLocaleString("es-CL")}</p>
                <button type="button" onclick="finalizarCompra()">Ir a pago</button>
            </div>
        `;
    }
}

function eliminarProducto(indice) {
    carrito.splice(indice, 1);
    guardarCarrito();
    mostrarCarrito();
}

function finalizarCompra() {
    if (carrito.length === 0) {
        alert("No hay productos en el carrito.");
        return;
    }

    window.location.href = "pago.html";
}
function vaciarCarrito() {
    carrito = [];
    guardarCarrito();
    mostrarCarrito();
}

document.addEventListener("DOMContentLoaded", mostrarCarrito);