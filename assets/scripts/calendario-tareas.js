// Mostrar en Calendarios los horarios confirmados en la cadena de Tareas.
(() => {
  const panel = document.querySelector('#sesiones-reprogramadas');
  if (!panel) return;
  const esc = texto => String(texto).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function mostrar() {
    let tareas = [], planificacion = [];
    try {
      const datos = JSON.parse(localStorage.getItem('studyflow:sifuentes:v1'));
      if (Array.isArray(datos?.tareas)) tareas = datos.tareas.filter(t => t.estudio);
      if (Array.isArray(datos?.planificacion)) planificacion = datos.planificacion;
    } catch { /* El calendario de ejemplo permanece disponible. */ }
    panel.innerHTML = '<h2>Sesiones de estudio confirmadas</h2>' + (tareas.length ? tareas.map(t => `<article class="fila"><div><h3>${esc(t.nombre)}</h3><p>${esc(t.curso)} · ${esc(t.estudio.fecha.split('-').reverse().join('/'))} · ${esc(t.estudio.hora)}–${esc(t.estudio.fin)}</p></div><a class="boton" href="tareas.html#detalle/${Number(t.id)}">Ver actividad</a></article>`).join('') : '<p>Las sesiones que confirmes en Tareas aparecerán aquí.</p><a class="boton" href="tareas.html">Ir a Tareas</a>');
    if (planificacion.length) panel.insertAdjacentHTML('beforeend', '<h3 class="flujo-seccion">Planificación desde Progresos</h3>' + planificacion.map(s => `<article class="fila"><div><h3>${esc(s.curso)}</h3><p>${esc(s.fecha.split('-').reverse().join('/'))} · ${esc(s.hora)}–${esc(s.fin)}</p></div><a class="boton" href="progresos.html#programar/${Number(s.id)}">Reprogramar sesión</a></article>`).join(''));
  }
  mostrar();
  window.addEventListener('storage', mostrar);
  window.addEventListener('pageshow', mostrar);
})();
