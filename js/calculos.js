/* ============================================ */
/* NODO CULTURAL - CÁLCULOS Y UTILIDADES        */
/* Gestión de inscripciones, cupos y validación */
/* ============================================ */
const Calculos = {

    // ============================================
    // 1. CÁLCULO DE CUPOS
    // ============================================

    /**
     * Calcula el porcentaje de ocupación de una actividad
     * @param {number} total - Cupos totales
     * @param {number} inscritos - Número de inscritos
     * @returns {number} Porcentaje redondeado (0-100)
     */
    porcentajeOcupacion: function(total, inscritos) {
        if (total <= 0) return 0;
        return Math.round((inscritos / total) * 100);
    },

    /**
     * Calcula los cupos disponibles
     * @param {number} total - Cupos totales
     * @param {number} inscritos - Número de inscritos
     * @returns {number} Cupos disponibles (nunca negativo)
     */
    cuposDisponibles: function(total, inscritos) {
        return Math.max(0, total - inscritos);
    },

    /**
     * Verifica si una actividad tiene cupos disponibles
     * @param {number} total - Cupos totales
     * @param {number} inscritos - Número de inscritos
     * @returns {boolean} True si hay cupos, false si está completo
     */
    hayCupos: function(total, inscritos) {
        return this.cuposDisponibles(total, inscritos) > 0;
    },

    /**
     * Obtiene el estado de una actividad según su ocupación
     * @param {number} total - Cupos totales
     * @param {number} inscritos - Número de inscritos
     * @returns {string} 'disponible', 'completo' o 'por-vencer'
     */
    estadoCupos: function(total, inscritos) {
        if (total <= 0) return 'completo';
        const ocupacion = this.porcentajeOcupacion(total, inscritos);
        if (ocupacion >= 100) return 'completo';
        if (ocupacion >= 85) return 'por-vencer';
        return 'disponible';
    },

    // ============================================
    // 2. FECHAS Y EDADES
    // ============================================

    /**
     * Calcula la edad a partir de una fecha de nacimiento
     * @param {string|Date} fechaNacimiento - Fecha de nacimiento
     * @returns {number} Edad en años
     */
    calcularEdad: function(fechaNacimiento) {
        const hoy = new Date();
        const nacimiento = new Date(fechaNacimiento);
        if (isNaN(nacimiento)) return 0;
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const mes = hoy.getMonth() - nacimiento.getMonth();
        if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
            edad--;
        }
        return Math.max(0, edad);
    },

    /**
     * Verifica si una fecha está dentro de un rango
     * @param {string|Date} fecha - Fecha a verificar
     * @param {string|Date} inicio - Fecha de inicio del rango
     * @param {string|Date} fin - Fecha de fin del rango
     * @returns {boolean}
     */
    fechaEnRango: function(fecha, inicio, fin) {
        const f = new Date(fecha);
        const i = new Date(inicio);
        const e = new Date(fin);
        return f >= i && f <= e;
    },

    /**
     * Formatea una fecha a dd/mm/yyyy
     * @param {string|Date} fecha - Fecha a formatear
     * @returns {string} Fecha en formato local
     */
    formatearFecha: function(fecha) {
        const f = new Date(fecha);
        if (isNaN(f)) return 'Fecha inválida';
        const dia = String(f.getDate()).padStart(2, '0');
        const mes = String(f.getMonth() + 1).padStart(2, '0');
        const anio = f.getFullYear();
        return `${dia}/${mes}/${anio}`;
    },

    /**
     * Formatea una fecha a formato largo (ej: "15 de julio de 2026")
     * @param {string|Date} fecha - Fecha a formatear
     * @returns {string} Fecha en formato largo
     */
    formatearFechaLarga: function(fecha) {
        const f = new Date(fecha);
        if (isNaN(f)) return 'Fecha inválida';
        const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
                       'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
        return `${f.getDate()} de ${meses[f.getMonth()]} de ${f.getFullYear()}`;
    },

    // ============================================
    // 3. FILTROS Y BÚSQUEDAS
    // ============================================

    /**
     * Filtra actividades por rango de fechas
     * @param {Array} actividades - Lista de actividades
     * @param {string|Date} inicio - Fecha de inicio
     * @param {string|Date} fin - Fecha de fin
     * @returns {Array} Actividades filtradas
     */
    filtrarPorFecha: function(actividades, inicio, fin) {
        return actividades.filter(act => {
            const fechaAct = new Date(act.fecha);
            const i = new Date(inicio);
            const e = new Date(fin);
            return fechaAct >= i && fechaAct <= e;
        });
    },

    /**
     * Filtra actividades por departamento
     * @param {Array} actividades - Lista de actividades
     * @param {string} departamento - Nombre del departamento
     * @returns {Array} Actividades filtradas
     */
    filtrarPorDepartamento: function(actividades, departamento) {
        return actividades.filter(act =>
            act.departamento && act.departamento.toLowerCase() === departamento.toLowerCase()
        );
    },

    /**
     * Filtra actividades por categoría
     * @param {Array} actividades - Lista de actividades
     * @param {string} categoria - Categoría (exposición, taller, charla, etc.)
     * @returns {Array} Actividades filtradas
     */
    filtrarPorCategoria: function(actividades, categoria) {
        return actividades.filter(act =>
            act.categoria && act.categoria.toLowerCase() === categoria.toLowerCase()
        );
    },

    /**
     * Busca actividades por texto (título, descripción, institución)
     * @param {Array} actividades - Lista de actividades
     * @param {string} texto - Texto a buscar
     * @returns {Array} Actividades que coinciden
     */
    buscarPorTexto: function(actividades, texto) {
        const term = texto.toLowerCase().trim();
        if (!term) return actividades;
        return actividades.filter(act => {
            const campos = [act.titulo, act.descripcion, act.institucion, act.departamento];
            return campos.some(campo =>
                campo && campo.toLowerCase().includes(term)
            );
        });
    },

    /**
     * Ordena actividades por fecha (más reciente primero)
     * @param {Array} actividades - Lista de actividades
     * @returns {Array} Actividades ordenadas
     */
    ordenarPorFecha: function(actividades) {
        return [...actividades].sort((a, b) =>
            new Date(a.fecha) - new Date(b.fecha)
        );
    },

    /**
     * Ordena actividades por disponibilidad de cupos
     * @param {Array} actividades - Lista de actividades
     * @returns {Array} Actividades ordenadas (más cupos primero)
     */
    ordenarPorCupos: function(actividades) {
        return [...actividades].sort((a, b) => {
            const dispA = this.cuposDisponibles(a.cupos, a.inscritos || 0);
            const dispB = this.cuposDisponibles(b.cupos, b.inscritos || 0);
            return dispB - dispA;
        });
    },

    // ============================================
    // 4. ESTADÍSTICAS
    // ============================================

    /**
     * Calcula estadísticas de un conjunto de actividades
     * @param {Array} actividades - Lista de actividades
     * @returns {Object} Estadísticas (total, por categoría, por departamento, etc.)
     */
    calcularEstadisticas: function(actividades) {
        const total = actividades.length;
        const porCategoria = {};
        const porDepartamento = {};
        let totalCupos = 0;
        let totalInscritos = 0;
        let disponibles = 0;

        actividades.forEach(act => {
            // Por categoría
            const cat = act.categoria || 'sin-categoria';
            porCategoria[cat] = (porCategoria[cat] || 0) + 1;

            // Por departamento
            const dep = act.departamento || 'sin-departamento';
            porDepartamento[dep] = (porDepartamento[dep] || 0) + 1;

            // Cupos
            const cupos = act.cupos || 0;
            const inscritos = act.inscritos || 0;
            totalCupos += cupos;
            totalInscritos += inscritos;
            if (this.hayCupos(cupos, inscritos)) {
                disponibles++;
            }
        });

        return {
            total,
            porCategoria,
            porDepartamento,
            totalCupos,
            totalInscritos,
            disponibles,
            ocupacionTotal: totalCupos > 0 ?
                Math.round((totalInscritos / totalCupos) * 100) : 0,
            porcentajeDisponibles: total > 0 ?
                Math.round((disponibles / total) * 100) : 0
        };
    },

    // ============================================
    // 5. VALIDACIONES DE INSCRIPCIÓN
    // ============================================

    /**
     * Valida si una persona puede inscribirse a una actividad
     * @param {Object} actividad - Datos de la actividad
     * @param {Object} usuario - Datos del usuario (edad, etc.)
     * @param {string} usuario.fechaNacimiento - Fecha de nacimiento (opcional)
     * @returns {Object} { valido: boolean, motivo: string }
     */
    validarInscripcion: function(actividad, usuario) {
        // Verificar cupos
        if (!this.hayCupos(actividad.cupos, actividad.inscritos || 0)) {
            return { valido: false, motivo: 'No hay cupos disponibles' };
        }

        // Verificar edad mínima
        if (actividad.edadMinima && usuario.fechaNacimiento) {
            const edad = this.calcularEdad(usuario.fechaNacimiento);
            if (edad < actividad.edadMinima) {
                return { valido: false, motivo: `Edad mínima: ${actividad.edadMinima} años` };
            }
        }

        // Verificar fecha de la actividad (no pasada)
        const hoy = new Date();
        const fechaAct = new Date(actividad.fecha);
        if (fechaAct < hoy) {
            return { valido: false, motivo: 'La actividad ya pasó' };
        }

        return { valido: true, motivo: 'Inscripción válida' };
    },

    /**
     * Simula una inscripción (reduce cupos disponibles)
     * @param {Object} actividad - Datos de la actividad
     * @returns {Object} Actividad actualizada con nuevos inscritos
     */
    simularInscripcion: function(actividad) {
        if (!this.hayCupos(actividad.cupos, actividad.inscritos || 0)) {
            return { ...actividad, error: 'Sin cupos disponibles' };
        }
        return {
            ...actividad,
            inscritos: (actividad.inscritos || 0) + 1
        };
    }
};

// Exportar para uso con módulos (CommonJS / ES6)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Calculos;
}

// Si no hay módulos, exponer globalmente
if (typeof window !== 'undefined') {
    window.Calculos = Calculos;
}
/* ============================================ */
/* NODO CULTURAL - CÁLCULOS DE INSCRIPCIONES    */
/* ============================================ */

const Calculos = {
    // Datos de los cursos (simulados)
    cursos: {
        'curso-1': { nombre: 'Conservación y restauración de obras', cuposTotales: 12, inscritos: 0 },
        'curso-2': { nombre: 'Cerámica precolombina', cuposTotales: 20, inscritos: 0 },
        'curso-3': { nombre: 'Gestión cultural y patrimonio', cuposTotales: 25, inscritos: 0 }
    },

    // Obtener cupos disponibles
    obtenerCuposDisponibles: function(cursoId) {
        const curso = this.cursos[cursoId];
        if (!curso) return 0;
        return curso.cuposTotales - curso.inscritos;
    },

    // Verificar si hay cupo
    hayCupo: function(cursoId) {
        return this.obtenerCuposDisponibles(cursoId) > 0;
    },

    // Inscribir a una persona
    inscribir: function(cursoId) {
        const curso = this.cursos[cursoId];
        if (!curso) {
            return { exito: false, mensaje: 'Curso no encontrado' };
        }

        if (!this.hayCupo(cursoId)) {
            return { exito: false, mensaje: 'Lo sentimos, no hay cupos disponibles para este curso.' };
        }

        // Aumentar inscritos
        curso.inscritos++;

        // Guardar en localStorage para persistencia
        this.guardarInscripciones();

        return {
            exito: true,
            mensaje: '¡Te inscribiste correctamente!',
            cuposRestantes: this.obtenerCuposDisponibles(cursoId)
        };
    },

    // Guardar inscripciones en localStorage
    guardarInscripciones: function() {
        try {
            localStorage.setItem('nodocultural_inscripciones', JSON.stringify(this.cursos));
        } catch (e) {
            console.warn('No se pudo guardar en localStorage:', e);
        }
    },

    // Cargar inscripciones desde localStorage
    cargarInscripciones: function() {
        try {
            const stored = localStorage.getItem('nodocultural_inscripciones');
            if (stored) {
                const data = JSON.parse(stored);
                // Solo actualizar los cursos que existen
                for (const key in data) {
                    if (this.cursos[key]) {
                        this.cursos[key].inscritos = data[key].inscritos || 0;
                    }
                }
            }
        } catch (e) {
            console.warn('No se pudo cargar desde localStorage:', e);
        }
    },

    // Reiniciar inscripciones (para pruebas)
    reiniciarInscripciones: function() {
        for (const key in this.cursos) {
            this.cursos[key].inscritos = 0;
        }
        this.guardarInscripciones();
        return true;
    }
};

// Exportar para usar en main.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Calculos;
}