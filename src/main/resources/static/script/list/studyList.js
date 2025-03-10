let toggleRecord = false;

function initializeStudyContent() {

    // 검색 폼 이벤트
    const searchForm = document.querySelector('#searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            filterStudies();
        });

        const resetButton = searchForm.querySelector('button[type="button"]');
        if (resetButton)
            resetButton.addEventListener('click', resetForm);
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

                try {
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
                        if (response.status === 401)
                            throw new Error("인증 실패: 로그인 정보를 다시 확인하세요.");
                         else
                            throw new Error(`오류 발생: ${response.status}`);

                    }
                    console.log("로그 저장 완료", studyKey);
                    window.location.href = `/viewer?studyKey=${studyKey}`;
                } catch (error) {
                    console.error("로그 저장 실패:", error);
                    alert(error.message);
                }
            });
        });
    }

    // 환자 이름 클릭 이벤트 추가
    const patientNames = document.querySelectorAll('.patient-name');
    patientNames.forEach(nameElement => {
        nameElement.addEventListener('click', async () => {
            const listElement = nameElement.closest('.list-element');
            const studyKey = listElement.querySelector('.study-key').textContent;
            const recodeForm = document.querySelector('#recode');
            const token = localStorage.getItem("jwtToken");

            if (toggleRecord) {
                recodeForm.style.display = "none";
                toggleRecord = false;
            } else {
                await fetchPatientData(studyKey);
                await fetchFindingData(studyKey);

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

                    recodeForm.style.display = "block";
                    toggleRecord = true;

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
            }
        });
    });
}

function showReportDetail(studyKey) {
    // const listElement = document.getElementById(`study-${studyKey}`);
    // if (!listElement) {
    //     console.error(`study-${studyKey} 요소를 찾을 수 없습니다.`);
    //     return;
    // }
    //
    // let recodeDiv = document.getElementById('recode');
    // if (recodeDiv)
    //     recodeDiv.remove();
    //
    // fetch(`/report/detail/${studyKey}`, { credentials: 'include' })
    //     .then(response => {
    //         if (!response.ok)
    //             throw new Error(`HTTP error! status: ${response.status}`);
    //
    //         return response.text();
    //     })
    //     .then(html => {
    //         document.body.insertAdjacentHTML('beforeend', html);
    //         recodeDiv = document.getElementById('recode');
    //         if (recodeDiv)
    //             recodeDiv.style.display = 'block';
    //          else
    //             console.error('#recode 요소를 찾을 수 없습니다.');
    //
    //     })
    //     .catch(error => {
    //         console.error('Error loading report detail:', error);
    //         alert('보고서 세부 정보를 로드하는 데 실패했습니다: ' + error.message);
    //     });
}

function filterStudies() {
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
}

function resetForm() {
    const form = document.getElementById('searchForm');
    if (!form)
        return;
    form.reset();
    filterStudies();
}

window.initializeStudyContent = initializeStudyContent;
window.showReportDetail = showReportDetail;
window.filterStudies = filterStudies;
window.resetForm = resetForm;