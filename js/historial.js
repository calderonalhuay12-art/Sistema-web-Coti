// ===== HISTORIAL, CLIENTES Y ESTADÍSTICAS =====
function guardarEnHistorial() {
    const nroCot = document.getElementById('in-cot').value;
    const cliente = document.getElementById('in-cliente').value;
    if (!nroCot) return;

    const nuevoRegistro = {
        id: (indiceEditandoHistorial !== null && historialCotizaciones[indiceEditandoHistorial] && nroCot === nroOriginalEditando)
            ? historialCotizaciones[indiceEditandoHistorial].id
            : (Date.now() + '-' + Math.random().toString(36).slice(2, 8)),
        nro: nroCot,
        cliente: cliente,
        ruc: document.getElementById('in-ruc').value,
        dir: document.getElementById('in-dir').value,
        contacto: document.getElementById('in-contacto').value,
        tel: document.getElementById('in-tel').value,
        correo: document.getElementById('in-correo').value,
        asesor: document.getElementById('in-asesor').value,
condicionPago: document.getElementById('in-condicion-pago').value,
        fecha: document.getElementById('in-fecha').value,
observaciones: document.getElementById('in-observaciones').value,
 viaticosChecked: document.getElementById('check-viaticos').checked,
    viaticosMonto: document.getElementById('viaticos-monto').value,
    viaticosDscto: document.getElementById('viaticos-dscto').value,
    viaticosDesc: document.getElementById('viaticos-desc').value,
servicioDetalle: document.getElementById('out-servicio-detalle').value,
        items: JSON.parse(JSON.stringify(itemsData))
    };

    if (indiceEditandoHistorial !== null && historialCotizaciones[indiceEditandoHistorial] && nroCot === nroOriginalEditando) {
        // Actualizar la que estábamos editando (mismo número, es una edición real)
        historialCotizaciones[indiceEditandoHistorial] = nuevoRegistro;
        indiceEditandoHistorial = null;
        nroOriginalEditando = null;
    } else {
        // Número distinto (o no había ninguna cargada): es una cotización nueva
        historialCotizaciones.push(nuevoRegistro);
        indiceEditandoHistorial = null;
        nroOriginalEditando = null;
    }

    actualizarSelectHistorial();
    refrescarVistasSecundarias();
    guardarEstadoLocal();
    alert(`Cotización N° ${nroCot} guardada en el historial.`);
}

function actualizarSelectHistorial() {
    const select = document.getElementById('select-historial'); select.innerHTML = '<option value="">Seleccione cotización guardada...</option>';
    historialCotizaciones.forEach((cot, idx) => { select.innerHTML += `<option value="${idx}" style="${cot.vendida ? 'background:rgba(0,255,0,0.15); font-weight:600;' : ''}">${cot.vendida ? '✅ ' : ''}Cot. #${cot.nro} - ${cot.cliente}</option>`; });
}
function actualizarCotizacion() {
    if (indiceEditandoHistorial === null) {
        alert("Primero carga una cotización del historial para actualizar.");
        return;
    }
    guardarEnHistorial(); // usa el índice y actualiza
}

function cargarDesdeHistorial() {
     const idx = document.getElementById('select-historial').value; if(idx === "") return alert("Seleccione una cotización del historial primero.");
indiceEditandoHistorial = parseInt(idx);
    const cot = historialCotizaciones[idx];
nroOriginalEditando = cot.nro;
    document.getElementById('in-cot').value = cot.nro; document.getElementById('in-cliente').value = cot.cliente; document.getElementById('in-ruc').value = cot.ruc; document.getElementById('in-dir').value = cot.dir; document.getElementById('in-contacto').value = cot.contacto; document.getElementById('in-tel').value = cot.tel; document.getElementById('in-correo').value = cot.correo; document.getElementById('in-asesor').value = cot.asesor; document.getElementById('in-fecha').value = cot.fecha;
document.getElementById('check-viaticos').checked = cot.viaticosChecked || false;
document.getElementById('viaticos-monto').value = cot.viaticosMonto || '';
document.getElementById('viaticos-dscto').value = cot.viaticosDscto || '0';
document.getElementById('viaticos-desc').value = cot.viaticosDesc || document.getElementById('viaticos-desc').value;
document.getElementById('out-servicio-detalle').value = cot.servicioDetalle || document.getElementById('out-servicio-detalle').options[0].value;
document.getElementById('in-condicion-pago').value = cot.condicionPago || '100% ADELANTADO';
document.getElementById('in-observaciones').value = cot.observaciones || '';
toggleViaticos();
    itemsData = JSON.parse(JSON.stringify(cot.items));
    itemsData.forEach(item => { if (!item.tipoServicio) item.tipoServicio = 'calibracion'; if (!item.actividades) item.actividades = []; });
    updateDoc(); renderTables();
guardarEstadoLocal();
}

function descargarDesdeHistorial() {
    const idx = document.getElementById('select-historial').value; if(idx === "") return alert("Seleccione una cotización del historial primero.");
    cargarDesdeHistorial();
    descargarPDF();
}

function eliminarDesdeHistorial() {
    const idx = document.getElementById('select-historial').value; if(idx === "") return alert("Seleccione una cotización a eliminar.");
    const cot = historialCotizaciones[idx];
    if (!confirm(`¿Eliminar del historial la Cotización #${cot.nro}?`)) return;
    historialCotizaciones.splice(idx, 1);
    actualizarSelectHistorial();
    refrescarVistasSecundarias();
    guardarEstadoLocal();
}
function iniciarNuevaCotizacion(preguntar = true) {
    if (preguntar && !confirm('¿Iniciar una nueva cotización? Se perderán los datos no guardados.')) return;

    // Limpiar cliente
    document.getElementById('in-ruc').value = '';
    document.getElementById('in-cliente').value = '';
    document.getElementById('in-dir').value = '';
    document.getElementById('in-contacto').value = '';
    document.getElementById('in-tel').value = '';
    document.getElementById('in-correo').value = '';
    document.getElementById('in-fecha').value = '';
    document.getElementById('in-estado').value = '';
    document.getElementById('in-condicion').value = '';
    document.getElementById('in-tiempo-entrega').value = '5 días hábiles';

    // Instrumentos
    itemsData = [];

    // Refrescar todo
    updateDoc();
    renderTables();
    guardarEstadoLocal();
    guardarTodosLosCampos();
}

function finalizarCotizacion() {
    if (itemsData.length === 0) { alert('Agrega al menos un instrumento antes de finalizar.'); return; }
    if (!confirm('¿Finalizar y guardar esta cotización en el historial?')) return;

    guardarEnHistorial();          // 👈 tu función existente — la reutilizamos
    siguienteNumeroCotizacion();   // avanza el correlativo para la próxima (ej: 050a → 050b)
    iniciarNuevaCotizacion(false); // limpia el formulario sin volver a preguntar
}
function calcularTotalesRegistroCotizacion(cotizacion) {
    const cot = cotizacion || {};
    return calcularTotalesCotizacion(cot.items, {
        incluidos: cot.viaticosChecked,
        monto: cot.viaticosMonto,
        descuento: cot.viaticosDscto,
    });
}

// Compatibilidad temporal con llamadas externas que aún usan el contrato anterior.
function calcularTotalCotizacion(items) {
    return calcularTotalesCotizacion(items).total;
}
function refrescarVistasSecundarias() {
    if (document.getElementById('view-historial')) renderHistorialTab();
    if (document.getElementById('view-clientes')) renderClientes();
    if (document.getElementById('view-estadisticas')) renderEstadisticas();
}

// ===== PESTAÑA CLIENTES =====
function renderClientes() {
    const tbody = document.querySelector('#tabla-clientes tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    const mapa = {};
    historialCotizaciones.forEach(cot => {
        const key = cot.ruc || cot.cliente || 'sin-dato';
        if (!mapa[key]) { mapa[key] = { cliente: cot.cliente || 'No indica', ruc: cot.ruc, contacto: cot.contacto, tel: cot.tel, cotizaciones: 0, montoTotal: 0, ultimaFecha: cot.fecha }; }
              mapa[key].cotizaciones++;
        const totales = calcularTotalesRegistroCotizacion(cot);
        mapa[key].montoTotal += totales.total;
        if ((cot.fecha || '') > (mapa[key].ultimaFecha || '')) mapa[key].ultimaFecha = cot.fecha;
    });
    const lista = Object.values(mapa);
    if (lista.length === 0) { tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; color:#94a3b8; padding:24px;">Aún no hay clientes. Guarda una cotización en el Historial para que aparezca aquí.</td></tr>'; return; }
    lista.sort((a, b) => b.montoTotal - a.montoTotal);
    lista.forEach(c => {
        tbody.innerHTML += `<tr><td><b>${c.cliente}</b></td><td>${c.ruc || 'No indica'}</td><td>${c.contacto || 'No indica'}</td><td>${c.tel || 'No indica'}</td><td style="text-align:center;">${c.cotizaciones}</td><td>S/ ${formatMoney(c.montoTotal)}</td><td>${c.ultimaFecha || '-'}</td></tr>`;
    });
}

// ===== PESTAÑA ESTADÍSTICAS =====
function poblarSelectClientesStat() {
    const sel = document.getElementById('stat-select-cliente');
    const clientesUnicos = [...new Set(historialCotizaciones.map(c => c.cliente))].filter(Boolean).sort();
    sel.innerHTML = '<option value="">-- Seleccione --</option>' + clientesUnicos.map(c => {
        const vendidas = historialCotizaciones.filter(cot => cot.cliente === c && cot.vendida).length;
        const etiqueta = vendidas > 0 ? ` ✅${vendidas}` : '';
        return `<option value="${c}">${c}${etiqueta}</option>`;
    }).join('');
}

function renderEstadisticasCliente() {
    const clienteSel = document.getElementById('stat-select-cliente').value;
    const cont = document.getElementById('stat-cliente-detalle');
    if (!clienteSel) { cont.innerHTML = ''; return; }
    const cotsCliente = historialCotizaciones.filter(c => c.cliente === clienteSel);

    if (cotsCliente.length > 1) {
              const opciones = cotsCliente.map((c, idx) => `<option value="${idx}">${c.vendida ? '✅ ' : ''}Cot. #${c.nro} - ${c.fecha || 'Sin fecha'}</option>`).join('');
        cont.innerHTML = `
            <div class="form-group" style="max-width:320px; margin-bottom:14px;">
                <label>Seleccione cotización</label>
                <select id="stat-select-cotizacion-cliente" onchange="renderDetalleCotizacionesCliente('${clienteSel.replace(/'/g, "\\'")}')">
                    <option value="todas">Todas (combinado)</option>
                    ${opciones}
                </select>
            </div>
            <div id="stat-cliente-detalle-inner"></div>
        `;
    } else {
        cont.innerHTML = `<div id="stat-cliente-detalle-inner"></div>`;
    }
    renderDetalleCotizacionesCliente(clienteSel);
}
function renderDetalleCotizacionesCliente(clienteSel) {
    const cotsCliente = historialCotizaciones.filter(c => c.cliente === clienteSel);
    const selectCot = document.getElementById('stat-select-cotizacion-cliente');
    const inner = document.getElementById('stat-cliente-detalle-inner');
    if (!inner) return;

    const cotsAMostrar = (selectCot && selectCot.value !== 'todas')
        ? [cotsCliente[parseInt(selectCot.value)]]
        : cotsCliente;

    let totalEquipos = 0, montoTotal = 0, viaticosTotal = 0;
    const porNombre = {}, porMagnitud = {};
    const detalleMagnitud = {};
    cotsAMostrar.forEach(cot => {
        const items = normalizarItemsCotizacion(cot.items);
        const totales = calcularTotalesRegistroCotizacion(cot);
        montoTotal += totales.total;
        viaticosTotal += totales.viaticosNetos;

        const gruposEquipo = {};
        items.forEach(it => {
            const cant = parseInt(it.cantidad) || 1;
            const clave = it.equipo + '||' + normalizarAlcance(it.alcance) + '||' + normalizarAlcance(it.puntos);
            gruposEquipo[clave] = Math.max(gruposEquipo[clave] || 0, cant);
        });
        Object.entries(gruposEquipo).forEach(([clave, cant]) => {
            const equipo = clave.split('||')[0];
            totalEquipos += cant;
            porNombre[equipo] = (porNombre[equipo] || 0) + cant;
            const mag = buscarMagnitudPorEquipo(equipo) || 'Otros / Importado';
            porMagnitud[mag] = (porMagnitud[mag] || 0) + cant;
            if (!detalleMagnitud[mag]) detalleMagnitud[mag] = {};
            detalleMagnitud[mag][equipo] = (detalleMagnitud[mag][equipo] || 0) + cant;
        });
    });

    const filaChip = (obj) => Object.entries(obj).sort((a, b) => b[1] - a[1]).map(([k, v]) => `<span style="display:inline-block; background:#f1f5f9; border-radius:6px; padding:4px 10px; margin:3px; font-size:11.5px;">${k}: <b>${v}</b></span>`).join('');
    const magnitudDesplegable = Object.entries(porMagnitud).sort((a, b) => b[1] - a[1]).map(([mag, count], idx) => {
        const detalleId = `detalle-mag-cliente-${idx}`;
        const equiposDetalle = Object.entries(detalleMagnitud[mag] || {}).sort((a, b) => b[1] - a[1])
            .map(([nombre, cant]) => `<div style="display:flex; justify-content:space-between; font-size:11px; color:#64748b; padding:3px 0;"><span>${nombre}</span><span><b>${cant}</b></span></div>`).join('');
        return `<div style="margin-bottom:8px;">
            <div style="cursor:pointer; font-size:12px; font-weight:600; color:#475569;" onclick="document.getElementById('${detalleId}').style.display = document.getElementById('${detalleId}').style.display === 'none' ? 'block' : 'none';">▸ ${mag}: <b>${count}</b></div>
            <div id="${detalleId}" style="display:none; margin-top:4px; padding:8px 12px; background:#fafafa; border-radius:6px;">${equiposDetalle}</div>
        </div>`;
    }).join('');
    inner.innerHTML = `
        <div class="stat-card-row"><div class="stat-card"><div class="stat-label">Cotizaciones</div><div class="stat-value">${cotsAMostrar.length}</div></div><div class="stat-card"><div class="stat-label">Equipos cotizados</div><div class="stat-value">${totalEquipos}</div></div><div class="stat-card"><div class="stat-label">Monto total</div><div class="stat-value">S/ ${formatMoney(montoTotal)}</div></div><div class="stat-card"><div class="stat-label">Viáticos</div><div class="stat-value">S/ ${formatMoney(viaticosTotal)}</div></div></div>
        <div class="card"><h3><span>🔧 Equipos por nombre</span></h3><div>${filaChip(porNombre) || '<p style="font-size:12px; color:#94a3b8;">Sin datos.</p>'}</div></div>
        <div class="card"><h3><span>📐 Equipos por Magnitud (clic para ver detalle)</span></h3><div>${magnitudDesplegable || '<p style="font-size:12px; color:#94a3b8;">Sin datos.</p>'}</div></div>
    `;
}
function cambiarVistaEstadistica(vista) {
    document.getElementById('stat-seccion-general').style.display = vista === 'general' ? 'block' : 'none';
    document.getElementById('stat-seccion-cliente').style.display = vista === 'cliente' ? 'block' : 'none';
    document.getElementById('btn-stat-general').style.background = vista === 'general' ? 'var(--green-brand)' : '';
    document.getElementById('btn-stat-general').style.color = vista === 'general' ? '#fff' : '';
    document.getElementById('btn-stat-cliente').style.background = vista === 'cliente' ? 'var(--green-brand)' : '';
    document.getElementById('btn-stat-cliente').style.color = vista === 'cliente' ? '#fff' : '';
    if (vista === 'cliente') poblarSelectClientesStat();
}
function normalizarAlcance(texto) {
    if (!texto) return '';
    let t = String(texto)
        .replace(/\+\/-/g, '±')
        .replace(/º/g, '°')
        .replace(/([±\-])\s+(\d)/g, '$1$2'); // pega el signo al número aunque haya espacio entre ellos
    const tokens = t.match(/[±\-]?\d+(?:\.\d+)?\s*°?\s*(?:C|F|K|HR|%|mm|cm|m³\/h|m|kg|g|mg|N|kN|bar|kPa|Pa|psi|L|mL|RPM|Hz|s|min|h)?/gi) || [];
    const limpios = tokens.map(tok => tok.replace(/\s+/g, '').toUpperCase()).filter(Boolean);
    const unicos = [...new Set(limpios)].sort(); // valores únicos, sin importar cuántas veces se repitan ni en qué orden aparezcan
    return unicos.join('|');
}
function renderEstadisticas() {
    const totalCotizaciones = historialCotizaciones.length;
    let totalEquipos = 0, montoTotal = 0, viaticosTotal = 0;
    const porMagnitud = {};
    const detalleMagnitud = {};
    historialCotizaciones.forEach(cot => {
        const items = normalizarItemsCotizacion(cot.items);
        const totales = calcularTotalesRegistroCotizacion(cot);
        montoTotal += totales.total;
        viaticosTotal += totales.viaticosNetos;

        const gruposEquipo = {};
        items.forEach(it => {
            const cant = parseInt(it.cantidad) || 1;
            const clave = it.equipo + '||' + normalizarAlcance(it.alcance) + '||' + normalizarAlcance(it.puntos);
            gruposEquipo[clave] = Math.max(gruposEquipo[clave] || 0, cant);
        });
        Object.entries(gruposEquipo).forEach(([clave, cant]) => {
            const equipo = clave.split('||')[0];
            totalEquipos += cant;
            const mag = buscarMagnitudPorEquipo(equipo) || 'Otros / Importado';
            porMagnitud[mag] = (porMagnitud[mag] || 0) + cant;
            if (!detalleMagnitud[mag]) detalleMagnitud[mag] = {};
            detalleMagnitud[mag][equipo] = (detalleMagnitud[mag][equipo] || 0) + cant;
        });
    });
    document.getElementById('stat-total-cotizaciones').innerText = totalCotizaciones;
    document.getElementById('stat-total-equipos').innerText = totalEquipos;
    document.getElementById('stat-monto-total').innerText = 'S/ ' + formatMoney(montoTotal);
    document.getElementById('stat-promedio').innerText = totalCotizaciones > 0 ? ('S/ ' + formatMoney(montoTotal / totalCotizaciones)) : 'S/ 0.00';
    document.getElementById('stat-viaticos-total').innerText = 'S/ ' + formatMoney(viaticosTotal);
    const totalVendidas = historialCotizaciones.filter(c => c.vendida).length;
    const elVendidas = document.getElementById('stat-total-vendidas');
    if (elVendidas) elVendidas.innerText = totalVendidas;
    const cont = document.getElementById('stat-magnitud-breakdown');
    const entries = Object.entries(porMagnitud).sort((a, b) => b[1] - a[1]);
    if (entries.length === 0) { cont.innerHTML = '<p style="font-size:12px; color:#94a3b8;">Aún no hay datos suficientes. Guarda cotizaciones en el Historial para ver estadísticas por magnitud.</p>'; return; }
    const max = entries[0][1];
    cont.innerHTML = entries.map(([mag, count], idx) => {
        const pct = Math.round((count / max) * 100);
        const detalleId = `detalle-mag-general-${idx}`;
        const equiposDetalle = Object.entries(detalleMagnitud[mag] || {}).sort((a, b) => b[1] - a[1])
            .map(([nombre, cant]) => `<div style="display:flex; justify-content:space-between; font-size:11px; color:#64748b; padding:3px 0;"><span>${nombre}</span><span><b>${cant}</b></span></div>`).join('');
        return `<div style="margin-bottom:12px;">
            <div style="display:flex; justify-content:space-between; font-size:11.5px; font-weight:600; color:#475569; margin-bottom:4px; cursor:pointer;" onclick="document.getElementById('${detalleId}').style.display = document.getElementById('${detalleId}').style.display === 'none' ? 'block' : 'none';">
                <span>▸ ${mag}</span><span>${count} equipo(s)</span>
            </div>
            <div style="background:#f1f5f9; border-radius:6px; height:10px; overflow:hidden;"><div style="background:var(--green-brand); height:100%; width:${pct}%;"></div></div>
            <div id="${detalleId}" style="display:none; margin-top:6px; padding:8px 12px; background:#fafafa; border-radius:6px;">${equiposDetalle}</div>
        </div>`;
    }).join('');
}
// ===== PESTAÑA HISTORIAL COMPLETO =====
function renderHistorialTab() {
    const tbody = document.querySelector('#tabla-historial-completo tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    if (historialCotizaciones.length === 0) { tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; color:#94a3b8; padding:24px;">No hay cotizaciones guardadas todavía.</td></tr>'; return; }
    historialCotizaciones.forEach((cot, idx) => {
      const totales = calcularTotalesRegistroCotizacion(cot);
const viaticoCot = totales.viaticosNetos;
const total = totales.total;
      const claseVendida = cot.vendida ? 'historial-ot-row-con-fecha' : '';
        tbody.innerHTML += `<tr class="${claseVendida}"><td><b>${cot.nro}</b></td><td>${cot.cliente}</td><td>${cot.ruc || 'No indica'}</td><td>${cot.fecha || '-'}</td><td style="text-align:center;">${(cot.items || []).length}</td><td>S/ ${formatMoney(viaticoCot)}</td><td>S/ ${formatMoney(total)}</td><td style="white-space:nowrap;"><button class="btn ${cot.vendida ? 'btn-success' : 'btn-secondary'} btn-sm" onclick="toggleVendidaHistorial(${idx})" title="${cot.vendida ? 'Marcada como vendida' : 'Marcar como vendida'}">${cot.vendida ? '✅' : '⬜'}</button><button class="btn btn-success btn-sm" onclick="verDesdeHistorialTab(${idx})">👁️ Ver</button><button class="btn btn-primary btn-sm" onclick="descargarDesdeHistorialTab(${idx})">📥 PDF</button><button class="btn btn-danger" onclick="eliminarDesdeHistorialTab(${idx})">🗑️</button></td></tr>`;
    });
}
function toggleVendidaHistorial(idx) {
    historialCotizaciones[idx].vendida = !historialCotizaciones[idx].vendida;
    guardarEstadoLocal();
    renderHistorialTab();
    renderEstadisticas();
    actualizarSelectHistorial();
}
function verDesdeHistorialTab(idx) { document.getElementById('select-historial').value = idx; cargarDesdeHistorial(); cambiarVista('view-cotizador', document.querySelector('.nav-item[data-view="view-cotizador"]')); }
function descargarDesdeHistorialTab(idx) { document.getElementById('select-historial').value = idx; descargarDesdeHistorial(); }
function eliminarDesdeHistorialTab(idx) {
    const cot = historialCotizaciones[idx];
    if (!confirm(`¿Eliminar del historial la Cotización #${cot.nro}?`)) return;
    historialCotizaciones.splice(idx, 1);
    actualizarSelectHistorial();
    renderHistorialTab();
    renderClientes();
    renderEstadisticas();
}
