const dialogo = document.querySelector("#detalle");
const titulo = document.querySelector("#detalle-titulo");
const contenido = document.querySelector("#detalle-contenido");
const buscador = document.querySelector("#buscar");
const filas = Array.from(document.querySelectorAll("[data-busqueda]"));
const resultado = document.querySelector("#resultado");

const vistas = {
    "Mis estudiantes": "Valeria Torres y Diego Salazar requieren seguimiento prioritario.",
    "Riesgo alto": "Valeria Torres: 3 actividades vencidas. Diego Salazar: 3 de 5 días de constancia.",
    "Tutorías": "Mateo Vega: viernes a las 15:00. Camila Mendoza: jueves a las 11:00.",
    "Calendarios": "Agenda de ejemplo: sesión de estudio a las 16:00 y entrega a las 18:00.",
    "Tareas": "Práctica de derivadas, repaso de programación y revisión de apuntes.",
    "Progresos": "Completaste 2 de los 3 días de estudio previstos.",
    "Mis cursos": "Cálculo I y Programación I.",
    "Ayuda / Tutorial": "Usa el buscador para filtrar los datos visibles. Puedes cerrar esta ventana con Esc.",
    "Mensajes": "No hay mensajes en esta demostración."
};

for (const boton of document.querySelectorAll("[data-vista]")) {
    boton.addEventListener("click", () => {
        const vista = boton.dataset.vista;

        if (document.body.dataset.perfil === "estudiante") {

            if (vista === "Calendarios") {
                abrirPantallaCalendarios();
                return;
            }

            ocultarPantallaCalendarios();
        }


        if (
        document.body.dataset.perfil === "estudiante" &&
        vista === "Tareas"
        ) {
            abrirPantallaTareas("lista");
            return;
        }

        if (
            document.body.dataset.perfil === "estudiante" &&
            (vista === "Inicio" || vista === "Mis cursos")
        ) {
            ocultarPantallasTareas();
        }
  
    if (
    document.body.dataset.perfil === "estudiante" &&
    (vista === "Mis cursos" || vista === "Inicio")
    ) {
    const mostrarCursos = vista === "Mis cursos";

    document.querySelector(".resumen").hidden = mostrarCursos;
    document.querySelector(".columns").hidden = mostrarCursos;
    document.querySelector("#vista-mis-cursos").hidden = !mostrarCursos;
    document.querySelector("#vista-registrar-curso").hidden = true;

    document.querySelectorAll(".menu-panel [data-vista]").forEach(opcion => {
        opcion.removeAttribute("aria-current");
    });

    boton.setAttribute("aria-current", "page");

    if (!mostrarCursos) {
        buscador.value = "";
        filtrar();
    }

        document.querySelector("main").scrollIntoView();
        return;
    }

        if (vista === "Inicio") {
            buscador.value = "";
            filtrar();
            document.querySelector("main").scrollIntoView();
            return;
        }

        titulo.textContent = vista;
        contenido.textContent = vistas[vista] || "Esta sección está pendiente en la demostración.";
        if (vista === "Personalizar panel") {
            const control = document.createElement("input");
            control.type = "checkbox";
            const resumen = document.querySelector(".columns .card:last-child");
            control.checked = !resumen.hidden;
            control.addEventListener("change", () => { resumen.hidden = !control.checked; });
            const etiqueta = document.createElement("label");
            etiqueta.append(control, " Mostrar resumen de la semana");
            contenido.replaceChildren(etiqueta);
        }
        dialogo.showModal();
    });
}

function normalizar(texto) {
    return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function filtrar() {
    const consulta = normalizar(buscador.value.trim());
    let coincidencias = 0;
    for (const fila of filas) {
        fila.hidden = !normalizar(fila.textContent).includes(consulta);
        if (!fila.hidden) coincidencias++;
    }
    resultado.textContent = consulta ? (coincidencias ? coincidencias + " resultados." : "No hay resultados. Prueba con otro nombre o actividad.") : "";
}

buscador.addEventListener("input", filtrar);

const botonRegistrarCurso = document.querySelector("#registrar-curso");
const botonCancelarCurso = document.querySelector("#cancelar-curso");
const vistaRegistrarCurso = document.querySelector("#vista-registrar-curso");
const vistaMisCursos = document.querySelector("#vista-mis-cursos");

if (botonRegistrarCurso && botonCancelarCurso && vistaRegistrarCurso && vistaMisCursos) {

    botonRegistrarCurso.addEventListener("click", () => {

        vistaMisCursos.hidden = true;

        vistaRegistrarCurso.hidden = false;

        document.querySelector("main").scrollIntoView();
    });

    botonCancelarCurso.addEventListener("click", () => {

        vistaRegistrarCurso.hidden = true;

        vistaMisCursos.hidden = false;

        document.querySelector("main").scrollIntoView();
    });
}

function ocultarPantallasTareas() {
    const pantallas = [
        "sf-vista-tareas",
        "sf-vista-nueva-tarea",
        "sf-vista-orden-tareas"
    ];

    for (const id of pantallas) {
        const seccion = document.getElementById(id);
        if (seccion) seccion.hidden = true;
    }
}

function abrirPantallaTareas(pantalla) {
    if (document.body.dataset.perfil !== "estudiante") return;

    document.querySelector(".resumen")?.setAttribute("hidden", "");
    document.querySelector(".columns")?.setAttribute("hidden", "");
    document.getElementById("vista-mis-cursos")?.setAttribute("hidden", "");
    document.getElementById("vista-registrar-curso")?.setAttribute("hidden", "");

    ocultarPantallasTareas();

    const pantallas = {
        lista: "sf-vista-tareas",
        nueva: "sf-vista-nueva-tarea",
        ordenar: "sf-vista-orden-tareas"
    };

    const id = pantallas[pantalla];

    if (id) {
        document.getElementById(id).hidden = false;
    }

    document.querySelectorAll(".menu-panel [data-vista]").forEach(boton => {
        boton.removeAttribute("aria-current");
    });

    document.querySelector('.menu-panel [data-vista="Tareas"]')
        ?.setAttribute("aria-current", "page");

    document.querySelector("main")?.scrollIntoView({
        block: "start"
    });
}


(() => {
    const lista = document.getElementById("sf-lista-tareas");
    const plantilla = document.getElementById("sf-plantilla-tarea");
    const formulario = document.getElementById("sf-form-nueva-tarea");

    if (!lista || !plantilla || !formulario) return;

    const clave = "studyflow-yataco-tareas-v1";

    const ejemplos = [
        {
            id: "ejemplo-1",
            titulo: "Práctica de derivadas",
            curso: "Cálculo I",
            tipo: "Tarea",
            fecha: "2026-11-23",
            hora: "18:00",
            prioridad: "Alta",
            completada: false
        },
        {
            id: "ejemplo-2",
            titulo: "Laboratorio de arreglos",
            curso: "Programación I",
            tipo: "Tarea",
            fecha: "2026-11-25",
            hora: "23:59",
            prioridad: "Media",
            completada: false
        },
        {
            id: "ejemplo-3",
            titulo: "Borrador del ensayo",
            curso: "Comunicación",
            tipo: "Tarea",
            fecha: "2026-11-27",
            hora: "20:00",
            prioridad: "Baja",
            completada: false
        }
    ];

    let tareas;

    try {
        const recuperadas = JSON.parse(localStorage.getItem(clave));
        tareas = Array.isArray(recuperadas) ? recuperadas : ejemplos;
    } catch {
        tareas = ejemplos;
    }

    let tareaActual = tareas[2]?.id ?? tareas[0]?.id ?? null;
    let criterio = "original";

    function mostrarAviso(texto) {
        const aviso = document.getElementById("sf-aviso-tareas");
        aviso.textContent = texto;
        aviso.hidden = false;
    }

    function guardar() {
        try {
            localStorage.setItem(clave, JSON.stringify(tareas));
        } catch {
            mostrarAviso("No se pudieron guardar los cambios en este navegador.");
        }
    }

    function fechaLegible(fecha) {
        return new Date(fecha + "T12:00:00").toLocaleDateString("es-PE", {
            weekday: "short",
            day: "numeric",
            month: "short"
        });
    }

    function pintarDetalle() {
        const tarea = tareas.find(t => t.id === tareaActual);
        const panel = document.getElementById("sf-detalle-tarea");

        panel.hidden = !tarea;

        if (!tarea) return;

        document.getElementById("sf-detalle-titulo").textContent =
            tarea.titulo;

        document.getElementById("sf-detalle-info").textContent =
            `${tarea.curso} · ${tarea.completada ? "Completada" : "Pendiente"}`;

        document.getElementById("sf-detalle-fecha").textContent =
            `Entrega: ${fechaLegible(tarea.fecha)} a las ${tarea.hora}`;

        document.getElementById("sf-cambiar-estado-tarea").textContent =
            tarea.completada
                ? "Marcar como pendiente"
                : "Marcar como completada";
    }

    function pintarTareas() {
        const visibles = [...tareas];

        const pesos = {
            Alta: 3,
            Media: 2,
            Baja: 1
        };

        if (criterio === "fecha") {
            visibles.sort((a, b) =>
                a.fecha.localeCompare(b.fecha) ||
                a.hora.localeCompare(b.hora)
            );
        }

        if (criterio === "prioridad") {
            visibles.sort((a, b) =>
                pesos[b.prioridad] - pesos[a.prioridad]
            );
        }

        const fragmento = document.createDocumentFragment();

        for (const tarea of visibles) {
            const boton = plantilla.content
                .querySelector(".sf-tarea-fila")
                .cloneNode(true);

            boton.classList.toggle(
                "seleccionada",
                tarea.id === tareaActual
            );

            boton.querySelector(".sf-tarea-nombre").textContent =
                tarea.titulo;

            boton.querySelector(".sf-tarea-subtitulo").textContent =
                `${tarea.curso} · ${fechaLegible(tarea.fecha)}, ${tarea.hora}`;

            const etiqueta = boton.querySelector(".sf-tarea-prioridad");

            etiqueta.textContent =
                tarea.completada ? "Completada" : tarea.prioridad;

            etiqueta.dataset.prioridad =
                tarea.completada ? "Completada" : tarea.prioridad;

            boton.addEventListener("click", () => {
                tareaActual = tarea.id;
                pintarTareas();
            });

            fragmento.appendChild(boton);
        }

        lista.replaceChildren(fragmento);
        pintarDetalle();
    }

    
    document.getElementById("sf-boton-nueva-tarea")
        .addEventListener("click", () => {
            abrirPantallaTareas("nueva");
        });

    document.getElementById("sf-boton-ordenar-tareas")
        .addEventListener("click", () => {
            abrirPantallaTareas("ordenar");
        });

    document.getElementById("sf-cancelar-nueva-tarea")
        .addEventListener("click", () => {
            abrirPantallaTareas("lista");
        });

    document.getElementById("sf-cancelar-orden-tareas")
        .addEventListener("click", () => {
            abrirPantallaTareas("lista");
        });

    
    formulario.addEventListener("submit", evento => {
        evento.preventDefault();

        if (!formulario.reportValidity()) return;

        const tarea = {
            id: "tarea-" + Date.now(),
            titulo: document.getElementById("sf-tarea-titulo").value.trim(),
            curso: document.getElementById("sf-tarea-curso").value,
            tipo: document.getElementById("sf-tarea-tipo").value,
            fecha: document.getElementById("sf-tarea-fecha").value,
            hora: document.getElementById("sf-tarea-hora").value,
            prioridad: document.getElementById("sf-tarea-prioridad").value,
            completada: false
        };

        if (!tarea.titulo) return;

        tareas.push(tarea);
        tareaActual = tarea.id;

        guardar();
        pintarTareas();
        formulario.reset();

        abrirPantallaTareas("lista");
        mostrarAviso("Actividad guardada correctamente.");
    });


    document.getElementById("sf-cambiar-estado-tarea")
        .addEventListener("click", () => {
            const tarea = tareas.find(t => t.id === tareaActual);

            if (!tarea) return;

            tarea.completada = !tarea.completada;

            guardar();
            pintarTareas();
            mostrarAviso("El estado de la actividad se actualizó.");
        });

   
    document.getElementById("sf-form-ordenar-tareas")
        .addEventListener("submit", evento => {
            evento.preventDefault();

            criterio = new FormData(evento.currentTarget)
                .get("orden") || "original";

            pintarTareas();
            abrirPantallaTareas("lista");
            mostrarAviso("Actividades ordenadas correctamente.");
        });

    pintarTareas();
})();


function ocultarPantallaCalendarios() {

    const calendario = document.getElementById(
        "sf-vista-calendarios"
    );

    if (calendario) {
        calendario.hidden = true;
    }
    
    const programar = document.getElementById("sf-cal-vista-programar");

    if (programar) {
        programar.hidden = true;
    }


    const pantallasHU08 = [
        "sf-cal-vista-sesion",
        "sf-cal-vista-editar",
        "sf-cal-vista-conflicto",
        "sf-cal-vista-actualizada",
        "sf-cal-vista-eliminar",
        "sf-cal-vista-eliminada"
    ];

    for (const id of pantallasHU08) {
        const pantalla = document.getElementById(id);

        if (pantalla) {
            pantalla.hidden = true;
        }
    }

    const pantallasHU42 = [
        "sf-cal-vista-simular",
        "sf-cal-vista-comparar",
        "sf-cal-vista-simulacion-aplicada",
        "sf-cal-vista-simulacion-descartada"
    ];

    for (const id of pantallasHU42) {
        const pantalla = document.getElementById(id);

        if (pantalla) {
            pantalla.hidden = true;
        }
    }

    const pantallasHU33 = [
        "sf-cal-vista-carga",
        "sf-cal-vista-redistribuir",
        "sf-cal-vista-carga-actualizada"
    ];

    for (const id of pantallasHU33) {
        const pantalla = document.getElementById(id);

        if (pantalla) {
            pantalla.hidden = true;
        }
    }


    const pantallasHU21 = [
        "sf-cal-vista-preparar-concentracion",
        "sf-cal-vista-concentracion-curso",
        "sf-cal-vista-concentracion-finalizada"
    ];

    for (const id of pantallasHU21) {
        const pantalla = document.getElementById(id);

        if (pantalla) {
            pantalla.hidden = true;
        }
    }


}


function abrirPantallaCalendarios() {

    if (document.body.dataset.perfil !== "estudiante") {
        return;
    }

    const calendario = document.getElementById(
        "sf-vista-calendarios"
    );

    if (!calendario) {
        return;
    }

    const resumen = document.querySelector(".resumen");
    const columnas = document.querySelector(".columns");

    if (resumen) {
        resumen.hidden = true;
    }

    if (columnas) {
        columnas.hidden = true;
    }

    const misCursos = document.getElementById("vista-mis-cursos");
    const registrarCurso = document.getElementById(
        "vista-registrar-curso"
    );

    if (misCursos) {
        misCursos.hidden = true;
    }

    if (registrarCurso) {
        registrarCurso.hidden = true;
    }


    if (typeof ocultarPantallasTareas === "function") {
        ocultarPantallasTareas();
    }


    const programar = document.getElementById("sf-cal-vista-programar");

    if (programar) {
        programar.hidden = true;
    }

    ocultarPantallaCalendarios();
    calendario.hidden = false;


    document.querySelectorAll(
        ".menu-panel [data-vista]"
    ).forEach(boton => {
        boton.removeAttribute("aria-current");
    });

    const botonCalendarios = document.querySelector(
        '.menu-panel [data-vista="Calendarios"]'
    );

    if (botonCalendarios) {
        botonCalendarios.setAttribute(
            "aria-current",
            "page"
        );
    }

    document.querySelector("main")?.scrollIntoView({
        block: "start"
    });
}


(() => {
    const obtener = id => document.getElementById(id);

    const botonProgramar = obtener("sf-cal-programar");
    const botonCancelar = obtener("sf-cal-cancelar-programar");
    const formulario = obtener("sf-cal-form-programar");

    if (!botonProgramar || !botonCancelar || !formulario) return;

    const clave = "studyflow-sesiones-hu08";

    const fechasSemana = [
        "2026-11-09", "2026-11-10", "2026-11-11",
        "2026-11-12", "2026-11-13", "2026-11-14",
        "2026-11-15"
    ];

    // Horarios de ejemplo del Figma
    const compromisos = [
        {
            fecha: "2026-11-09",
            hora: "09:00",
            duracion: 60,
            actividad: "Clase"
        },
        {
            fecha: "2026-11-10",
            hora: "11:00",
            duracion: 60,
            actividad: "Clase"
        },
        {
            fecha: "2026-11-11",
            hora: "09:00",
            duracion: 90,
            actividad: "Base de Datos (clase)"
        },
        {
            fecha: "2026-11-11",
            hora: "12:00",
            duracion: 60,
            actividad: "Evaluación"
        },
        {
            fecha: "2026-11-11",
            hora: "16:00",
            duracion: 60,
            actividad: "Estudio"
        },
        {
            fecha: "2026-11-12",
            hora: "11:00",
            duracion: 60,
            actividad: "Clase"
        },
        {
            fecha: "2026-11-12",
            hora: "15:00",
            duracion: 60,
            actividad: "Evaluación"
        },
        {
            fecha: "2026-11-12",
            hora: "17:00",
            duracion: 60,
            actividad: "Estudio"
        }
    ];

    let sesiones = [];

    try {
        const recuperadas = JSON.parse(
            localStorage.getItem(clave)
        );

        sesiones = Array.isArray(recuperadas)
            ? recuperadas
            : [];

    } catch {
        sesiones = [];
    }

    let sesionSeleccionadaId = null;
    let pantallaRegresoConflicto = "sf-cal-vista-programar";



    function convertirMinutos(hora) {
        const [h, m] = hora.split(":").map(Number);
        return h * 60 + m;
    }

    function convertirHora(minutos) {
        return String(Math.floor(minutos / 60)).padStart(2, "0")
            + ":" +
            String(minutos % 60).padStart(2, "0");
    }

    function fechaLegible(fecha) {
        return new Date(fecha + "T12:00:00")
            .toLocaleDateString("es-PE", {
                weekday: "long",
                day: "numeric",
                month: "long"
            });
    }

    function intervaloTexto(sesion) {
        return fechaLegible(sesion.fecha)
            + " · " + sesion.hora
            + "–" + convertirHora(
                convertirMinutos(sesion.hora)
                + Number(sesion.duracion)
            );
    }


    function buscarConflicto(
        fecha,
        hora,
        duracion,
        idExcluido = null
    ) {
        const inicio = convertirMinutos(hora);
        const fin = inicio + Number(duracion);

        const ocupados = compromisos.concat(
            sesiones.filter(sesion => {
                return sesion.id !== idExcluido;
            })
        );

        return ocupados.find(ocupado => {
            if (ocupado.fecha !== fecha) {
                return false;
            }

            const inicioOcupado = convertirMinutos(
                ocupado.hora
            );

            const finOcupado = inicioOcupado
                + Number(ocupado.duracion);

            return inicio < finOcupado
                && fin > inicioOcupado;
        });
    }


    function guardarSesiones(nuevas) {
        try {
            localStorage.setItem(
                clave,
                JSON.stringify(nuevas)
            );

            sesiones = nuevas;
            return true;

        } catch {
            alert(
                "No se pudo guardar la información en este navegador."
            );
            return false;
        }
    }


    function mostrarPantalla(id) {
        ocultarPantallaCalendarios();

        const pantalla = obtener(id);

        if (pantalla) {
            pantalla.hidden = false;
        }

        document.querySelector("main")
            ?.scrollIntoView({
                block: "start"
            });
    }

    function sesionActual() {
        return sesiones.find(sesion => {
            return sesion.id === sesionSeleccionadaId;
        });
    }

    function actualizarDetalles() {
        const sesion = sesionActual();

        if (!sesion) return;

        obtener("sf-cal-sesion-titulo").textContent =
            sesion.actividad;

        obtener("sf-cal-sesion-info").textContent =
            intervaloTexto(sesion) + " · Sesión de estudio";

        obtener("sf-cal-editar-descripcion").textContent =
            sesion.actividad;

        obtener("sf-cal-actualizada-titulo").textContent =
            sesion.actividad;

        obtener("sf-cal-actualizada-info").textContent =
            intervaloTexto(sesion);

        obtener("sf-cal-eliminar-descripcion").textContent =
            sesion.actividad + " · " + intervaloTexto(sesion);
    }

    function abrirSesion(id) {
        sesionSeleccionadaId = id;

        actualizarDetalles();

        mostrarPantalla("sf-cal-vista-sesion");
    }


    function mostrarSemanas() {
        const base = document.querySelector(
            "#sf-vista-calendarios .sf-cal-semana"
        );

        if (!base) return;

        const destinos = [
            "sf-cal-semana-programada",
            "sf-cal-semana-actualizada",
            "sf-cal-semana-eliminada"
        ];

        for (const id of destinos) {
            const destino = obtener(id);

            if (destino) {
                destino.replaceChildren(
                    base.cloneNode(true)
                );
            }
        }
    }

    function mostrarSesiones() {
        const anteriores = document.querySelectorAll(
            "#sf-vista-calendarios [data-sf-sesion]"
        );

        anteriores.forEach(elemento => elemento.remove());

        const dias = document.querySelectorAll(
            "#sf-vista-calendarios .sf-cal-dia"
        );

        const plantilla = document.querySelector(
            "#sf-vista-calendarios .sf-cal-estudio"
        );

        if (!plantilla) return;

        for (const sesion of sesiones) {
            const indice = fechasSemana.indexOf(
                sesion.fecha
            );

            if (indice === -1 || !dias[indice]) {
                continue;
            }

            const evento = plantilla.cloneNode(true);

            evento.textContent = "Estudio · " + sesion.hora;

            evento.title = sesion.actividad
                + " · Seleccionar sesión";

            evento.dataset.sfSesion = sesion.id;

            evento.setAttribute("role", "button");
            evento.tabIndex = 0;

            evento.addEventListener("click", () => {
                abrirSesion(sesion.id);
            });

            evento.addEventListener("keydown", e => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    evento.click();
                }
            });

            dias[indice].appendChild(evento);
        }

        mostrarSemanas();
    }

    function mostrarConflicto(
        fecha,
        hora,
        duracion,
        ocupado,
        regreso
    ) {
        pantallaRegresoConflicto = regreso;

        obtener("sf-cal-conflicto-elegido").textContent =
            intervaloTexto({ fecha, hora, duracion });

        obtener("sf-cal-conflicto-ocupado").textContent =
            (ocupado.actividad || "Compromiso existente")
            + " · " + intervaloTexto(ocupado);

        const tituloCruce = document.querySelector(
            "#sf-cal-vista-conflicto .sf-cal-conflicto h3:nth-of-type(2)"
        );

        if (tituloCruce) {
            tituloCruce.textContent = ocupado.id
                ? "Se superpone con otra sesión"
                : "Se superpone con una clase o actividad";
        }

        mostrarPantalla("sf-cal-vista-conflicto");
    }


    botonProgramar.addEventListener("click", () => {

        if (!obtener("sf-cal-fecha").value) {
            obtener("sf-cal-fecha").value = "2026-11-10";
        }

        mostrarPantalla("sf-cal-vista-programar");
    });

    botonCancelar.addEventListener("click", () => {
        abrirPantallaCalendarios();
    });


    formulario.addEventListener("submit", evento => {
        evento.preventDefault();

        if (!formulario.reportValidity()) return;

        const curso = obtener("sf-cal-curso");

        const fecha = obtener("sf-cal-fecha").value;
        const hora = obtener("sf-cal-hora").value;

        const duracion = Number(
            obtener("sf-cal-duracion").value
        );

        const actividad = curso.options[
            curso.selectedIndex
        ].textContent.trim();

        if (convertirMinutos(hora) + duracion > 1440) {
            alert(
                "La sesión no puede finalizar después de medianoche."
            );
            return;
        }

        const ocupado = buscarConflicto(
            fecha,
            hora,
            duracion
        );

        if (ocupado) {
            mostrarConflicto(
                fecha,
                hora,
                duracion,
                ocupado,
                "sf-cal-vista-programar"
            );
            return;
        }

        const nuevaSesion = {
            id: "sesion-" + Date.now(),
            actividad: actividad,
            fecha: fecha,
            hora: hora,
            duracion: duracion
        };

        const nuevas = [...sesiones, nuevaSesion];

        if (!guardarSesiones(nuevas)) return;

        mostrarSesiones();

        formulario.reset();

        abrirSesion(nuevaSesion.id);
    });


    obtener("sf-cal-editar-sesion")
        .addEventListener("click", () => {

            const sesion = sesionActual();

            if (!sesion) return;

            obtener("sf-cal-editar-fecha").value =
                sesion.fecha;

            obtener("sf-cal-editar-hora").value =
                sesion.hora;

            obtener("sf-cal-editar-duracion").value =
                String(sesion.duracion);

            mostrarPantalla("sf-cal-vista-editar");
        });


    obtener("sf-cal-cancelar-edicion")
        .addEventListener("click", () => {

            mostrarPantalla("sf-cal-vista-sesion");
        });


    obtener("sf-cal-form-editar")
        .addEventListener("submit", evento => {

            evento.preventDefault();

            if (!evento.currentTarget.reportValidity()) {
                return;
            }

            const sesion = sesionActual();

            if (!sesion) return;

            const fecha = obtener(
                "sf-cal-editar-fecha"
            ).value;

            const hora = obtener(
                "sf-cal-editar-hora"
            ).value;

            const duracion = Number(
                obtener("sf-cal-editar-duracion").value
            );

            if (convertirMinutos(hora) + duracion > 1440) {
                alert(
                    "La sesión no puede finalizar después de medianoche."
                );
                return;
            }

            const ocupado = buscarConflicto(
                fecha,
                hora,
                duracion,
                sesionSeleccionadaId
            );

            if (ocupado) {
                mostrarConflicto(
                    fecha,
                    hora,
                    duracion,
                    ocupado,
                    "sf-cal-vista-editar"
                );
                return;
            }

            const nuevas = sesiones.map(actual => {

                if (actual.id === sesionSeleccionadaId) {
                    return {
                        ...actual,
                        fecha: fecha,
                        hora: hora,
                        duracion: duracion
                    };
                }

                return actual;
            });

            if (!guardarSesiones(nuevas)) return;

            mostrarSesiones();
            actualizarDetalles();

            mostrarPantalla("sf-cal-vista-actualizada");
        });



    obtener("sf-cal-elegir-otro-horario")
        .addEventListener("click", () => {

            mostrarPantalla(pantallaRegresoConflicto);
        });




    obtener("sf-cal-ir-eliminar")
        .addEventListener("click", () => {

            actualizarDetalles();

            mostrarPantalla("sf-cal-vista-eliminar");
        });


    obtener("sf-cal-cancelar-eliminar")
        .addEventListener("click", () => {

            mostrarPantalla("sf-cal-vista-sesion");
        });


    obtener("sf-cal-confirmar-eliminar")
        .addEventListener("click", () => {

            if (!sesionActual()) return;

            const nuevas = sesiones.filter(sesion => {
                return sesion.id !== sesionSeleccionadaId;
            });

            if (!guardarSesiones(nuevas)) return;

            sesionSeleccionadaId = null;

            mostrarSesiones();

            mostrarPantalla("sf-cal-vista-eliminada");
        });



    document.querySelectorAll(
        ".sf-cal-volver-inicio"
    ).forEach(boton => {

        boton.addEventListener("click", () => {
            abrirPantallaCalendarios();
        });
    });

    mostrarSesiones();

})();

(() => {
    const obtener = id => document.getElementById(id);

    const botonSimular = obtener("sf-cal-simular");
    const formulario = obtener("sf-cal-form-simulacion");

    if (!botonSimular || !formulario) return;

    const clave = "studyflow-planificacion-hu42";

    const fechasSemana = [
        "2026-11-09",
        "2026-11-10",
        "2026-11-11",
        "2026-11-12",
        "2026-11-13",
        "2026-11-14",
        "2026-11-15"
    ];

    const planInicial = [
        {
            id: "normalizacion",
            titulo: "Repaso de normalización",
            fecha: "2026-11-11",
            hora: "16:00",
            duracion: 60
        },
        {
            id: "sql",
            titulo: "Práctica de consultas SQL",
            fecha: "2026-11-12",
            hora: "17:00",
            duracion: 60
        }
    ];

    const compromisos = [
        { fecha: "2026-11-09", hora: "09:00", duracion: 60 },
        { fecha: "2026-11-10", hora: "11:00", duracion: 60 },
        { fecha: "2026-11-11", hora: "09:00", duracion: 90 },
        { fecha: "2026-11-11", hora: "12:00", duracion: 60 },
        { fecha: "2026-11-12", hora: "11:00", duracion: 60 },
        { fecha: "2026-11-12", hora: "15:00", duracion: 60 },
        { fecha: "2026-11-13", hora: "20:00", duracion: 60 }
    ];

    function copiar(plan) {
        return plan.map(actividad => ({ ...actividad }));
    }

    let planActual = copiar(planInicial);

    try {
        const guardado = JSON.parse(localStorage.getItem(clave));

        if (Array.isArray(guardado)) {
            planActual = planInicial.map(original => {
                const actividad = guardado.find(
                    item => item.id === original.id
                );

                if (
                    actividad &&
                    fechasSemana.includes(actividad.fecha) &&
                    /^([01]\d|2[0-3]):[0-5]\d$/.test(actividad.hora)
                ) {
                    return {
                        ...original,
                        fecha: actividad.fecha,
                        hora: actividad.hora
                    };
                }

                return original;
            });
        }
    } catch {
        planActual = copiar(planInicial);
    }

    let borrador = [];

    function minutos(hora) {
        const [h, m] = hora.split(":").map(Number);
        return h * 60 + m;
    }

    function fechaTexto(fecha) {
        return new Date(fecha + "T12:00:00")
            .toLocaleDateString("es-PE", {
                weekday: "short",
                day: "numeric"
            })
            .replace(".", "");
    }

    function mostrarPantalla(id) {
        ocultarPantallaCalendarios();

        const pantalla = obtener(id);

        if (pantalla) {
            pantalla.hidden = false;
        }

        document.querySelector("main")?.scrollIntoView({
            block: "start"
        });
    }

    function sesionesGuardadas() {
        try {
            const sesiones = JSON.parse(
                localStorage.getItem("studyflow-sesiones-hu08")
            );

            return Array.isArray(sesiones) ? sesiones : [];
        } catch {
            return [];
        }
    }

    function buscarConflicto(plan, actividad) {
        const otrasActividades = plan.filter(
            item => item.id !== actividad.id
        );

        const ocupados = [
            ...compromisos,
            ...sesionesGuardadas(),
            ...otrasActividades
        ];

        const inicio = minutos(actividad.hora);
        const fin = inicio + Number(actividad.duracion);

        return ocupados.find(ocupado => {
            if (ocupado.fecha !== actividad.fecha) {
                return false;
            }

            const inicioOcupado = minutos(ocupado.hora);
            const finOcupado = inicioOcupado +
                Number(ocupado.duracion);

            return inicio < finOcupado &&
                   fin > inicioOcupado;
        });
    }

    function comprobarPlan(plan) {
        for (const actividad of plan) {
            if (
                minutos(actividad.hora) +
                Number(actividad.duracion) > 1440
            ) {
                return "Una sesión termina después de medianoche.";
            }

            if (buscarConflicto(plan, actividad)) {
                return "El horario de " + actividad.titulo +
                    " se superpone con otra actividad.";
            }
        }

        return "";
    }

    function actualizarLista() {
        const elementos = document.querySelectorAll(
            "#sf-cal-lista-simulacion .sf-cal-simulacion-item"
        );

        borrador.forEach((actividad, indice) => {
            const original = planActual.find(
                item => item.id === actividad.id
            );

            const elemento = elementos[indice];

            if (!elemento || !original) return;

            elemento.querySelector("strong").textContent =
                actividad.titulo;

            elemento.querySelector("p").textContent =
                fechaTexto(original.fecha) + ", " +
                original.hora + " → " +
                fechaTexto(actividad.fecha) + ", " +
                actividad.hora;
        });
    }

    function actualizarFormulario() {
        const id = obtener("sf-cal-sim-actividad").value;

        const actividad = borrador.find(
            item => item.id === id
        );

        if (!actividad) return;

        obtener("sf-cal-sim-fecha").value = actividad.fecha;
        obtener("sf-cal-sim-hora").value = actividad.hora;
    }

    function cargaDelDia(plan, fecha) {
        return plan
            .filter(item => item.fecha === fecha)
            .reduce(
                (total, item) => total + Number(item.duracion),
                0
            );
    }

    function actualizarComparacion() {
        const contenedor = obtener("sf-cal-comparacion");

        const plantilla = contenedor.querySelector(
            ".sf-cal-comparacion-item"
        );

        if (!plantilla) return;

        const fragmento = document.createDocumentFragment();

        for (const fecha of fechasSemana) {
            const original = cargaDelDia(planActual, fecha);
            const simulado = cargaDelDia(borrador, fecha);

            if (original === simulado) continue;

            const fila = plantilla.cloneNode(true);

            fila.querySelector("strong").textContent =
                fechaTexto(fecha);

            fila.querySelector("p").textContent =
                "Original: " + original +
                " min → Simulación: " + simulado + " min";

            fragmento.appendChild(fila);
        }

        if (!fragmento.hasChildNodes()) {
            const fila = plantilla.cloneNode(true);

            fila.querySelector("strong").textContent =
                "Sin cambios de carga diaria";

            fila.querySelector("p").textContent =
                "La distribución de minutos por día se mantiene.";

            fragmento.appendChild(fila);
        }

        contenedor.replaceChildren(fragmento);
    }

    function actualizarResumen() {
        const elementos = document.querySelectorAll(
            "#sf-cal-resumen-aplicada .sf-cal-simulacion-item"
        );

        planActual.forEach((actividad, indice) => {
            const elemento = elementos[indice];

            if (!elemento) return;

            elemento.querySelector("strong").textContent =
                actividad.titulo;

            elemento.querySelector("p").textContent =
                fechaTexto(actividad.fecha) + " · " +
                actividad.hora + " · " +
                actividad.duracion + " min";
        });
    }

    function copiarSemana(destinoId) {
        const semana = document.querySelector(
            "#sf-vista-calendarios .sf-cal-semana"
        );

        const destino = obtener(destinoId);

        if (semana && destino) {
            destino.replaceChildren(semana.cloneNode(true));
        }
    }

    function actualizarCalendario() {
        const dias = document.querySelectorAll(
            "#sf-vista-calendarios .sf-cal-dia"
        );

        const plantilla = document.querySelector(
            "#sf-vista-calendarios .sf-cal-clase"
        );

        if (!plantilla || dias.length !== 7) return;


        const originales = [
            { indice: 2, hora: "16:00" },
            { indice: 3, hora: "17:00" }
        ];

        for (const original of originales) {
            const eventos = dias[original.indice]
                .querySelectorAll(
                    ".sf-cal-estudio:not([data-sf-sesion]):not([data-sf-hu42])"
                );

            eventos.forEach(evento => {
                if (evento.textContent.includes(original.hora)) {
                    evento.remove();
                }
            });
        }

        document.querySelectorAll(
            "#sf-vista-calendarios [data-sf-hu42]"
        ).forEach(evento => evento.remove());

        for (const actividad of planActual) {
            const indice = fechasSemana.indexOf(actividad.fecha);

            if (indice === -1) continue;

            const evento = plantilla.cloneNode(true);

            evento.className = "sf-cal-evento sf-cal-estudio";
            evento.textContent = "Estudio · " + actividad.hora;
            evento.title = actividad.titulo;
            evento.dataset.sfHu42 = actividad.id;

            dias[indice].appendChild(evento);
        }

        const destinos = [
            "sf-cal-semana-programada",
            "sf-cal-semana-actualizada",
            "sf-cal-semana-eliminada",
            "sf-cal-semana-simulada",
            "sf-cal-semana-descartada"
        ];

        destinos.forEach(copiarSemana);
    }

    botonSimular.addEventListener("click", () => {
        borrador = copiar(planActual);

        if (
            borrador[0].fecha === "2026-11-11" &&
            borrador[1].fecha === "2026-11-12"
        ) {
            borrador[0].fecha = "2026-11-13";
            borrador[0].hora = "15:00";

            borrador[1].fecha = "2026-11-14";
            borrador[1].hora = "10:00";
        }

        actualizarLista();

        obtener("sf-cal-sim-actividad").value =
            "normalizacion";

        actualizarFormulario();

        mostrarPantalla("sf-cal-vista-simular");
    });

    obtener("sf-cal-sim-actividad")
        .addEventListener("change", actualizarFormulario);

    formulario.addEventListener("submit", evento => {
        evento.preventDefault();

        if (!formulario.reportValidity()) return;

        const id = obtener("sf-cal-sim-actividad").value;
        const fecha = obtener("sf-cal-sim-fecha").value;
        const hora = obtener("sf-cal-sim-hora").value;

        if (!fechasSemana.includes(fecha)) {
            alert(
                "Selecciona un día entre el 9 y el 15 de noviembre de 2026."
            );
            return;
        }

        const propuesta = copiar(borrador);

        const actividad = propuesta.find(
            item => item.id === id
        );

        if (!actividad) return;

        actividad.fecha = fecha;
        actividad.hora = hora;

        const conflicto = buscarConflicto(propuesta, actividad);

        if (conflicto) {
            alert(
                "Conflicto de horario. Elige otro espacio libre."
            );
            return;
        }

        if (minutos(hora) + actividad.duracion > 1440) {
            alert("La sesión no puede terminar después de medianoche.");
            return;
        }

        borrador = propuesta;
        actualizarLista();

        alert(
            "Cambio añadido al borrador. " +
            "El calendario original todavía no se ha modificado."
        );
    });

    obtener("sf-cal-comparar")
        .addEventListener("click", () => {
            actualizarComparacion();
            mostrarPantalla("sf-cal-vista-comparar");
        });

    obtener("sf-cal-aplicar")
        .addEventListener("click", () => {
            const error = comprobarPlan(borrador);

            if (error) {
                alert(error);
                return;
            }

            try {
                localStorage.setItem(
                    clave,
                    JSON.stringify(borrador)
                );
            } catch {
                alert("No se pudo guardar la simulación.");
                return;
            }

            planActual = copiar(borrador);

            actualizarCalendario();
            actualizarResumen();

            mostrarPantalla(
                "sf-cal-vista-simulacion-aplicada"
            );
        });

    function descartarSimulacion() {
        borrador = [];

        actualizarCalendario();

        mostrarPantalla(
            "sf-cal-vista-simulacion-descartada"
        );
    }

    obtener("sf-cal-descartar")
        .addEventListener("click", descartarSimulacion);

    obtener("sf-cal-descartar-comparacion")
        .addEventListener("click", descartarSimulacion);

    obtener("sf-cal-volver-aplicada")
        .addEventListener("click", abrirPantallaCalendarios);

    obtener("sf-cal-volver-descartada")
        .addEventListener("click", abrirPantallaCalendarios);

    actualizarCalendario();



window.sfHU42Redistribuir = function () {

    const propuesta = copiar(planActual);

    const repaso = propuesta.find(
        actividad => actividad.id === "normalizacion"
    );

    const sql = propuesta.find(
        actividad => actividad.id === "sql"
    );

    if (!repaso || !sql) {
        return {
            ok: false,
            mensaje: "No se encontraron las actividades."
        };
    }


    if (
        repaso.fecha === "2026-11-13" &&
        repaso.hora === "15:00" &&
        sql.fecha === "2026-11-14" &&
        sql.hora === "10:00"
    ) {
        return {
            ok: true,
            yaAplicado: true
        };
    }


    if (
        repaso.fecha !== "2026-11-11" ||
        repaso.hora !== "16:00" ||
        sql.fecha !== "2026-11-12" ||
        sql.hora !== "17:00"
    ) {
        return {
            ok: false,
            mensaje: "Estas actividades ya tienen horarios diferentes. " +
                     "Utiliza Simular semana para reorganizarlas."
        };
    }

    repaso.fecha = "2026-11-13";
    repaso.hora = "15:00";

    sql.fecha = "2026-11-14";
    sql.hora = "10:00";

    const error = comprobarPlan(propuesta);

    if (error) {
        return {
            ok: false,
            mensaje: error
        };
    }

    try {
        localStorage.setItem(
            clave,
            JSON.stringify(propuesta)
        );
    } catch {
        return {
            ok: false,
            mensaje: "No se pudo guardar la redistribución."
        };
    }

    planActual = copiar(propuesta);

    actualizarCalendario();
    actualizarResumen();

    return {
        ok: true,
        yaAplicado: false
    };
};

})();

(() => {

    function mostrarHU33(id) {
        ocultarPantallaCalendarios();

        const pantalla = document.getElementById(id);

        if (pantalla) {
            pantalla.hidden = false;
        }
    }

    const botonCarga = document.getElementById("sf-cal-carga");

    if (botonCarga) {
        botonCarga.addEventListener("click", () => {
            mostrarHU33("sf-cal-vista-carga");
        });
    }

    const botonSugerencias = document.getElementById(
        "sf-cal-revisar-sugerencias"
    );

    if (botonSugerencias) {
        botonSugerencias.addEventListener("click", () => {
            mostrarHU33("sf-cal-vista-redistribuir");
        });
    }

    const botonRegresar = document.getElementById(
        "sf-cal-regresar-carga"
    );

    if (botonRegresar) {
        botonRegresar.addEventListener(
            "click",
            abrirPantallaCalendarios
        );
    }

    const botonCancelar = document.getElementById(
        "sf-cal-cancelar-redistribucion"
    );

    if (botonCancelar) {
        botonCancelar.addEventListener("click", () => {
            mostrarHU33("sf-cal-vista-carga");
        });
    }

    const botonConfirmar = document.getElementById(
        "sf-cal-confirmar-redistribucion"
    );

    if (botonConfirmar) {
        botonConfirmar.addEventListener("click", () => {

            if (typeof window.sfHU42Redistribuir !== "function") {
                alert("No se encontró la planificación de HU42.");
                return;
            }

            const resultado = window.sfHU42Redistribuir();

            if (!resultado.ok) {
                alert(resultado.mensaje);
                return;
            }

            mostrarHU33("sf-cal-vista-carga-actualizada");
        });
    }

    const botonVerCalendario = document.getElementById(
        "sf-cal-ver-calendario-actualizado"
    );

    if (botonVerCalendario) {
        botonVerCalendario.addEventListener(
            "click",
            abrirPantallaCalendarios
        );
    }

})();

(() => {

    const obtener = id => document.getElementById(id);

    const botonConcentracion = obtener("sf-cal-concentracion");
    const formulario = obtener("sf-cal-form-concentracion");
    const botonCancelar = obtener("sf-cal-cancelar-concentracion");
    const botonVolver = obtener("sf-cal-volver-finalizada");

    const pantallaCurso = obtener("sf-cal-vista-concentracion-curso");
    const campoPersonalizar = obtener("sf-cal-personalizar-duracion");
    const minutosPersonalizados = obtener("sf-cal-minutos-personalizados");

    if (!botonConcentracion || !formulario ||
        !botonCancelar || !botonVolver ||
        !pantallaCurso || !campoPersonalizar ||
        !minutosPersonalizados) {
        return;
    }

    const claveActiva = "studyflow-concentracion-activa-hu21";
    const claveHistorial = "studyflow-concentraciones-hu21";

    let duracion = 25;
    let horaFinal = 0;
    let intervalo = null;
    let finalizacionPendiente = false;

    function mostrarPantalla(id) {

        ocultarPantallaCalendarios();

        const pantalla = obtener(id);

        if (pantalla) {
            pantalla.hidden = false;
        }

        document.querySelector("main")?.scrollIntoView({
            block: "start"
        });
    }

    const opciones = formulario.querySelectorAll(
        'input[name="sf-cal-duracion"]'
    );

    function actualizarPersonalizacion() {

        const seleccionada = formulario.querySelector(
            'input[name="sf-cal-duracion"]:checked'
        );

        const personalizar = seleccionada &&
            seleccionada.value === "personalizar";

        campoPersonalizar.hidden = !personalizar;
        minutosPersonalizados.disabled = !personalizar;
        minutosPersonalizados.required = personalizar;
    }

    opciones.forEach(opcion => {
        opcion.addEventListener(
            "change",
            actualizarPersonalizacion
        );
    });

    actualizarPersonalizacion();

    function formatoTiempo(segundos) {

        const minutos = Math.floor(segundos / 60);
        const segundosRestantes = segundos % 60;

        return String(minutos).padStart(2, "0") +
            ":" +
            String(segundosRestantes).padStart(2, "0");
    }


    function finalizarConcentracion() {

        if (horaFinal === 0) return;

        const estabaVisible = !pantallaCurso.hidden;

        clearInterval(intervalo);
        intervalo = null;
        horaFinal = 0;

        try {
            localStorage.removeItem(claveActiva);
        } catch {

        }

        const registro = {
            actividad: "Repaso de normalización",
            curso: "Base de Datos",
            minutos: duracion,
            fecha: new Date().toISOString()
        };

        let guardado = false;

        try {
            let historial = JSON.parse(
                localStorage.getItem(claveHistorial)
            );

            if (!Array.isArray(historial)) {
                historial = [];
            }

            historial.push(registro);

            localStorage.setItem(
                claveHistorial,
                JSON.stringify(historial)
            );

            guardado = true;

        } catch {
            guardado = false;
        }

        obtener("sf-cal-sesion-registrada").textContent =
            registro.actividad + " · " +
            duracion + " min · " +
            registro.curso;

        obtener("sf-cal-minutos-registrados").textContent =
            duracion + " min";

        const descripcion = document.querySelector(
            "#sf-cal-vista-concentracion-finalizada .sf-cal-cabecera p"
        );

        const tituloResultado = document.querySelector(
            "#sf-cal-vista-concentracion-finalizada .sf-cal-tarjeta-resultado h3"
        );

        if (descripcion) {
            descripcion.textContent = guardado
                ? "StudyFlow registró la sesión realizada"
                : "La sesión terminó, pero no se pudo guardar en este navegador";
        }

        if (tituloResultado) {
            tituloResultado.textContent = guardado
                ? "Sesión guardada"
                : "Sesión finalizada";
        }

        finalizacionPendiente = true;

        if (estabaVisible) {
            finalizacionPendiente = false;

            mostrarPantalla(
                "sf-cal-vista-concentracion-finalizada"
            );
        }
    }


    function actualizarTemporizador() {

        if (horaFinal === 0) return;

        const segundosRestantes = Math.max(
            0,
            Math.ceil((horaFinal - Date.now()) / 1000)
        );

        const tiempo = formatoTiempo(segundosRestantes);

        obtener("sf-cal-temporizador").textContent = tiempo;
        obtener("sf-cal-tiempo-resumen").textContent = tiempo;

        if (segundosRestantes === 0) {
            finalizarConcentracion();
        }
    }

    function iniciarIntervalo() {

        if (intervalo !== null) {
            clearInterval(intervalo);
        }

        intervalo = setInterval(
            actualizarTemporizador,
            1000
        );

        actualizarTemporizador();
    }


    botonConcentracion.addEventListener("click", () => {

        if (horaFinal > 0) {
            actualizarTemporizador();

            if (horaFinal > 0) {
                mostrarPantalla(
                    "sf-cal-vista-concentracion-curso"
                );
                return;
            }
        }

        if (finalizacionPendiente) {
            finalizacionPendiente = false;

            mostrarPantalla(
                "sf-cal-vista-concentracion-finalizada"
            );
            return;
        }

        mostrarPantalla(
            "sf-cal-vista-preparar-concentracion"
        );
    });


    botonCancelar.addEventListener("click", () => {
        abrirPantallaCalendarios();
    });


    formulario.addEventListener("submit", evento => {

        evento.preventDefault();

        if (!formulario.reportValidity()) return;

        const seleccionada = formulario.querySelector(
            'input[name="sf-cal-duracion"]:checked'
        );

        if (!seleccionada) return;

        if (seleccionada.value === "personalizar") {
            duracion = Number(minutosPersonalizados.value);
        } else {
            duracion = Number(seleccionada.value);
        }

        if (!Number.isInteger(duracion) ||
            duracion < 1 ||
            duracion > 180) {

            alert("Selecciona una duración entre 1 y 180 minutos.");
            return;
        }

        horaFinal = Date.now() + duracion * 60 * 1000;

        const descripcion = obtener(
            "sf-cal-concentracion-descripcion"
        );

        descripcion.textContent =
            "Repaso de normalización · Sesión de " +
            duracion + " min";

        try {
            localStorage.setItem(
                claveActiva,
                JSON.stringify({
                    final: horaFinal,
                    minutos: duracion
                })
            );
        } catch {

        }

        mostrarPantalla(
            "sf-cal-vista-concentracion-curso"
        );

        iniciarIntervalo();
    });


    botonVolver.addEventListener("click", () => {

        finalizacionPendiente = false;
        abrirPantallaCalendarios();

    });


    try {

        const activa = JSON.parse(
            localStorage.getItem(claveActiva)
        );

        if (activa &&
            Number.isFinite(activa.final) &&
            Number.isInteger(activa.minutos) &&
            activa.minutos >= 1 &&
            activa.minutos <= 180) {

            horaFinal = activa.final;
            duracion = activa.minutos;

            obtener("sf-cal-concentracion-descripcion").textContent =
                "Repaso de normalización · Sesión de " +
                duracion + " min";

            iniciarIntervalo();
        }

    } catch {

    }

})();

