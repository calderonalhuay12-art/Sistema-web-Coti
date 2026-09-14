// ===== FUNCIONES AUXILIARES =====
function esMaterialVidrioOPlastico(equipo) { return ["Pipeta", "Bureta", "Fiola", "Probeta", "Vaso de Precipitado", "Dispensador", "Picnómetro", "Matraz", "Propipeta"].includes(equipo); }
function esMedioIsotermico(equipo) { return ["Estufa", "Horno", "Incubadora", "Conservadora", "Refrigeradora", "Congelador", "Baño María", "Baños Termostáticos", "Autoclave"].includes(equipo); }
function buscarMagnitudPorEquipo(equipoNombre) { for (const mag in catalogData) { if (catalogData[mag].includes(equipoNombre)) return mag; } return null; }
function setSelectValueOAgregar(selectId, valor) {
    const el = document.getElementById(selectId); if (!el || valor === undefined || valor === null || valor === '') return;
    const valorTexto = String(valor);
    if (el.tagName === 'SELECT' && !Array.from(el.options).some(o => o.value === valorTexto)) {
        const opt = document.createElement('option'); opt.value = valorTexto; opt.textContent = valorTexto; el.appendChild(opt);
    }
    el.value = valorTexto;
}
function formatMoney(val) { return val.toFixed(2).replace('.', ','); }

function numeroSeguro(valor, predeterminado = 0) {
    const numero = Number.parseFloat(valor);
    return Number.isFinite(numero) ? numero : predeterminado;
}

function normalizarItemCotizacion(item) {
    const original = item || {};
    const cantidad = Math.max(1, Math.trunc(numeroSeguro(original.cantidad, 1)));
    return {
        ...original,
        alcance: original.alcance || 'No Indica',
        alcanceDatos: Array.isArray(original.alcanceDatos) ? original.alcanceDatos : [],
        actividades: Array.isArray(original.actividades) ? original.actividades : [],
        cantidad,
        descuentoMonto: numeroSeguro(original.descuentoMonto),
        tipoServicio: original.tipoServicio || 'calibracion',
        valorUnitario: numeroSeguro(original.valorUnitario),
    };
}

function normalizarItemsCotizacion(items) {
    return Array.isArray(items) ? items.map(normalizarItemCotizacion) : [];
}

function calcularTotalesCotizacion(items, viaticos = {}) {
    const itemsNormalizados = normalizarItemsCotizacion(items);
    const subtotalBrutoItems = itemsNormalizados.reduce((total, item) => total + item.valorUnitario * item.cantidad, 0);
    const descuentoItems = itemsNormalizados.reduce((total, item) => total + item.descuentoMonto * item.cantidad, 0);
    const subtotalNetoItems = subtotalBrutoItems - descuentoItems;

    const montoViaticos = numeroSeguro(viaticos.monto);
    const descuentoViaticosSolicitado = numeroSeguro(viaticos.descuento);
    const aplicarViaticos = Boolean(viaticos.incluidos) && montoViaticos > 0
        && itemsNormalizados.some(item => item.lugar === 'In situ');
    const descuentoViaticos = aplicarViaticos ? descuentoViaticosSolicitado : 0;
    const viaticosNetos = aplicarViaticos ? montoViaticos - descuentoViaticos : 0;
    const subtotalNeto = subtotalNetoItems + viaticosNetos;
    const igv = subtotalNeto * 0.18;

    return {
        itemsNormalizados,
        subtotalBrutoItems,
        descuentoItems,
        subtotalNetoItems,
        montoViaticos: aplicarViaticos ? montoViaticos : 0,
        descuentoViaticos,
        viaticosNetos,
        aplicarViaticos,
        descuentoTotal: descuentoItems + descuentoViaticos,
        subtotalNeto,
        igv,
        total: subtotalNeto + igv,
    };
}

function numeroALetras(num) { 
    let entero = Math.floor(num), 
        decimales = Math.round((num - entero) * 100), 
        textoEntero = entero > 0 ? numeroUnidades(entero) : "Cero"; 
    return `${textoEntero} con ${decimales < 10 ? '0' + decimales : decimales}/100 SOLES INCLUIDO EL IGV.`; 
}
function numeroUnidades(num) {
    const Unidades = [
        '', 'Un', 'Dos', 'Tres', 'Cuatro', 'Cinco', 'Seis', 'Siete', 'Ocho', 'Nueve', 
        'Diez', 'Once', 'Doce', 'Trece', 'Catorce', 'Quince', 'Dieciséis', 'Diecisiete', 'Dieciocho', 'Diecinueve', 
        'Veinte', 'Veintiuno', 'Veintidós', 'Veintitrés', 'Veinticuatro', 'Veinticinco', 'Veintiséis', 'Veintisiete', 'Veintiocho', 'Veintinueve'
    ];
    const Decenas = ['', '', '', 'Treinta', 'Cuarenta', 'Cincuenta', 'Sesenta', 'Setenta', 'Ochenta', 'Noventa'];
    const Centenas = ['', 'Ciento', 'Doscientos', 'Trescientos', 'Cuatrocientos', 'Quinientos', 'Seiscientos', 'Setecientos', 'Ochocientos', 'Novecientos'];

    if (num === 100) return "Cien"; 
    if (num < 30) return Unidades[num];
    if (num < 100) return Decenas[Math.floor(num / 10)] + (num % 10 > 0 ? " y " + Unidades[num % 10] : "");
    if (num < 1000) return Centenas[Math.floor(num / 100)] + (num % 100 > 0 ? " " + numeroUnidades(num % 100) : "");
    if (num < 1000000) { 
        let m = Math.floor(num / 1000), resto = num % 1000; 
        return (m === 1 ? "Un Mil" : numeroUnidades(m) + " Mil") + (resto > 0 ? " " + numeroUnidades(resto) : ""); 
    }
    return num.toString();
}
