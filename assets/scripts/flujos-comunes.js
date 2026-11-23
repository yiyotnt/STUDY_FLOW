// Elementos compartidos por las cadenas de Recursos y Progresos.
window.vistaStudyFlow = ({ datos, guardar, esc }, seccion) => {
  const raiz = document.querySelector('#contenido');
  let aviso = '';
  const enlace = (texto, ruta, principal=false) => `<a class="boton ${principal?'principal':''}" href="#${ruta}">${texto}</a>`;
  const encabezado = (titulo, texto) => `<small class="eyebrow">ESPACIO ESTUDIANTE · ${seccion.toUpperCase()}</small><h1>${esc(titulo)}</h1><p class="subtitulo">${esc(texto)}</p>`;
  const campo = (texto,nombre,tipo='text',valor='',extras='') => `<label>${texto}<input name="${nombre}" type="${tipo}" value="${esc(valor)}" ${extras}></label>`;
  const formulario = (accion,campos,texto='Guardar',volver='inicio') => `<form class="formulario-tarea" data-flujo-form="${accion}" novalidate><p class="form-error" role="alert" hidden></p>${campos}<div class="acciones"><button type="submit" class="principal">${texto}</button>${enlace('Cancelar',volver)}</div></form>`;
  const ruta = () => location.hash.slice(1) || 'inicio';
  const hoy = () => new Intl.DateTimeFormat('en-CA',{timeZone:'America/Lima',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
  const fecha = v => v?v.split('-').reverse().join('/'):'Sin fecha';
  const normalizar = v => String(v).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  let render = () => '';
  function pintar(){raiz.innerHTML=`<nav class="ruta-tareas" aria-label="Ubicación"><a href="#inicio">${seccion}</a>${ruta()!=='inicio'?'<span>/</span><span>Detalle</span>':''}</nav>${aviso?'<p class="aviso-tarea" role="status">'+esc(aviso)+'</p>':''}${render()}`}
  function ir(destino){if(location.hash==='#'+destino)pintar();else location.hash=destino}
  function guardarCambios(mensaje){if(guardar(mensaje)===false)throw new Error('No se pudieron guardar los cambios. Revisa el almacenamiento del navegador.');aviso=mensaje}
  window.addEventListener('hashchange',()=>{pintar();document.querySelector('main').scrollIntoView({block:'start'})});
  document.querySelector('[data-accion="avisos"]')?.addEventListener('click',()=>{aviso=`Tienes ${datos.tareas.filter(t=>!t.completa).length} actividades pendientes.`;pintar()});
  return {raiz,enlace,encabezado,campo,formulario,ruta,hoy,fecha,normalizar,ir,pintar,guardarCambios,setAviso:v=>{aviso=v},iniciar:fn=>{render=fn;pintar()}};
};

// Los archivos se guardan aparte para permitir materiales de hasta 10 MB.
window.archivosStudyFlow = {
  abrir(){return new Promise((resolve,reject)=>{const solicitud=indexedDB.open('studyflow-materiales',1);solicitud.onupgradeneeded=()=>solicitud.result.createObjectStore('archivos');solicitud.onsuccess=()=>resolve(solicitud.result);solicitud.onerror=()=>reject(new Error('No se pudo abrir el almacenamiento de archivos.'))})},
  async guardar(id,archivo){const db=await this.abrir();try{await new Promise((resolve,reject)=>{const tx=db.transaction('archivos','readwrite');tx.objectStore('archivos').put(archivo,id);tx.oncomplete=resolve;tx.onerror=()=>reject(new Error('No se pudo guardar el archivo.'));tx.onabort=()=>reject(new Error('No se pudo guardar el archivo.'))})}finally{db.close()}},
  async leer(id){const db=await this.abrir();try{return await new Promise((resolve,reject)=>{const req=db.transaction('archivos').objectStore('archivos').get(id);req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(new Error('No se pudo recuperar el archivo.'))})}finally{db.close()}}
};
