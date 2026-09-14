// ===== INCERTIDUMBRE =====
const incertidumbrePorEquipo = {
    "Medidor de pH (pH Meter)": "0.012 pH",
    "Medidor de Conductividad": "0.62 µS/cm",
    "Medidor de Oxígeno Disuelto": "0.11 mg/L",
    "Turbidímetro": "0.061 NTU",
    "Pie de Rey (Calibrador)": "0.01 mm",
    "Micrómetro de Exteriores": "0.58 µm",
    "Comparador de Carátula": "0.01 mm",
    "Cinta Métrica": "0.26 mm",
    "Flexómetro": "0.26 mm",
    "Tamiz": "1.7 µm",
    "Malla de Ensayo": "1.7 µm",
    "Manómetro": "0.012 bar",
    "Vacuómetro": "0.012 bar",
    "Manovacuómetro": "0.012 bar",
    "Barómetro": "0.32 mbar",
    "Anemómetro": "0.12 m/s",
    "Flujómetro de Gas": "0.003 L/min",
    "Muestreador Hi-Vol": "0.03 m³/min",
    "Pipeta": "0.0012 mL",
    "Bureta": "0.0012 mL",
    "Fiola": "0.0034 mL",
    "Probeta": "0.012 mL",
    "Pipeta de Pistón": "0.074 µL",
    "Micropipeta": "0.074 µL",
    "Vaso de Precipitado": "0.012 mL",
    "Dispensador": "0.0012 mL",
    "Picnómetro": "0.001 mL",
    "Matraz": "0.0034 mL",
    "Propipeta": "0.0012 mL",
    "Balanza Clase I (Analítica)": "0.001 g",
    "Balanza Clase II (Precisión)": "0.01 g",
    "Balanza Clase III/IV (Industrial)": "0.05 g",
    "Pesa M1": "1.1 mg",
    "Pesa M2": "21 mg",
    "Pesa F1": "0.013 mg",
    "Pesa F2": "0.013 mg",
    "Máquina de Ensayo (Tensión/Compresión)": "0.041 %",
    "Dinamómetro": "0.041 %",
    "Termohigrómetro": "0.3 °C, 1.8 %RH",
    "Termómetro Digital": "0.027 °C",
    "Termómetro Infrarrojo": "1.6 °C",
    "Autoclave": "0.12 °C",
    "Baño María": "0.1 °C",
    "Baños Termostáticos": "0.1 °C",
    "Estufa": "0.1 °C",
    "Conservadora": "0.1 °C",
    "Refrigeradora": "0.1 °C",
    "Congelador": "0.1 °C",
    "Horno": "0.1 °C",
    "Incubadora": "0.1 °C",
    "Cronómetro": "0.06 s",
    "Contador de Tiempo": "0.06 s",
    "Tacómetro": "2.2 rpm",
    "Centrífuga": "2.2 rpm",
    "Refractómetro": "0.12 °Brix",
    "Espectrofotómetro": "0.21 nm"
};

// ===== CATÁLOGOS COMPLETOS =====
const catalogData = {
    "Química": ["Medidor de pH (pH Meter)", "Medidor de Conductividad", "Medidor de Oxígeno Disuelto", "Turbidímetro"],
    "Dimensional": ["Pie de Rey (Calibrador)", "Micrómetro de Exteriores", "Comparador de Carátula", "Cinta Métrica", "Flexómetro", "Tamiz", "Malla de Ensayo"],
    "Mecánica": ["Manómetro", "Vacuómetro", "Manovacuómetro", "Barómetro", "Anemómetro", "Flujómetro de Gas", "Muestreador Hi-Vol"],
    "Volumen": ["Pipeta", "Bureta", "Fiola", "Probeta", "Pipeta de Pistón", "Micropipeta", "Vaso de Precipitado", "Dispensador", "Picnómetro", "Matraz", "Propipeta"],
    "Masa/Fuerza": ["Balanza Clase I (Analítica)", "Balanza Clase II (Precisión)", "Balanza Clase III/IV (Industrial)", "Pesa M1", "Pesa M2", "Pesa F1", "Pesa F2", "Máquina de Ensayo (Tensión/Compresión)", "Dinamómetro"],
    "Termodinámica": ["Termohigrómetro", "Termómetro Digital", "Termómetro Infrarrojo", "Autoclave", "Baño María", "Baños Termostáticos", "Estufa", "Conservadora", "Refrigeradora", "Congelador", "Horno", "Incubadora"],
    "Tiempo/Frecuencia": ["Cronómetro", "Contador de Tiempo", "Tacómetro", "Centrífuga"],
    "Óptica": ["Refractómetro", "Espectrofotómetro"]
};

const marcasPorEquipo = {
    "Termómetro Digital": ["TESTO", "TRACEABLE", "HANNA INSTRUMENTS", "ELITECH", "BOECO", "EUROLAB", "EXTECH", "PERUTEST S.A.C", "ISOLAB"],
    "Termohigrómetro": ["TESTO", "TRACEABLE", "HANNA INSTRUMENTS", "ELITECH", "BOECO", "EUROLAB", "EXTECH"],
    "Termómetro Infrarrojo": ["TESTO", "FLUKE", "EXTECH", "LUTRON", "TRACEABLE"],
    "Estufa": ["MEMMERT", "BINDER", "YAMATO", "BOECO", "BIOBASE", "THERMOLYNE"], "Horno": ["MEMMERT", "BINDER", "YAMATO", "BOECO", "BIOBASE", "THERMOLYNE"], "Incubadora": ["MEMMERT", "BINDER", "YAMATO", "BOECO", "BIOBASE", "THERMOLYNE"],
    "Baño María": ["BOECO", "EUROLAB", "MEMMERT", "BIOBASE", "JULABO"], "Baños Termostáticos": ["BOECO", "EUROLAB", "MEMMERT", "BIOBASE", "JULABO"],
    "Autoclave": ["BIOBASE", "YAMATO", "RAYPA", "BOECO"], "Conservadora": ["INDURAMA", "MABE", "LG", "SAMSUNG", "THERMO SCIENTIFIC"], "Refrigeradora": ["INDURAMA", "MABE", "LG", "SAMSUNG", "THERMO SCIENTIFIC"],
    "Congelador": ["INDURAMA", "MABE", "BIOBASE", "THERMO SCIENTIFIC"], "Balanza Clase I (Analítica)": ["OHAUS", "SARTORIUS", "METTLER TOLEDO", "KERN", "A&D COMPANY"],
    "Balanza Clase II (Precisión)": ["OHAUS", "A&D COMPANY", "NAGATA", "EXCELL", "KERN", "HENKEL"], "Balanza Clase III/IV (Industrial)": ["OHAUS", "NAGATA", "EXCELL", "HENKEL", "CAMRY", "A&D COMPANY"],
    "Pesa M1": ["OHAUS", "KERN", "METTLER TOLEDO", "SARTORIUS"], "Pesa M2": ["OHAUS", "KERN", "METTLER TOLEDO", "SARTORIUS"], "Pesa F1": ["OHAUS", "KERN", "METTLER TOLEDO", "SARTORIUS"], "Pesa F2": ["OHAUS", "KERN", "METTLER TOLEDO", "SARTORIUS"], "Máquina de Ensayo (Tensión/Compresión)": ["CHATILLON", "MARK-10", "PCE INSTRUMENTS", "SUNDOO", "LLOYD INSTRUMENTS"],
    "Dinamómetro": ["CHATILLON", "MARK-10", "LUTRON", "PCE INSTRUMENTS", "SUNDOO"], "Pie de Rey (Calibrador)": ["MITUTOYO", "INSIZE", "FOWLER", "DASQUA", "VOGEL"],
    "Micrómetro de Exteriores": ["MITUTOYO", "INSIZE", "FOWLER", "DASQUA", "VOGEL"], "Comparador de Carátula": ["MITUTOYO", "INSIZE", "FOWLER", "DASQUA"],
    "Cinta Métrica": ["STANLEY", "LUFKIN", "TRUPER", "MITUTOYO"], "Flexómetro": ["STANLEY", "LUFKIN", "TRUPER", "MITUTOYO"], "Tamiz": ["HAVER & BOECKER", "ADVANTECH", "TYLER", "INSIZE", "RETSCH", "PINZUAR", "IMPACT", "DUAL MANUFACTURING CO", "FORNEY", "ELE INTERNATIONAL"], "Malla de Ensayo": ["HAVER & BOECKER", "ADVANTECH", "TYLER", "INSIZE", "RETSCH", "PINZUAR", "IMPACT", "DUAL MANUFACTURING CO", "FORNEY", "ELE INTERNATIONAL"],
    "Manómetro": ["WIKA", "ASHCROFT", "EXTECH", "ADDITEL", "FLUKE", "DWYER"], "Vacuómetro": ["WIKA", "ASHCROFT", "EXTECH", "ADDITEL", "FLUKE"], "Manovacuómetro": ["WIKA", "ASHCROFT", "EXTECH", "ADDITEL", "FLUKE"],
    "Barómetro": ["TESTO", "TRACEABLE", "VAISALA", "LUTRON"], "Anemómetro": ["TESTO", "EXTECH", "LUTRON", "TSI", "DWYER"], "Flujómetro de Gas": ["TSI", "ALBORG", "BROOKS", "DWYER"], "Muestreador Hi-Vol": ["TISCH", "ANDERSEN", "KIMOTO"],
    "Pipeta": ["BRAND", "EPPENDORF", "BOECO", "GILSON", "KIMAX", "PYREX", "ISOLAB GERMANY", "HIRSCHMANN"], "Bureta": ["BRAND", "BOECO", "KIMAX", "PYREX", "ISOLAB GERMANY", "HIRSCHMANN"],
    "Fiola": ["BRAND", "KIMAX", "PYREX", "ISOLAB GERMANY", "BOROSIL", "KLASS"], "Probeta": ["BRAND", "KIMAX", "PYREX", "ISOLAB GERMANY", "BOROSIL", "BOECO", "LMS GERMANY"],
    "Pipeta de Pistón": ["EPPENDORF", "GILSON", "BRAND", "BOECO", "SOCOREX", "THERMO SCIENTIFIC"], "Micropipeta": ["EPPENDORF", "GILSON", "BRAND", "BOECO", "SOCOREX", "THERMO SCIENTIFIC"], "Vaso de Precipitado": ["PYREX", "KIMAX", "ISOLAB GERMANY", "BOROSIL"],
    "Dispensador": ["BRAND", "BOECO", "EPPENDORF", "VITLAB"], "Picnómetro": ["KIMAX", "PYREX", "ISOLAB GERMANY"], "Matraz": ["PYREX", "KIMAX", "ISOLAB GERMANY", "BOROSIL"], "Propipeta": ["BOECO", "BRAND", "ISOLAB GERMANY", "DLAB"],
    "Medidor de pH (pH Meter)": ["HANNA INSTRUMENTS", "OAKTON", "HACH", "METTLER TOLEDO", "HORIBA", "WTW", "THERMO SCIENTIFIC"], "Medidor de Conductividad": ["HANNA INSTRUMENTS", "OAKTON", "HACH", "METTLER TOLEDO", "WTW"],
    "Medidor de Oxígeno Disuelto": ["HANNA INSTRUMENTS", "YSI", "HACH", "EXTECH"], "Turbidímetro": ["HACH", "HANNA INSTRUMENTS", "LAMOTTE"],
    "Cronómetro": ["TRACEABLE", "CASIO", "EXTECH", "LUTRON"], "Contador de Tiempo": ["TRACEABLE", "CASIO", "EXTECH", "LUTRON"], "Tacómetro": ["LUTRON", "EXTECH", "FLUKE", "AMPROBE"], "Centrífuga": ["LUTRON", "EXTECH", "FLUKE", "AMPROBE"],
    "Refractómetro": ["ATAGO", "MILWAUKEE", "HANNA INSTRUMENTS", "KERN"], "Espectrofotómetro": ["SHIMADZU", "THERMO SCIENTIFIC", "PERKINELMER", "JENWAY", "HACH"]
};

const brandCatalog = {
    "Química": ["HANNA INSTRUMENTS", "OAKTON", "HACH", "METTLER TOLEDO", "HORIBA", "WTW", "THERMO SCIENTIFIC", "Ohaus"],
    "Dimensional": ["MITUTOYO", "STARRETT", "INSIZE", "FOWLER", "TESA", "Mahr", "STANLEY", "LUFKIN"],
    "Mecánica": ["WIKA", "ASHCROFT", "FLUKE", "DRUCK", "ADDITEL", "TESTO", "DWYER", "VAISALA", "TSI"],
    "Volumen": ["BRAND", "EPPENDORF", "BOECO", "GILSON", "KIMAX", "PYREX", "ISOLAB GERMANY", "HIRSCHMANN", "SOCOREX", "VITLAB"],
    "Masa/Fuerza": ["OHAUS", "SARTORIUS", "METTLER TOLEDO", "KERN", "A&D COMPANY", "NAGATA", "EXCELL", "CHATILLON", "MARK-10"],
    "Termodinámica": ["TESTO", "FLUKE", "CONTROL COMPANY (TRACEABLE)", "HANNA INSTRUMENTS", "ELITECH", "ISOTECH", "MEMMERT", "BINDER", "THERMO SCIENTIFIC", "YAMATO"],
    "Tiempo/Frecuencia": ["TRACEABLE", "CASIO", "EXTECH", "FLUKE", "LUTRON", "AMPROBE"], "Óptica": ["ATAGO", "MILWAUKEE", "SHIMADZU", "THERMO SCIENTIFIC", "PERKINELMER", "JENWAY"]
};

const unitsCatalog = {
    "Masa/Fuerza": ["g", "kg", "t", "mg", "N", "kN"], "Mecánica": ["mbar", "psi", "bar", "Pa", "kPa", "mmHg", "inHg", "m³/h", "L/min"],
    "Termodinámica": ["°C", "°F", "%HR", "K"], "Volumen": ["µL", "mL", "L" , "%"], "Dimensional": ["mm", "cm", "m", "in", "µm"],
    "Química": ["pH", "µS/cm", "mS/cm", "NTU", "mg/L"], "Tiempo/Frecuencia": ["s", "min", "h", "RPM", "Hz"], "Óptica": ["%Brix", "nm", "ABS"]
};

const alcancePorEquipo = {
    "Medidor de pH (pH Meter)": [{ label: "Rango de pH", units: ["pH"], default: "pH" }], "Medidor de Conductividad": [{ label: "Conductividad", units: ["µS/cm", "mS/cm"], default: "µS/cm" }],
    "Medidor de Oxígeno Disuelto": [{ label: "Oxígeno Disuelto", units: ["mg/L", "%"], default: "mg/L" }], "Turbidímetro": [{ label: "Turbidez", units: ["NTU"], default: "NTU" }],
    "Pie de Rey (Calibrador)": [{ label: "Longitud", units: ["mm", "cm", "m", "in"], default: "mm" }], "Micrómetro de Exteriores": [{ label: "Longitud", units: ["mm", "cm", "in"], default: "mm" }],
    "Comparador de Carátula": [{ label: "Recorrido", units: ["mm", "µm"], default: "mm" }], "Cinta Métrica": [{ label: "Longitud", units: ["m", "cm", "mm"], default: "m" }], "Flexómetro": [{ label: "Longitud", units: ["m", "cm", "mm"], default: "m" }],
    "Tamiz": [{ label: "Abertura de malla", units: ["mm", "µm"], default: "µm" }], "Malla de Ensayo": [{ label: "Abertura de malla", units: ["mm", "µm"], default: "µm" }], "Manómetro": [{ label: "Presión", units: ["mbar", "psi", "bar", "Pa", "kPa", "mmHg", "inHg"], default: "psi" }],
    "Vacuómetro": [{ label: "Presión (Vacío)", units: ["mbar", "psi", "bar", "Pa", "kPa", "mmHg", "inHg"], default: "mmHg" }], "Manovacuómetro": [{ label: "Presión", units: ["mbar", "psi", "bar", "Pa", "kPa", "mmHg", "inHg"], default: "psi" }],
    "Barómetro": [{ label: "Presión Atmosférica", units: ["mbar", "hPa", "mmHg", "inHg"], default: "mbar" }], "Anemómetro": [{ label: "Velocidad de Aire", units: ["m/s", "km/h", "ft/min"], default: "m/s" }],
    "Flujómetro de Gas": [{ label: "Flujo", units: ["m³/h", "L/min"], default: "m³/h" }], "Muestreador Hi-Vol": [{ label: "Flujo", units: ["m³/h", "L/min"], default: "m³/h" }],
    "Pipeta": [{ label: "Volumen", units: ["µL", "mL", "L"], default: "mL" }], "Bureta": [{ label: "Volumen", units: ["mL", "L"], default: "mL" }],
    "Fiola": [{ label: "Volumen", units: ["mL", "L"], default: "mL" }], "Probeta": [{ label: "Volumen", units: ["mL", "L"], default: "mL" }],
    "Pipeta de Pistón": [{ label: "Volumen", units: ["µL", "mL"], default: "µL" }], "Micropipeta": [{ label: "Volumen", units: ["µL", "mL"], default: "µL" }], "Vaso de Precipitado": [{ label: "Volumen", units: ["mL", "L"], default: "mL" }],
    "Dispensador": [{ label: "Volumen", units: ["mL", "L"], default: "mL" }], "Picnómetro": [{ label: "Volumen", units: ["mL"], default: "mL" }],
    "Matraz": [{ label: "Volumen", units: ["mL", "L"], default: "mL" }], "Propipeta": [{ label: "Volumen", units: ["mL", "L"], default: "mL" }],
    "Balanza Clase I (Analítica)": [{ label: "Capacidad", units: ["g", "kg", "mg"], default: "g" }], "Balanza Clase II (Precisión)": [{ label: "Capacidad", units: ["g", "kg"], default: "kg" }],
    "Balanza Clase III/IV (Industrial)": [{ label: "Capacidad", units: ["kg", "t"], default: "kg" }], "Pesa M1": [{ label: "Masa", units: ["mg", "g", "kg"], default: "g" }], "Pesa M2": [{ label: "Masa", units: ["mg", "g", "kg"], default: "g" }], "Pesa F1": [{ label: "Masa", units: ["mg", "g", "kg"], default: "g" }],
    "Pesa F2": [{ label: "Masa", units: ["mg", "g", "kg"], default: "g" }],
    "Máquina de Ensayo (Tensión/Compresión)": [{ label: "Fuerza", units: ["N", "kN"], default: "kN" }], "Dinamómetro": [{ label: "Fuerza", units: ["N", "kN"], default: "N" }],
    "Termohigrómetro": [{ label: "Temperatura", units: ["°C", "°F", "K"], default: "°C" }, { label: "Humedad Relativa", units: ["%HR"], default: "%HR" }],
    "Termómetro Digital": [{ label: "Temperatura", units: ["°C", "°F", "K"], default: "°C" }], "Termómetro Infrarrojo": [{ label: "Temperatura", units: ["°C", "°F"], default: "°C" }],
    "Autoclave": [{ label: "Temperatura", units: ["°C"], default: "°C" }, { label: "Presión", units: ["bar", "psi", "kPa"], default: "bar" }],
    "Baño María": [{ label: "Temperatura", units: ["°C"], default: "°C" }], "Baños Termostáticos": [{ label: "Temperatura", units: ["°C"], default: "°C" }],
    "Estufa": [{ label: "Temperatura", units: ["°C"], default: "°C" }], "Horno": [{ label: "Temperatura", units: ["°C"], default: "°C" }], "Incubadora": [{ label: "Temperatura", units: ["°C"], default: "°C" }],
    "Conservadora": [{ label: "Temperatura", units: ["°C"], default: "°C" }], "Refrigeradora": [{ label: "Temperatura", units: ["°C"], default: "°C" }], "Congelador": [{ label: "Temperatura", units: ["°C"], default: "°C" }],
    "Cronómetro": [{ label: "Tiempo", units: ["s", "min", "h"], default: "min" }], "Contador de Tiempo": [{ label: "Tiempo", units: ["s", "min", "h"], default: "min" }], "Tacómetro": [{ label: "Velocidad", units: ["RPM", "Hz"], default: "RPM" }], "Centrífuga": [{ label: "Velocidad", units: ["RPM", "Hz"], default: "RPM" }],
    "Refractómetro": [{ label: "Índice / Concentración", units: ["°Brix", "nD"], default: "°Brix" }], "Espectrofotómetro": [{ label: "Longitud de Onda", units: ["nm"], default: "nm" }]
};

let proceduresData = {
    "Química": [{ code: "PC-020", desc: "Procedimiento para la Calibración de Medidores de pH (2nd Ed. 2017)" }, { code: "PC-022", desc: "Procedimiento para la calibración de medidores de conductividad electrolítica (Conductimetros). 2da Edición. 2023. INACAL -DA" }, { code: "MV-LQ-01", desc: "Procedimiento para la calibración de medidores de Oxigeno disuelto.2025" }, { code: "MV-LQ-05", desc: "Procedure for calibrating turbidimeters. rev. 00" }],
    "Dimensional": [{ code: "PC-012", desc: "Procedimiento de calibración de Pie de Rey 5ta Edición 2012" }, { code: "PC-014", desc: "Procedimiento para la calibración de comparadores utilizando bloques patrón de longitud 3ra. Edición 2019" }, { code: "DI-005", desc: "Procedimiento para la calibración de micrometros de dos contactos Edición digital 1" }, { code: "MV-LD-01", desc: "Procedimiento para la Calibración de Cintas métricas según OIML r35 clase II y III" }, { code: "MV-LD-02", desc: "Calibration procedure for sieves.2023" }],
    "Mecánica": [{ code: "ME-003", desc: "Procedimiento para la calibración de manómetros, vacuómetros y manovacuómetros Edición digital 3 -2019." }, { code: "PC-024", desc: "Calibración de Instrumentos de medición - Presión absoluta" }, { code: "ME-020", desc: "Procedimiento para la calibración de medidores de presión diferencial" }, { code: "ME-021", desc: "Procedimiento para la calibración de columnas liquidas (manométricas y barométricas). Edición DIGITAL 2, 2020. CEM-España." }, { code: "MV-LM-01", desc: "Procedimiento de Calibración de Muestreadores de Partículas de Alto Volumen (HIVOL)" }, { code: "MV-LM-02", desc: "Procedure for the calibration of anemometers" }, { code: "MV-LM-03", desc: "Procedimiento de Calibración de calibradores de flujo variable de alto volumen (VARIFLOW)" }, { code: "ME-009", desc: "Procedimiento para la calibracion de Caudalimetros de Gases- CEM españa.2008" }],
    "Volumen": [{ code: "PC-015", desc: "Procedimiento de calibración para Material volumétrico de vidrio y plástico. Edición 5ta: 2017 INACAL" }, { code: "PC-027", desc: "Procedimiento para la calibración de pipetas de pistón. Primera Edición – Marzo 2019" }, { code: "MV-LCF-03", desc: "Procedimiento de calibración para medidores volumétricos metálicos (método volumétrico) .2020" }, { code: "MV-LCF-04", desc: "Calibration for metallic volumetric meters standards" }],
    "Masa/Fuerza": [{ code: "PC-008", desc: "Procedimiento para la calibración de pesas de clase de exactitud M1-2, M2, M2-3 y M3 DE LA NMP 004:2007" }, { code: "PC-011", desc: "Procedimiento para la calibracion de balanzas de funcionamiento no automatico clase I y clase II INDECOPI 4ta. Ed. Abril 2010" }, { code: "PC-001", desc: "Procedimiento para la calibracion de instrumentos de pesaje de funcionamiento no automatico clase III y IV . INACAL 1ra Edicion. Mayo 2019" }, { code: "PC-016", desc: "Procedure for calibrating precision weights. INDECOPI SNM, 2nd Edition, 2015" }, { code: "ISO 7500-1", desc: "ISO 7500-1:2018 Metallic materials — Calibration and verification of static uniaxial testing machines" }],
    "Termodinámica": [{ code: "TH-001", desc: "Procedure for the calibration of digital thermometers 2nd edition, 2019" }, { code: "TH-002", desc: "Procedure for the calibration of infrared radiation thermometers. 1st ed, digital.CEM-Spain" }, { code: "PC-019", desc: "Procedimiento para la calibración de Baños Termostáticos. INDECOPI/SNM Primera Edición – Abril 2009" }, { code: "PC-018", desc: "Procedimiento para la calibración de medios isotermos con aire como medio termostático. 2da. Edición 2009 INDECOPI/SNM" }, { code: "PC-006", desc: "Procedimiento para la Calibracion de Autoclave. INDECOPI 2da. Edición 2008" }, { code: "PC-026", desc: "Procedimiento para la calibración de hidrómetros y termómetros ambientales. 2019" }],
    "Tiempo/Frecuencia": [{ code: "MV-LTF-01", desc: "Procedure for calibrating time counters" }, { code: "MV-LTF-02", desc: "Procedure for the calibration of rotating equipment" }],
    "Óptica": [{ code: "MV-LO-01", desc: "Procedure for calibrating refractometers. rev. 00" }, { code: "M6-01-F-01", desc: "M6-01-F-01: UV-Vis spectrophotometer calibration guide, rev. 01:2021 INM" }]
};

const procedimientoPorEquipo = {
    "Medidor de pH (pH Meter)": "PC-020", "Medidor de Conductividad": "PC-022", "Medidor de Oxígeno Disuelto": "MV-LQ-01", "Turbidímetro": "MV-LQ-05",
    "Pie de Rey (Calibrador)": "PC-012", "Micrómetro de Exteriores": "DI-005", "Cinta Métrica": "MV-LD-01", "Flexómetro": "MV-LD-01", "Tamiz": "MV-LD-02", "Malla de Ensayo": "MV-LD-02",
    "Manómetro": "ME-003", "Vacuómetro": "ME-003", "Manovacuómetro": "ME-003", "Barómetro": "PC-024", "Anemómetro": "MV-LM-02", "Flujómetro de Gas": "ME-009", "Muestreador Hi-Vol": "MV-LM-01",
    "Pipeta": "PC-015", "Bureta": "PC-015", "Fiola": "PC-015", "Probeta": "PC-015", "Pipeta de Pistón": "PC-027", "Micropipeta": "PC-027", "Vaso de Precipitado": "PC-015", "Dispensador": "PC-015", "Picnómetro": "PC-015", "Matraz": "PC-015",
    "Balanza Clase I (Analítica)": "PC-011", "Balanza Clase II (Precisión)": "PC-011", "Balanza Clase III/IV (Industrial)": "PC-001", "Pesa M1": "PC-008", 
    "Pesa M2": "PC-008", "Pesa F1": "PC-016", "Pesa F2": "PC-016", "Máquina de Ensayo (Tensión/Compresión)": "ISO 7500-1", "Dinamómetro": "ISO 7500-1",
    "Termohigrómetro": "PC-026", "Termómetro Digital": "TH-001", "Termómetro Infrarrojo": "TH-002", "Autoclave": "PC-006", "Baño María": "PC-019", "Baños Termostáticos": "PC-019", "Estufa": "PC-018", "Horno": "PC-018", "Incubadora": "PC-018", "Conservadora": "PC-018", "Refrigeradora": "PC-018", "Congelador": "PC-018",
    "Cronómetro": "MV-LTF-01", "Contador de Tiempo": "MV-LTF-01", "Tacómetro": "MV-LTF-02", "Centrífuga": "MV-LTF-02", "Refractómetro": "MV-LO-01", "Espectrofotómetro": "M6-01-F-01"
};

