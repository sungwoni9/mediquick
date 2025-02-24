document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('btn-search').addEventListener('click', updateTable);
    document.getElementById('sort-order').addEventListener('change', updateTable);

    const logsPerPage = 10;
    let currentPage = 1;
    let totalPages = 0;

    const logTableBody = document.getElementById("log-table-body");
    let allRows = Array.from(logTableBody.querySelectorAll('tr'));
    let filteredRows = allRows;

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

        document.getElementById("prev-btn").disabled = page === 1;
        document.getElementById("next-btn").disabled = page === totalPages;
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

    function updateTable() {
        const logSelect = document.getElementById("log-select");
        const selectedLog = logSelect.value;
        const sortOrder = document.getElementById("sort-order").value;

        filteredRows = allRows.filter(row => {
            const logTypeCell = row.querySelector('#logType');
            const logType = logTypeCell.textContent;
            return selectedLog === "" || selectedLog === logType;
        });

        filteredRows.sort((a, b) => {
            const dateA = new Date(a.querySelector('[data-log-date]').getAttribute('data-log-date'));
            const dateB = new Date(b.querySelector('[data-log-date]').getAttribute('data-log-date'));
            return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
        });

        allRows.forEach(row => row.style.display = 'none');

        filteredRows.forEach(row => logTableBody.appendChild(row));

        totalPages = Math.ceil(filteredRows.length / logsPerPage);
        currentPage = 1;
        showPage(currentPage);
    }

    updateTable();
});
