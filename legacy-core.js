// ===== HISTORIAL DE COTIZACIONES =====
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
function calcularTotalCotizacion(items) {
    let subtotal = 0;
    (items || []).forEach(it => {
        const bruto = (it.valorUnitario || 0) * (it.cantidad || 1);
        const dscto = (it.descuentoMonto || 0) * (it.cantidad || 1);
        subtotal += (bruto - dscto);
    });
    return subtotal * 1.18;
}
// ===== NAVEGACIÓN =====
function cambiarVista(viewId, btnEl) {
    document.querySelectorAll('.page-view').forEach(v => v.classList.remove('active'));
    const vista = document.getElementById(viewId);
    if (vista) vista.classList.add('active');
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    if (btnEl) btnEl.classList.add('active');
    if (viewId === 'view-clientes') renderClientes();
    else if (viewId === 'view-estadisticas') renderEstadisticas();
    else if (viewId === 'view-historial') renderHistorialTab();
    else if (viewId === 'view-ot') { inicializarOT(); }
}

function toggleSidebar() {
    const sidebar = document.getElementById('app-sidebar');
    const contentArea = document.querySelector('.content-area');
    const btn = document.getElementById('sidebar-toggle-btn');
    sidebar.classList.toggle('collapsed');
    const colapsada = sidebar.classList.contains('collapsed');
    if (contentArea) contentArea.style.marginLeft = colapsada ? '68px' : '230px';
    btn.innerText = colapsada ? '▶' : '◀';
    btn.title = colapsada ? 'Mostrar menú completo' : 'Ocultar / mostrar menú';
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
        const subtotalEquipos = calcularTotalCotizacion(cot.items) / 1.18;
        const viaticoCot = cot.viaticosChecked ? (parseFloat(cot.viaticosMonto) || 0) : 0;
        mapa[key].montoTotal += (subtotalEquipos + viaticoCot) * 1.18;
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
        const items = cot.items || [];
        const subtotalEquipos = calcularTotalCotizacion(items) / 1.18;
        const viaticoCot = cot.viaticosChecked ? (parseFloat(cot.viaticosMonto) || 0) : 0;
        montoTotal += (subtotalEquipos + viaticoCot) * 1.18;
        viaticosTotal += viaticoCot;

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
        const items = cot.items || [];
        const subtotalEquipos = calcularTotalCotizacion(items) / 1.18;
        const viaticoCot = cot.viaticosChecked ? (parseFloat(cot.viaticosMonto) || 0) : 0;
        montoTotal += (subtotalEquipos + viaticoCot) * 1.18;
        viaticosTotal += viaticoCot;

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
      const subtotalEquipos = calcularTotalCotizacion(cot.items) / 1.18;
const viaticoCot = cot.viaticosChecked ? (parseFloat(cot.viaticosMonto) || 0) : 0;
const total = (subtotalEquipos + viaticoCot) * 1.18;
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

// ===== PESTAÑA ORDEN DE TRABAJO (CON MEJORAS) =====
let otInicializado = false;

function obtenerFechaActualISO() {
    const hoy = new Date();
    const y = hoy.getFullYear();
    const m = String(hoy.getMonth() + 1).padStart(2, '0');
    const d = String(hoy.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}
function formatearFechaVisual(fechaStr) {
    if (!fechaStr || fechaStr === '—' || fechaStr === 'No indica') return '—';
    const s = String(fechaStr).trim();
    let m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (m) return `${m[3]}/${m[2]}/${m[1]}`;
    m = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
    if (m) return `${String(m[1]).padStart(2,'0')}/${String(m[2]).padStart(2,'0')}/${m[3]}`;
    return s;
}
function inicializarOT() {
    if (!otInicializado) {
        const hoy = obtenerFechaActualISO();
        document.getElementById('ot-fecha').value = hoy;
        if (!document.getElementById('ot-numero').value) {
            document.getElementById('ot-numero').value = '001-' + new Date().getFullYear();
        }
        if (!fechaCompromisoActual) {
            fechaCompromisoActual = '';
        }
        otInicializado = true;
    }
    cargarItemsEnOT();
}

function siguienteNumeroOT() {
    const input = document.getElementById('ot-numero');
    let val = input.value.trim();
    const match = val.match(/^(\d{3})-\d{4}$/);
    if (match) {
        let num = parseInt(match[1], 10);
        if (num < 999) {
            num++;
            input.value = String(num).padStart(3, '0') + '-' + new Date().getFullYear();
        } else {
            alert('Límite de 999 alcanzado.');
        }
    } else {
        input.value = '001-' + new Date().getFullYear();
    }
 guardarEstadoLocal();
}

function cargarDatosOTDesdeCotizacion() {
    document.getElementById('ot-empresa').value = document.getElementById('in-cliente').value;
    document.getElementById('ot-ruc').value = document.getElementById('in-ruc').value;
    document.getElementById('ot-contacto').value = document.getElementById('in-contacto').value;
    document.getElementById('ot-telefono').value = document.getElementById('in-tel').value;
    document.getElementById('ot-correo').value = document.getElementById('in-correo').value;
    document.getElementById('ot-cotizacion').value = document.getElementById('in-cot').value;
    const dir = document.getElementById('in-dir').value;
    if (dir) document.getElementById('ot-cert-direccion').value = dir;
    cargarItemsEnOT();
}

function cargarItemsEnOT() {
    const tbody = document.querySelector('#tabla-ot tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    if (itemsData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; color:#94a3b8; padding:18px;">No hay instrumentos cargados.</td></tr>';
        return;
    }
    const fechaMostrar = fechaCompromisoActual ? formatearFechaVisual(fechaCompromisoActual) : '—';
    itemsData.forEach((it, idx) => {
        const codigoSerie = [it.codigo, it.serie].filter(v => v && v !== 'No Indica').join(' / ') || 'No Indica';
        const incertidumbreDefault = incertidumbrePorEquipo[it.equipo] || '';
        tbody.innerHTML += `<tr>
            <td style="text-align:center;">${idx + 1}</td>
            <td>
               <select class="ot-field-input">
    <option value="Calibración" ${(it.tipoServicio === 'calibracion' || !it.tipoServicio) ? 'selected' : ''}>Calibración</option>
    <option value="Mantenimiento" ${it.tipoServicio === 'mantenimiento' ? 'selected' : ''}>Mantenimiento</option>
    <option value="Verificación" ${it.tipoServicio === 'verificacion' ? 'selected' : ''}>Verificación</option>
    <option value="Venta y Calibración" ${it.tipoServicio === 'ventacalibracion' ? 'selected' : ''}>Venta y Calibración</option>
</select>
                <div style="font-size:10px; color:#64748b; margin-top:3px;">${it.equipo}</div>
            </td>
            <td style="font-size:10.5px;">${it.procedimiento || 'No aplica'}</td>
            <td>${it.alcance || 'No Indica'}</td>
            <td><input type="text" class="ot-field-input" placeholder="Incertidumbre" value="${incertidumbreDefault}"></td>
            <td>${codigoSerie}</td>
            <td style="text-align:center;">${fechaMostrar}</td>
        </tr>`;
    });
}

function renderOTPdf() {
    document.getElementById('ot-out-numero').innerText = document.getElementById('ot-numero').value || 'No indica';
    document.getElementById('ot-out-numero2').innerText = document.getElementById('ot-numero').value || 'No indica';
    document.getElementById('ot-out-fecha').innerText = formatearFechaOT(document.getElementById('ot-fecha').value);
    document.getElementById('ot-out-laboratorio').innerText = document.getElementById('ot-laboratorio').value || 'No indica';
    document.getElementById('ot-out-empresa').innerText = valorOTOFallback('ot-empresa', 'in-cliente') || 'No indica';
    document.getElementById('ot-out-correo').innerText = valorOTOFallback('ot-correo', 'in-correo') || 'No indica';
    document.getElementById('ot-out-ruc').innerText = valorOTOFallback('ot-ruc', 'in-ruc') || 'No indica';
    document.getElementById('ot-out-contacto').innerText = valorOTOFallback('ot-contacto', 'in-contacto') || 'No indica';
    document.getElementById('ot-out-telefono').innerText = valorOTOFallback('ot-telefono', 'in-tel') || 'No indica';
    document.getElementById('ot-out-prioridad').innerText = document.getElementById('ot-prioridad').value;
    document.getElementById('ot-out-expediente').innerText = document.getElementById('ot-expediente').value || 'No indica';
    document.getElementById('ot-out-cotizacion').innerText = valorOTOFallback('ot-cotizacion', 'in-cot') || 'No indica';
    document.getElementById('ot-out-factura').innerText = document.getElementById('ot-factura').value || 'No indica';
    document.getElementById('ot-out-guia').innerText = document.getElementById('ot-guia').value || 'No indica';
    document.getElementById('ot-out-entregar').innerText = document.getElementById('ot-entregar').value || 'NO APLICA';
    document.getElementById('ot-out-cert-nombre').innerText = document.getElementById('ot-cert-nombre').value || 'No indica';
    document.getElementById('ot-out-cert-direccion').innerText = document.getElementById('ot-cert-direccion').value || 'No indica';
    document.getElementById('ot-out-observaciones').innerText = document.getElementById('ot-observaciones').value || 'Ninguna';
    document.getElementById('ot-out-condiciones').innerText = document.getElementById('ot-condiciones').value || 'Ninguna';

    const tbody = document.getElementById('ot-print-table-body');
    tbody.innerHTML = '';
    const filas = document.querySelectorAll('#tabla-ot tbody tr');
    if (filas.length === 0 || itemsData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="padding:8px; border:1px solid #000;">Sin instrumentos cargados</td></tr>';
        return;
    }
    const fechaCompromisoPDF = fechaCompromisoActual ? formatearFechaVisual(fechaCompromisoActual) : '—';
    filas.forEach((fila, idx) => {
        const item = itemsData[idx];
        if (!item) return;
        const servicioSel = fila.querySelector('select');
        const inputs = fila.querySelectorAll('input');
        const incertidumbre = inputs[0] && inputs[0].value ? inputs[0].value : '—';
        const codigoSerie = [item.codigo, item.serie].filter(v => v && v !== 'No Indica').join(' / ') || 'No Indica';
        tbody.innerHTML += `<tr>
            <td style="border:1px solid #000; padding:4px;">${idx + 1}</td>
            <td style="border:1px solid #000; padding:4px; text-align:left;">${servicioSel ? servicioSel.value : 'Calibración'} — ${item.equipo}</td>
            <td style="border:1px solid #000; padding:4px; font-size:8.5px; text-align:left;">${item.procedimiento || 'No aplica'}</td>
            <td style="border:1px solid #000; padding:4px;">${item.alcance || 'No Indica'}</td>
            <td style="border:1px solid #000; padding:4px;">${incertidumbre}</td>
            <td style="border:1px solid #000; padding:4px;">${codigoSerie}</td>
            <td style="border:1px solid #000; padding:4px;">${fechaCompromisoPDF}</td>
        </tr>`;
    });
   const footerRight = document.querySelector('.ot-footer-fixed .footer-right');
if (footerRight) {
    // Calcular cuántas páginas tiene el contenido
    // Por ahora, asumimos 1 página
    const totalPaginas = 1; // Aquí podrías calcularlo dinámicamente
    footerRight.innerHTML = `<div>Pág. 1 de ${totalPaginas}</div>`;
     }
}

function verPDFOrdenTrabajo() { 
    document.querySelectorAll('.pdf-modal-overlay').forEach(m => m.classList.remove('active'));
    renderOTPdf(); 
    const otModal = document.getElementById('otPdfModal');
    otModal.classList.add('active'); 
}

function descargarPDFOrdenTrabajo() {
    document.getElementById('modalPuntos').classList.remove('active');
    const pdfModal = document.getElementById('pdfModal');
    if (pdfModal) pdfModal.classList.remove('active');
    renderOTPdf();
    const otModal = document.getElementById('otPdfModal');
    document.querySelectorAll('.pdf-modal-overlay').forEach(m => m.classList.remove('active'));
    otModal.classList.add('active');
    setPageOrientation('portrait');
    setTimeout(() => {
        window.print();
    }, 200);
}

// ===== HISTORIAL OT =====
function abrirHistorialOT() {
    document.getElementById('modalHistorialOT').classList.add('active');
    renderHistorialOTModal();
}
function cerrarHistorialOT() { document.getElementById('modalHistorialOT').classList.remove('active'); }
function filtrarHistorialOT() { renderHistorialOTModal(); }

function normalizarFechaISO(valor) {
    if (!valor) return '';
    let s = String(valor).trim();
    let m00 = s.match(/^00(\d{2})-(\d{2})-(\d{2})$/);
    if (m00) return `20${m00[1]}-${m00[2]}-${m00[3]}`;
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
    let m = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
    if (m) return `${m[3]}-${String(m[2]).padStart(2,'0')}-${String(m[1]).padStart(2,'0')}`;
    return s;
}

function renderHistorialOTModal() {
    const tbody = document.getElementById('cuerpo-historial-ot');
    tbody.innerHTML = '';
    if (historialOT.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:20px; color:#94a3b8;">No hay órdenes de trabajo guardadas.</td></tr>';
        return;
    }
    const filtro = document.getElementById('buscar-historial-ot').value.toLowerCase();
    const filtrados = historialOT.filter((ot) => {
        const cliente = (ot.empresa || ot.cliente || '').toLowerCase();
        return cliente.includes(filtro);
    });
    filtrados.forEach((ot) => {
        const realIdx = historialOT.indexOf(ot);
        const fechaVal = ot.fechaCompromiso ? normalizarFechaISO(ot.fechaCompromiso) : '';
        const tieneFecha = fechaVal !== '';
        const clase = tieneFecha ? 'historial-ot-row-con-fecha' : 'historial-ot-row-sin-fecha';
        tbody.innerHTML += `<tr class="${clase}">
            <td><b>${ot.numero}</b></td>
            <td>${ot.empresa || ot.cliente || 'No indica'}</td>
            <td>${ot.fecha || '-'}</td>
            <td style="text-align:center;">${(ot.items || []).length}</td>
            <td>
                <input type="date" value="${fechaVal}" 
                       oninput="actualizarFechaCompromisoOT(${realIdx}, this.value, this)" 
                       onchange="actualizarFechaCompromisoOT(${realIdx}, this.value, this)" 
                       style="width:100%; padding:4px; border:1px solid #000; border-radius:0; font-size:12px; background:#fff;">
            </td>
            <td style="white-space:nowrap;">
                <button class="btn btn-success btn-sm" onclick="editarOT(${realIdx})" title="Editar">✏️</button>
                <button class="btn btn-info btn-sm" onclick="verPDFOTdesdeHistorial(${realIdx})" title="Vista Previa">👁️</button>
                <button class="btn btn-primary btn-sm" onclick="descargarPDFOTdesdeHistorial(${realIdx})" title="Descargar">📥</button>
                <button class="btn btn-danger btn-sm" onclick="eliminarOTdesdeHistorial(${realIdx})" title="Eliminar">🗑️</button>
            </td>
        </tr>`;
    });
}

function actualizarFechaCompromisoOT(idx, valor, inputEl) {
    if (idx >= 0 && idx < historialOT.length) {
        const fechaNorm = normalizarFechaISO(valor);
        historialOT[idx].fechaCompromiso = fechaNorm;
        if (inputEl) {
            const tr = inputEl.closest('tr');
            if (tr) {
                if (fechaNorm && fechaNorm !== '') {
                    tr.classList.remove('historial-ot-row-sin-fecha');
                    tr.classList.add('historial-ot-row-con-fecha');
                } else {
                    tr.classList.remove('historial-ot-row-con-fecha');
                    tr.classList.add('historial-ot-row-sin-fecha');
                }
            }
        }
        if (editingOTIndex === idx) {
            fechaCompromisoActual = fechaNorm;
            cargarItemsEnOT();
        }
        guardarEstadoLocal();
    }
}

function editarOT(idx) {
    const ot = historialOT[idx];
    if (!ot) return;
    document.getElementById('ot-numero').value = ot.numero;
    document.getElementById('ot-fecha').value = ot.fecha;
    document.getElementById('ot-laboratorio').value = ot.laboratorio || 'EX Scientia Veritas';
    document.getElementById('ot-empresa').value = ot.empresa || '';
    document.getElementById('ot-ruc').value = ot.ruc || '';
    document.getElementById('ot-correo').value = ot.correo || '';
    document.getElementById('ot-contacto').value = ot.contacto || '';
    document.getElementById('ot-telefono').value = ot.telefono || '';
    document.getElementById('ot-prioridad').value = ot.prioridad || 'Media';
    document.getElementById('ot-expediente').value = ot.expediente || '';
    document.getElementById('ot-cotizacion').value = ot.cotizacion || '';
    document.getElementById('ot-factura').value = ot.factura || '';
    document.getElementById('ot-guia').value = ot.guia || '';
    document.getElementById('ot-entregar').value = ot.entregar || 'NO APLICA';
    document.getElementById('ot-cert-nombre').value = ot.certNombre || '';
    document.getElementById('ot-cert-direccion').value = ot.certDireccion || '';
    document.getElementById('ot-observaciones').value = ot.observaciones || '';
    document.getElementById('ot-condiciones').value = ot.condiciones || '';
    fechaCompromisoActual = ot.fechaCompromiso || '';
    itemsData = JSON.parse(JSON.stringify(ot.items || []));
    cargarItemsEnOT();
    editingOTIndex = idx;
    cerrarHistorialOT();
    alert(`Editando OT #${ot.numero}. Presiona "Guardar en Historial de OT" para sobrescribir.`);
    cambiarVista('view-ot', document.querySelector('.nav-item[data-view="view-ot"]'));
 guardarEstadoLocal();
}

function verPDFOTdesdeHistorial(idx) {
    const ot = historialOT[idx];
    if (!ot) return;
    const originalItems = JSON.parse(JSON.stringify(itemsData));
    const originalFecha = fechaCompromisoActual;
    document.getElementById('ot-numero').value = ot.numero;
    document.getElementById('ot-fecha').value = ot.fecha;
    document.getElementById('ot-laboratorio').value = ot.laboratorio || 'EX Scientia Veritas';
    document.getElementById('ot-empresa').value = ot.empresa || '';
    document.getElementById('ot-ruc').value = ot.ruc || '';
    document.getElementById('ot-correo').value = ot.correo || '';
    document.getElementById('ot-contacto').value = ot.contacto || '';
    document.getElementById('ot-telefono').value = ot.telefono || '';
    document.getElementById('ot-prioridad').value = ot.prioridad || 'Media';
    document.getElementById('ot-expediente').value = ot.expediente || '';
    document.getElementById('ot-cotizacion').value = ot.cotizacion || '';
    document.getElementById('ot-factura').value = ot.factura || '';
    document.getElementById('ot-guia').value = ot.guia || '';
    document.getElementById('ot-entregar').value = ot.entregar || 'NO APLICA';
    document.getElementById('ot-cert-nombre').value = ot.certNombre || '';
    document.getElementById('ot-cert-direccion').value = ot.certDireccion || '';
    document.getElementById('ot-observaciones').value = ot.observaciones || '';
    document.getElementById('ot-condiciones').value = ot.condiciones || '';
    fechaCompromisoActual = ot.fechaCompromiso || '';
    itemsData = JSON.parse(JSON.stringify(ot.items || []));
    cargarItemsEnOT();
    verPDFOrdenTrabajo();
    itemsData = originalItems;
    cargarItemsEnOT();
    fechaCompromisoActual = originalFecha;
}

function descargarPDFOTdesdeHistorial(idx) {
    const ot = historialOT[idx];
    if (!ot) return;
    const originalItems = JSON.parse(JSON.stringify(itemsData));
    const originalFecha = fechaCompromisoActual;
    document.getElementById('ot-numero').value = ot.numero;
    document.getElementById('ot-fecha').value = ot.fecha;
    document.getElementById('ot-laboratorio').value = ot.laboratorio || 'EX Scientia Veritas';
    document.getElementById('ot-empresa').value = ot.empresa || '';
    document.getElementById('ot-ruc').value = ot.ruc || '';
    document.getElementById('ot-correo').value = ot.correo || '';
    document.getElementById('ot-contacto').value = ot.contacto || '';
    document.getElementById('ot-telefono').value = ot.telefono || '';
    document.getElementById('ot-prioridad').value = ot.prioridad || 'Media';
    document.getElementById('ot-expediente').value = ot.expediente || '';
    document.getElementById('ot-cotizacion').value = ot.cotizacion || '';
    document.getElementById('ot-factura').value = ot.factura || '';
    document.getElementById('ot-guia').value = ot.guia || '';
    document.getElementById('ot-entregar').value = ot.entregar || 'NO APLICA';
    document.getElementById('ot-cert-nombre').value = ot.certNombre || '';
    document.getElementById('ot-cert-direccion').value = ot.certDireccion || '';
    document.getElementById('ot-observaciones').value = ot.observaciones || '';
    document.getElementById('ot-condiciones').value = ot.condiciones || '';
    fechaCompromisoActual = ot.fechaCompromiso || '';
    itemsData = JSON.parse(JSON.stringify(ot.items || []));
    cargarItemsEnOT();
    cerrarHistorialOT();
    descargarPDFOrdenTrabajo();
    itemsData = originalItems;
    cargarItemsEnOT();
    fechaCompromisoActual = originalFecha;
}

function eliminarOTdesdeHistorial(idx) {
    const ot = historialOT[idx];
    if (!ot) return;
    if (!confirm(`¿Eliminar la Orden de Trabajo #${ot.numero}?`)) return;
    historialOT.splice(idx, 1);
    renderHistorialOTModal();
    if (editingOTIndex === idx) editingOTIndex = -1;
    else if (editingOTIndex > idx) editingOTIndex--;
    guardarEstadoLocal();
}

function guardarEnHistorialOT() {
    const numero = document.getElementById('ot-numero').value.trim();
    if (!numero) { alert('Ingresa un N° de OTI antes de guardar.'); return; }

    if (!fechaCompromisoActual) {
        fechaCompromisoActual = '';
    }

    const filas = document.querySelectorAll('#tabla-ot tbody tr');
    const tablaSnapshot = [];
    filas.forEach((fila, idx) => {
        if (!itemsData[idx]) return;
        const select = fila.querySelector('select');
        const inputs = fila.querySelectorAll('input');
        tablaSnapshot.push({
            servicio: select ? select.value : 'Calibración',
            incertidumbre: inputs[0] ? inputs[0].value : '',
        });
    });

    const objetoOT = {
        numero,
        fecha: document.getElementById('ot-fecha').value,
        fechaCompromiso: fechaCompromisoActual,
        laboratorio: document.getElementById('ot-laboratorio').value,
        empresa: document.getElementById('ot-empresa').value,
        correo: document.getElementById('ot-correo').value,
        ruc: document.getElementById('ot-ruc').value,
        contacto: document.getElementById('ot-contacto').value,
        telefono: document.getElementById('ot-telefono').value,
        prioridad: document.getElementById('ot-prioridad').value,
        expediente: document.getElementById('ot-expediente').value,
        cotizacion: document.getElementById('ot-cotizacion').value,
        factura: document.getElementById('ot-factura').value,
        guia: document.getElementById('ot-guia').value,
        entregar: document.getElementById('ot-entregar').value,
        certNombre: document.getElementById('ot-cert-nombre').value,
        certDireccion: document.getElementById('ot-cert-direccion').value,
        observaciones: document.getElementById('ot-observaciones').value,
        condiciones: document.getElementById('ot-condiciones').value,
        items: JSON.parse(JSON.stringify(itemsData)),
        tablaSnapshot
    };

    if (editingOTIndex >= 0 && editingOTIndex < historialOT.length) {
        historialOT[editingOTIndex] = objetoOT;
        alert(`Orden de Trabajo #${numero} actualizada correctamente.`);
        editingOTIndex = -1;
    } else {
        historialOT.push(objetoOT);
        alert(`Orden de Trabajo #${numero} guardada en su historial.`);
    }
    renderHistorialOTModal();
    guardarEstadoLocal();
}

function formatearFechaOT(fechaInput) { if (!fechaInput) return 'No indica'; const [y,m,d] = fechaInput.split('-'); return `${d}/${m}/${y}`; }
function valorOTOFallback(otId, cotId) { const otEl = document.getElementById(otId); const otVal = otEl ? otEl.value.trim() : ''; if (otVal) return otVal; const cotEl = document.getElementById(cotId); return cotEl ? cotEl.value.trim() : ''; }
