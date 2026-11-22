(() => {
    if (document.documentElement.dataset.formularioListo) return;

    const selectorPerfil = document.querySelector("#perfil-login");
    if (new URLSearchParams(location.search).get("perfil") === "tutor") {
        selectorPerfil.value = "tutor";
    }

    const formulario = document.querySelector("#login-form");
    const correo = document.querySelector("#correo");
    const clave = document.querySelector("#clave");
    const estado = document.querySelector("#estado");
    const mostrar = document.querySelector("#toggle-clave");
    const demo = { correo: "demo@example.com", clave: "StudyFlow2026!" };

    function validar(campo) {
        let mensaje = "";

        if (campo === correo) {
            if (!correo.value.trim()) {
                mensaje = "Escribe tu correo electrónico.";
            } else if (correo.validity.typeMismatch) {
                mensaje = "Revisa el correo. Usa un formato como nombre@ejemplo.com.";
            }
        } else if (!clave.value.trim()) {
            mensaje = "Escribe tu contraseña.";
        }

        const error = document.querySelector("#error-" + campo.id);
        error.textContent = mensaje;
        error.hidden = !mensaje;

        if (mensaje) {
            campo.setAttribute("aria-invalid", "true");
        } else {
            campo.removeAttribute("aria-invalid");
        }

        return !mensaje;
    }

    function informar(mensaje, tipo) {
        estado.textContent = mensaje;
        estado.dataset.tipo = tipo;
    }

    for (const campo of [correo, clave]) {
        campo.addEventListener("input", () => {
            if (campo.hasAttribute("aria-invalid")) {
                validar(campo);
            }
            informar("", "");
        });
    }

    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault();
        const correoValido = validar(correo);
        const claveValida = validar(clave);

        if (!correoValido || !claveValida) {
            informar("Revisa los campos indicados y vuelve a intentarlo.", "error");
            (correoValido ? clave : correo).focus();
            return;
        }

        if (correo.value.trim().toLowerCase() !== demo.correo || clave.value !== demo.clave) {
            informar("El correo o la contraseña son incorrectos. Revisa los datos o usa «Rellenar datos de prueba».", "error");
            return;
        }

        clave.type = "password";
        mostrar.textContent = "Mostrar";
        clave.value = "";
        location.assign("inicio-" + selectorPerfil.value + ".html");
    });

    mostrar.addEventListener("click", () => {
        const visible = clave.type === "password";
        clave.type = visible ? "text" : "password";
        mostrar.textContent = visible ? "Ocultar" : "Mostrar";
    });

    document.querySelector("#demo-datos").addEventListener("click", () => {
        correo.value = demo.correo;
        clave.value = demo.clave;
        clave.type = "password";
        mostrar.textContent = "Mostrar";
        validar(correo);
        validar(clave);
        informar("Datos de prueba listos. Pulsa «Iniciar sesión».", "");
        formulario.querySelector('[type="submit"]').focus();
    });

    for (const enlace of document.querySelectorAll("[data-dialog]")) {
        enlace.addEventListener("click", (evento) => {
            evento.preventDefault();
            document.getElementById(enlace.dataset.dialog).showModal();
        });
    }



    formulario.querySelector('[type="submit"]').disabled = false;

    document.documentElement.dataset.formularioListo = "true";
})();
