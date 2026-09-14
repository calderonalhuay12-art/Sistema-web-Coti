// ===== FUNCIONES DE IMPORTACIÓN / EXPORTACIÓN =====
function ejecutarAccionArchivo(selectElem) {
    const val = selectElem.value;
    if(val === "import-word") document.getElementById('word-file-input').click();
    else if(val === "export-excel") exportarExcel();
    else if(val === "import-excel") document.getElementById('excel-file-input').click();
    else if(val === "export-backup") exportarRespaldoLocal();
    else if(val === "import-backup") document.getElementById('backup-file-input').click();
    selectElem.selectedIndex = 0;
}

function ejecutarAccionDocumento(selectElem) {
    const val = selectElem.value;
    if(val === "toggle-pdf") togglePDFModal();
    else if(val === "download-pdf") ;
    selectElem.selectedIndex = 0;
}

function exportarExcel() {
    if(itemsData.length === 0) return alert("No hay datos para exportar.");
    const headerInfo = [{ Cotización: document.getElementById('in-cot').value, Cliente: document.getElementById('in-cliente').value, RUC: document.getElementById('in-ruc').value, Dirección: document.getElementById('in-dir').value, Contacto: document.getElementById('in-contacto').value, Teléfono: document.getElementById('in-tel').value, Correo: document.getElementById('in-correo').value, Asesor: document.getElementById('in-asesor').value, Fecha: document.getElementById('in-fecha').value }];
    const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(headerInfo), "Datos_Generales"); XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(itemsData), "Instrumentos"); XLSX.writeFile(wb, `Cotización_${document.getElementById('in-cot').value}.xlsx`);
}

function cargarDesdeExcel(event) {
    const file = event.target.files[0]; if(!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        const workbook = XLSX.read(new Uint8Array(e.target.result), {type: 'array'});
        if(workbook.SheetNames.includes("Datos_Generales")) {
            const g = XLSX.utils.sheet_to_json(workbook.Sheets["Datos_Generales"])[0] || {};
            if(g.Cotización) document.getElementById('in-cot').value = g.Cotización; if(g.Cliente) document.getElementById('in-cliente').value = g.Cliente; if(g.RUC) document.getElementById('in-ruc').value = g.RUC; if(g.Dirección) document.getElementById('in-dir').value = g.Dirección; if(g.Contacto) document.getElementById('in-contacto').value = g.Contacto; if(g.Teléfono) document.getElementById('in-tel').value = g.Teléfono; if(g.Correo) document.getElementById('in-correo').value = g.Correo; if(g.Asesor) document.getElementById('in-asesor').value = g.Asesor; if(g.Fecha) document.getElementById('in-fecha').value = g.Fecha;
        }
        if(workbook.SheetNames.includes("Instrumentos")) itemsData = XLSX.utils.sheet_to_json(workbook.Sheets["Instrumentos"]);
        updateDoc(); renderTables(); alert("¡Cotización cargada desde Excel!");
    };
    reader.readAsArrayBuffer(file);
}

// ===== FUNCIONES DE WORD =====
function normalizarTextoWord(texto) { return String(texto || "").replace(/\u00ad/g, "").replace(/\uFFFD/g, "").replace(/\s+/g, " ").trim(); }
function normalizarCodigoWord(texto) { let s = normalizarTextoWord(texto); s = s.replace(/\s*-\s*/g, "-"); return s.replace(/([A-Z]{1,5}-[A-Z]{1,5}-\d{2})\s+(\d)/gi, "$1$2") || "No Indica"; }
function textoSinAcentos(texto) { return normalizarTextoWord(texto).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase(); }
function normalizarAlcancesWord(texto) { if (!texto) return "No Indica"; return String(texto).split(/\s*;\s*/).map(parte => parte.trim()).filter(Boolean).map(parte => parte.replace(/º\s*C\b/gi, '°C').replace(/°\s*C\b/gi, '°C').replace(/%\s*H(?:R|r)?\b/gi, '%HR').replace(/\s+/g, ' ').trim()).join(' ; '); }
function normalizarPuntosWord(texto) { if (!texto) return ""; return String(texto).split(/\s*;\s*/).map(parte => parte.trim()).filter(Boolean).join(' ; '); }
function identificarEquipoWord(descRaw) {
    const d = textoSinAcentos(descRaw);
    if (d.includes("PROBETA")) return { equipo: "Probeta", servicio: "MATERIAL VOLUMÉTRICO DE VIDRIO Y PLÁSTICO" };
    if (d.includes("PIPETA") && !d.includes("PISTON") && !d.includes("MICROPIPETA")) return { equipo: "Pipeta", servicio: "MATERIAL VOLUMÉTRICO DE VIDRIO Y PLÁSTICO" };
    if (d.includes("VASO") && d.includes("PRECIPIT")) return { equipo: "Vaso de Precipitado", servicio: "MATERIAL VOLUMÉTRICO DE VIDRIO Y PLÁSTICO" };
    if (d.includes("MATRAZ")) return { equipo: "Matraz", servicio: "MATERIAL VOLUMÉTRICO DE VIDRIO Y PLÁSTICO" };
    if (d.includes("FIOLA")) return { equipo: "Fiola", servicio: "MATERIAL VOLUMÉTRICO DE VIDRIO Y PLÁSTICO" };
    if (d.includes("BURETA")) return { equipo: "Bureta", servicio: "MATERIAL VOLUMÉTRICO DE VIDRIO Y PLÁSTICO" };
    if (d.includes("PIPETA") && d.includes("MICROPIPETA")) return { equipo: "Micropipeta", servicio: "MICROPIPETA" };
    if (d.includes("PIPETA") && d.includes("PISTON")) return { equipo: "Pipeta de Pistón", servicio: "PIPETA DE PISTÓN" };
    if (d.includes("MALLA")) return { equipo: "Malla de Ensayo", servicio: "MALLA DE ENSAYO" };
    if (d.includes("TAMIZ")) return { equipo: "Tamiz", servicio: "TAMIZ" };
    if (d.includes("TERMOHIGROMETRO")) return { equipo: "Termohigrómetro", servicio: "TERMÓMETRO E HIGRÓMETRO DIGITAL" };
    if (d.includes("TERMOMETRO") && d.includes("INFRARROJO")) return { equipo: "Termómetro Infrarrojo", servicio: "TERMÓMETRO INFRARROJO" };
    if (d.includes("TERMOMETRO") && d.includes("DIGITAL")) return { equipo: "Termómetro Digital", servicio: "TERMÓMETRO DIGITAL" };
    if (d.includes("TURBIMET")) return { equipo: "Turbidímetro", servicio: "TURBIDÍMETRO" };
    if (d.includes("BALANZA")) {
        if (d.includes("CLASE I") || d.includes("ANALITICA")) return { equipo: "Balanza Clase I (Analítica)", servicio: "BALANZA CLASE I (ANALÍTICA)" };
        if (d.includes("CLASE II") || d.includes("PRECISION")) return { equipo: "Balanza Clase II (Precisión)", servicio: "BALANZA CLASE II (PRECISIÓN)" };
        return { equipo: "Balanza Clase III/IV (Industrial)", servicio: "BALANZA CLASE III/IV (INDUSTRIAL)" };
    }
    if (d.includes("MANOMETRO")) return { equipo: "Manómetro", servicio: "MANÓMETRO" };
    if (d.includes("VACUOMETRO")) return { equipo: "Vacuómetro", servicio: "VACUÓMETRO" };
    if (d.includes("MANOVACUOMETRO")) return { equipo: "Manovacuómetro", servicio: "MANOVACUÓMETRO" };
    if (d.includes("ANEMOMETRO")) return { equipo: "Anemómetro", servicio: "ANEMÓMETRO" };
    if (d.includes("CAUDALIMETRO") || d.includes("FLUJOMETRO")) return { equipo: "Flujómetro de Gas", servicio: "FLUJÓMETRO DE GAS" };
    if (d.includes("PIE DE REY") || d.includes("CALIBRADOR")) return { equipo: "Pie de Rey (Calibrador)", servicio: "PIE DE REY (CALIBRADOR)" };
    if (d.includes("MICROMETRO")) return { equipo: "Micrómetro de Exteriores", servicio: "MICRÓMETRO DE EXTERIORES" };
    return { equipo: normalizarTextoWord(descRaw) || "Equipo", servicio: normalizarTextoWord(descRaw).toUpperCase() || "EQUIPO" };
}
function buscarProcedimientoTextoPorCodigo(codigo, magnitud) { const lista = proceduresData[magnitud] || [], p = lista.find(x => x.code === codigo); return p ? `${p.code}: ${p.desc}` : "No aplica"; }
function obtenerMagnitudDeEquipoWord(equipo) { return buscarMagnitudPorEquipo(equipo); }
function mapearEquipoInteligente(descRaw) { const info = identificarEquipoWord(descRaw), codigoProc = procedimientoPorEquipo[info.equipo], magnitud = obtenerMagnitudDeEquipoWord(info.equipo); return { ...info, proc: codigoProc ? buscarProcedimientoTextoPorCodigo(codigoProc, magnitud) : "No aplica", tipo: codigoProc ? "ACREDITADO" : "NO ACREDITADO", precioBase: 200, nombreNormalizado: info.equipo }; }

function procesarWordCliente(event) {
    const file = event.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        mammoth.convertToHtml({ arrayBuffer: e.target.result }).then(function(result) {
            const tempDiv = document.createElement('div'); tempDiv.innerHTML = result.value;
            const textContent = tempDiv.innerText || tempDiv.textContent || "";
            const matchContacto = textContent.match(/Nombre\s*y\s*Apellido\s*:?\s*([A-Za-zÁÉÍÓÚáéíóúÑñ\s]+?)(?=\s+DNI|\s+Empresa|\n|$)/i);
            const matchTel = textContent.match(/Tel[eé]fono\s*\(s\)\s*:?\s*([0-9\s\-+()]+)/i);
            if (matchContacto && matchContacto[1]) document.getElementById('in-contacto').value = normalizarTextoWord(matchContacto[1]);
            if (matchTel && matchTel[1]) document.getElementById('in-tel').value = normalizarTextoWord(matchTel[1]);
            const tables = Array.from(tempDiv.querySelectorAll('table')); if (!tables.length) { alert("No se encontraron tablas."); return; }
            const targetTable = tables.find(table => { const h = textoSinAcentos(table.innerText || ""); return h.includes("DESCRIPCION") && h.includes("MARCA") && h.includes("PUNTO DE CALIBRACION"); }) || tables[tables.length - 1];
            const rows = Array.from(targetTable.querySelectorAll('tr')); if (!rows.length) { alert("La tabla está vacía."); return; }
            let headerIndex = rows.findIndex(row => textoSinAcentos(row.innerText || "").includes("DESCRIPCION")); if (headerIndex < 0) headerIndex = 0;
            const headers = Array.from(rows[headerIndex].querySelectorAll('td,th')).map(c => textoSinAcentos(c.innerText || ""));
            function findCol(patterns, fallback) { const idx = headers.findIndex(h => patterns.some(p => h.includes(p))); return idx >= 0 ? idx : fallback; }
            const idxDesc = findCol(["DESCRIPCION"], 1), idxMarca = findCol(["MARCA"], 2), idxModelo = findCol(["MODELO"], 3), idxSerie = findCol(["SERIE"], 4), idxCodigo = findCol(["CODIGO"], 5), idxAlcance = findCol(["ALCANCE"], 6), idxPuntos = findCol(["PUNTO DE CALIBRACION"], 8);
            itemsData = []; let nuevos = 0, acreditados = 0, noAcreditados = 0;
            rows.slice(headerIndex + 1).forEach(row => {
                const cols = Array.from(row.querySelectorAll('td,th')); if (cols.length < 3) return;
                const descRaw = normalizarTextoWord(cols[idxDesc]?.innerText || ""); if (!descRaw || textoSinAcentos(descRaw).includes("DESCRIPCION")) return;
                const info = identificarEquipoWord(descRaw), marca = normalizarTextoWord(cols[idxMarca]?.innerText || "No Indica") || "No Indica", modelo = normalizarTextoWord(cols[idxModelo]?.innerText || "No Indica") || "No Indica", serie = normalizarTextoWord(cols[idxSerie]?.innerText || "No Indica") || "No Indica", codigo = normalizarCodigoWord(cols[idxCodigo]?.innerText || "No Indica"), alcance = normalizarAlcancesWord(cols[idxAlcance]?.innerText || "") || "No Indica", puntosWord = normalizarPuntosWord(cols[idxPuntos]?.innerText || "");
                const procedimiento = mapearEquipoInteligente(descRaw), puntos = puntosWord || "10%, 50% Y 100%";
                let descripcionDetalle = esMaterialVidrioOPlastico(info.equipo) ? (alcance && alcance !== "No Indica" ? `${info.equipo} de ${alcance}` : info.equipo) : `Alcance: ${alcance && alcance !== "No Indica" ? alcance : 'No Indica'}`;
                let servicioTitulo = esMaterialVidrioOPlastico(info.equipo) ? "CALIBRACIÓN DE MATERIAL VOLUMÉTRICO DE VIDRIO Y PLÁSTICO" : info.servicio;
                itemsData.push({ equipo: info.equipo, servicioTitulo, descripcionDetalle, alcance, marca, modelo, serie, codigo, procedimiento: procedimiento.proc, puntos, lugar: "Laboratorio", tipo: procedimiento.tipo, valorUnitario: procedimiento.precioBase, cantidad: 1, descuentoMonto: 0, tipoServicio: 'calibracion', actividades: [] });
                nuevos++; if (procedimiento.tipo === "ACREDITADO") acreditados++; else noAcreditados++;
            });
            updateDoc(); renderTables();
            alert(`¡Importación completada! ${nuevos} instrumentos individuales (1 por fila).`);
        }).catch(err => alert("Error al leer Word: " + err.message));
    };
    reader.readAsArrayBuffer(file);
}

