# LEVEL UP GAMER

> Tienda gamer estática con diseño oscuro/neon, catálogo dinámico y funciones pensadas para una experiencia de compra completa.

## Descripción

`LEVEL UP GAMER` es una aplicación web estática construida con HTML, CSS y JavaScript vanilla. El proyecto incluye catálogo de productos, ficha de producto, carrito, administración básica, perfiles de usuario, noticias, eventos, soporte y componentes reutilizables.

La experiencia está orientada a un contexto gamer con promociones, contenido editorial y acciones rápidas para compartir productos y ofertas.

## Demo local

Para ver el proyecto localmente necesitas un servidor estático. Si tienes Python 3 instalado:

1. Abre una terminal en la carpeta del proyecto.
2. Ejecuta:

```bash
python -m http.server 8000
```

3. Abre `http://localhost:8000` en tu navegador.

## Características

- Catálogo de productos con tarjetas dinámicas y detalle individual.
- Carrito de compras con cálculo de subtotal, descuento DUOC y total final.
- Registro y login con persistencia en `localStorage`.
- Descuento permanente del 20% para correos `@duoc.cl`.
- Última compra registrada y visible en el perfil.
- Soporte con contacto directo a WhatsApp.
- Eventos con selector dinámico de región y comuna.
- Noticias, guías y consejos con estilo editorial.
- Botones para compartir productos, promociones y contenido.
- Componentes HTML reutilizables: header, footer y navegación.
- Diseño responsivo con enfoque gamer y estética neon.

## Tecnologías

- HTML5
- CSS3
- JavaScript (vanilla)
- `localStorage`
- Sitio estático compatible con GitHub Pages o cualquier hosting simple

## Estructura del proyecto

- `index.html` — Página principal
- `src/assets/` — Imágenes, banners, favicons y productos
- `src/components/` — Fragmentos HTML reutilizables
- `src/css/` — Hojas de estilo globales, por componente y por página
- `src/js/` — Lógica de cliente para productos, carrito, validaciones, perfil, noticias y eventos
- `src/pages/` — Páginas internas como catálogo, carrito, pago, soporte, noticias y eventos

## Cómo contribuir

Si quieres mejorar el proyecto, sigue estos pasos:

1. Haz un fork o copia local.
2. Crea una rama nueva: `git checkout -b mejora/mi-cambio`.
3. Realiza los cambios y prueba localmente.
4. Abre un Pull Request describiendo los cambios y qué se buscaba mejorar.

## Buenas prácticas

- Mantén los componentes HTML pequeños y reutilizables.
- Separa la lógica (JS) de la vista (HTML) cuando el proyecto crezca.
- Añade pruebas manuales para flujos críticos como registro, carrito y pago.
- Conserva coherencia visual entre páginas para no romper la identidad gamer.

## Ideas de mejoras futuras

- Migrar la persistencia a un backend ligero para usuarios, pedidos y stock.
- Añadir filtros más avanzados por marca, precio y categoría.
- Integrar un panel de administración con métricas de ventas y productos.
- Automatizar pruebas y despliegue continuo.

## Licencia

Este proyecto está bajo la licencia MIT — modifica según necesites.

## Contacto

Autor: Tu Nombre Aquí — reemplaza con tu nombre y correo.

---

Notas: agrega capturas, enlace de despliegue y tu nombre real para dejar el README listo como portafolio.
