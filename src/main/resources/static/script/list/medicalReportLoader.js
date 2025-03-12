if (typeof window.toggleRecord === 'undefined') {
    window.toggleRecord = false;
}

console.log('medicalReportLoader.js 스크립트 시작');

const patientNames = document.querySelectorAll('.patient-name');
patientNames.forEach(nameElement => {
    nameElement.addEventListener('click', async () => {
        const listElement = nameElement.closest('.list-element');
        const studyKey = listElement.querySelector('.study-key').textContent;
        const recode = document.querySelector('#recode');

        if (window.toggleRecord) {
            recode.style.display = "none";
            window.toggleRecord = false;
        } else {
            const token = sessionStorage.getItem('jwtToken') || localStorage.getItem('jwtToken');
            if (!token) {
                console.error("인증 토큰이 없습니다. 로그인이 필요합니다.");
                alert("로그인이 필요합니다.");
                return;
            }

            try {
                // 1. 환자 정보 조회
                const patientResponse = await fetch(`/report/patient/${studyKey}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                let patientData = {};
                if (!patientResponse.ok) {
                    console.log(`환자 정보 조회 실패: ${patientResponse.status}`);
                } else {
                    patientData = await patientResponse.json();
                }

                // 2. 진료 기록 조회
                const medicalResponse = await fetch(`/medical/detail/${studyKey}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                let medicalData = {};
                if (!medicalResponse.ok) {
                    console.log(`진료 기록 조회 실패: ${medicalResponse.status}`);
                } else {
                    medicalData = await medicalResponse.json();
                }

                // 3. 판독 소견 조회
                const reportResponse = await fetch(`/report/${studyKey}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                let reportData = {};
                if (!reportResponse.ok) {
                    console.log(`판독 소견 조회 실패: ${reportResponse.status}`);
                } else {
                    reportData = await reportResponse.json();
                }
                // 환자 정보 삽입
                document.getElementById("chartNo").innerText = patientData.pid ? `${patientData.pid} / ` : "정보 없음";
                document.getElementById("patientName").innerText = patientData.pname ? `${patientData.pname} / ` : "정보 없음";
                document.getElementById("patientBirth").innerText = patientData.pbirthdatetime ?
                    `${formatDate(patientData.pbirthdatetime)} / ` : "정보 없음";
                document.getElementById("patientGender").innerText = patientData.psex || "정보 없음";

                // 진료 기록 삽입
                document.getElementById("doctor-name").innerText = medicalData.username || "정보 없음";
                document.getElementById("patient-symptoms").innerText = medicalData.patientSymptoms || "정보 없음";
                document.getElementById("order-description").innerText = medicalData.orderDesc || "정보 없음";
                document.getElementById("medical-date").innerText = medicalData.medicalDate ?
                    new Date(medicalData.medicalDate).toISOString().split('T')[0] : "정보 없음";

                // 판독 소견 삽입
                document.getElementById("reader").innerText = reportData.radiologistName || "판독 정보가 없습니다.";
                document.getElementById("hospital").innerText = reportData.institutionName || "판독 정보가 없습니다.";
                document.getElementById("report-level").innerText = formatUrgencyLevel(reportData.urgencyLevel);
                document.getElementById("report-level").style.color = getUrgencyColor(reportData.urgencyLevel);
                document.getElementById("normal-status").innerText = reportData.normal ? "정상" : "비정상";
                document.getElementById("additional-exam-needed").innerText = reportData.recommendedStudies ? "필요" : "불필요";
                document.getElementById("lesion-location").innerText = reportData.lesionLocation || "판독 정보가 없습니다.";
                document.getElementById("lesion-size").innerText = reportData.lesionSize || "판독 정보가 없습니다.";
                document.getElementById("lesion-count").innerText = reportData.lesionCount || "판독 정보가 없습니다.";
                document.getElementById("morphological-features").innerText = reportData.morphology || "판독 정보가 없습니다.";
                document.getElementById("special-findings").innerText = reportData.additionalFindings || "판독 정보가 없습니다.";
                document.getElementById("suspected-diagnosis").innerText = reportData.possibleDiagnosis || "판독 정보가 없습니다.";
                document.getElementById("clinical-significance").innerText = reportData.clinicalSignificance || "판독 정보가 없습니다.";
                document.getElementById("past-exam-reference").innerText = reportData.comparisonStudies || "판독 정보가 없습니다.";
                document.getElementById("additional-comments").innerText = reportData.additionalComment || "판독 정보가 없습니다.";
                document.getElementById("notes").innerText = reportData.additionalNotes || "판독 정보가 없습니다.";
                document.getElementById("report-status").innerText = formatReportStatus(reportData.reportStatus);
                document.getElementById("report-date").innerText = reportData.regDate ?
                    new Date(reportData.regDate).toISOString().split('T')[0] : "판독 정보가 없습니다.";

                recode.style.display = "block";
                window.toggleRecord = true;

                // 진료 기록 조회 로그 저장 요청
                try {
                    const response = await fetch("/logs/view-record", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        credentials: "include",
                        body: JSON.stringify({studyKey})
                    });

                    if (!response.ok) {
                        console.error("로그 저장 실패:", response.statusText);
                    } else {
                        console.log("진료 기록 조회 로그 저장 완료");
                    }
                } catch (error) {
                    console.error("로그 저장 요청 중 오류 발생:", error);
                }

                const closeButton = document.querySelector('#close-recode');
                closeButton.onclick = null; // 기존 이벤트 제거
                closeButton.addEventListener('click', () => {
                    recode.style.display = "none";
                    window.toggleRecord = false;
                });

            } catch (error) {
                console.error("데이터 조회 중 오류 발생:", error.message);
                alert(`데이터 로드 실패: ${error.message}`);
            }
        }
    });
});

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