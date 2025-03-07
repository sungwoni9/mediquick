document.addEventListener('DOMContentLoaded', function () {

    const logsPerPage = 10;
    let currentPage = 1;
    let totalPages = 0;

    const TableBody = document.getElementById("user-table-body");
    let filteredRows = Array.from(TableBody.querySelectorAll('tr'));

    function showPage(page) {
        const start = (page - 1) * logsPerPage;
        const end = start + logsPerPage;

        filteredRows.forEach((row, index) => {
            if (index >= start && index < end) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });

        filteredRows.forEach(row => TableBody.appendChild(row));
        totalPages = Math.ceil(filteredRows.length / logsPerPage);

        document.getElementById("prev-btn").style.display = page === 1 ? 'none' : 'inline-block';
        document.getElementById("next-btn").style.display = page === totalPages ? 'none' : 'inline-block';

        document.getElementById("page-info").textContent = `${page}/${totalPages}`;
    }

    document.getElementById("prev-btn").addEventListener("click", function () {
        if (currentPage > 1) {
            currentPage--;
            showPage(currentPage);
        }
    });

    document.getElementById("next-btn").addEventListener("click", function () {
        if (currentPage < totalPages) {
            currentPage++;
            showPage(currentPage);
        }
    });

    showPage(1);
});