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
