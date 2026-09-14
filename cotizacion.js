
        // ===================================================================
// PARTE 3: JAVASCRIPT COMPLETO (CORREGIDO)
// ===================================================================

// ===== FUNCIONES DEL COTIZADOR =====
function toggleOcultarCliente() {
    clienteOculto = !clienteOculto;
    const btn = document.getElementById('btn-toggle-cliente');
    const container = document.getElementById('container-datos-cliente');
    if (clienteOculto) { btn.innerText = 'Mostrar'; if (container) container.style.display = 'none'; } else { btn.innerText = 'Ocultar'; if (container) container.style.display = 'grid'; }
    updateDoc(); renderTables();
}

function siguienteNumeroCotizacion() {
    const input = document.getElementById('in-cot');
    let val = input.value.trim();
    const match = val.match(/^(\d+)([a-zA-Z]?)-(\d{4})$/);
    if (match) {
        let num = parseInt(match[1], 10);
        let letter = match[2] || '';
        let year = match[3];
        if (letter === '') { letter = 'a'; } else if (letter === 'a') { letter = 'b'; } else if (letter === 'b') { letter = 'c'; } else if (letter === 'c') { num++; letter = ''; }
        input.value = String(num).padStart(3, '0') + (letter ? letter : '') + '-' + year;
    } else {
        const mNum = val.match(/^(\d+)-(\d{4})$/);
        if (mNum) { let num = parseInt(mNum[1], 10) + 1; let year = mNum[2]; input.value = String(num).padStart(3, '0') + '-' + year; } else {
            const soloNum = val.match(/^(\d+)$/);
            if (soloNum) { input.value = String(parseInt(soloNum[1], 10) + 1).padStart(3, '0'); }
        }
    }
    updateDoc();
guardarEstadoLocal();
}
function cambiarTipoServicio() {
    const tipo = document.getElementById('tipo-servicio-select').value;
    const titulo = document.getElementById('titulo-agregar-instrumentos');
    const labels = { calibracion: 'Calibración', mantenimiento: 'Mantenimiento', verificacion: 'Verificación', ventacalibracion: 'Venta y Calibración' };
    titulo.textContent = `⚙️ Agregar Instrumentos para ${labels[tipo] || 'Calibración'}`;

    const procSelect = document.getElementById('item-proc');
    const puntosContainer = document.getElementById('puntos-container');
    const puntosTextoContainer = document.getElementById('puntos-texto-container');
    const actividadesContainer = document.getElementById('actividades-container');
    const labelPuntos = document.getElementById('puntos-label');

    if (tipo === 'mantenimiento') {
        procSelect.disabled = true;
        procSelect.innerHTML = '<option value="PRO-OPE-007: Procedimiento general de mantenimiento, fabricación y venta de equipos">PRO-OPE-007: Procedimiento general de mantenimiento, fabricación y venta de equipos</option>';
        procSelect.value = 'PRO-OPE-007: Procedimiento general de mantenimiento, fabricación y venta de equipos';
        puntosContainer.style.display = 'none';
        puntosTextoContainer.style.display = 'block';
        actividadesContainer.style.display = 'block';
        labelPuntos.textContent = 'Puntos / Especificaciones (texto libre)';
    } else {
        const mag = document.getElementById('item-magnitud').value;
        actualizarDesplegablesDependientes();
        puntosContainer.style.display = 'block';
        puntosTextoContainer.style.display = 'none';
        actividadesContainer.style.display = 'none';
        labelPuntos.textContent = (tipo === 'verificacion') ? 'Puntos de Verificación / Especificaciones' : 'Puntos de Calibración Acreditados / Especificaciones';
    }

    renderPreviewChips();
    document.getElementById('puntos-texto').value = '';
    document.getElementById('actividades-preview').innerHTML = '';
    actividadesTemp = [];
    renderActividadesPreview();
}

function abrirModalPuntos() {
    const mag = document.getElementById('item-magnitud').value, equipo = document.getElementById('item-equipo').value, unidadSelect = document.getElementById('modal-punto-unidad');
    unidadSelect.innerHTML = '';
    let unidades = esMaterialVidrioOPlastico(equipo) ? ["%"] : (unitsCatalog[mag] || ["unid", "pto"]);
    unidades.forEach(u => unidadSelect.innerHTML += `<option value="${u}">${u}</option>`);
    if (esMaterialVidrioOPlastico(equipo) && puntosModalTemp.length === 0) puntosModalTemp = ["10%, 50% Y 100%"];

    const seccionIso = document.getElementById('modal-punto-isotermico');
    if (esMedioIsotermico(equipo)) {
        seccionIso.style.display = 'block';
        const unidadesTemp = ["°C", "°F", "K"];
        const selUnidad = document.getElementById('modal-iso-unidad');
        selUnidad.innerHTML = '';
        unidadesTemp.forEach(u => { selUnidad.innerHTML += `<option value="${u}">${u}</option>`; });
    } else { seccionIso.style.display = 'none'; }
    renderModalChips(); document.getElementById('modalPuntos').classList.add('active');
}

function agregarPuntoChip() {
    const val = document.getElementById('modal-punto-val').value.trim(), unit = document.getElementById('modal-punto-unidad').value;
    if(!val) return;
    const puntosProcesados = val.split(',').map(p => p.trim()).filter(p => p !== '').map(p => unit ? `${p} ${unit}` : p);
    puntosModalTemp.push(...puntosProcesados); document.getElementById('modal-punto-val').value = ''; renderModalChips();
}

function agregarPuntoIsotermico() {
    const tolerancia = document.getElementById('modal-iso-tolerancia').value.trim();
    const unidadTolerancia = document.getElementById('modal-iso-unidad').value;
    if (!tolerancia) { alert('Ingrese la tolerancia del punto seleccionado.'); return; }
    if (puntosModalTemp.length === 0) { alert('Primero agregue el punto de calibración.'); return; }
    const idx = puntosModalTemp.length - 1;
    const punto = puntosModalTemp[idx].trim();
    const base = punto.replace(/\s*[±+−].*$/u, '').trim();
    puntosModalTemp[idx] = `${base} ± ${tolerancia} ${unidadTolerancia}`;
    document.getElementById('modal-iso-tolerancia').value = '';
    renderModalChips();
}

function eliminarPuntoChip(index) { puntosModalTemp.splice(index, 1); renderModalChips(); }
function renderModalChips() {
    const container = document.getElementById('modal-chips-container'); container.innerHTML = '';
    if(puntosModalTemp.length === 0) { container.innerHTML = '<span style="font-size:11px; color:#94a3b8;">Sin puntos agregados.</span>'; return; }
    puntosModalTemp.forEach((p, idx) => { container.innerHTML += `<div class="chip"><span>${p}</span><span class="chip-remove" onclick="eliminarPuntoChip(${idx})">✕</span></div>`; });
}
function cerrarModalPuntos(guardar) { if(guardar) renderPreviewChips(); document.getElementById('modalPuntos').classList.remove('active'); }
function renderPreviewChips() {
    const container = document.getElementById('puntos-preview-chips');
    container.innerHTML = '';
    puntosModalTemp.forEach(p => { container.innerHTML += `<div class="chip"><span>${p}</span></div>`; });
}

// ===== ACTIVIDADES =====

// Función auxiliar para saber en qué Dimensión o Equipo estamos trabajando
function obtenerClaveActividad() {
    const dimEl = document.getElementById('in-dim') || document.getElementById('in-dimension');
    const eqEl = document.getElementById('in-equipo');
    const dim = dimEl && dimEl.value ? dimEl.value.trim() : '';
    const eq = eqEl && eqEl.value ? eqEl.value.trim() : '';
    return dim || eq || 'General';
}

function abrirModalActividades() {
    const preview = document.getElementById('actividades-preview');
    const items = preview.querySelectorAll('.actividad-item');
    actividadesTemp = [];
    
    // 1. Cargar las que ya estaban marcadas en el formulario actual
    const marcadas = {};
    items.forEach(el => {
        const checkbox = el.querySelector('input[type="checkbox"]');
        const text = el.querySelector('span') ? el.querySelector('span').textContent.trim() : '';
        if (text) {
            marcadas[text] = checkbox ? checkbox.checked : false;
        }
    });

    // 2. Traer del catálogo guardado (LocalStorage) para la dimensión/equipo actual
    const clave = obtenerClaveActividad();
    if (!catalogoActividades[clave]) {
        catalogoActividades[clave] = [];
    }

    // Unir las guardadas con las marcadas
    const todasLasActividades = [...new Set([...catalogoActividades[clave], ...Object.keys(marcadas)])];
    
    todasLasActividades.forEach(texto => {
        actividadesTemp.push({
            texto: texto,
            checked: marcadas[texto] !== undefined ? marcadas[texto] : false
        });
    });

    renderActividadesModal();
    document.getElementById('modalActividades').classList.add('active');
}

function renderActividadesModal() {
    const container = document.getElementById('actividades-lista');
    container.innerHTML = '';
    actividadesTemp.forEach((act, idx) => {
        const div = document.createElement('div');
        div.className = 'actividad-item';
        div.style.cssText = 'display:flex; align-items:center; gap:8px; margin-bottom:6px;';
        div.innerHTML = `
            <input type="checkbox" ${act.checked ? 'checked' : ''} onchange="actividadesTemp[${idx}].checked = this.checked">
            <input type="text" value="${act.texto}" onchange="actividadesTemp[${idx}].texto = this.value" style="flex:1; padding:4px 8px; border:2px solid #000; border-radius:0; font-size:12px;">
            <button type="button" class="btn btn-danger" onclick="eliminarActividad(${idx})" title="Eliminar de la lista y del catálogo">✕</button>
        `;
        container.appendChild(div);
    });
    if (actividadesTemp.length === 0) { 
        container.innerHTML = '<p style="font-size:11px; color:#94a3b8;">No hay actividades guardadas para esta dimensión.</p>'; 
    }
}

function agregarActividad() {
    const input = document.getElementById('nueva-actividad-input');
    const texto = input.value.trim();
    if (!texto) return;

    // 1. Agregar a la vista temporal (marcada por defecto al crearla)
    actividadesTemp.push({ texto: texto, checked: true });

    // 2. Guardar en el catálogo permanente de la dimensión actual
    const clave = obtenerClaveActividad();
    if (!catalogoActividades[clave]) {
        catalogoActividades[clave] = [];
    }
    if (!catalogoActividades[clave].includes(texto)) {
        catalogoActividades[clave].push(texto);
        guardarEstadoLocal(); // <-- Se guarda en la memoria de la laptop
    }

    input.value = '';
    renderActividadesModal();
}

function eliminarActividad(idx) {
    const act = actividadesTemp[idx];
    if (!act) return;

    if (confirm(`¿Deseas eliminar "${act.texto}" permanentemente del catálogo?`)) {
        // 1. Eliminar del catálogo permanente
        const clave = obtenerClaveActividad();
        if (catalogoActividades[clave]) {
            catalogoActividades[clave] = catalogoActividades[clave].filter(t => t !== act.texto);
            guardarEstadoLocal(); // <-- Guarda el cambio en la memoria
        }

        // 2. Eliminar de la vista actual
        actividadesTemp.splice(idx, 1);
        renderActividadesModal();
    }
}

function cerrarModalActividades(guardar) { 
    if (guardar) renderActividadesPreview(); 
    document.getElementById('modalActividades').classList.remove('active'); 
}

function renderActividadesPreview() {
    const container = document.getElementById('actividades-preview');
    container.innerHTML = '';
    const marcadas = actividadesTemp.filter(act => act.checked);
    if (marcadas.length === 0) { 
        container.innerHTML = '<span style="color:#94a3b8;">Sin actividades.</span>'; 
        return; 
    }
    marcadas.forEach(act => {
        const div = document.createElement('div');
        div.className = 'actividad-item';
        div.style.cssText = 'display:flex; align-items:center; gap:6px; margin-bottom:2px;';
        div.innerHTML = `<input type="checkbox" checked disabled style="width:14px; height:14px;"><span style="font-size:11px;">${act.texto}</span>`;
        container.appendChild(div);
    });
}
// ===== FUNCIONES DE CATÁLOGOS =====
function actualizarDesplegablesDependientes() {
    const mag = document.getElementById('item-magnitud').value;
    const equipoSelect = document.getElementById('item-equipo'), procSelect = document.getElementById('item-proc');
    equipoSelect.innerHTML = '<option value="">Primero seleccione magnitud</option>';
    procSelect.innerHTML = '<option value="">Primero seleccione magnitud</option>';
    equipoSelect.disabled = true;
    procSelect.disabled = false;

    if (mag && catalogData[mag]) {
        equipoSelect.disabled = false;
        (catalogData[mag] || []).forEach(eq => { const opt = document.createElement('option'); opt.value = eq; opt.textContent = eq; equipoSelect.appendChild(opt); });
        const tipo = document.getElementById('tipo-servicio-select').value;
        if (tipo !== 'mantenimiento') {
            procSelect.disabled = false;
            (proceduresData[mag] || []).forEach(p => { const opt = document.createElement('option'); opt.value = `${p.code}: ${p.desc}`; opt.textContent = `${p.code}: ${p.desc}`; procSelect.appendChild(opt); });
        } else {
            procSelect.disabled = true;
            procSelect.innerHTML = '<option value="PRO-OPE-007: Procedimiento general de mantenimiento, fabricación y venta de equipos">PRO-OPE-007: Procedimiento general de mantenimiento, fabricación y venta de equipos</option>';
            procSelect.value = 'PRO-OPE-007: Procedimiento general de mantenimiento, fabricación y venta de equipos';
        }
    }
    document.getElementById('item-marca-select').innerHTML = '';
    ['item-modelo','item-serie','item-codigo'].forEach(id => document.getElementById(id).value = 'No Indica');
    puntosModalTemp = [];
    renderPreviewChips();
    renderAlcanceFields();
}

function actualizarMarcasPorEquipo() {
    const equipo = document.getElementById('item-equipo').value;
    const mag = document.getElementById('item-magnitud').value;
    const brandSelect = document.getElementById('item-marca-select');
    brandSelect.innerHTML = '';
    let listaMarcas = (equipo && marcasPorEquipo[equipo]) ? marcasPorEquipo[equipo] : ((mag && brandCatalog[mag]) ? brandCatalog[mag] : ["TESTO", "OHAUS", "MITUTOYO", "WIKA", "BRAND", "CHATILLON", "HANNA INSTRUMENTS"]);
    listaMarcas.forEach(m => { const opt = document.createElement('option'); opt.value = m; opt.textContent = m; brandSelect.appendChild(opt); });
    ["No Indica", "S/I"].forEach(opc => { if (!listaMarcas.includes(opc)) { const opt = document.createElement('option'); opt.value = opc; opt.textContent = opc; brandSelect.appendChild(opt); } });
    renderAlcanceFields();
    autoSeleccionarProcedimiento(equipo);
    if (esMaterialVidrioOPlastico(equipo)) { puntosModalTemp = ["20%, 60% Y 100%"]; renderPreviewChips(); }
guardarEstadoLocal();

}

function autoSeleccionarProcedimiento(equipo) {
    const tipo = document.getElementById('tipo-servicio-select').value;
    if (tipo === 'mantenimiento') return;
    const codigo = procedimientoPorEquipo[equipo]; if (!codigo) return;
    const procSelect = document.getElementById('item-proc');
    const opciones = Array.from(procSelect.options);
    const encontrado = opciones.find(opt => opt.value.startsWith(codigo + ':'));
    if (encontrado) procSelect.value = encontrado.value;
}

function renderAlcanceFields() {
    const equipo = document.getElementById('item-equipo').value, mag = document.getElementById('item-magnitud').value, container = document.getElementById('alcance-fields-container');
    if (!container) return; container.innerHTML = '';
    let campos = alcancePorEquipo[equipo] || [{ label: "Alcance", units: unitsCatalog[mag] || ["unid"], default: (unitsCatalog[mag] || ["unid"])[0] }];
    const unidadesGlobales = unitsCatalog[mag] || [];
    campos.forEach((campo, idx) => {
        const row = document.createElement('div'); row.style.cssText = "display:flex; gap:6px; align-items:center;";
        // Combinar unidades específicas del equipo + globales (sin duplicados)
        const unidadesCombinadas = [...new Set([...campo.units, ...unidadesGlobales])];
        const defaultUnit = campo.default || (unidadesCombinadas.length > 0 ? unidadesCombinadas[0] : '');
        row.innerHTML = `
            <span style="font-size:10px; color:#64748b; width:100px; flex-shrink:0;">${campo.label}</span>
            <input type="text" id="alcance-val-${idx}" placeholder="Ej: 10 a 100" style="flex:1; padding:7px 9px; border:1px solid var(--border-color); border-radius:6px; font-size:12px;">
            <select id="alcance-unit-${idx}" style="width:85px; padding:7px 4px; border:1px solid var(--border-color); border-radius:6px; font-size:12px;">
                ${unidadesCombinadas.map(u => `<option value="${u}" ${u === defaultUnit ? 'selected' : ''}>${u}</option>`).join('')}
            </select>
        `;
        container.appendChild(row);
    });
}
function agregarUnidadPunto() {
    const mag = document.getElementById('item-magnitud').value;
    if (!mag) { alert("Seleccione una magnitud primero."); return; }
    const nueva = prompt("Ingrese la nueva unidad (ej: ppm, %, °C):");
    if (!nueva) return;
    if (!unitsCatalog[mag]) unitsCatalog[mag] = [];
    if (unitsCatalog[mag].includes(nueva)) { alert("Ya existe."); return; }
    unitsCatalog[mag].push(nueva);
    unitsCatalog[mag].sort();
    // Reconstruir el select del modal de puntos si está abierto
    const sel = document.getElementById('modal-punto-unidad');
    if (sel) {
        sel.innerHTML = '';
        unitsCatalog[mag].forEach(u => {
            const opt = document.createElement('option');
            opt.value = u;
            opt.textContent = u;
            sel.appendChild(opt);
        });
    }
    guardarEstadoLocal();
}

function eliminarUnidadPunto() {
    const mag = document.getElementById('item-magnitud').value;
    if (!mag) return;
    const sel = document.getElementById('modal-punto-unidad');
    if (!sel) return;
    const seleccionada = sel.value;
    if (!seleccionada) { alert("Seleccione una unidad para eliminar."); return; }
    if (!confirm(`¿Eliminar unidad "${seleccionada}"?`)) return;
    unitsCatalog[mag] = (unitsCatalog[mag] || []).filter(u => u !== seleccionada);
    sel.innerHTML = '';
    unitsCatalog[mag].forEach(u => {
        const opt = document.createElement('option');
        opt.value = u;
        opt.textContent = u;
        sel.appendChild(opt);
    });
    guardarEstadoLocal();
}
function obtenerAlcanceEstructurado() {
    const container = document.getElementById('alcance-fields-container');
    if (!container) return [];
    const inputs = container.querySelectorAll('input[id^="alcance-val-"]');
    const datos = [];
    inputs.forEach(inp => {
        const idx = inp.id.replace('alcance-val-', '');
        const unitSelect = document.getElementById(`alcance-unit-${idx}`);
        datos.push({ valor: inp.value.trim(), unidad: unitSelect ? unitSelect.value : '' });
    });
    return datos;
}

function cargarAlcanceEstructurado(datos) {
    datos.forEach((d, idx) => {
        const valInput = document.getElementById(`alcance-val-${idx}`);
        const unitSelect = document.getElementById(`alcance-unit-${idx}`);
        if (valInput) valInput.value = d.valor || '';
        if (unitSelect && d.unidad !== undefined) {
            const existe = Array.from(unitSelect.options).some(o => o.value === d.unidad);
            if (!existe) {
                const opt = document.createElement('option');
                opt.value = d.unidad;
                opt.textContent = d.unidad || '(sin unidad)';
                unitSelect.appendChild(opt);
            }
            unitSelect.value = d.unidad;
        }
    });
}
function obtenerAlcanceTexto() {
    const container = document.getElementById('alcance-fields-container'); if (!container) return "No Indica";
    const inputs = container.querySelectorAll('input[id^="alcance-val-"]'), partes = [];
    inputs.forEach(inp => {
        const idx = inp.id.replace('alcance-val-', ''), val = inp.value.trim(), unitSelect = document.getElementById(`alcance-unit-${idx}`), unit = unitSelect ? unitSelect.value : '';
        if (val) partes.push(unit ? `${val} ${unit}` : val);
    });
    return partes.length > 0 ? partes.join(' , ') : 'No Indica';
}

// Agregar unidad en Alcance (global para la magnitud)
function agregarUnidadAlcance() {
    const mag = document.getElementById('item-magnitud').value;
    if (!mag) { alert("Seleccione una magnitud primero."); return; }
    const nueva = prompt("Ingrese la nueva unidad (ej: ppm, %, °C):");
    if (!nueva) return;
    if (!unitsCatalog[mag]) unitsCatalog[mag] = [];
    if (unitsCatalog[mag].includes(nueva)) { alert("Ya existe."); return; }
    unitsCatalog[mag].push(nueva);
    unitsCatalog[mag].sort();
    renderAlcanceFields(); // Refresca los selects de alcance con la nueva unidad
    guardarEstadoLocal();
}

// Eliminar unidad en Alcance
function eliminarUnidadAlcance() {
    const mag = document.getElementById('item-magnitud').value;
    if (!mag) return;
    // No podemos saber qué unidad está seleccionada porque hay múltiples selects.
    // Preguntamos cuál eliminar mediante prompt.
    const unidadAEliminar = prompt("Ingrese el nombre exacto de la unidad que desea eliminar (ej: 'ppm'):");
    if (!unidadAEliminar) return;
    if (!unitsCatalog[mag] || !unitsCatalog[mag].includes(unidadAEliminar)) {
        alert(`La unidad "${unidadAEliminar}" no existe en el catálogo de esta magnitud.`);
        return;
    }
    if (!confirm(`¿Eliminar unidad "${unidadAEliminar}" de la magnitud "${mag}"?`)) return;
    unitsCatalog[mag] = unitsCatalog[mag].filter(u => u !== unidadAEliminar);
    renderAlcanceFields();
    guardarEstadoLocal();
}
function cargarAlcanceEnCampos(alcanceTexto) {
    if (!alcanceTexto || alcanceTexto === 'No Indica') return;
    const partes = String(alcanceTexto).split(/\s*;\s*/).map(p => p.trim()).filter(Boolean);
    partes.forEach((parte, idx) => {
        const valInput = document.getElementById(`alcance-val-${idx}`);
        const unitSelect = document.getElementById(`alcance-unit-${idx}`);
        if (!valInput) return;
        let texto = parte.replace(/^alcance\s*:\s*/i, '').trim();
        let unidad = '';
        let valor = texto;
        if (unitSelect) {
            // Buscar, entre las opciones REALES del select (incluye las personalizadas),
            const opciones = Array.from(unitSelect.options).map(o => o.value).filter(Boolean);
            opciones.sort((a, b) => b.length - a.length); // más larga primero, evita coincidencias parciales
            const encontrada = opciones.find(op => texto.toUpperCase().endsWith(op.toUpperCase()));
            if (encontrada) {
                unidad = encontrada;
                valor = texto.slice(0, texto.length - encontrada.length).trim();
            }
        }
        valor = valor.replace(/\s+/g, ' ').trim();
        valInput.value = valor;
        if (unitSelect && unidad) {
            const opciones = Array.from(unitSelect.options);
            const op = opciones.find(o => o.value.toUpperCase() === unidad.toUpperCase());
            if (op) unitSelect.value = op.value;
        }
    });
}


// ===== AGREGAR / ELIMINAR (Equipo, Marca, Procedimiento, Precio, Asesor) =====
function agregarEquipo() {
    const mag = document.getElementById('item-magnitud').value;
    if(!mag) { alert("Seleccione una Magnitud / Área primero."); return; }
    const nuevoEquipo = prompt("Ingrese el nombre del nuevo equipo/instrumento:");
    if (!nuevoEquipo || !nuevoEquipo.trim()) return;
    const nombre = nuevoEquipo.trim();
    if (!catalogData[mag]) catalogData[mag] = [];
    if (catalogData[mag].includes(nombre)) { alert("Este equipo ya existe en esta magnitud."); return; }
    catalogData[mag].push(nombre);
    const select = document.getElementById('item-equipo');
    const opt = document.createElement('option');
    opt.value = nombre;
    opt.textContent = nombre;
    select.appendChild(opt);
    select.value = nombre;
    actualizarMarcasPorEquipo();
guardarEstadoLocal();
   
}

function eliminarEquipoSeleccionado() {
    const select = document.getElementById('item-equipo');
    const valor = select.value;
    if (!valor || valor === "") { alert('No hay equipo seleccionado para eliminar.'); return; }
    const mag = document.getElementById('item-magnitud').value;
    if (!mag) { alert('Seleccione una magnitud primero.'); return; }
    if (!confirm(`¿Eliminar el equipo "${valor}" de la magnitud "${mag}"?`)) return;
    if (catalogData[mag]) { catalogData[mag] = catalogData[mag].filter(eq => eq !== valor); }
    const opcionAEliminar = Array.from(select.options).find(opt => opt.value === valor);
    if (opcionAEliminar) select.removeChild(opcionAEliminar);
    select.value = '';
    actualizarMarcasPorEquipo();
 guardarEstadoLocal();
}

function agregarMarcaEspecial() {
    const mag = document.getElementById('item-magnitud').value, nuevaMarca = prompt("Ingrese la nueva marca:");
    if (!nuevaMarca || !nuevaMarca.trim()) return;
    const brandSelect = document.getElementById('item-marca-select'), optVal = nuevaMarca.trim().toUpperCase(), opt = document.createElement('option');
    opt.value = optVal; opt.textContent = optVal; brandSelect.appendChild(opt); brandSelect.value = optVal;
    if (mag) { if (!brandCatalog[mag]) brandCatalog[mag] = []; brandCatalog[mag].push(optVal); }
 guardarEstadoLocal(); 
}

function eliminarMarcaSeleccionada() {
    const select = document.getElementById('item-marca-select'), valor = select.value;
    if (!valor || valor === 'No Indica' || valor === 'S/I') { alert('No se puede eliminar esta opción.'); return; }
    if (!confirm(`¿Eliminar marca "${valor}"?`)) return;
    const equipo = document.getElementById('item-equipo').value, mag = document.getElementById('item-magnitud').value;
    if (equipo && marcasPorEquipo[equipo]) marcasPorEquipo[equipo] = marcasPorEquipo[equipo].filter(m => m !== valor);
    if (mag && brandCatalog[mag]) brandCatalog[mag] = brandCatalog[mag].filter(m => m !== valor);
    actualizarMarcasPorEquipo(); select.value = 'No Indica';
 guardarEstadoLocal();  
}

function agregarProcedimiento() {
    const mag = document.getElementById('item-magnitud').value; if(!mag) { alert("Seleccione una Magnitud / Área primero."); return; }
    const tipo = document.getElementById('tipo-servicio-select').value;
    if (tipo === 'mantenimiento') { alert('En Mantenimiento el procedimiento es fijo.'); return; }
    const codigo = prompt("Ingrese código del procedimiento:"); if(!codigo) return;
    const descripcion = prompt("Ingrese descripción completa:"); if(!descripcion) return;
    if(!proceduresData[mag]) proceduresData[mag] = [];
    proceduresData[mag].push({ code: codigo, desc: descripcion });
    const procSelect = document.getElementById('item-proc');
    const opt = document.createElement('option');
    opt.value = `${codigo}: ${descripcion}`;
    opt.textContent = `${codigo}: ${descripcion}`;
    procSelect.appendChild(opt);
    procSelect.value = `${codigo}: ${descripcion}`;
   guardarEstadoLocal();
}    
function eliminarProcedimientoSeleccionado() {
    const procSelect = document.getElementById('item-proc'), valor = procSelect.value.trim(); if (!valor) return;
    const tipo = document.getElementById('tipo-servicio-select').value;
    if (tipo === 'mantenimiento') { alert('No se puede eliminar el procedimiento fijo de Mantenimiento.'); return; }
    if (!confirm(`¿Eliminar procedimiento?\n\n${valor}`)) return;
    const mag = document.getElementById('item-magnitud').value, codigo = valor.split(':')[0].trim();
    if (mag && proceduresData[mag]) proceduresData[mag] = proceduresData[mag].filter(p => p.code !== codigo);
    const opcionAEliminar = Array.from(procSelect.options).find(opt => opt.value === valor);
    if (opcionAEliminar) procSelect.removeChild(opcionAEliminar);
    procSelect.value = '';
 guardarEstadoLocal();
}

function agregarPrecio() {
    const nuevoPrecio = prompt("Ingrese el nuevo valor unitario (en S/):");
    if (nuevoPrecio === null) return;
    const num = parseFloat(nuevoPrecio.trim());
    if (isNaN(num) || num < 0) { alert('Por favor, ingrese un número válido (mayor o igual a 0).'); return; }
    const precioSelect = document.getElementById('item-precio');
    const valorStr = num % 1 === 0 ? num.toString() : num.toFixed(2);
    const opciones = Array.from(precioSelect.options);
    if (opciones.some(o => parseFloat(o.value) === num)) { alert('Este precio ya existe en la lista.'); return; }
    const opt = document.createElement('option');
    opt.value = valorStr;
    opt.textContent = valorStr;
    precioSelect.appendChild(opt);
    precioSelect.value = valorStr;
    ordenarSelectPrecios();
    guardarEstadoLocal();
}
function ordenarSelectPrecios() {
    const select = document.getElementById('item-precio');
    const valorActual = select.value;
    const opciones = Array.from(select.options);
    opciones.sort((a, b) => parseFloat(a.value) - parseFloat(b.value));
    select.innerHTML = '';
    opciones.forEach(o => select.appendChild(o));
    select.value = valorActual;
}
function limpiarPreciosDuplicados() {
    const select = document.getElementById('item-precio');
    const valoresUnicos = [...new Set(Array.from(select.options).map(o => parseFloat(o.value)))];
    valoresUnicos.sort((a, b) => a - b);
    select.innerHTML = '';
    valoresUnicos.forEach(num => {
        const v = num % 1 === 0 ? num.toString() : num.toFixed(2);
        const opt = document.createElement('option');
        opt.value = v;
        opt.textContent = v;
        select.appendChild(opt);
    });
    guardarEstadoLocal();
    alert('✅ Precios limpiados y ordenados: ' + valoresUnicos.length + ' precios únicos.');
}
function eliminarPrecioSeleccionado() {
    const select = document.getElementById('item-precio');
    const valor = select.value;
    if (!valor) { alert('No hay precio seleccionado.'); return; }
    if (select.options.length <= 1) { alert('Debe quedar al menos una opción.'); return; }
    if (!confirm(`¿Eliminar el precio S/ ${valor}?`)) return;
    const opcion = Array.from(select.options).find(o => o.value === valor);
    if (opcion) { select.removeChild(opcion); select.selectedIndex = 0; }
guardarEstadoLocal();
}

function agregarAsesor() {
    const nuevoAsesor = prompt("Nombre completo del nuevo Asesor Comercial:"); if(!nuevoAsesor || !nuevoAsesor.trim()) return;
    const selectAsesor = document.getElementById('in-asesor'), option = document.createElement('option');
    option.value = nuevoAsesor.trim(); option.textContent = nuevoAsesor.trim(); selectAsesor.appendChild(option); selectAsesor.value = nuevoAsesor.trim(); updateDoc();
   guardarEstadoLocal();
}

function eliminarAsesorSeleccionado() {
    const select = document.getElementById('in-asesor'); if (select.options.length <= 1) { alert('Debe quedar al menos un Asesor.'); return; }
    const valor = select.value; if (!valor || !confirm(`¿Eliminar asesor "${valor}"?`)) return;
    const opt = Array.from(select.options).find(o => o.value === valor); if (opt) select.remove(opt.index); updateDoc();
guardarEstadoLocal();
}

function procesarProcedimientoInput() {}

// ===== FUNCIONES PRINCIPALES DEL COTIZADOR =====
function addItem() {
    const equipoBase = document.getElementById('item-equipo').value;
    const tipoServicio = document.getElementById('tipo-servicio-select').value;
    let procedimiento = document.getElementById('item-proc').value;
    if (!equipoBase) { alert("Seleccione un equipo."); return; }
    if (!procedimiento) { alert("El procedimiento es obligatorio."); return; }
    
    let puntosTexto = '';
    if (tipoServicio === 'mantenimiento') {
        puntosTexto = document.getElementById('puntos-texto').value.trim() || 'No especificado';
    } else {
        puntosTexto = puntosModalTemp.length > 0 ? puntosModalTemp.join(', ') : '10%, 50% Y 100%';
    }
       const alcanceExt = obtenerAlcanceTexto();
    const alcanceDatos = obtenerAlcanceEstructurado();
    let servicioTitulo = '';
    if (tipoServicio === 'calibracion') {
        servicioTitulo = esMaterialVidrioOPlastico(equipoBase) ? "CALIBRACIÓN DE MATERIAL VOLUMÉTRICO DE VIDRIO Y PLÁSTICO" : `CALIBRACIÓN DE ${equipoBase.toUpperCase()}`;
    } else if (tipoServicio === 'verificacion') {
        servicioTitulo = `VERIFICACIÓN DE ${equipoBase.toUpperCase()}`;
    } else if (tipoServicio === 'mantenimiento') {
        servicioTitulo = `MANTENIMIENTO DE ${equipoBase.toUpperCase()}`;
    } else if (tipoServicio === 'ventacalibracion') {
        servicioTitulo = esMaterialVidrioOPlastico(equipoBase) ? "VENTA Y CALIBRACIÓN DE MATERIAL VOLUMÉTRICO DE VIDRIO Y PLÁSTICO" : `VENTA Y CALIBRACIÓN DE ${equipoBase.toUpperCase()}`;
    }
      const notaInput = document.getElementById('item-nota');
    const notaTexto = notaInput ? notaInput.value.trim() : '';
    let descripcionDetalle = '';
    if (tipoServicio === 'mantenimiento') {
       const actividadesText = actividadesTemp.filter(a => a.checked).map(a => a.texto).join('; ');
        descripcionDetalle = `Alcance: ${alcanceExt && alcanceExt !== "No Indica" ? alcanceExt : 'No Indica'}. Actividades: ${actividadesText || 'No especificadas'}`;
    } else {
        descripcionDetalle = esMaterialVidrioOPlastico(equipoBase) ? (alcanceExt && alcanceExt !== "No Indica" ? `${equipoBase} de ${alcanceExt}` : equipoBase) : `Alcance: ${alcanceExt && alcanceExt !== "No Indica" ? alcanceExt : 'No Indica'}`;
    }
    if (notaTexto) {
        descripcionDetalle += `. Nota: ${notaTexto}`;
    }
    const itemConstruido = {
        equipo: equipoBase, 
        servicioTitulo: servicioTitulo, 
        descripcionDetalle: descripcionDetalle, 
        alcance: alcanceExt,
        alcanceDatos: alcanceDatos,
        marca: document.getElementById('item-marca-select').value || "No Indica", 
        modelo: document.getElementById('item-modelo').value || "No Indica",
        serie: document.getElementById('item-serie').value || "No Indica", 
        codigo: document.getElementById('item-codigo').value || "No Indica",
        procedimiento: procedimiento, 
        puntos: puntosTexto, 
        lugar: document.getElementById('item-lugar').value,
        tipo: document.getElementById('item-tipo').value, 
        valorUnitario: parseFloat(document.getElementById('item-precio').value) || 0,
        cantidad: parseInt(document.getElementById('item-cant').value) || 1, 
        descuentoMonto: parseFloat(document.getElementById('item-dscto').value) || 0,
            tipoServicio: tipoServicio,
        actividades: JSON.parse(JSON.stringify(actividadesTemp)),
        nota: notaTexto
    };
    if (editingIndex >= 0 && itemsData[editingIndex]) {
        itemsData[editingIndex] = itemConstruido; editingIndex = -1;
        document.getElementById('editing-banner').style.display = 'none';
        const btnAdd = document.getElementById('btn-add-item'); btnAdd.innerText = '+ Añadir Instrumento al Detalle'; btnAdd.classList.remove('btn-amber'); btnAdd.classList.add('btn-success');
    } else { itemsData.push(itemConstruido); }

    puntosModalTemp = []; 
    renderPreviewChips(); 
    renderAlcanceFields(); 
    renderTables();
    actividadesTemp = [];
    renderActividadesPreview();
    document.getElementById('puntos-texto').value = '';
    if (notaInput) notaInput.value = '';
  guardarEstadoLocal();
}
function removeItem(index) { itemsData.splice(index, 1); if (editingIndex === index) cancelarEdicionItem(); else if (editingIndex > index) editingIndex--; renderTables(); guardarEstadoLocal(); }
function editarItem(index) {
    const item = itemsData[index]; 
    if (!item) return;

    const mag = buscarMagnitudPorEquipo(item.equipo);
    document.getElementById('tipo-servicio-select').value = item.tipoServicio || 'calibracion';
    cambiarTipoServicio();

    if (mag) {
        document.getElementById('item-magnitud').value = mag;
        actualizarDesplegablesDependientes();
    }

    // Esperamos a que los desplegables se generen para recién inyectar equipo, marcas y alcance
    setTimeout(() => {
        setSelectValueOAgregar('item-equipo', item.equipo);
        actualizarMarcasPorEquipo();
        
        // 1. Cargamos la Marca guardada después de actualizar las marcas del equipo
        setSelectValueOAgregar('item-marca-select', item.marca);

        // 2. Cargamos el Procedimiento
        if (item.tipoServicio !== 'mantenimiento') { 
            setSelectValueOAgregar('item-proc', item.procedimiento); 
        }
  renderAlcanceFields();
        // 3. Cargamos el Alcance en sus campos correspondientes
               if (item.alcanceDatos && item.alcanceDatos.length > 0) {
            cargarAlcanceEstructurado(item.alcanceDatos);
        } else {
            cargarAlcanceEnCampos(item.alcance); // respaldo para ítems guardados antes de este cambio
        }
    }, 60);

    // Campos de texto simples
    document.getElementById('item-modelo').value = item.modelo || "No Indica";
    document.getElementById('item-serie').value = item.serie || "No Indica"; 
    document.getElementById('item-codigo').value = item.codigo || "No Indica";
    document.getElementById('item-lugar').value = item.lugar; 
    document.getElementById('item-tipo').value = item.tipo;
 const notaInputEdit = document.getElementById('item-nota');
    if (notaInputEdit) notaInputEdit.value = item.nota || '';
    setSelectValueOAgregar('item-precio', item.valorUnitario); 
    document.getElementById('item-cant').value = item.cantidad;
    setSelectValueOAgregar('item-dscto', item.descuentoMonto);

    // Actividades o Puntos
    if (item.tipoServicio === 'mantenimiento') {
        document.getElementById('puntos-texto').value = item.puntos || '';
        actividadesTemp = JSON.parse(JSON.stringify(item.actividades || []));
        renderActividadesPreview();
    } else {
        puntosModalTemp = (item.puntos && item.puntos !== 'De rutina / Estándar') ? item.puntos.split(/\s*;\s*|,\s*/).map(p => p.trim()).filter(Boolean) : [];
        renderPreviewChips();
    }

    editingIndex = index; 
    document.getElementById('editing-banner-text').innerText = `✏️ Editando: ${item.equipo}...`;
    document.getElementById('editing-banner').style.display = 'flex';
    
    const btnAdd = document.getElementById('btn-add-item'); 
    btnAdd.innerText = '✏️ Actualizar Instrumento'; 
    btnAdd.classList.remove('btn-success'); 
    btnAdd.classList.add('btn-amber');
    
    renderTables(); 
    btnAdd.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
// ===== RENDER TABLAS =====
function renderTables() {
    const uiBody = document.querySelector('#ui-items-table tbody');
    const printBody = document.getElementById('print-table-body');
    uiBody.innerHTML = '';
    printBody.innerHTML = '';
    let totalSubtotalNeto = 0;
    let totalMontoDescuento = 0;

    itemsData.forEach((row, index) => {
        const subtotalBruto = row.valorUnitario * row.cantidad;
        const montoDsctoTotal = (row.descuentoMonto || 0) * row.cantidad;
        const subtotalNeto = subtotalBruto - montoDsctoTotal;
        totalSubtotalNeto += subtotalNeto;
        totalMontoDescuento += montoDsctoTotal;

        const estaEditando = index === editingIndex;
        const equipoNombre = row.equipo || "Instrumento";
        const subtituloInfo = `${row.marca || 'No Indica'} · S: ${row.serie || 'No Indica'} · C: ${row.codigo || 'No Indica'}`;

        uiBody.innerHTML += `<tr style="cursor:pointer; ${estaEditando ? 'background:#fff7ed; box-shadow: inset 3px 0 0 #d97706;' : ''}" title="Clic para editar" onclick="editarItem(${index})"><td style="text-align:center; color:#94a3b8; font-size:11px;">${index + 1}</td><td class="equipo"><b>${equipoNombre}</b> ${estaEditando ? '<span style="color:#d97706; font-size:10px; font-weight:700;">(editando)</span>' : ''}<br><small>${subtituloInfo} · Dscto: S/ ${formatMoney(montoDsctoTotal)}</small></td><td class="tipo">${row.tipo}</td><td class="total">S/ ${formatMoney(subtotalNeto)}</td><td class="acciones"><button class="btn btn-danger" onclick="event.stopPropagation(); removeItem(${index})">X</button></td></tr>`;

        let tituloServicio = row.servicioTitulo || `CALIBRACIÓN DE ${equipoNombre.toUpperCase()}`;
        let descHTML = `<div class="desc-title">${tituloServicio}</div>`;
        descHTML += `<div class="desc-details">MARCA: ${row.marca || 'No indica'} , MODELO: ${row.modelo || 'No indica'}</div>`;
        descHTML += `<div class="desc-details">SERIE: ${row.serie || 'NO INDICA'}</div>`;
        descHTML += `<div class="desc-details">CÓDIGO: ${row.codigo || 'No indica'}</div>`;
        let ultimaLinea = "";
        if (row.tipoServicio === 'mantenimiento') {
        const actText = (row.actividades || []).filter(a => a.checked).map(a => a.texto).join('; ');
            ultimaLinea = `Alcance: ${row.alcance || 'No Indica'}. Actividades: ${actText || 'No especificadas'}`;
        } else {
            if (esMaterialVidrioOPlastico(equipoNombre)) {
                ultimaLinea = row.descripcionDetalle || (row.alcance && row.alcance !== "No Indica" ? `${equipoNombre} de ${row.alcance}` : equipoNombre);
            } else {
                if (row.descripcionDetalle && /^Alcance\s*:/i.test(row.descripcionDetalle)) ultimaLinea = row.descripcionDetalle;
                else ultimaLinea = `Alcance: ${(row.alcance && row.alcance !== "No Indica") ? row.alcance : (row.descripcionDetalle || "No Indica")}`;
            }
        }
        descHTML += `<div class="desc-details" style="margin-top: 2px;">${ultimaLinea}</div>`;
    printBody.innerHTML += `<tr style="${row.tipo==='ACREDITADO'?'background:#fef2f2;':''}"><td class="equipo">${index + 1}</td><td class="desc-cell">${descHTML}</td><td class="tipo">${row.procedimiento}</td><td class="total">${row.puntos || '10%, 50% Y 100%'}</td><td>${row.lugar || 'Laboratorio'}</td><td style="font-weight:bold;">${row.tipo}</td><td>S/ ${formatMoney(row.descuentoMonto || 0)}</td><td>S/ ${formatMoney(row.valorUnitario)}</td><td>${row.cantidad}</td><td class="total">S/ ${formatMoney(subtotalNeto)}</td></tr>`;
    });
    const checkboxViaticos = document.getElementById('check-viaticos');
    const montoViaticos = parseFloat(document.getElementById('viaticos-monto').value) || 0;
    const dsctoViaticos = parseFloat(document.getElementById('viaticos-dscto').value) || 0;
    const netoViaticos = montoViaticos - dsctoViaticos;
    const hayInSitu = itemsData.some(item => item.lugar === 'In situ');
    if (checkboxViaticos && checkboxViaticos.checked && hayInSitu && montoViaticos > 0) {
        const viaticosIndex = itemsData.length + 1;
         const descViaticos = document.getElementById('viaticos-desc').value || "Viáticos de personal metrólogo y transporte de equipos";
        const descHTML = `<div class="desc-details">${descViaticos.replace(/\n/g, '<br>')}</div>`;
        printBody.innerHTML += `<tr><td class="equipo">${viaticosIndex}</td><td class="desc-cell">${descHTML}</td><td class="tipo">No aplica</td><td class="total">No aplica</td><td>Campo (in situ)</td><td style="font-weight:bold;">NO APLICA</td><td>S/ ${formatMoney(dsctoViaticos)}</td><td>S/ ${formatMoney(montoViaticos)}</td><td>1</td><td class="total">S/ ${formatMoney(netoViaticos)}</td></tr>`;
        totalSubtotalNeto += netoViaticos;
        totalMontoDescuento += dsctoViaticos;
    }

    const igv = totalSubtotalNeto * 0.18;
    const final = totalSubtotalNeto + igv;

    document.getElementById('lbl-subtotal').innerText = "S/ " + formatMoney(totalSubtotalNeto);
    document.getElementById('lbl-igv').innerText = "S/ " + formatMoney(igv);
    document.getElementById('lbl-total').innerText = "S/ " + formatMoney(final);
    document.getElementById('t-descuento').innerText = "S/. " + formatMoney(totalMontoDescuento);
    document.getElementById('t-subtotal').innerText = formatMoney(totalSubtotalNeto);
    document.getElementById('t-igv').innerText = formatMoney(igv);
    document.getElementById('t-total').innerText = formatMoney(final);
    document.getElementById('out-monto-letras').innerText = "Son: " + numeroALetras(final);
}

function limpiarCliente() {
    if (!confirm("¿Estás seguro de limpiar todos los datos del cliente?")) return;
    
    document.getElementById('in-ruc').value = '';
    document.getElementById('in-cliente').value = '';
    document.getElementById('in-dir').value = '';
    document.getElementById('in-contacto').value = '';
    document.getElementById('in-tel').value = '';
    document.getElementById('in-correo').value = '';
    document.getElementById('in-fecha').value = '';
    document.getElementById('in-estado').value = '';
    document.getElementById('in-condicion').value = '';
    document.getElementById('in-tiempo-entrega').value = '5 días hábiles'; // 👈 agregado (o '' si prefieres vacío)
    
    updateDoc();
    guardarEstadoLocal();
    guardarTodosLosCampos();

    console.log("🧹 Datos del cliente limpiados");
}
function updateDoc() {
    document.getElementById('out-cot').innerText = "# " + document.getElementById('in-cot').value;
    document.getElementById('out-cliente').innerText = clienteOculto ? "NO INDICA" : document.getElementById('in-cliente').value;
    document.getElementById('out-ruc').innerText = clienteOculto ? "NO INDICA" : document.getElementById('in-ruc').value;
    document.getElementById('out-dir').innerText = clienteOculto ? "NO INDICA" : document.getElementById('in-dir').value;
    const contacto = clienteOculto ? "NO INDICA" : document.getElementById('in-contacto').value;
    document.getElementById('out-contacto').innerText = contacto; document.getElementById('out-contacto-greet').innerText = contacto;
    document.getElementById('out-tel').innerText = clienteOculto ? "NO INDICA" : document.getElementById('in-tel').value;
    document.getElementById('out-correo').innerText = clienteOculto ? "NO INDICA" : document.getElementById('in-correo').value;
    document.getElementById('out-asesor').innerText = document.getElementById('in-asesor').value;
    document.getElementById('out-tiempo-entrega').innerText = document.getElementById('in-tiempo-entrega').value || '5 días hábiles';
 document.getElementById('out-observaciones').innerText = document.getElementById('in-observaciones').value || 'Ninguna';  
document.getElementById('out-condicion-pago').innerText = document.getElementById('in-condicion-pago').value || '100% ADELANTADO';
    const fechaInput = document.getElementById('in-fecha').value;

    if(fechaInput) {
        const [year, month, day] = fechaInput.split('-'), meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        document.getElementById('out-fecha').innerText = `${parseInt(day)} de ${meses[parseInt(month) - 1]} de ${year}`;
    }
}
function toggleViaticos() {
    const checkbox = document.getElementById('check-viaticos');
    const montoInput = document.getElementById('viaticos-monto');
    const dsctoInput = document.getElementById('viaticos-dscto');
    if (!checkbox.checked) {
        montoInput.disabled = true; montoInput.style.opacity = '0.5';
        if (dsctoInput) { dsctoInput.disabled = true; dsctoInput.style.opacity = '0.5'; }
    } else {
        montoInput.disabled = false; montoInput.style.opacity = '1';
        if (dsctoInput) { dsctoInput.disabled = false; dsctoInput.style.opacity = '1'; }
    }
    renderTables();
guardarEstadoLocal();
}
