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
