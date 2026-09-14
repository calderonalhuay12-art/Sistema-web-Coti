// ===== FUNCIONES DE PDF Y DOCUMENTO (CORREGIDAS) =====
function togglePDFModal() { 
    const modal = document.getElementById('pdfModal');
    modal.classList.toggle('active');
    if (modal.classList.contains('active')) {
        const valorGuardado = localStorage.getItem(LOCAL_STORAGE_KEY_CAMPOS)
            ? JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_CAMPOS))['out-servicio-detalle']
            : null;
        prepararPDFCompletoConInstitucional();
        if (valorGuardado) {
            document.getElementById('out-servicio-detalle').value = valorGuardado;
        }
    }
}
function toggleOTPDFModal() { 
    document.getElementById('otPdfModal').classList.toggle('active');
}

function setPageOrientation(orientation) { 
    const styleTag = document.getElementById('dynamic-page-size'); 
    if (!styleTag) return; 
    const margin = orientation === 'landscape' ? '6mm 8mm' : '8mm 10mm'; 
    styleTag.textContent = `@media print { @page { size: A4 ${orientation}; margin: ${margin}; } }`; 
}

function descargarPDF() {
    document.getElementById('modalPuntos').classList.remove('active');
    const otModal = document.getElementById('otPdfModal');
    if (otModal) otModal.classList.remove('active');
    updateDoc();
    renderTables();
    const valorGuardado = localStorage.getItem(LOCAL_STORAGE_KEY_CAMPOS)
        ? JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_CAMPOS))['out-servicio-detalle']
        : null;
    prepararPDFCompleto();
    if (valorGuardado) {
        document.getElementById('out-servicio-detalle').value = valorGuardado;
    }
    const pdfModal = document.getElementById('pdfModal');
    pdfModal.classList.add('active');
    setPageOrientation('portrait');
    setTimeout(() => {
        window.print();
    }, 100);
}

// ===== CONTROL DE PÁGINAS (SOLO 1 PÁGINA) =====
function prepararPDFCompleto() {
    const paginas = document.querySelectorAll('.a4-landscape');
    paginas.forEach((pag, index) => {
        if (index === 0) {
            pag.style.display = 'block';
            const footerRight = pag.querySelector('.footer-right');
            if (footerRight) {
                footerRight.innerHTML = `<div>Pág. 1 de 1</div>`;
            }
        } else {
            pag.style.display = 'none';
        }
    });
}
// Helper: descarga la imagen del logo y la convierte a base64 (jsPDF necesita esto, no puede usar una URL directo)
async function cargarImagenBase64(url) {
    const resp = await fetch(url);
    const blob = await resp.blob();
    return await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}
async function generarCotizacionPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' }); // 👈 ahora A4 vertical

    const ruc = document.getElementById('in-ruc').value;
    const cot = document.getElementById('in-cot').value;
    const cliente = document.getElementById('in-cliente').value;
    const dir = document.getElementById('in-dir').value;
    const contacto = document.getElementById('in-contacto').value;
    const tel = document.getElementById('in-tel').value;
    const correo = document.getElementById('in-correo').value;
    const tiempoEntrega = document.getElementById('in-tiempo-entrega').value || '5 días hábiles';
    const asesor = document.getElementById('in-asesor').value;
    const fechaInput = document.getElementById('in-fecha').value;


    let fechaTexto = '';
    if (fechaInput) {
        const [y, m, d] = fechaInput.split('-');
        const meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
        fechaTexto = `${parseInt(d)} de ${meses[parseInt(m)-1]} de ${y}`;
    }

    const detalleServicioEl = document.getElementById('out-servicio-detalle');
    const detalleServicio = detalleServicioEl ? detalleServicioEl.value :
        'El servicio de calibración se realizará utilizando procedimientos de Nacionales - INACAL.';

    const ROJO = [192, 0, 0];
    const VERDE = [0, 176, 80];
    const NEGRO = [0, 0, 0];
    const M = 10;              // margen izq/der
    const ANCHO_PAGINA = 210;  // A4 portrait
    const ANCHO_UTIL = ANCHO_PAGINA - (M * 2); // 190mm de contenido

    // ================= LOGO REAL =================
    try {
        const logoBase64 = await cargarImagenBase64('https://i.postimg.cc/B6dqRr5K/Whats-App-Image-2026-08-12-at-3-04-12-PM.jpg');
        doc.addImage(logoBase64, 'JPEG', M, 8, 18, 18);
    } catch (e) {
        console.warn('No se pudo cargar el logo para el PDF:', e);
    }

    // ================= TÍTULO CENTRAL =================
    doc.setTextColor(...NEGRO); doc.setFontSize(12); doc.setFont(undefined, 'bold');
    doc.text('LABORATORIO DE CALIBRACION ACREDITADO CON PJLA-USA', 97, 13, { align: 'center' });
    doc.setFontSize(8.5); doc.setFont(undefined, 'normal');
    doc.text('Accreditation # 135715', 97, 19, { align: 'center' });

    // ================= CAJA RUC / COTIZACIÓN (arriba derecha) =================
    const bx = 165, bw = 35;
    doc.setDrawColor(0); doc.setLineWidth(0.3);
    doc.rect(bx, 6, bw, 8); doc.setFontSize(7.5); doc.setFont(undefined, 'bold');
    doc.text('RUC : 20554508112', bx + bw / 2, 11, { align: 'center' });

// ===== Cotización (fondo verde CON BORDE) =====
doc.setFillColor(...VERDE);          // Fondo verde
doc.rect(bx, 14, bw, 6, 'FD');       // 'FD' = Fondo + Borde (dibuja el borde)
doc.setTextColor(255, 255, 255);
doc.text('Cotización', bx + bw / 2, 18, { align: 'center' });

    doc.setDrawColor(0); doc.rect(bx, 20, bw, 7);
    doc.setTextColor(...NEGRO); doc.setFont(undefined, 'normal'); doc.setFontSize(8);
    doc.text(`# ${cot}`, bx + bw / 2, 24.5, { align: 'center' });

    // ================= DIRECCIÓN Y SERVICIOS =================
    doc.setTextColor(...ROJO); doc.setFont(undefined, 'bolditalic'); doc.setFontSize(8);
    doc.text('Calle Las Codornices 223A - Surquillo - Lima - Perú', 105, 32, { align: 'center' });

    doc.setDrawColor(...ROJO); doc.setLineWidth(0.3);
    doc.rect(M, 35, ANCHO_UTIL, 6);
    doc.setFontSize(7);
    doc.text('Mantenimiento - Fabricación - Verificación - Calibración - Venta de equipos e instrumentos de medición', 105, 39, { align: 'center' });

// ================= GRILLA DE INFORMACIÓN =================

// ===== TABLA IZQUIERDA =====
const observaciones = document.getElementById('in-observaciones').value || 'NINGUNA';
const condicionPago = document.getElementById('in-condicion-pago').value || '100% ADELANTADO';
const datosIzquierda = [
    ['Cliente', ':', cliente.toUpperCase()],
    ['RUC', ':', ruc],
    ['Dirección', ':', dir.toUpperCase()],
    ['Contacto', ':', contacto.toUpperCase()],
    ['Teléfono', ':', tel],
    ['Correo', ':', correo.toUpperCase()],
    ['Observaciones', ':', observaciones]
];

doc.autoTable({
    startY: 46,
    margin: { left: 12 },
    body: datosIzquierda,
    theme: 'plain',
    styles: {
        fontSize: 7.5,
        cellPadding: 0.5,
        valign: 'top',
        lineColor: [0, 0, 0],
        lineWidth: 0,
        halign: 'left'
    },
    columnStyles: {
        0: { cellWidth: 24, fontStyle: 'bold', halign: 'left' },
        1: { cellWidth: 4, fontStyle: 'bold', halign: 'center' },
        2: { cellWidth: 68, halign: 'left' }
    }
});

// Guardar la altura final de la tabla izquierda
const finalYIzquierda = doc.lastAutoTable.finalY;

// ===== TABLA DERECHA =====
const datosDerecha = [
    ['Asesor Comercial', ':', asesor.toUpperCase()],
    ['Condición Pago', ':', condicionPago.toUpperCase()],
    ['Tiempo de Entrega', ':', tiempoEntrega.toUpperCase()],
    ['Validez Oferta', ':', '30 DÍAS'],
    ['Moneda', ':', 'SOLES'],
    ['Fecha Emision', ':', fechaTexto.toUpperCase()],
    ['Alcance Acreditado', ':', 'https://bit.ly/AlcancePJLA-USA']
];

doc.autoTable({
    startY: 46,
    margin: { left: 115 },
    body: datosDerecha,
    theme: 'plain',
    styles: {
        fontSize: 7.5,
        cellPadding: 0.5,
        valign: 'top',
        lineColor: [0, 0, 0],
        lineWidth: 0,
        halign: 'left'
    },
    columnStyles: {
        0: { cellWidth: 32, fontStyle: 'bold', halign: 'left' },
        1: { cellWidth: 4, fontStyle: 'bold', halign: 'center' },
        2: { cellWidth: 'auto', halign: 'left' }
    },
    willDrawCell: function(data) {
        if (data.section === 'body' && data.column.index === 2) {
            const contenido = data.cell.text.join('');
            if (contenido.includes('https://')) {
                doc.setTextColor(0, 0, 238);
            }
        }
    },
    didDrawCell: function(data) {
        if (data.section === 'body' && data.column.index === 2) {
            const contenido = data.cell.text.join('');
            if (contenido.includes('https://')) {
                const textWidth = doc.getTextWidth(contenido);
                const x = data.cell.x;
                const y = data.cell.y + data.cell.height - 1;
                
                doc.setDrawColor(0, 0, 238);
                doc.setLineWidth(0.3);
                doc.line(x, y, x + textWidth, y);
            }
        }
    }
});

// Guardar la altura final de la tabla derecha
const finalYDerecha = doc.lastAutoTable.finalY;

// ===== OBTENER LA POSICIÓN FINAL MÁXIMA =====
// Toma el valor más grande entre la tabla izquierda y la derecha para evitar cruces
let gy = Math.max(finalYIzquierda, finalYDerecha) + 6;

// ===== SALUDO =====
doc.setFontSize(7.5);
doc.setFont(undefined, 'normal');
doc.setTextColor(0, 0, 0);
doc.text(`Estimado(a): ${contacto.toUpperCase()}`, 12, gy);
gy += 3.5;
doc.text('Agradecemos su requerimiento y procedemos a cotizar, sujeto a confirmación final, lo siguiente:', 12, gy);
gy += 3.5;
    // ================= TABLA DE ÍTEMS =================
    const filas = itemsData.map((it, idx) => {
        const bruto = it.valorUnitario * it.cantidad;
        const dscto = (it.descuentoMonto || 0) * it.cantidad;
        const neto = bruto - dscto;
        const desc = `${it.servicioTitulo || it.equipo}\nMARCA: ${it.marca} , MODELO: ${it.modelo}\nSERIE: ${it.serie}\nCÓDIGO: ${it.codigo}\n${it.descripcionDetalle || ''}`;
        return [idx + 1, desc, it.procedimiento, it.puntos, it.lugar, it.tipo,
                'S/ ' + formatMoney(it.descuentoMonto || 0), 'S/ ' + formatMoney(it.valorUnitario), it.cantidad, 'S/ ' + formatMoney(neto)];
    });

    let totalNeto = itemsData.reduce((s, it) =>
        s + (it.valorUnitario * it.cantidad - (it.descuentoMonto || 0) * it.cantidad), 0);
    let totalDescuento = itemsData.reduce((s, it) => s + (it.descuentoMonto || 0) * it.cantidad, 0);

    const checkViaticos = document.getElementById('check-viaticos');
    if (checkViaticos && checkViaticos.checked) {
        const monto = parseFloat(document.getElementById('viaticos-monto').value) || 0;
        const dscto = parseFloat(document.getElementById('viaticos-dscto').value) || 0;
        const neto = monto - dscto;
        const descViat = document.getElementById('viaticos-desc').value;
        filas.push([filas.length + 1, descViat, 'No aplica', 'No aplica', 'Campo', 'NO APLICA',
                    'S/ ' + formatMoney(dscto), 'S/ ' + formatMoney(monto), 1, 'S/ ' + formatMoney(neto)]);
        totalNeto += neto;
        totalDescuento += dscto;
    }

        doc.autoTable({
        startY: gy,
        margin: { left: M, right: M, bottom: 18 }, // deja espacio para el pie en cada hoja
        head: [['Item','Descripción','Procedimiento','Puntos de Calibracioón','Lugar','Tipo de Servicio','Descuento S/','Valor Unitario S/','Cantidad','Importe Total S/']],
        body: filas,
        theme: 'grid',
        styles: { fontSize: 5.8, cellPadding: 1, valign: 'middle', lineColor: [0,0,0], lineWidth: 0.2, textColor: [0,0,0] },
        headStyles: { fillColor: VERDE, textColor: 255, fontStyle: 'bold', halign: 'center', fontSize: 6 },
        bodyStyles: { halign: 'center', textColor: [0,0,0] },
        columnStyles: {
            0: { cellWidth: ANCHO_UTIL * 0.03 },
            1: { cellWidth: ANCHO_UTIL * 0.25, halign: 'center' },
            2: { cellWidth: ANCHO_UTIL * 0.25, halign: 'left' },
            3: { cellWidth: ANCHO_UTIL * 0.10 },
            4: { cellWidth: ANCHO_UTIL * 0.07 },
            5: { cellWidth: ANCHO_UTIL * 0.08, fontStyle: 'bold' },
            6: { cellWidth: ANCHO_UTIL * 0.06, halign: 'right' },
            7: { cellWidth: ANCHO_UTIL * 0.06, halign: 'right' },
            8: { cellWidth: ANCHO_UTIL * 0.04 },
            9: { cellWidth: ANCHO_UTIL * 0.06, halign: 'right' }
        },
        // 👇 esto dibuja el pie fijo en TODAS las hojas que la tabla vaya creando
        didDrawPage: (data) => {
            const yPie = 285;
            doc.setDrawColor(0); doc.setLineWidth(0.3);
          //  doc.line(M, yPie - 4, ANCHO_PAGINA - M, yPie - 4);
            doc.setFont(undefined, 'normal'); doc.setFontSize(5.5); doc.setTextColor(80, 80, 80);
            doc.text('F-PVEN-01.2', M, yPie);
            doc.text('05', M, yPie + 2.5);
            doc.text('02/09/2026', M, yPie + 5);
        }
    });

    // ================= DETALLES + TOTALES =================
    let fy = doc.lastAutoTable.finalY + 4;

    // Si no queda espacio suficiente antes del pie, saltar a una hoja nueva
    if (fy > 255) {
        doc.addPage();
        fy = 20;
    }

    doc.setFont(undefined, 'italic'); doc.setFontSize(6.5); doc.setTextColor(...NEGRO);
    doc.text('Detalles del servicio:', 12, fy);
    doc.text(doc.splitTextToSize(detalleServicio, 110), 12, fy + 3);

    const igv = totalNeto * 0.18;
    const total = totalNeto + igv;
    doc.setFont(undefined, 'normal'); doc.setFontSize(7.5);
    doc.text('Descuento:', 165, fy, {align:'right'}); doc.text(`S/. ${formatMoney(totalDescuento)}`, 200, fy, {align:'right'}); fy += 4;
    doc.text('Sub total:', 165, fy, {align:'right'}); doc.text(`${formatMoney(totalNeto)}`, 200, fy, {align:'right'}); fy += 4;
    doc.text('IGV (18%):', 165, fy, {align:'right'}); doc.text(`${formatMoney(igv)}`, 200, fy, {align:'right'}); fy += 5;
    doc.setFont(undefined, 'bold'); doc.setFontSize(8.5);
    doc.text('Total:', 165, fy, {align:'right'}); doc.text(`${formatMoney(total)}`, 200, fy, {align:'right'});
    fy += 6;

    doc.setFont(undefined, 'bolditalic'); doc.setFontSize(7.5);
    doc.text(`Son: ${numeroALetras(total)}`, 200, fy, { align: 'right' });


    return doc;
}
// ===== PREPARAR PDF CON PÁGINAS INSTITUCIONALES =====
function prepararPDFCompletoConInstitucional() {
renderTables();
    // 1. Obtener la cotización
    const cotizacion = document.getElementById('pagina-cotizacion');
    if (!cotizacion) return;
    
    // 2. Crear un contenedor para el modal
    const modal = document.getElementById('pdfModal');
    
    // 3. Limpiar el modal (solo mantener el botón de cerrar)
    const closeBtn = modal.querySelector('.modal-close-bar');
    modal.innerHTML = '';
    modal.appendChild(closeBtn);
    
    // 4. Crear un contenedor para las páginas
    const wrapper = document.createElement('div');
    wrapper.style.width = '100%';
    wrapper.style.maxWidth = '800px';
    wrapper.style.margin = '0 auto';
    
    // 5. Agregar la página de cotización
    const cotizacionClone = cotizacion.cloneNode(true);
    cotizacionClone.style.display = 'block';
    cotizacionClone.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
    cotizacionClone.style.margin = '0 auto 20px auto';
    cotizacionClone.style.width = '100%';
    cotizacionClone.style.maxWidth = '210mm';
    wrapper.appendChild(cotizacionClone);
    
    // 6. Agregar las 3 páginas institucionales como un visor PDF
    const pdfContainer = document.createElement('div');
    pdfContainer.style.cssText = `
        margin: 0 auto 20px auto;
        padding: 10px;
        background: #f8f9fa;
        border-radius: 8px;
        border: 1px solid #dee2e6;
        max-width: 210mm;
        width: 100%;
        box-sizing: border-box;
    `;
    pdfContainer.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
            <span style="font-weight: bold; color: #1a237e; font-size: 12px;">📄 Páginas Institucionales</span>
            <span style="color: #868e96; font-size: 10px;">Certificado · Contacto · Equipos</span>
        </div>
        <div style="position: relative; padding-bottom: 75%; height: 0; overflow: hidden; border-radius: 6px; border: 1px solid #e9ecef; background: #ffffff;">
            <iframe src="PAGacre.pdf" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; border-radius: 6px;" allowfullscreen></iframe>
        </div>
    `;
    wrapper.appendChild(pdfContainer);
    
    // 7. Agregar el wrapper al modal
    modal.appendChild(wrapper);
}

// ============================================================
// FUNCIÓN PARA AGREGAR NUMERACIÓN A TODAS LAS PÁGINAS
// ============================================================
async function agregarNumerosDePagina(pdfBytes) {
    const { PDFDocument, rgb, StandardFonts } = PDFLib;
    
    // 1. Cargar el PDF
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();
    const totalPages = pages.length;

    // 2. Agregar número a CADA página
    for (let i = 0; i < totalPages; i++) {
        const page = pages[i];
        const { width, height } = page.getSize();
        
        // Número de página: "Página X de Y"
        const texto = `Página ${i + 1} de ${totalPages}`;
        
        // Dibujar el número en la parte inferior izquierda
        page.drawText(texto, {
            x: 525,              // 👈 Posición izquierda
            y: 12,              // 👈 Posición inferior
            size: 6,            // 👈 Tamaño pequeño
            color: rgb(0, 0, 0),
            font: await pdfDoc.embedFont(StandardFonts.Helvetica)
        });
    }

    // 3. Devolver el PDF con numeración
    return await pdfDoc.save();
}
// ========== DESCARGAR PDF COMPLETO (CON MEJOR CALIDAD) ==========
async function descargarPDFCompleto() {
    updateDoc();
    renderTables();

    const btn = document.querySelector('button[onclick="descargarPDFCompleto()"]');
    const textoOriginal = btn.textContent;
    btn.textContent = '⏳ Generando PDF...';
    btn.disabled = true;

    try {
        // ====== 1. GENERAR PDF REAL DE LA COTIZACIÓN (texto, no imagen) ======
        console.log('🔄 Generando PDF de cotización...');
        const docCotizacion = await generarCotizacionPDF();
        const cotizacionArrayBuffer = docCotizacion.output('arraybuffer');
        console.log('✅ PDF de cotización generado');

        // ====== 2. CARGAR EL PDF INSTITUCIONAL ======
        console.log('🔄 Cargando PDF institucional...');
        const pdfInstitucional = await fetch('PAGacre.pdf');
        if (!pdfInstitucional.ok) {
            alert('⚠️ No se encontró el archivo PAGacre.pdf');
            btn.textContent = textoOriginal;
            btn.disabled = false;
            return;
        }
        const pdfInstitucionalArrayBuffer = await pdfInstitucional.arrayBuffer();
        console.log('✅ PDF institucional cargado');

        // ====== 3. UNIR LOS PDFs ======
        console.log('🔄 Uniendo PDFs...');
        const { PDFDocument } = PDFLib;

        const cotizacionPdf = await PDFDocument.load(cotizacionArrayBuffer);
const paginasCotizacion = cotizacionPdf.getPageCount();
        const institucionalPdf = await PDFDocument.load(pdfInstitucionalArrayBuffer);

        const newPdf = await PDFDocument.create();

        const cotizacionPages = await newPdf.copyPages(cotizacionPdf, cotizacionPdf.getPageIndices());
        cotizacionPages.forEach(page => newPdf.addPage(page));

        const institucionalPages = await newPdf.copyPages(institucionalPdf, institucionalPdf.getPageIndices());
        institucionalPages.forEach(page => newPdf.addPage(page));

        console.log('✅ PDFs unidos (total: ' + newPdf.getPageCount() + ' páginas)');
// ====== 3.5 AGREGAR NUMERACIÓN AL PDF INSTITUCIONAL ======
const pdfUnidoBytes = await newPdf.save();
const pdfNumeradoBytes = await agregarNumerosDePagina(pdfUnidoBytes);
console.log('✅ Numeración agregada al PDF institucional');

    // ====== 4. DESCARGAR ======
const blob = new Blob([pdfNumeradoBytes], { type: 'application/pdf' }); // 👈 CAMBIADO
const url = URL.createObjectURL(blob);
const link = document.createElement('a');
link.href = url;
const nroCot = document.getElementById('in-cot').value || 'SinNumero';
const clienteNombre = document.getElementById('in-cliente').value || 'SinCliente';
link.download = `Cotización ${nroCot} ${clienteNombre}.pdf`;
link.click();
URL.revokeObjectURL(url);

alert('✅ PDF completo descargado correctamente.');

    } catch (error) {
        console.error('❌ Error:', error);
        alert('❌ Error al generar el PDF: ' + error.message);
    } finally {
        const btn2 = document.querySelector('button[onclick="descargarPDFCompleto()"]');
        if (btn2) {
            btn2.textContent = '📄 Descargar Cotización + Información';
            btn2.disabled = false;
        }
    }
}
    