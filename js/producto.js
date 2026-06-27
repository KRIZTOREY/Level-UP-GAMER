let detalleProductoSeleccionado = null;

document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const codigo = params.get("code");
    const contenedor = document.getElementById("detalleProducto");

    if (!contenedor) {
        return;
    }

    const producto = typeof productos !== "undefined" && productos.find(p => p.codigo === codigo) || (typeof productos !== "undefined" ? productos[0] : null);
    detalleProductoSeleccionado = producto;

    if (!producto) {
        contenedor.innerHTML = "<p>Producto no encontrado.</p>";
        return;
    }

    const imagenesProducto = producto.imagenes && producto.imagenes.length > 0
        ? producto.imagenes
        : [IMAGEN_PRODUCTO_DEFECTO];

    const imagenPrincipal = encodeURI(imagenesProducto[0]);

    const thumbnails = imagenesProducto
        .map((img, index) => `
            <div class="thumb ${index === 0 ? "active" : ""}" data-index="${index}" style="background-image: url('${encodeURI(img)}')"></div>
        `).join("");

    contenedor.innerHTML = `
        <div class="detalle-card">
            <div class="detalle-left">
                <div class="detalle-imagen grande" id="productoCarousel">
                    <img src="${imagenPrincipal}" alt="${escaparHtml(producto.nombre)}" id="imagenPrincipalProducto">
                </div>
                <div class="detalle-thumbs">
                    ${thumbnails}
                </div>
            </div>
            <div class="detalle-info">
                <nav class="breadcrumb">
                    <a href="catalogo.html">Home</a> / <a href="catalogo.html">${escaparHtml(producto.categoria)}</a> / <span>${escaparHtml(producto.nombre)}</span>
                </nav>
                <h1>${escaparHtml(producto.nombre)}</h1>
                <p class="precio">$${Number(producto.precio).toLocaleString("es-CL")}</p>
                <p class="descripcion">${escaparHtml(producto.descripcion)}</p>
                <div class="detalle-meta">
                    <p><strong>Categoría:</strong> ${escaparHtml(producto.categoria)}</p>
                    <p><strong>Código:</strong> ${escaparHtml(producto.codigo)}</p>
                    <p><strong>Stock:</strong> ${Number(producto.stock)}</p>
                </div>
                <div class="detalle-actions">
                    <div class="cantidad-control">
                        <button type="button" onclick="ajustarCantidadDetalle(-1)">-</button>

                        <input
                            type="number"
                            id="detalleCantidad"
                            value="1"
                            min="1"
                            max="${producto.stock}">

                        <button type="button" onclick="ajustarCantidadDetalle(1)">+</button>
                    </div>

                    <button type="button" id="btnAgregarDetalle" class="btn">
                        Añadir al carrito
                    </button>

                    <button type="button" id="btnCompartirDetalle" class="btn outline">
                        Compartir
                    </button>
                </div>
            </div>
        </div>

        <section class="related-products">
            <h3>Productos relacionados</h3>
            <div class="productos relacionados" id="relatedProducts"></div>
        </section>
    `;

    inicializarCarousel(imagenesProducto, producto.nombre);

    const btnAgregar = document.getElementById("btnAgregarDetalle");
    if (btnAgregar) {
        btnAgregar.addEventListener("click", () => {
            const cantidad = Number(document.getElementById("detalleCantidad").value) || 1;

            if (cantidad < 1) {
                alert("La cantidad debe ser mayor a 0.");
                return;
            }

            if (cantidad > producto.stock) {
                alert(`Solo hay ${producto.stock} unidades disponibles.`);
                return;
            }

            agregarAlCarrito({ ...producto, cantidad });
        });
    }

    const btnCompartir = document.getElementById("btnCompartirDetalle");
    if (btnCompartir && typeof compartirContenido === "function") {
        btnCompartir.addEventListener("click", () => {
            compartirContenido({
                titulo: producto.nombre,
                texto: `Producto destacado de Level-Up Gamer: ${producto.nombre} por $${Number(producto.precio).toLocaleString("es-CL")}.`,
                url: window.location.href
            });
        });
    }

    mostrarProductosRelacionados(producto);
});

function inicializarCarousel(imagenes, nombreProducto) {
    const mainImage = document.getElementById("imagenPrincipalProducto");
    const thumbItems = Array.from(document.querySelectorAll(".detalle-thumbs .thumb"));

    if (!mainImage || thumbItems.length === 0) {
        return;
    }

    let indiceActivo = 0;

    function actualizarCarousel() {
        mainImage.src = encodeURI(imagenes[indiceActivo]);
        mainImage.alt = `Imagen ${indiceActivo + 1} de ${nombreProducto}`;
        thumbItems.forEach((thumb, index) => {
            thumb.classList.toggle("active", index === indiceActivo);
        });
    }

    thumbItems.forEach((thumb, index) => {
        thumb.addEventListener("click", () => {
            indiceActivo = index;
            actualizarCarousel();
        });
    });
}

function ajustarCantidadDetalle(delta) {
    const input = document.getElementById("detalleCantidad");
    if (!input) {
        return;
    }
    const valor = Math.max(1, Number(input.value || 1) + delta);
    input.value = valor;
}

function mostrarProductosRelacionados(productoActual) {
    const contenedor = document.getElementById("relatedProducts");
    if (!contenedor || !productoActual) {
        return;
    }

    const relacionados = productos.filter(producto => producto.codigo !== productoActual.codigo).slice(0, 4);
    contenedor.innerHTML = relacionados
        .map(producto => {
            const imagenRelacionado = producto.imagenes && producto.imagenes.length > 0
                ? producto.imagenes[0]
                : IMAGEN_PRODUCTO_DEFECTO;

            return `
            <div class="card-producto related-card">
                <div class="related-image" style="background-image: url('${encodeURI(imagenRelacionado)}');"></div>
                <h3>${escaparHtml(producto.nombre)}</h3>
                <p class="precio">$${Number(producto.precio).toLocaleString("es-CL")}</p>
                <a class="btn outline" href="producto.html?code=${encodeURIComponent(producto.codigo)}">Ver producto</a>
            </div>
        `;
        })
        .join("");
}
