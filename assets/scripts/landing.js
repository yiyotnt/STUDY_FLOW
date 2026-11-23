const enlaces = document.querySelectorAll('.studyflow-landing nav a[href^="#"]');

function indicarSeccion() {
  const destino = location.hash || '#inicio';
  for (const enlace of enlaces) {
    if (enlace.hash === destino) {
      enlace.setAttribute('aria-current', 'location');
    } else {
      enlace.removeAttribute('aria-current');
    }
  }
}

indicarSeccion();
window.addEventListener('hashchange', indicarSeccion);

const encabezado = document.querySelector('.studyflow-landing > .top');

const observarEncabezado = new ResizeObserver(() => {
  const altura = encabezado.getBoundingClientRect().height;
  document.body.style.setProperty('--sf-header-height', `${altura}px`);
});

observarEncabezado.observe(encabezado);
