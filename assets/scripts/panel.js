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
        const pantallasTutor = { 'Mis estudiantes': 'mis-estudiantes.html', 'Riesgo alto': 'mis-estudiantes.html?riesgo=Alto', 'Tutorías': 'tutorias.html', 'Recursos': 'recursos-tutor.html' };
        if (document.body.dataset.perfil === 'tutor' && pantallasTutor[vista]) {
            window.location.href = pantallasTutor[vista];
            return;
        }
        const pantallasEstudiante = { Calendarios: 'calendarios.html', Mensajes: 'mensajes.html', 'Ayuda / Tutorial': 'ayuda-estudiante.html', Tareas: 'tareas.html', Recursos: 'recursos.html', Progresos: 'progresos.html' };
        if (document.body.dataset.perfil === 'estudiante' && pantallasEstudiante[vista]) {
            window.location.href = pantallasEstudiante[vista];
            return;
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

if (document.body.dataset.perfil === 'estudiante' && window.location.hash === '#mis-cursos') {
    document.querySelector('[data-vista="Mis cursos"]')?.click();
}

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

