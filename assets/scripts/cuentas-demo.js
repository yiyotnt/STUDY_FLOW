/* Cuentas de prueba para la pestaña actual de StudyFlow. */
const cuentasDemo = (() => {
    const llave = (correo, perfil) => "studyflow:demo:" + perfil + ":" + correo;

    async function huella(clave, sal) {
        const entrada = new TextEncoder().encode(sal + ":" + clave);
        const resultado = await crypto.subtle.digest("SHA-256", entrada);
        return Array.from(new Uint8Array(resultado)).join(",");
    }

    return {
        async registrar(correo, clave, perfil, nombre) {
            const sal = crypto.randomUUID();
            const verificador = await huella(clave, sal);
            sessionStorage.setItem(llave(correo, perfil), JSON.stringify({ sal, verificador, nombre }));
        },

        async verificar(correo, clave, perfil) {
            const cuenta = JSON.parse(sessionStorage.getItem(llave(correo, perfil)));
            return cuenta && cuenta.verificador === await huella(clave, cuenta.sal) ? cuenta : null;
        }
    };
})();
