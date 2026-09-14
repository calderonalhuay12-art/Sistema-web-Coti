// ===== FUNCION DE BUSQUEDA RUC CON API =====
async function buscarRUC() {
    const ruc = document.getElementById('in-ruc').value.trim();
    if (ruc.length !== 11) {
        alert("❌ El RUC debe tener 11 dígitos.");
        return;
    }

    const btnBuscar = document.querySelector('button[onclick="buscarRUC()"]');
    const textoOriginal = btnBuscar.textContent;
    btnBuscar.textContent = "⏳ Buscando...";
    btnBuscar.disabled = true;

    try {
        const token = obtenerTokenAPI();
        const url = "https://apiperu.dev/api/ruc";
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({ ruc: ruc })
        });

        if (res.ok) {
            const respuesta = await res.json();
            const data = respuesta.data || respuesta;
            
            // ==== RAZON SOCIAL ====
            const razonSocial = data.nombre_o_razon_social || 
                               data.nombre || 
                               data.razon_social || 
                               data.razonSocial || 
                               '';
            
            // ==== DIRECCION ====
            const direccion = data.direccion_completa || 
                             data.direccion || 
                             data.domicilio_fiscal || 
                             '';
            
            // ==== ASIGNAR DATOS (SIN ALERTAS) ====
            if (razonSocial) {
                document.getElementById('in-cliente').value = razonSocial;
            }
            if (direccion) {
                document.getElementById('in-dir').value = direccion;
            }

            updateDoc();
            // ==== ESTADO Y CONDICION ====
            const estado = data.estado || '';
            const condicion = data.condicion || '';
            
            document.getElementById('in-estado').value = estado;
            document.getElementById('in-condicion').value = condicion;
            
            
            // ==== MOSTRAR MENSAJE RÁPIDO (solo si hay error o éxito) ====
            if (razonSocial) {
                // Éxito: mensaje breve en la consola (no molesta)
                console.log(`✅ RUC ${ruc} cargado: ${razonSocial}`);
                // Opcional: un pequeño toast o notificación (puedes omitir)
                // alert(`✅ RUC ${ruc} cargado`); // ← DESCOMENTAR SI QUIERES ALERTA CORTA
            } else {
                alert(`⚠️ RUC ${ruc} encontrado pero sin razón social.`);
            }
        } else {
            alert(`❌ Error al consultar API: ${res.status}`);
        }
    } catch (e) {
        console.error("❌ Error:", e);
        alert("❌ Error de conexión. Verifica tu internet.");
    } finally {
        btnBuscar.textContent = textoOriginal;
        btnBuscar.disabled = false;
 guardarTodosLosCampos();
    }
}

// ===== TOKEN API =====
function obtenerTokenAPI() {
    let token = localStorage.getItem('api_token_peru');
    if (!token) {
        token = '72b98f4fd90f4adf38c'; // Token por defecto
        localStorage.setItem('api_token_peru', token);
    }
    // Actualizar el input con el token guardado
    const input = document.getElementById('api-token-input');
    if (input) input.value = token;
    return token;
}

function guardarTokenAPI() {
    const input = document.getElementById('api-token-input');
    if (!input) return;
    const token = input.value.trim();
    if (!token) {
        alert('❌ Ingresa un token válido.');
        return;
    }
    localStorage.setItem('api_token_peru', token);
    alert('✅ Token guardado correctamente.');
}
// ===== TOGGLE API CONFIG =====
function toggleApiConfig() {
    const content = document.getElementById('api-config-content');
    const icon = document.getElementById('api-toggle-icon');
    if (content.style.display === 'none') {
        content.style.display = 'block';
        icon.textContent = '▼';
    } else {
        content.style.display = 'none';
        icon.textContent = '▶';
    }
}

function toggleTokenVisibility() {
    const input = document.getElementById('api-token-input');
    if (input.type === 'password') {
        input.type = 'text';
    } else {
        input.type = 'password';
    }
}
