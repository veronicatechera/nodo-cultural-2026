/* ============================================ */
/* NODO CULTURAL - JAVASCRIPT PRINCIPAL         */
/* ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // ============================================
    // 1. MENÚ MÓVIL (Hamburguesa)
    // ============================================
    const navbarToggle = document.querySelector('.navbar__toggle');
    const navbarMenu = document.querySelector('.navbar__menu');
    const navbarOverlay = document.createElement('div');
    navbarOverlay.className = 'navbar__overlay';
    document.body.appendChild(navbarOverlay);

    function toggleMenu() {
        const isOpen = navbarMenu.classList.toggle('navbar__menu--abierto');
        navbarToggle.classList.toggle('navbar__toggle--activo');
        navbarOverlay.classList.toggle('navbar__overlay--activo');
        navbarToggle.setAttribute('aria-expanded', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    function closeMenu() {
        navbarMenu.classList.remove('navbar__menu--abierto');
        navbarToggle.classList.remove('navbar__toggle--activo');
        navbarOverlay.classList.remove('navbar__overlay--activo');
        navbarToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    if (navbarToggle) {
        navbarToggle.addEventListener('click', toggleMenu);
    }

    if (navbarOverlay) {
        navbarOverlay.addEventListener('click', closeMenu);
    }

    // Cerrar menú al hacer clic en un enlace
    const navLinks = document.querySelectorAll('.navbar__link');
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Cerrar menú al redimensionar a > 1024px
    window.addEventListener('resize', function() {
        if (window.innerWidth > 1024) {
            closeMenu();
        }
    });

    // ============================================
    // 2. BÚSQUEDA RÁPIDA
    // ============================================
    const searchForm = document.querySelector('.buscador-rapido__form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const input = this.querySelector('.buscador-rapido__input');
            const query = input.value.trim();
            if (query) {
                window.location.href = 'catalogo.html?q=' + encodeURIComponent(query);
            }
        });
    }

    // Sugerencias populares (clic)
    const sugerencias = document.querySelectorAll('.buscador-rapido__sugerencias a');
    sugerencias.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const query = this.textContent.trim();
            const input = document.querySelector('.buscador-rapido__input');
            if (input) {
                input.value = query;
                // Disparar búsqueda automática
                const form = input.closest('form');
                if (form) {
                    form.dispatchEvent(new Event('submit'));
                }
            }
        });
    });

    // ============================================
    // 3. BOLETÍN (suscripción simulada)
    // ============================================
    const boletinForm = document.querySelector('.boletin__form');
    if (boletinForm) {
        boletinForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const input = this.querySelector('.boletin__input');
            const email = input.value.trim();
            if (email && email.includes('@')) {
                // Simular éxito
                const originalText = input.placeholder;
                input.value = '';
                input.placeholder = '✅ ¡Suscripción exitosa!';
                input.disabled = true;
                this.querySelector('.boletin__boton').textContent = '¡Listo!';
                setTimeout(() => {
                    input.placeholder = originalText;
                    input.disabled = false;
                    this.querySelector('.boletin__boton').innerHTML = 'Suscribirme <i class="fa-solid fa-paper-plane" aria-hidden="true"></i>';
                }, 3000);
            } else {
                alert('Por favor, ingresá un correo electrónico válido.');
                input.focus();
            }
        });
    }

    // ============================================
    // 4. ASISTENTE CULTURAL (simulado)
    // ============================================
    const asistenteChat = document.querySelector('.asistente__chat');
    const asistenteInput = document.querySelector('.asistente__input');
    const asistenteEnviar = document.querySelector('.asistente__enviar');
    const asistenteMensajes = document.querySelector('.asistente__mensajes');

    // Sugerencias del asistente (botones)
    const sugerenciasAsistente = document.querySelectorAll('.asistente__sugerencia');
    sugerenciasAsistente.forEach(btn => {
        btn.addEventListener('click', function() {
            const consulta = this.getAttribute('data-consulta') || this.textContent.trim();
            if (asistenteInput) {
                asistenteInput.value = consulta;
                enviarConsulta(consulta);
            }
        });
    });

    function enviarConsulta(texto) {
        if (!texto || texto.trim() === '') return;

        // Mostrar mensaje del usuario
        agregarMensaje('usuario', texto);

        // Limpiar input
        if (asistenteInput) {
            asistenteInput.value = '';
        }

        // Simular respuesta del bot después de 1 segundo
        setTimeout(() => {
            const respuestas = [
                '¡Excelente pregunta! Te recomiendo visitar nuestra sección de <a href="catalogo.html">Actividades</a> donde encontrarás muchas opciones.',
                'Para eso te sugiero explorar los <a href="recursos.html">Recursos educativos</a>, tenemos material muy completo.',
                'Podés consultar la <a href="agenda.html">Agenda Cultural</a> para ver todas las actividades programadas.',
                'Si buscás instituciones, visitá <a href="museos.html">Instituciones</a> y encontrá museos, bibliotecas y centros culturales.',
                'Para planificar una visita educativa, te recomiendo la sección <a href="instituciones-educativas.html">Para docentes</a>.'
            ];
            const respuestaAleatoria = respuestas[Math.floor(Math.random() * respuestas.length)];
            agregarMensaje('bot', respuestaAleatoria);
        }, 800);
    }

    function agregarMensaje(tipo, contenido) {
        if (!asistenteMensajes) return;

        const div = document.createElement('div');
        div.className = `asistente__mensaje asistente__mensaje--${tipo}`;

        const avatar = document.createElement('div');
        avatar.className = 'asistente__avatar';
        avatar.setAttribute('aria-hidden', 'true');
        avatar.innerHTML = tipo === 'bot' ? '<i class="fa-solid fa-robot"></i>' : '<i class="fa-solid fa-user"></i>';

        const burbuja = document.createElement('div');
        burbuja.className = 'asistente__burbuja';
        burbuja.innerHTML = `<p>${contenido}</p>`;

        div.appendChild(avatar);
        div.appendChild(burbuja);

        asistenteMensajes.appendChild(div);

        // Scroll al final
        asistenteMensajes.scrollTop = asistenteMensajes.scrollHeight;
    }

    // Enviar consulta con Enter o clic
    if (asistenteEnviar) {
        asistenteEnviar.addEventListener('click', function(e) {
            e.preventDefault();
            const texto = asistenteInput ? asistenteInput.value : '';
            enviarConsulta(texto);
        });
    }

    if (asistenteInput) {
        asistenteInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                enviarConsulta(this.value);
            }
        });
    }

    // ============================================
    // 5. FAVORITOS (con localStorage)
    // ============================================
    // Obtener favoritos guardados
    let favoritos = [];
    try {
        const stored = localStorage.getItem('nodocultural_favoritos');
        if (stored) {
            favoritos = JSON.parse(stored);
        }
    } catch (e) {
        favoritos = [];
    }

    function guardarFavoritos() {
        localStorage.setItem('nodocultural_favoritos', JSON.stringify(favoritos));
    }

    function toggleFavorito(elemento) {
        const card = elemento.closest('.card');
        if (!card) return;

        // Buscar un identificador único: puede ser el título o un data-id
        const titulo = card.querySelector('.card__titulo')?.textContent?.trim() || '';
        const enlace = card.querySelector('a[href]')?.getAttribute('href') || '';
        const id = titulo + '|' + enlace; // Identificador compuesto

        const index = favoritos.indexOf(id);
        if (index === -1) {
            favoritos.push(id);
            elemento.classList.add('card__favorito--activo');
            elemento.querySelector('i').classList.remove('fa-regular');
            elemento.querySelector('i').classList.add('fa-solid');
        } else {
            favoritos.splice(index, 1);
            elemento.classList.remove('card__favorito--activo');
            elemento.querySelector('i').classList.remove('fa-solid');
            elemento.querySelector('i').classList.add('fa-regular');
        }
        guardarFavoritos();
    }

    // Inicializar favoritos en la página
    document.querySelectorAll('.card__favorito').forEach(btn => {
        const card = btn.closest('.card');
        if (card) {
            const titulo = card.querySelector('.card__titulo')?.textContent?.trim() || '';
            const enlace = card.querySelector('a[href]')?.getAttribute('href') || '';
            const id = titulo + '|' + enlace;
            if (favoritos.includes(id)) {
                btn.classList.add('card__favorito--activo');
                btn.querySelector('i').classList.remove('fa-regular');
                btn.querySelector('i').classList.add('fa-solid');
            }
        }

        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorito(this);
        });
    });

    // ============================================
    // 6. NAVEGACIÓN SUAVE (anclas internas)
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // 7. LOG (para saber que todo cargó)
    // ============================================
    console.log('✅ Nodo Cultural - JavaScript inicializado correctamente');

    /* ============================================ */
/* NODO CULTURAL - JAVASCRIPT PRINCIPAL         */
/* ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // ============================================
    // 1. MENÚ MÓVIL
    // ============================================
    const navbarToggle = document.querySelector('.navbar__toggle');
    const navbarMenu = document.querySelector('.navbar__menu');
    const navbarOverlay = document.createElement('div');
    navbarOverlay.className = 'navbar__overlay';
    document.body.appendChild(navbarOverlay);

    function toggleMenu() {
        const isOpen = navbarMenu.classList.toggle('navbar__menu--abierto');
        navbarToggle.classList.toggle('navbar__toggle--activo');
        navbarOverlay.classList.toggle('navbar__overlay--activo');
        navbarToggle.setAttribute('aria-expanded', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    function closeMenu() {
        navbarMenu.classList.remove('navbar__menu--abierto');
        navbarToggle.classList.remove('navbar__toggle--activo');
        navbarOverlay.classList.remove('navbar__overlay--activo');
        navbarToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    if (navbarToggle) {
        navbarToggle.addEventListener('click', toggleMenu);
    }
    if (navbarOverlay) {
        navbarOverlay.addEventListener('click', closeMenu);
    }

    document.querySelectorAll('.navbar__link').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    window.addEventListener('resize', function() {
        if (window.innerWidth > 1024) closeMenu();
    });

    // ============================================
    // 2. BÚSQUEDA RÁPIDA
    // ============================================
    const searchForm = document.querySelector('.buscador-rapido__form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const input = this.querySelector('.buscador-rapido__input');
            const query = input.value.trim();
            if (query) {
                window.location.href = 'catalogo.html?q=' + encodeURIComponent(query);
            }
        });
    }

    document.querySelectorAll('.buscador-rapido__sugerencias a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const query = this.textContent.trim();
            const input = document.querySelector('.buscador-rapido__input');
            if (input) {
                input.value = query;
                input.closest('form').dispatchEvent(new Event('submit'));
            }
        });
    });

    // ============================================
    // 3. BOLETÍN
    // ============================================
    const boletinForm = document.querySelector('.boletin__form');
    if (boletinForm) {
        boletinForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const input = this.querySelector('.boletin__input');
            const email = input.value.trim();
            if (email && email.includes('@')) {
                input.value = '';
                input.placeholder = '✅ ¡Suscripción exitosa!';
                input.disabled = true;
                this.querySelector('.boletin__boton').textContent = '¡Listo!';
                setTimeout(() => {
                    input.placeholder = 'Tu correo electrónico';
                    input.disabled = false;
                    this.querySelector('.boletin__boton').innerHTML =
                        'Suscribirme <i class="fa-solid fa-paper-plane" aria-hidden="true"></i>';
                }, 3000);
            } else {
                alert('Por favor, ingresá un correo electrónico válido.');
                input.focus();
            }
        });
    }

    // ============================================
    // 4. ASISTENTE CULTURAL
    // ============================================
    const asistenteInput = document.querySelector('.asistente__input');
    const asistenteEnviar = document.querySelector('.asistente__enviar');
    const asistenteMensajes = document.querySelector('.asistente__mensajes');

    document.querySelectorAll('.asistente__sugerencia').forEach(btn => {
        btn.addEventListener('click', function() {
            const consulta = this.getAttribute('data-consulta') || this.textContent.trim();
            if (asistenteInput) {
                asistenteInput.value = consulta;
                enviarConsulta(consulta);
            }
        });
    });

    function enviarConsulta(texto) {
        if (!texto || texto.trim() === '') return;
        agregarMensaje('usuario', texto);
        if (asistenteInput) asistenteInput.value = '';

        setTimeout(() => {
            const respuestas = [
                '¡Excelente pregunta! Te recomiendo visitar nuestra sección de <a href="catalogo.html">Actividades</a>.',
                'Para eso, explorá los <a href="recursos.html">Recursos educativos</a>.',
                'Podés consultar la <a href="agenda.html">Agenda Cultural</a>.',
                'Si buscás instituciones, visitá <a href="museos.html">Instituciones</a>.',
                'Para planificar una visita educativa, <a href="instituciones-educativas.html">Para docentes</a>.'
            ];
            const respuestaAleatoria = respuestas[Math.floor(Math.random() * respuestas.length)];
            agregarMensaje('bot', respuestaAleatoria);
        }, 800);
    }

    function agregarMensaje(tipo, contenido) {
        if (!asistenteMensajes) return;
        const div = document.createElement('div');
        div.className = `asistente__mensaje asistente__mensaje--${tipo}`;
        const avatar = document.createElement('div');
        avatar.className = 'asistente__avatar';
        avatar.setAttribute('aria-hidden', 'true');
        avatar.innerHTML = tipo === 'bot' ?
            '<i class="fa-solid fa-robot"></i>' :
            '<i class="fa-solid fa-user"></i>';
        const burbuja = document.createElement('div');
        burbuja.className = 'asistente__burbuja';
        burbuja.innerHTML = `<p>${contenido}</p>`;
        div.appendChild(avatar);
        div.appendChild(burbuja);
        asistenteMensajes.appendChild(div);
        asistenteMensajes.scrollTop = asistenteMensajes.scrollHeight;
    }

    if (asistenteEnviar) {
        asistenteEnviar.addEventListener('click', function(e) {
            e.preventDefault();
            enviarConsulta(asistenteInput ? asistenteInput.value : '');
        });
    }
    if (asistenteInput) {
        asistenteInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                enviarConsulta(this.value);
            }
        });
    }

    // ============================================
    // 5. FAVORITOS
    // ============================================
    let favoritos = [];
    try {
        const stored = localStorage.getItem('nodocultural_favoritos');
        if (stored) favoritos = JSON.parse(stored);
    } catch (e) { favoritos = []; }

    function guardarFavoritos() {
        localStorage.setItem('nodocultural_favoritos', JSON.stringify(favoritos));
    }

    function toggleFavorito(elemento) {
        const card = elemento.closest('.card');
        if (!card) return;
        const titulo = card.querySelector('.card__titulo')?.textContent?.trim() || '';
        const enlace = card.querySelector('a[href]')?.getAttribute('href') || '';
        const id = titulo + '|' + enlace;
        const index = favoritos.indexOf(id);
        if (index === -1) {
            favoritos.push(id);
            elemento.classList.add('card__favorito--activo');
            elemento.querySelector('i').classList.replace('fa-regular', 'fa-solid');
        } else {
            favoritos.splice(index, 1);
            elemento.classList.remove('card__favorito--activo');
            elemento.querySelector('i').classList.replace('fa-solid', 'fa-regular');
        }
        guardarFavoritos();
    }

    document.querySelectorAll('.card__favorito').forEach(btn => {
        const card = btn.closest('.card');
        if (card) {
            const titulo = card.querySelector('.card__titulo')?.textContent?.trim() || '';
            const enlace = card.querySelector('a[href]')?.getAttribute('href') || '';
            const id = titulo + '|' + enlace;
            if (favoritos.includes(id)) {
                btn.classList.add('card__favorito--activo');
                btn.querySelector('i').classList.replace('fa-regular', 'fa-solid');
            }
        }
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorito(this);
        });
    });

    // ============================================
    // 6. NAVEGACIÓN SUAVE
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                const targetPosition = target.getBoundingClientRect().top +
                    window.pageYOffset - headerHeight;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });

    // ============================================
    // 7. EJEMPLO DE USO DE CALCULOS.JS
    // ============================================
    // Si el objeto Calculos está disponible (desde calculos.js)
    if (typeof Calculos !== 'undefined') {
        console.log('📊 Módulo de cálculos cargado correctamente');

        // Ejemplo: datos de una actividad simulada
        const actividadEjemplo = {
            titulo: 'Taller de Fotografía',
            fecha: '2026-08-15',
            cupos: 20,
            inscritos: 12,
            edadMinima: 16,
            departamento: 'Montevideo',
            categoria: 'taller'
        };

        // Calcular estado
        const disponibles = Calculos.cuposDisponibles(
            actividadEjemplo.cupos,
            actividadEjemplo.inscritos
        );
        const porcentaje = Calculos.porcentajeOcupacion(
            actividadEjemplo.cupos,
            actividadEjemplo.inscritos
        );
        const estado = Calculos.estadoCupos(
            actividadEjemplo.cupos,
            actividadEjemplo.inscritos
        );

        console.log(`📌 ${actividadEjemplo.titulo}`);
        console.log(`   Cupos: ${disponibles} disponibles de ${actividadEjemplo.cupos}`);
        console.log(`   Ocupación: ${porcentaje}% (${estado})`);
        console.log(`   Fecha: ${Calculos.formatearFechaLarga(actividadEjemplo.fecha)}`);

    } else {
        console.warn('⚠️ Módulo de cálculos no encontrado. Asegurate de incluir calculos.js');
    }

    console.log('✅ Nodo Cultural - JavaScript inicializado correctamente');
});
// ============================================
// 8. INSCRIPCIONES A CURSOS (con calculos.js)
// ============================================

// Cargar inscripciones guardadas
if (typeof Calculos !== 'undefined') {
    Calculos.cargarInscripciones();

    // Actualizar todos los contadores al cargar la página
    document.querySelectorAll('.cupos-disponibles').forEach(el => {
        const cursoId = el.getAttribute('data-curso');
        const disponibles = Calculos.obtenerCuposDisponibles(cursoId);
        el.textContent = disponibles;
    });

    // Botones de inscripción
    document.querySelectorAll('.btn-inscribir').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const cursoId = this.getAttribute('data-curso');
            const resultado = Calculos.inscribir(cursoId);

            // Actualizar contador visual
            const contador = document.querySelector(`.cupos-disponibles[data-curso="${cursoId}"]`);
            if (contador) {
                contador.textContent = Calculos.obtenerCuposDisponibles(cursoId);
            }

            // Mostrar mensaje
            const mensajeEl = document.getElementById(`mensaje-${cursoId}`);
            if (mensajeEl) {
                mensajeEl.textContent = resultado.mensaje;
                mensajeEl.style.display = 'block';
                mensajeEl.style.color = resultado.exito ? 'var(--color-exito)' : 'var(--color-error)';

                // Ocultar después de 4 segundos
                setTimeout(() => {
                    mensajeEl.style.display = 'none';
                }, 4000);
            }

            // Si no hay cupos, deshabilitar botón
            if (!Calculos.hayCupo(cursoId)) {
                this.disabled = true;
                this.innerHTML = '<i class="fa-solid fa-times-circle" aria-hidden="true"></i> Sin cupos';
                this.classList.remove('btn--primario');
                this.classList.add('btn--outline');
            }
        });
    });

    console.log('✅ Sistema de inscripciones inicializado');
}

}); // Fin DOMContentLoaded