(() => {
    if (document.documentElement.dataset.formularioListo) return;

    const formulario = document.querySelector("#registro-form");
    const pasos = Array.from(document.querySelectorAll("[data-paso]"));
    const progreso = Array.from(document.querySelectorAll(".progreso li"));
    const estado = document.querySelector("#estado-registro");
    const errorPerfil = document.querySelector("#error-perfil");
    const clave = document.querySelector("#clave");
    const confirmar = document.querySelector("#confirmar");
    const crear = document.querySelector("#crear");
    const continuar = document.querySelector("#continuar");
    let perfil = "";

    function mostrarPaso(numero) {
        pasos.forEach((paso, indice) => { paso.hidden = indice !== numero - 1; });
        progreso.forEach((item, indice) => {
            item.classList.toggle("completo", indice < numero - 1);
            item.querySelector("span").textContent = indice < numero - 1 ? "✓" : String(indice + 1);
            if (indice === numero - 1) item.setAttribute("aria-current", "step");
            else item.removeAttribute("aria-current");
        });
        pasos[numero - 1].querySelector("h1").focus();
    }

    continuar.addEventListener("click", () => {
        const elegido = document.querySelector('input[name="perfil"]:checked');
        if (!elegido) {
            errorPerfil.hidden = false;
            errorPerfil.textContent = "Selecciona estudiante o tutor para continuar.";
            document.querySelector('input[name="perfil"]').focus();
            return;
        }

        perfil = elegido.value;
        for (const tipo of ["estudiante", "tutor"]) {
            const grupo = document.getElementById(tipo);
            grupo.hidden = tipo !== perfil;
            grupo.disabled = grupo.hidden;
        }
        document.querySelector("#titulo-formulario").textContent =
            perfil === "tutor" ? "Crear cuenta - Tutor" : "Crear cuenta - Estudiante";
        crear.textContent = "Crear cuenta de " + perfil;
        mostrarPaso(2);
    });

    document.querySelector(".perfiles").addEventListener("change", () => {
        errorPerfil.hidden = true;
    });

    document.querySelector("#volver").addEventListener("click", () => {
        estado.textContent = "";
        mostrarPaso(1);
    });

    function validar(campo) {
        let mensaje = "";
        if (campo.type === "checkbox" && !campo.checked) {
            mensaje = "Acepta las condiciones de la demostración para continuar.";
        } else if (campo.required && !campo.value.trim()) {
            mensaje = campo.tagName === "SELECT" ? "Selecciona una opción." : "Completa este campo.";
        } else if (campo.validity.typeMismatch) {
            mensaje = "Escribe un correo con un formato como nombre@example.com.";
        } else if (campo === clave && campo.value.length < 8) {
            mensaje = "Usa al menos 8 caracteres.";
        } else if (campo === confirmar && campo.value !== clave.value) {
            mensaje = "Las contraseñas deben coincidir.";
        }

        const error = document.getElementById("error-" + campo.id);
        error.textContent = mensaje;
        error.hidden = !mensaje;
        if (mensaje) campo.setAttribute("aria-invalid", "true");
        else campo.removeAttribute("aria-invalid");
        return !mensaje;
    }

    function revisarEdicion(evento) {
        const campo = evento.target;
        if (campo.hasAttribute("aria-invalid")) validar(campo);
        if (campo === clave && confirmar.value) validar(confirmar);
        estado.textContent = "";
    }

    formulario.addEventListener("input", revisarEdicion);
    formulario.addEventListener("change", revisarEdicion);

    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault();
        const campos = Array.from(formulario.querySelectorAll("input:enabled, select:enabled"));
        const errores = campos.filter((campo) => !validar(campo));
        if (errores.length) {
            estado.dataset.tipo = "error";
            estado.textContent = "Corrige los campos indicados y vuelve a intentarlo.";
            errores[0].focus();
            return;
        }

        formulario.reset();
        for (const boton of formulario.querySelectorAll("[data-toggle]")) {
            document.getElementById(boton.dataset.toggle).type = "password";
            boton.textContent = "Mostrar";
        }
        estado.textContent = "";
        document.querySelector("#confirmacion-texto").textContent =
            "Completaste el flujo de " + perfil + ". Puedes probar el inicio de sesión con sus credenciales de demostración.";
        document.querySelector('[data-paso="3"] a').href = "login.html?perfil=" + perfil;
        mostrarPaso(3);
    });

    for (const boton of document.querySelectorAll("[data-toggle]")) {
        boton.addEventListener("click", () => {
            const campo = document.getElementById(boton.dataset.toggle);
            const visible = campo.type === "password";
            campo.type = visible ? "text" : "password";
            boton.textContent = visible ? "Ocultar" : "Mostrar";
        });
    }

    for (const control of document.querySelectorAll("[data-dialog]")) {
        control.addEventListener("click", (evento) => {
            evento.preventDefault();
            document.getElementById(control.dataset.dialog).showModal();
        });
    }

    continuar.disabled = false;
    crear.disabled = false;

    document.documentElement.dataset.formularioListo = "true";
})();
