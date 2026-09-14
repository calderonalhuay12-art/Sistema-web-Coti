// ===== INICIALIZACIÓN Y CARGA AUTOLOCAL =====
window.onload = () => {
    cargarEstadoLocal();
 cargarTodosLosCampos();
    obtenerTokenAPI();
    updateDoc();
    renderTables();
    renderAlcanceFields();
    toggleViaticos();
    cambiarTipoServicio();
    inicializarOT();
    actualizarSelectHistorial();
    if (!document.getElementById('ot-numero').value) {
        document.getElementById('ot-numero').value = '001-' + new Date().getFullYear();
    }
};
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
