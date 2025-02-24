document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('btn-search').addEventListener('click', updateTable);
});

function updateTable() {
    const logSelect = document.getElementById("log-select");
    const logTableBody = document.getElementById("log-table-body");
    const selectedLog = logSelect.value;

    const rows = logTableBody.querySelectorAll('tr');

    rows.forEach(row => {
        const logTypeCell = row.querySelector('#logType');
        const logType = logTypeCell.textContent;

        if (selectedLog === "" || selectedLog === logType) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}
