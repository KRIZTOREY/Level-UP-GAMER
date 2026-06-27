const BASE = window.location.hostname.includes("github.io")
    ? "/Level-UP-GAMER"
    : "";

const IMAGEN_PRODUCTO_DEFECTO = `${BASE}/src/assets/favicon/favicon.png`;
const PRODUCTOS_STORAGE_KEY = "catalogoProductos";

const productosIniciales = [
    {
        codigo: "JM001",
        nombre: "Catan",
        precio: 29990,
        categoria: "Juegos de mesa",
        descripcion: "Estrategia, comercio y construcción en un clásico de mesa para la comunidad gamer.",
        stock: 12,
        imagenes: [
            `${BASE}/src/assets/productos/Catan/catan.webp`,
            `${BASE}/src/assets/productos/Catan/catan_2.webp`,
            `${BASE}/src/assets/productos/Catan/catan_3.webp`
        ]
    },
    {
        codigo: "JM002",
        nombre: "Carcassonne",
        precio: 24990,
        categoria: "Juegos de mesa",
        descripcion: "Juego de colocación de fichas donde construyes paisajes, fortalezas y caminos con estrategia.",
        stock: 9,
        imagenes: [
            "https://live.staticflickr.com/4004/4270521104_f32d9fc068_b.jpg"
        ]
    },
    {
        codigo: "AC001",
        nombre: "Controlador Inalámbrico Xbox Series X",
        precio: 59990,
        categoria: "Accesorios",
        descripcion: "Mando inalámbrico con agarre cómodo, respuesta precisa y compatibilidad con Xbox y PC.",
        stock: 14,
        imagenes: [
            "https://live.staticflickr.com/5476/11044375283_47f7a171fd_b.jpg"
        ]
    },
    {
        codigo: "AC002",
        nombre: "Auriculares Gamer HyperX Cloud II",
        precio: 79990,
        categoria: "Accesorios",
        descripcion: "Audífonos con sonido envolvente, micrófono desmontable y gran comodidad para sesiones largas.",
        stock: 11,
        imagenes: [
            "https://live.staticflickr.com/7447/10963478003_18c20b5e35_b.jpg"
        ]
    },
    {
        codigo: "CO001",
        nombre: "PlayStation 5",
        precio: 549990,
        categoria: "Consolas",
        descripcion: "La consola de nueva generación con gráficos 4K, SSD rápido y catálogo exclusivo.",
        stock: 5,
        imagenes: [
            `${BASE}/src/assets/productos/PS5/PS5.jpg`,
            `${BASE}/src/assets/productos/PS5/PS5_2.jpg`
        ]
    },
    {
        codigo: "CG001",
        nombre: "PC Gamer ASUS ROG Strix",
        precio: 1299990,
        categoria: "Computadores Gamers",
        descripcion: "Equipo de alto rendimiento para gaming exigente, multitarea y experiencia inmersiva.",
        stock: 4,
        imagenes: [
            "https://live.staticflickr.com/7337/9109281973_9f68bac445_b.jpg"
        ]
    },
    {
        codigo: "SG001",
        nombre: "Silla Gamer Secretlab Titan",
        precio: 349990,
        categoria: "Sillas Gamers",
        descripcion: "Silla ergonómica con soporte lumbar y ajuste premium para largas jornadas de juego.",
        stock: 6,
        imagenes: [
            "https://live.staticflickr.com/5301/5895210427_e912680d46_b.jpg"
        ]
    },
    {
        codigo: "MS001",
        nombre: "Logitech G502 HERO",
        precio: 49990,
        categoria: "Mouse",
        descripcion: "Mouse gamer ergonómico con sensor HERO 25K y botones programables.",
        stock: 18,
        imagenes: [
            `${BASE}/src/assets/productos/Logitech G502 HERO/Logitech_G502_HERO.webp`,
            `${BASE}/src/assets/productos/Logitech G502 HERO/Logitech_G502_HERO_2.webp`,
            `${BASE}/src/assets/productos/Logitech G502 HERO/Logitech_G502_HERO_3.webp`
        ]
    },
    {
        codigo: "KB001",
        nombre: "Razer BlackWidow",
        precio: 129990,
        categoria: "Accesorios",
        descripcion: "Teclado mecánico RGB con switches táctiles y respuesta rápida para gaming.",
        stock: 10,
        imagenes: [
            `${BASE}/src/assets/productos/Razer BlackWidow/Razer_BlackWidow.jpg`,
            `${BASE}/src/assets/productos/Razer BlackWidow/Razer_BlackWidow_2.jpg`,
            `${BASE}/src/assets/productos/Razer BlackWidow/Razer_BlackWidow_3.jpg`,
            `${BASE}/src/assets/productos/Razer BlackWidow/Razer_BlackWidow_4.jpg`
        ]
    },
    {
        codigo: "MP001",
        nombre: "Mousepad Razer Goliathus Extended Chroma",
        precio: 29990,
        categoria: "Mousepad",
        descripcion: "Superficie amplia con iluminación RGB y deslizamiento uniforme para mayor control.",
        stock: 20,
        imagenes: [
            "https://live.staticflickr.com/4082/4776723533_e434ffc277_m.jpg"
        ]
    },
    {
        codigo: "PP001",
        nombre: "Polera Gamer Personalizada 'Level-Up'",
        precio: 14990,
        categoria: "Poleras Personalizadas",
        descripcion: "Polera cómoda y personalizable con tu gamer tag o diseño favorito.",
        stock: 30,
        imagenes: [
            "https://live.staticflickr.com/5005/5362774965_9ee957c7b9_b.jpg"
        ]
    },
    {
        codigo: "PG001",
        nombre: "Polerón Gamer Personalizado",
        precio: 24990,
        categoria: "Polerones Gamers Personalizados",
        descripcion: "Polerón con estilo gamer, ideal para crear diseños a pedido y reforzar identidad de equipo.",
        stock: 16,
        imagenes: [
            "https://live.staticflickr.com/2084/1988440171_b05f747417_b.jpg"
        ]
    },
    {
        codigo: "ST001",
        nombre: "Servicio Técnico Gamer",
        precio: 19990,
        categoria: "Servicio técnico",
        descripcion: "Diagnóstico y soporte para limpieza, mantención y mejora de equipos gamer.",
        stock: 99,
        imagenes: [
            "https://live.staticflickr.com/7150/6500625219_4966a6ff53_b.jpg"
        ]
    },
    {
        codigo: "HD001",
        nombre: "SSD 1TB NVMe",
        precio: 74990,
        categoria: "Hardware",
        descripcion: "Almacenamiento rápido para rendimiento superior y tiempos de carga reducidos.",
        stock: 25,
        imagenes: [
            `${BASE}/src/assets/productos/SSD 1TB NVMe/SSD_1TB_NVMe.png`,
            `${BASE}/src/assets/productos/SSD 1TB NVMe/SSD_1TB_NVMe_2.png`,
            `${BASE}/src/assets/productos/SSD 1TB NVMe/SSD_1TB_NVMe_3.png`
        ]
    }
];

let productos = cargarProductosGuardados();

function obtenerImagenesProducto(producto) {
    return Array.isArray(producto?.imagenes) ? producto.imagenes.filter(Boolean) : [];
}

function renderizarImagenProducto(producto, variante = "card") {
    const imagenes = obtenerImagenesProducto(producto);

    if (imagenes.length > 0) {
        return `<img src="${encodeURI(imagenes[0])}" alt="Imagen de ${escaparHtml(producto.nombre)}">`;
    }

    const clase = variante === "detalle" ? "detalle-imagen-placeholder" : "producto-imagen-placeholder";
    const texto = variante === "detalle"
        ? `${escaparHtml(producto.nombre)}<br>Sin imagen disponible`
        : `${escaparHtml(producto.nombre)}<br>Sin imagen`;

    return `<div class="${clase}">${texto}</div>`;
}

function cargarProductosGuardados() {
    const productosGuardados = localStorage.getItem(PRODUCTOS_STORAGE_KEY);

    if (!productosGuardados) {
        localStorage.setItem(
            PRODUCTOS_STORAGE_KEY,
            JSON.stringify(productosIniciales)
        );
        return [...productosIniciales];
    }

    try {
        const lista = JSON.parse(productosGuardados);

        if (!Array.isArray(lista)) {
            throw new Error();
        }

        const productosPorCodigo = new Map(lista.map(producto => [producto.codigo, producto]));

        productosIniciales.forEach(productoBase => {
            const productoGuardado = productosPorCodigo.get(productoBase.codigo);
            const imagenPrincipal = Array.isArray(productoGuardado?.imagenes) ? productoGuardado.imagenes[0] : null;

            if (!productoGuardado || !imagenPrincipal || imagenPrincipal === IMAGEN_PRODUCTO_DEFECTO) {
                productosPorCodigo.set(productoBase.codigo, productoBase);
            }
        });

        const productosNormalizados = Array.from(productosPorCodigo.values());
        localStorage.setItem(PRODUCTOS_STORAGE_KEY, JSON.stringify(productosNormalizados));
        return productosNormalizados;
    } catch {
        localStorage.setItem(
            PRODUCTOS_STORAGE_KEY,
            JSON.stringify(productosIniciales)
        );

        return [...productosIniciales];
    }
}

function guardarProductos() {
    window.productos = productos;
    localStorage.setItem(PRODUCTOS_STORAGE_KEY, JSON.stringify(productos));
}

function buscarProductoPorCodigo(codigo) {
    return productos.find(producto => producto.codigo === codigo);
}

function cargarProductos() {
    const contenedor = document.getElementById("productos");
    if (!contenedor) {
        return;
    }

    if (productos.length === 0) {
        contenedor.innerHTML = "<p>No hay productos en el catálogo.</p>";
        return;
    }

    contenedor.innerHTML = productos
        .map(producto => crearTarjetaProducto(producto))
        .join("");
}

function obtenerUsuarioActivo() {
    try {
        return JSON.parse(localStorage.getItem("usuarioActivo") || "null");
    } catch {
        return null;
    }
}

function esAdminActual() {
    const usuario = obtenerUsuarioActivo();
    return usuario?.rol === "admin" || ((usuario?.correo === "superusuario@gmail.com" || usuario?.correo === "admin") && usuario?.password === "admin1234");
}

function crearTarjetaProducto(producto) {
    const accionesAdmin = esAdminActual() ? `
        <button type="button" data-action="editar" data-codigo="${escaparHtml(producto.codigo)}">Editar</button>
        <button type="button" data-action="eliminar" data-codigo="${escaparHtml(producto.codigo)}" class="btn-danger">Eliminar</button>
    ` : "";

    return `
            <div class="card-producto">
                ${renderizarImagenProducto(producto)}
                <div class="card-body">
                    <h3>${escaparHtml(producto.nombre)}</h3>
                    <p>${escaparHtml(producto.descripcion)}</p>
                    <p><strong>Código:</strong> ${escaparHtml(producto.codigo)}</p>
                    <p><strong>Stock:</strong> ${Number(producto.stock)}</p>
                    <p class="precio">$${Number(producto.precio).toLocaleString("es-CL")}</p>
                    <div class="producto-actions">
                        <button type="button" data-action="carrito" data-codigo="${escaparHtml(producto.codigo)}">Añadir al carrito</button>
                        <button type="button" data-action="compartir" data-codigo="${escaparHtml(producto.codigo)}" class="btn-share">Compartir</button>
                        ${accionesAdmin}
                        <a href="producto.html?code=${encodeURIComponent(producto.codigo)}">Ver detalle</a>
                    </div>
                </div>
            </div>
        `;
}

function escaparHtml(valor) {
    return String(valor)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

window.productos = productos;
window.guardarProductos = guardarProductos;
window.buscarProductoPorCodigo = buscarProductoPorCodigo;
window.cargarProductos = cargarProductos;
window.obtenerUsuarioActivo = obtenerUsuarioActivo;
window.esAdminActual = esAdminActual;
window.escaparHtml = escaparHtml;
window.obtenerImagenesProducto = obtenerImagenesProducto;
window.renderizarImagenProducto = renderizarImagenProducto;