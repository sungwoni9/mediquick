    document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('btn-search').addEventListener('click', updateTable);
});

    function updateTable() {
    const logSelect = document.getElementById("log-select");
    const logTableBody = document.getElementById("log-table-body");

    const logs = {
    login: [
{ date: '2025-02-18', content: 'test A 로그인' },
{ date: '2025-02-19', content: 'test B 로그인' }
    ],
    logout: [
{ date: '2025-02-18', content: 'test A 로그아웃' },
{ date: '2025-02-19', content: 'test B 로그아웃' }
    ],
    view: [
{ date: '2025-02-18', content: 'test 영상 1 조회' },
{ date: '2025-02-19', content: 'test 영상 2 조회' }
    ],
    medical: [
{ date: '2025-02-18', content: 'test 진료 기록 1 조회' },
{ date: '2025-02-19', content: 'test 진료 기록 2 조회' }
    ],
    admin: [
{ date: '2025-02-18', content: 'test 관리자 작업 1' },
{ date: '2025-02-19', content: 'test 관리자 작업 2' }
    ]
};

    const selectedLog = logSelect.value;
    const selectedLogData = logs[selectedLog] || [];

    logTableBody.innerHTML = "";

    selectedLogData.forEach(log => {
    const row = document.createElement("tr");
    const dateCell = document.createElement("td");
    const contentCell = document.createElement("td");

    dateCell.textContent = log.date;
    contentCell.textContent = log.content;

    row.appendChild(dateCell);
    row.appendChild(contentCell);
    logTableBody.appendChild(row);
});
}
