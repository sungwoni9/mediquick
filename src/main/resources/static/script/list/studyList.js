function initializeStudyContent() {
    // 검색 폼 이벤트
    const searchForm = document.querySelector('#searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault(); // 새로고침 방지
            filterStudies();
        });

        const resetButton = searchForm.querySelector('button[type="button"]');
        if (resetButton) {
            resetButton.addEventListener('click', () => {
                resetForm();
            });
        }
    }

    // PACS 버튼 이벤트
    const pacsButtons = document.querySelectorAll('.pacs-button');
    if (pacsButtons.length > 0) {
        pacsButtons.forEach(button => {
            button.addEventListener('click', () => {
                const studyKey = button.closest('.list-element').querySelector('.study-key').textContent;
                
                // 로그 저장
                fetch("/logs/view-video", {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    credentials: "include"
                }).then(response => {
                    if (response.ok) {
                        console.log("영상 조회 로그 저장 완료");
                    } else {
                        return response.text().then(text => { throw new Error(text); });
                    }
                }).catch(error => console.error("로그 저장 실패:", error));


                window.location.href = `/viewer?studyKey=${studyKey}`;
            });
        });
    }
}

function filterStudies() {
    const patientName = document.querySelector('#patientName')?.value.toLowerCase() || '';
    const studyTime = document.querySelector('#studyTime')?.value.toLowerCase() || '';
    const modality = document.querySelector('#modality')?.value.toLowerCase() || '';
    const bodyPart = document.querySelector('#bodyPart')?.value.toLowerCase() || '';

    const studies = document.getElementsByClassName('list-element');
    for (let i = 1; i < studies.length; i++) { // 헤더 제외
        const study = studies[i];
        const pName = study.querySelector('.patients-name')?.textContent.toLowerCase() || '';
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

// 전역에서 함수 노출
window.initializePatientContent = initializePatientContent;
window.filterPatients = filterPatients;