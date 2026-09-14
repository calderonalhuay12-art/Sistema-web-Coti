// ===== PERSISTENCIA EN NAVEGADOR (localStorage) =====
const LOCAL_STORAGE_KEY = 'cotizador_metrologico_v10_5';

// ===== DATOS GLOBALES =====
let itemsData = [{ equipo: "Pipeta", servicioTitulo: "CALIBRACIÓN DE MATERIAL VOLUMÉTRICO DE VIDRIO Y PLÁSTICO", descripcionDetalle: "Pipeta de 10 mL", alcance: "10 mL", marca: "No Indica", modelo: "No Indica", serie: "No Indica", codigo: "No Indica", procedimiento: "PC-015: Procedimiento de calibración para Material volumétrico de vidrio y plástico. Edición 5ta: 2017 INACAL", puntos: "10%, 50% Y 100%", lugar: "Laboratorio", tipo: "ACREDITADO", valorUnitario: 200, cantidad: 1, descuentoMonto: 0, tipoServicio: "calibracion", actividades: [] }];
let historialCotizaciones = [], puntosModalTemp = [], editingIndex = -1, clienteOculto = false;
let indiceEditandoHistorial = null;
let nroOriginalEditando = null;
let actividadesTemp = [];
let catalogoActividades = {};
let historialOT = [];
let editingOTIndex = -1;
let fechaCompromisoActual = '';
let asesorSeleccionado = 'Ing. Januusz Ruiz';

