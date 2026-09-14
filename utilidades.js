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

