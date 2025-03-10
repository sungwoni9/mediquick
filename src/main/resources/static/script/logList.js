document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('btn-search').addEventListener('click', updateTable);
    document.getElementById('sort-order').addEventListener('change', updateTable);

    let toggleRecord = false;
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

    function updateTable() {
        const logSelect = document.getElementById("log-select");
        const selectedLog = logSelect.value;
        const sortOrder = document.getElementById("sort-order").value;

        filteredRows = allRows.filter(row => {
            const logTypeCell = row.querySelector('#logType');
            const logType = logTypeCell.textContent;
            return selectedLog === "" || selectedLog === "all" || selectedLog === logType;
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
        movePageByStudyKey();
    }

    function movePageByStudyKey() {
        const logCodes = document.querySelectorAll(".log-code");

        logCodes.forEach(logCode => {
            logCode.addEventListener("click", async () => {
                const logType = logCode.getAttribute("data-log-type");
                const studyKey = logCode.getAttribute("data-study-key");

                if (logType === "VIEW_VIDEO") {
                    window.location.href = `/viewer?studyKey=${studyKey}`;
                } else if (logType === "VIEW_RECORD") {
                    const recodeForm = document.querySelector("#recode");

                    if (!recodeForm) {
                        alert("진료 기록 창을 찾을 수 없습니다.");
                        return;
                    }

                    if (toggleRecord) {
                        recodeForm.style.display = "none";
                        toggleRecord = false;
                    } else {
                        await fetchPatientData(studyKey);
                        await fetchFindingData(studyKey);
                        recodeForm.style.display = "block";
                        toggleRecord = true;
                    }
                }
            });
        });
    }

    function formatDate(dateString) {
        return `${dateString.slice(0, 4)}-${dateString.slice(4, 6)}-${dateString.slice(6, 8)}`;
    }

    async function fetchPatientData(studyKey) {
        try {
            const response = await fetch(`/report/patient/${studyKey}`);
            if (!response.ok) {
                console.log("환자정보를 찾을 수 없습니다.");
                return;
            }
            const data = await response.json();
            document.getElementById("chartNo").innerText = data.pid + " / ";
            document.getElementById("patientName").innerText = data.pname + " / ";
            document.getElementById("patientBirth").innerText = formatDate(data.pbirthdatetime) + " / ";
            document.getElementById("patientGender").innerText = data.psex;
        } catch (error) {
            console.error("오류 발생:", error.message);
        }
    }

    async function fetchFindingData(studyKey) {
        const response = await fetch(`/report/${studyKey}`);
        if (!response.ok) {
            alert("판독 소견서가 존재하지 않습니다.");
            return false;
        }

        const data = await response.json();
        // 판독 레벨
        let urgencyText = '';
        let textColor = '';
        if (data.urgencyLevel === 1) {
            urgencyText = '일반';
            textColor = 'green';
        } else if (data.urgencyLevel === 2) {
            urgencyText = '중요';
            textColor = 'orange';
        } else if (data.urgencyLevel === 3) {
            urgencyText = '긴급';
            textColor = 'red';
        }
        // 보고서 상태
        let reportStatus = '';
        if (data.reportStatus === 1) {
            reportStatus = '초안';
        } else if (data.reportStatus === 2) {
            reportStatus = '수정 필요';
        } else if (data.reportStatus === 3) {
            reportStatus = '판독 완료';
        }
        // 보고서 날짜
        const formattedDate = new Date(data.regDate).toISOString().split('T')[0];
        document.getElementById("reader").textContent = data.radiologistName;
        document.getElementById("hospital").textContent = data.institutionName;
        document.getElementById("report-level").textContent = urgencyText;
        const urgencyTextEl = document.getElementById("report-level");
        urgencyTextEl.textContent = urgencyText;
        urgencyTextEl.style.color = textColor;
        document.getElementById("normal-status").textContent = data.normal ? "정상" : "비정상";
        document.getElementById("additional-exam-needed").textContent = data.recommendedStudies ? "필요" : "불필요";
        document.getElementById("lesion-location").textContent = data.lesionLocation;
        document.getElementById("lesion-size").textContent = data.lesionSize;
        document.getElementById("lesion-count").textContent = data.lesionCount;
        document.getElementById("morphological-features").textContent = data.morphology;
        document.getElementById("special-findings").textContent = data.additionalFindings;
        document.getElementById("suspected-diagnosis").textContent = data.possibleDiagnosis;
        document.getElementById("clinical-significance").textContent = data.clinicalSignificance;
        document.getElementById("past-exam-reference").textContent = data.comparisonStudies;
        document.getElementById("additional-comments").textContent = data.additionalComment;
        document.getElementById("notes").textContent = data.additionalNotes;
        document.getElementById("report-status").textContent = reportStatus;
        document.getElementById("report-date").textContent = formattedDate;
    }

    updateTable();
});
