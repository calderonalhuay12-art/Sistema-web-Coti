function guardarEstadoLocal() {
    try {
        // ==== OBTENER LISTA DE PRECIOS DEL SELECT ====
        const selectPrecio = document.getElementById('item-precio');
        const listaPrecios = [];
        for (let i = 0; i < selectPrecio.options.length; i++) {
            listaPrecios.push(selectPrecio.options[i].value);
        }
        
        // ==== OBTENER LISTA DE ASESORES DEL SELECT ====
        const selectAsesor = document.getElementById('in-asesor');
        const listaAsesores = [];
        for (let i = 0; i < selectAsesor.options.length; i++) {
            listaAsesores.push(selectAsesor.options[i].value);
        }

        // ==== CREAR ESTADO COMPLETO ====
        const estado = {
            catalogData: catalogData,
            marcasPorEquipo: marcasPorEquipo,
           catalogoActividades: catalogoActividades,
            brandCatalog: brandCatalog,
            proceduresData: proceduresData,
            procedimientoPorEquipo: procedimientoPorEquipo,
            historialCotizaciones: historialCotizaciones,
            historialOT: historialOT,
            itemsData: itemsData,
            asesorSeleccionado: selectAsesor.value,
            listaAsesores: listaAsesores,          // <--- GUARDA LA LISTA COMPLETA
            preciosCatalog: listaPrecios,          // <--- GUARDA LA LISTA COMPLETA
            precioSeleccionado: selectPrecio.value, // <--- GUARDA EL SELECCIONADO
            unitsCatalog: unitsCatalog,
            clienteData: {
                ruc: document.getElementById('in-ruc').value,
                cliente: document.getElementById('in-cliente').value,
                dir: document.getElementById('in-dir').value,
                contacto: document.getElementById('in-contacto').value,
                tel: document.getElementById('in-tel').value,
                correo: document.getElementById('in-correo').value,
                fecha: document.getElementById('in-fecha').value
            }
        };
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(estado));
        console.log("✅ Datos guardados correctamente");
    } catch (e) {
        console.error("Error al guardar en localStorage:", e);
    }
}

function exportarRespaldoLocal() {
    guardarEstadoLocal();
    const estadoStr = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!estadoStr) return alert("No hay datos para respaldar.");
    const blob = new Blob([estadoStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const hoy = new Date().toISOString().split('T')[0];
    a.href = url;
    a.download = `Respaldo_Cotizador_${hoy}.json`;
    a.click();
    URL.revokeObjectURL(url);
}
function fusionarProfundo(local, importado) {
    if (Array.isArray(local) && Array.isArray(importado)) {
        const combinado = [...local];
        importado.forEach(item => {
            const yaExiste = combinado.some(x => JSON.stringify(x) === JSON.stringify(item));
            if (!yaExiste) combinado.push(item);
        });
        return combinado;
    }
    if (typeof local === 'object' && local !== null && typeof importado === 'object' && importado !== null && !Array.isArray(local) && !Array.isArray(importado)) {
        const resultado = { ...local };
        Object.keys(importado).forEach(key => {
            resultado[key] = resultado.hasOwnProperty(key) ? fusionarProfundo(resultado[key], importado[key]) : importado[key];
        });
        return resultado;
    }
    return local; // primitivo o tipos distintos: se mantiene el local
}  

function cargarRespaldoLocal(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importado = JSON.parse(e.target.result);
            const estadoActualStr = localStorage.getItem(LOCAL_STORAGE_KEY);
            const actual = estadoActualStr ? JSON.parse(estadoActualStr) : {};

            const camposCatalogo = ['catalogData','marcasPorEquipo','catalogoActividades','brandCatalog','proceduresData','procedimientoPorEquipo','unitsCatalog','listaAsesores','preciosCatalog'];
            const estadoFusionado = { ...actual };

            camposCatalogo.forEach(campo => {
                if (importado[campo] !== undefined) {
                    estadoFusionado[campo] = fusionarProfundo(actual[campo] || (Array.isArray(importado[campo]) ? [] : {}), importado[campo]);
                }
            });

           // Historial de cotizaciones: sumar las que falten por "id"
            const historialActual = actual.historialCotizaciones || [];
            const historialImportado = importado.historialCotizaciones || [];
            const idsExistentes = new Set(historialActual.map(c => c.id).filter(Boolean));
            const nuevasCotizaciones = historialImportado.filter(c => !c.id || !idsExistentes.has(c.id));
            estadoFusionado.historialCotizaciones = [...historialActual, ...nuevasCotizaciones];

            // Historial de OT: sumar las que falten por "numero"
            const otActual = actual.historialOT || [];
            const otImportado = importado.historialOT || [];
            const numerosExistentes = new Set(otActual.map(o => o.numero));
            const nuevasOT = otImportado.filter(o => !numerosExistentes.has(o.numero));
            estadoFusionado.historialOT = [...otActual, ...nuevasOT];

            // Se mantienen los de esta laptop (no se sobrescriben con el respaldo)
            estadoFusionado.itemsData = actual.itemsData || [];
            estadoFusionado.clienteData = actual.clienteData || {};
            estadoFusionado.asesorSeleccionado = actual.asesorSeleccionado;
            estadoFusionado.precioSeleccionado = actual.precioSeleccionado;

            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(estadoFusionado));
            cargarEstadoLocal();
            updateDoc();
            renderTables();
            actualizarSelectHistorial();
            refrescarVistasSecundarias();
            alert("¡Respaldo combinado correctamente! Se sumaron los datos nuevos sin borrar los existentes.");
        } catch (err) {
            alert("Error al leer el archivo de respaldo JSON: " + err.message);
        }
    };
    reader.readAsText(file);
}


function cargarEstadoLocal() {
    try {
        const dataStr = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (!dataStr) {
            console.log("ℹ️ No hay datos guardados. Usando catálogos por defecto.");
            return;
        }
        const estado = JSON.parse(dataStr);
        
        // ==== CARGAR CATÁLOGOS ====
        if (estado.catalogoActividades) {
                catalogoActividades = estado.catalogoActividades;
              }
        if (estado.catalogData && Object.keys(estado.catalogData).length > 0) {
            Object.keys(catalogData).forEach(key => delete catalogData[key]);
            Object.assign(catalogData, estado.catalogData);
        }
        if (estado.marcasPorEquipo && Object.keys(estado.marcasPorEquipo).length > 0) {
            Object.keys(marcasPorEquipo).forEach(key => delete marcasPorEquipo[key]);
            Object.assign(marcasPorEquipo, estado.marcasPorEquipo);
        }
        if (estado.brandCatalog && Object.keys(estado.brandCatalog).length > 0) {
            Object.keys(brandCatalog).forEach(key => delete brandCatalog[key]);
            Object.assign(brandCatalog, estado.brandCatalog);
        }
        if (estado.proceduresData && Object.keys(estado.proceduresData).length > 0) {
            Object.keys(proceduresData).forEach(key => delete proceduresData[key]);
            Object.assign(proceduresData, estado.proceduresData);
        }
        if (estado.procedimientoPorEquipo && Object.keys(estado.procedimientoPorEquipo).length > 0) {
            Object.keys(procedimientoPorEquipo).forEach(key => delete procedimientoPorEquipo[key]);
            Object.assign(procedimientoPorEquipo, estado.procedimientoPorEquipo);
        }
if (estado.unitsCatalog && Object.keys(estado.unitsCatalog).length > 0) {
    Object.keys(unitsCatalog).forEach(key => delete unitsCatalog[key]);
    Object.assign(unitsCatalog, estado.unitsCatalog);
}

              // ==== CARGAR ARRAYS ====
        if (estado.historialCotizaciones && Array.isArray(estado.historialCotizaciones)) {
            historialCotizaciones = estado.historialCotizaciones;
            historialCotizaciones.forEach(cot => {
                if (!cot.id) cot.id = 'legacy-' + cot.nro + '-' + (cot.fecha || '') + '-' + (cot.cliente || '');
            });
        }
        if (estado.historialOT && Array.isArray(estado.historialOT)) {
            historialOT = estado.historialOT;
        }
        if (estado.itemsData && Array.isArray(estado.itemsData)) {
            itemsData = estado.itemsData;
        }
   if (estado.preciosCatalog && Array.isArray(estado.preciosCatalog)) {
            const selectPrecio = document.getElementById('item-precio');
            selectPrecio.innerHTML = '';
            estado.preciosCatalog.forEach(precio => {
                const opt = document.createElement('option');
                opt.value = precio;
                opt.textContent = precio;
                selectPrecio.appendChild(opt);
            });
            if (estado.precioSeleccionado) {
                selectPrecio.value = estado.precioSeleccionado;
            }
ordenarSelectPrecios();
        }

        // ==== CARGAR ASESOR ====
       if (estado.listaAsesores && Array.isArray(estado.listaAsesores)) {
            const selectAsesor = document.getElementById('in-asesor');
            selectAsesor.innerHTML = '';
            estado.listaAsesores.forEach(asesor => {
                const opt = document.createElement('option');
                opt.value = asesor;
                opt.textContent = asesor;
                selectAsesor.appendChild(opt);
            });
            if (estado.asesorSeleccionado) {
                selectAsesor.value = estado.asesorSeleccionado;
            }
        }

        // ==== CARGAR DATOS DEL CLIENTE ====
        if (estado.clienteData) {
            document.getElementById('in-ruc').value = estado.clienteData.ruc || '';
            document.getElementById('in-cliente').value = estado.clienteData.cliente || '';
            document.getElementById('in-dir').value = estado.clienteData.dir || '';
            document.getElementById('in-contacto').value = estado.clienteData.contacto || '';
            document.getElementById('in-tel').value = estado.clienteData.tel || '';
            document.getElementById('in-correo').value = estado.clienteData.correo || '';
            document.getElementById('in-fecha').value = estado.clienteData.fecha || '';
        }

        // ==== ACTUALIZAR SELECTS (NUEVO) ====
        actualizarDesplegablesDependientes();
        actualizarMarcasPorEquipo();
        updateDoc();
        renderTables();

        console.log("✅ Datos cargados correctamente");
    } catch (e) {
        console.error("Error al cargar de localStorage:", e);
    }
}
const LOCAL_STORAGE_KEY_CAMPOS = 'cotizador_campos_v1';

// Prefijos de campos que NO deben persistir (son del formulario "agregar instrumento",
// se resetean solos cada vez que agregas un ítem — guardarlos causaría confusión)
const PREFIJOS_EXCLUIDOS = ['item-', 'alcance-', 'modal-', 'select-historial', 'puntos-texto'];

function debeExcluirCampo(id) {
    return PREFIJOS_EXCLUIDOS.some(p => id.startsWith(p));
}

function guardarTodosLosCampos() {
    const datos = {};
    document.querySelectorAll('input[id], select[id], textarea[id]').forEach(el => {
        if (debeExcluirCampo(el.id)) return;
        datos[el.id] = (el.type === 'checkbox') ? el.checked : el.value;
    });
    localStorage.setItem(LOCAL_STORAGE_KEY_CAMPOS, JSON.stringify(datos));
}

function cargarTodosLosCampos() {
    const dataStr = localStorage.getItem(LOCAL_STORAGE_KEY_CAMPOS);
    if (!dataStr) return;
    try {
        const datos = JSON.parse(dataStr);
        Object.keys(datos).forEach(id => {
            const el = document.getElementById(id);
            if (!el) return; // el campo pudo no existir aún (select dinámico vacío) — se ignora sin error
            if (el.type === 'checkbox') el.checked = datos[id];
            else el.value = datos[id];
        });
    } catch (e) { console.error('Error al cargar campos:', e); }
}

// Guarda automáticamente CADA VEZ que se escribe o cambia cualquier casilla del formulario
document.addEventListener('input', guardarTodosLosCampos);
document.addEventListener('change', guardarTodosLosCampos);
