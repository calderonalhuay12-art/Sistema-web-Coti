// ===== PESTAÑA ORDEN DE TRABAJO (CON MEJORAS) =====
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
    tablaSnapshotOTActual = [];
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
        const snapshot = tablaSnapshotOTActual[idx] || {};
        const codigoSerie = [it.codigo, it.serie].filter(v => v && v !== 'No Indica').join(' / ') || 'No Indica';
        const incertidumbreDefault = incertidumbrePorEquipo[it.equipo] || '';
        tbody.innerHTML += `<tr>
            <td style="text-align:center;">${idx + 1}</td>
            <td>
               <select class="ot-field-input">
    <option value="Calibración" ${(snapshot.servicio || (it.tipoServicio === 'calibracion' || !it.tipoServicio ? 'Calibración' : '')) === 'Calibración' ? 'selected' : ''}>Calibración</option>
    <option value="Mantenimiento" ${(snapshot.servicio || (it.tipoServicio === 'mantenimiento' ? 'Mantenimiento' : '')) === 'Mantenimiento' ? 'selected' : ''}>Mantenimiento</option>
    <option value="Verificación" ${(snapshot.servicio || (it.tipoServicio === 'verificacion' ? 'Verificación' : '')) === 'Verificación' ? 'selected' : ''}>Verificación</option>
    <option value="Venta y Calibración" ${(snapshot.servicio || (it.tipoServicio === 'ventacalibracion' ? 'Venta y Calibración' : '')) === 'Venta y Calibración' ? 'selected' : ''}>Venta y Calibración</option>
</select>
                <div style="font-size:10px; color:#64748b; margin-top:3px;">${it.equipo}</div>
            </td>
            <td style="font-size:10.5px;">${it.procedimiento || 'No aplica'}</td>
            <td>${it.alcance || 'No Indica'}</td>
            <td><input type="text" class="ot-field-input" placeholder="Incertidumbre" value="${snapshot.incertidumbre !== undefined ? snapshot.incertidumbre : incertidumbreDefault}"></td>
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
    tablaSnapshotOTActual = JSON.parse(JSON.stringify(ot.tablaSnapshot || []));
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
    const originalSnapshot = JSON.parse(JSON.stringify(tablaSnapshotOTActual));
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
    tablaSnapshotOTActual = JSON.parse(JSON.stringify(ot.tablaSnapshot || []));
    cargarItemsEnOT();
    verPDFOrdenTrabajo();
    itemsData = originalItems;
    fechaCompromisoActual = originalFecha;
    tablaSnapshotOTActual = originalSnapshot;
    cargarItemsEnOT();
}

function descargarPDFOTdesdeHistorial(idx) {
    const ot = historialOT[idx];
    if (!ot) return;
    const originalItems = JSON.parse(JSON.stringify(itemsData));
    const originalFecha = fechaCompromisoActual;
    const originalSnapshot = JSON.parse(JSON.stringify(tablaSnapshotOTActual));
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
    tablaSnapshotOTActual = JSON.parse(JSON.stringify(ot.tablaSnapshot || []));
    cargarItemsEnOT();
    cerrarHistorialOT();
    descargarPDFOrdenTrabajo();
    itemsData = originalItems;
    fechaCompromisoActual = originalFecha;
    tablaSnapshotOTActual = originalSnapshot;
    cargarItemsEnOT();
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
    tablaSnapshotOTActual = JSON.parse(JSON.stringify(tablaSnapshot));
    renderHistorialOTModal();
    guardarEstadoLocal();
}

function formatearFechaOT(fechaInput) { if (!fechaInput) return 'No indica'; const [y,m,d] = fechaInput.split('-'); return `${d}/${m}/${y}`; }
function valorOTOFallback(otId, cotId) { const otEl = document.getElementById(otId); const otVal = otEl ? otEl.value.trim() : ''; if (otVal) return otVal; const cotEl = document.getElementById(cotId); return cotEl ? cotEl.value.trim() : ''; }
