// Interacciones visuales sencillas; las pantallas también se muestran sin JavaScript.
(() => {
 const busqueda = document.querySelector('#buscar-tutor');
 const riesgo = document.querySelector('#riesgo');
 const filas = [...document.querySelectorAll('[data-estudiante]')];
 const normalizar = texto => texto.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
 function filtrar() {
   let visibles = 0;
   for (const fila of filas) {
     fila.hidden = !normalizar(fila.textContent).includes(normalizar(busqueda.value)) || Boolean(riesgo?.value && fila.dataset.riesgo !== riesgo.value);
     if (!fila.hidden) visibles++;
   }
   const contador = document.querySelector('#contador-estudiantes');
   if (contador) contador.textContent = `${visibles} de ${filas.length} estudiantes`;
   const vacio = document.querySelector('#sin-estudiantes');
   if (vacio) vacio.hidden = visibles > 0;
 }
 busqueda?.addEventListener('input', filtrar);
 riesgo?.addEventListener('change', filtrar);
})();
