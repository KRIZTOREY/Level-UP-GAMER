document.addEventListener('DOMContentLoaded', () => {
    const botonesCompartir = document.querySelectorAll('[data-share-noticia]');

    botonesCompartir.forEach(boton => {
        boton.addEventListener('click', () => {
            if (typeof compartirContenido !== 'function') {
                return;
            }

            compartirContenido({
                titulo: boton.dataset.title,
                texto: boton.dataset.text,
                url: boton.dataset.url || window.location.href
            });
        });
    });
});
