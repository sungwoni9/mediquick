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
        nameElement.addEventListener('click', () => {
            const listElement = nameElement.closest('.list-element');
            const studyKey = listElement.querySelector('.study-key').textContent;
            showReportDetail(studyKey);
        });
    });
}

function showReportDetail(studyKey) {
    console.log('showReportDetail 호출, studyKey:', studyKey);
    const listElement = document.getElementById(`study-${studyKey}`);
    if (!listElement) {
        console.error(`study-${studyKey} 요소를 찾을 수 없습니다.`);
        return;
    }

    let recodeDiv = document.getElementById('recode');
    if (recodeDiv)
        recodeDiv.remove();

    fetch(`/report/detail/${studyKey}`, { credentials: 'include' })
        .then(response => {
            console.log('Response status:', response.status);
            if (!response.ok)
                throw new Error(`HTTP error! status: ${response.status}`);

            return response.text();
        })
        .then(html => {
            console.log('받은 HTML:', html);
            document.body.insertAdjacentHTML('beforeend', html);
            recodeDiv = document.getElementById('recode');
            if (recodeDiv)
                recodeDiv.style.display = 'block';
             else
                console.error('#recode 요소를 찾을 수 없습니다.');

        })
        .catch(error => {
            console.error('Error loading report detail:', error);
            alert('보고서 세부 정보를 로드하는 데 실패했습니다: ' + error.message);
        });
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