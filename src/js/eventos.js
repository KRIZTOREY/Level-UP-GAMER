const EVENTOS_REGIONES = {
    'Región de Antofagasta': {
        comunas: ['Antofagasta', 'Calama', 'Tocopilla'],
        evento: 'Antofagasta Arena Gaming',
        descripcion: 'Showmatch, free play y stands de periféricos en el norte del país.',
        puntos: 150
    },
    'Región de Valparaíso': {
        comunas: ['Valparaíso', 'Viña del Mar', 'Quilpué'],
        evento: 'Valparaíso Esports Day',
        descripcion: 'Torneo abierto con estaciones de prueba y premios instantáneos.',
        puntos: 120
    },
    'Región Metropolitana': {
        comunas: ['Santiago', 'Providencia', 'Las Condes'],
        evento: 'Santiago Game Festival',
        descripcion: 'Competencias principales, invitados especiales y experiencia de comunidad.',
        puntos: 200
    },
    'Región del Biobío': {
        comunas: ['Concepción', 'Talcahuano', 'San Pedro de la Paz'],
        evento: 'Concepción Retro Night',
        descripcion: 'Espacio para consolas clásicas, coleccionismo y ranking de asistencia.',
        puntos: 100
    },
    'Región del Maule': {
        comunas: ['Talca', 'Curicó', 'Linares'],
        evento: 'Maule Battle Zone',
        descripcion: 'Encuentro competitivo con desafíos, demo stations y actividades de comunidad.',
        puntos: 110
    },
    'Región de Los Lagos': {
        comunas: ['Puerto Montt', 'Osorno', 'Castro'],
        evento: 'Lagos Level-Up Fest',
        descripcion: 'Jornada gamer con exhibición de productos y bonos por participación.',
        puntos: 130
    }
};

const regionSelect = document.getElementById('regionEvento');
const comunaSelect = document.getElementById('comunaEvento');
const eventoNombre = document.getElementById('eventoNombre');
const eventoDescripcion = document.getElementById('eventoDescripcion');
const eventoRegion = document.getElementById('eventoRegion');
const eventoComuna = document.getElementById('eventoComuna');
const eventoPuntos = document.getElementById('eventoPuntos');
const eventoTarjetaActiva = document.getElementById('eventoTarjetaActiva');

function limpiarSelect(select, placeholder) {
    select.innerHTML = '';
    const option = document.createElement('option');
    option.value = '';
    option.textContent = placeholder;
    select.appendChild(option);
}

function cargarRegiones() {
    if (!regionSelect) return;

    limpiarSelect(regionSelect, 'Selecciona una región');

    Object.keys(EVENTOS_REGIONES).forEach(region => {
        const option = document.createElement('option');
        option.value = region;
        option.textContent = region;
        regionSelect.appendChild(option);
    });
}

function cargarComunas(region) {
    if (!comunaSelect) return;

    const datos = EVENTOS_REGIONES[region];
    comunaSelect.disabled = !datos;
    limpiarSelect(comunaSelect, datos ? 'Selecciona una comuna' : 'Primero selecciona una región');

    if (!datos) {
        return;
    }

    datos.comunas.forEach(comuna => {
        const option = document.createElement('option');
        option.value = comuna;
        option.textContent = comuna;
        comunaSelect.appendChild(option);
    });
}

function mostrarEstado(region, comuna) {
    const datos = EVENTOS_REGIONES[region];

    if (!datos || !comuna) {
        if (eventoNombre) eventoNombre.textContent = 'Sin ubicación seleccionada';
        if (eventoDescripcion) eventoDescripcion.textContent = 'Escoge una región y una comuna para ver el evento disponible.';
        if (eventoRegion) eventoRegion.textContent = '-';
        if (eventoComuna) eventoComuna.textContent = '-';
        if (eventoPuntos) eventoPuntos.textContent = '-';
        if (eventoTarjetaActiva) {
            eventoTarjetaActiva.innerHTML = `
                <h4>Mapa activo</h4>
                <p>Selecciona una región para mostrar el evento sugerido y la comuna correspondiente.</p>
                <p><strong>Puntos:</strong> +0 LevelUp</p>
            `;
        }
        return;
    }

    if (eventoNombre) eventoNombre.textContent = datos.evento;
    if (eventoDescripcion) eventoDescripcion.textContent = datos.descripcion;
    if (eventoRegion) eventoRegion.textContent = region;
    if (eventoComuna) eventoComuna.textContent = comuna;
    if (eventoPuntos) eventoPuntos.textContent = `+${datos.puntos}`;

    if (eventoTarjetaActiva) {
        eventoTarjetaActiva.innerHTML = `
            <h4>${datos.evento}</h4>
            <p>${datos.descripcion}</p>
            <p><strong>Región:</strong> ${region}</p>
            <p><strong>Comuna:</strong> ${comuna}</p>
            <p><strong>Puntos:</strong> +${datos.puntos} LevelUp</p>
        `;
    }
}

if (regionSelect && comunaSelect) {
    cargarRegiones();

    regionSelect.addEventListener('change', () => {
        cargarComunas(regionSelect.value);
        mostrarEstado(regionSelect.value, '');
    });

    comunaSelect.addEventListener('change', () => {
        mostrarEstado(regionSelect.value, comunaSelect.value);
    });

    mostrarEstado('', '');
}
