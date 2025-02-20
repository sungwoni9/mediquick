document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('sidebar-toggle').addEventListener('click', function () {
        const sidebar = document.getElementById('sidebar');
        const content = document.getElementById('nav-content');
        sidebar.classList.toggle('sidebar-closed');
        content.classList.toggle('sidebar-closed');
    });
});