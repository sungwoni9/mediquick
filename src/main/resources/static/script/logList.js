if (typeof window.toggleRecord === 'undefined') {
    window.toggleRecord = false;
}

// 날짜 포맷팅 함수
function formatDate(dateString) {
    return dateString ? `${dateString.slice(0, 4)}-${dateString.slice(4, 6)}-${dateString.slice(6, 8)}` : "정보 없음";
}

// 판독 등급 포맷팅 함수
function formatUrgencyLevel(level) {
    switch (level) {
        case 1:
            return "일반";
        case 2:
            return "중요";
        case 3:
            return "긴급";
        default:
            return "판독 정보가 없습니다.";
    }
}

// 판독 등급 색상 함수
function getUrgencyColor(level) {
    switch (level) {
        case 1:
            return "green";
        case 2:
            return "orange";
        case 3:
            return "red";
        default:
            return "black";
    }
}

// 보고서 상태 포맷팅 함수
function formatReportStatus(status) {
    switch (status) {
        case 1:
            return "초안";
        case 2:
            return "수정 필요";
        case 3:
            return "판독 완료";
        default:
            return "판독 정보가 없습니다.";
    }
}

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
    }

    async function fetchData(url) {
        try {
            const token = sessionStorage.getItem('jwtToken') || localStorage.getItem('jwtToken');
            if (!token) {
                console.error("인증 토큰이 없습니다. 로그인이 필요합니다.");
                alert("로그인이 필요합니다.");
                return null;
            }

            const response = await fetch(url, {
                method: 'GET',
                headers: {'Authorization': `Bearer ${token}`}
            });

            if (response.status === 404) {
                console.warn(`데이터 없음: ${url}`);
                return null;
            }

            if (!response.ok) {
                console.warn(`API 요청 실패: ${url} (상태 코드: ${response.status})`);
                return null;
            }

            return await response.json();
        } catch (error) {
            console.error(`데이터 조회 중 오류 발생: ${error.message}`);
            return null;
        }
    }

    async function movePageByStudyKey() {
        const logCodes = document.querySelectorAll(".log-code");

        logCodes.forEach(logCode => {
            logCode.addEventListener("click", async () => {
                const logType = logCode.getAttribute("data-log-type");
                const studyKey = logCode.getAttribute("data-study-key");

                if (!studyKey) {
                    console.warn("올바른 studyKey가 없습니다.");
                    return;
                }

                if (logType === "VIEW_VIDEO") {
                    window.location.href = `/viewer?studyKey=${studyKey}`;
                } else if (logType === "VIEW_RECORD") {
                    const recode = document.querySelector('#recode');

                    if (window.toggleRecord) {
                        recode.style.display = "none";
                        window.toggleRecord = false;
                    } else {
                        const patientData = await fetchData(`/report/patient/${studyKey}`) || {};
                        const medicalData = await fetchData(`/medical/detail/${studyKey}`) || {};
                        const reportData = await fetchData(`/report/${studyKey}`) || {};

                        updatePatientInfo(patientData);
                        updateMedicalInfo(medicalData);
                        updateReportInfo(reportData);

                        recode.style.display = "block";
                        window.toggleRecord = true;

                        document.querySelector('#close-recode').addEventListener('click', () => {
                            recode.style.display = "none";
                            window.toggleRecord = false;
                        });
                    }
                }
            });
        });
    }

    function updatePatientInfo(patientData) {
        document.getElementById("chartNo").innerText = patientData.pid ? `${patientData.pid} / ` : "정보 없음";
        document.getElementById("patientName").innerText = patientData.pname ? `${patientData.pname} / ` : "정보 없음";
        document.getElementById("patientBirth").innerText = patientData.pbirthdatetime ? formatDate(patientData.pbirthdatetime) : "정보 없음";
        document.getElementById("patientGender").innerText = patientData.psex || "정보 없음";
    }

    function updateMedicalInfo(medicalData) {
        document.getElementById("doctor-name").innerText = medicalData.username || "정보 없음";
        document.getElementById("patient-symptoms").innerText = medicalData.patientSymptoms || "정보 없음";
        document.getElementById("order-description").innerText = medicalData.orderDesc || "정보 없음";
        document.getElementById("medical-date").innerText = medicalData.medicalDate ? new Date(medicalData.medicalDate).toISOString().split('T')[0] : "정보 없음";
    }

    function updateReportInfo(reportData) {
        document.getElementById("reader").innerText = reportData.radiologistName || "판독 정보가 없습니다.";
        document.getElementById("hospital").innerText = reportData.institutionName || "판독 정보가 없습니다.";
        document.getElementById("report-level").innerText = formatUrgencyLevel(reportData.urgencyLevel);
        document.getElementById("report-level").style.color = getUrgencyColor(reportData.urgencyLevel);
        document.getElementById("normal-status").innerText = reportData.normal ? "정상" : "비정상";
        document.getElementById("additional-exam-needed").innerText = reportData.recommendedStudies ? "필요" : "불필요";
        document.getElementById("report-status").innerText = formatReportStatus(reportData.reportStatus);
        document.getElementById("report-date").innerText = reportData.regDate ? new Date(reportData.regDate).toISOString().split('T')[0] : "판독 정보가 없습니다.";
    }

    document.addEventListener("scroll", () => {
        const recodeElement = document.querySelector("#recode");
        const scrollPos = window.scrollY;

        if (scrollPos > 50) {
            recodeElement.style.height = "100%";
        } else {
            recodeElement.style.height = "calc(100% - 106px)"
        }
    });

    updateTable();
    movePageByStudyKey();
});
