if (typeof window.toggleRecord === 'undefined') {
    window.toggleRecord = false;
}

console.log('studyList.js 스크립트 시작');

const contentArea = document.getElementById('content-area');

// 검색 폼 이벤트
const searchFormStudy = document.querySelector('#searchForm');
if (searchFormStudy) {
    searchFormStudy.addEventListener('submit', (e) => {
        e.preventDefault();
        const patientName = document.querySelector('#patientName')?.value.toLowerCase() || '';
        const studyTime = document.querySelector('#studyTime')?.value.toLowerCase() || '';
        const modality = document.querySelector('#modality')?.value.toLowerCase() || '';
        const bodyPart = document.querySelector('#bodyPart')?.value.toLowerCase() || '';

        const studies = document.getElementsByClassName('list-element');
        for (let i = 1; i < studies.length; i++) {
            const study = studies[i];
            const pName = study.querySelector('.patient-name')?.textContent.toLowerCase() || '';
            const sTime = study.querySelector('.study-time')?.textContent.toLowerCase() || '';
            const mod = study.querySelector('.modality')?.textContent.toLowerCase() || '';
            const bPart = study.querySelector('.body-part')?.textContent.toLowerCase() || '';

            const matches = (!patientName || pName.includes(patientName)) &&
                (!studyTime || sTime.includes(studyTime)) &&
                (!modality || mod.includes(modality)) &&
                (!bodyPart || bPart.includes(bodyPart));

            study.style.display = matches ? '' : 'none';
        }
    });
    const resetButtonStudy = searchFormStudy.querySelector('button[type="button"]');
    if (resetButtonStudy) {
        resetButtonStudy.addEventListener('click', () => {
            searchFormStudy.reset();
            const studies = document.getElementsByClassName('list-element');
            for (let i = 1; i < studies.length; i++) {
                studies[i].style.display = '';
            }
        });
    }
}

// PACS 버튼 이벤트
const pacsButtons = document.querySelectorAll('.pacs-button');
if (pacsButtons.length > 0) {
    pacsButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const studyKey = button.closest('.list-element').querySelector('.study-key').textContent;
            const token = localStorage.getItem("jwtToken");

            if (!token) {
                alert("로그인이 필요합니다.");
                window.location.href = "/login";
                return;
            }

            const response = await fetch("/logs/view-video", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                credentials: "include",
                body: JSON.stringify({studyKey})
            });

            if (!response.ok) {
                if (response.status === 401) {
                    alert("인증 실패: 로그인 정보를 다시 확인하세요.");
                } else {
                    alert(`오류 발생: ${response.status}`);
                }
            } else {
                console.log("로그 저장 완료", studyKey);
                const viewerResponse = await fetch(`/viewer?studyKey=${studyKey}`, {method: 'GET'});
                if (!viewerResponse.ok) {
                    contentArea.innerHTML = '<p>뷰어를 불러오는 데 실패했습니다.</p>';
                } else {
                    const viewerHtml = await viewerResponse.text();
                    contentArea.innerHTML = viewerHtml;
                    console.log('뷰어 표시 완료');
                }
            }
        });
    });
}

// 환자 이름 클릭 이벤트
const patientNames = document.querySelectorAll('.patient-name');
patientNames.forEach(nameElement => {
    nameElement.addEventListener('click', async () => {
        const listElement = nameElement.closest('.list-element');
        const studyKey = listElement.querySelector('.study-key').textContent;
        const recodeForm = document.querySelector('#recode');

        if (window.toggleRecord) {
            recodeForm.style.display = "none";
            window.toggleRecord = false;
        } else {
            const patientResponse = await fetch(`/report/patient/${studyKey}`);
            if (!patientResponse.ok) {
                console.log("환자정보를 찾을 수 없습니다.");
            } else {
                const patientData = await patientResponse.json();
                document.getElementById("chartNo").innerText = patientData.pid + " / ";
                document.getElementById("patientName").innerText = patientData.pname + " / ";
                document.getElementById("patientBirth").innerText =
                    `${patientData.pbirthdatetime.slice(0, 4)}-${patientData.pbirthdatetime.slice(4, 6)}-${patientData.pbirthdatetime.slice(6, 8)} / `;
                document.getElementById("patientGender").innerText = patientData.psex;
            }

            const reportResponse = await fetch(`/report/detail/${studyKey}`);
            if (!reportResponse.ok) {
                alert("판독 소견서가 존재하지 않습니다.");
            } else {
                recodeForm.style.display = "block";
                window.toggleRecord = true;

                const reportData = await reportResponse.json();
                let urgencyText = '';
                let textColor = '';
                if (reportData.urgencyLevel === 1) {
                    urgencyText = '일반';
                    textColor = 'green';
                } else if (reportData.urgencyLevel === 2) {
                    urgencyText = '중요';
                    textColor = 'orange';
                } else if (reportData.urgencyLevel === 3) {
                    urgencyText = '긴급';
                    textColor = 'red';
                }

                let reportStatus = '';
                if (reportData.reportStatus === 1) {
                    reportStatus = '초안';
                } else if (reportData.reportStatus === 2) {
                    reportStatus = '수정 필요';
                } else if (reportData.reportStatus === 3) {
                    reportStatus = '판독 완료';
                }

                const formattedDate = new Date(reportData.regDate).toISOString().split('T')[0];
                document.getElementById("reader").textContent = reportData.radiologistName;
                document.getElementById("hospital").textContent = reportData.institutionName;
                const urgencyTextEl = document.getElementById("report-level");
                urgencyTextEl.textContent = urgencyText;
                urgencyTextEl.style.color = textColor;
                document.getElementById("normal-status").textContent = reportData.normal ? "정상" : "비정상";
                document.getElementById("additional-exam-needed").textContent = reportData.recommendedStudies ? "필요" : "불필요";
                document.getElementById("lesion-location").textContent = reportData.lesionLocation;
                document.getElementById("lesion-size").textContent = reportData.lesionSize;
                document.getElementById("lesion-count").textContent = reportData.lesionCount;
                document.getElementById("morphological-features").textContent = reportData.morphology;
                document.getElementById("special-findings").textContent = reportData.additionalFindings;
                document.getElementById("suspected-diagnosis").textContent = reportData.possibleDiagnosis;
                document.getElementById("clinical-significance").textContent = reportData.clinicalSignificance;
                document.getElementById("past-exam-reference").textContent = reportData.comparisonStudies;
                document.getElementById("additional-comments").textContent = reportData.additionalComment;
                document.getElementById("notes").textContent = reportData.additionalNotes;
                document.getElementById("report-status").textContent = reportStatus;
                document.getElementById("report-date").textContent = formattedDate;

                const closeButton = document.getElementById("close");
                if (closeButton) {
                    closeButton.addEventListener('click', () => {
                        reportRoot.style.display = "none";
                        window.toggleRecord = false;
                    });
                }
            }
        }
    });
});