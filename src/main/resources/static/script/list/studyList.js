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
                        alert("인증 실패: 로그인 정보를 다시 확인하세요.");
                    else
                        alert(`오류 발생: ${response.status}`);
                }
                window.location.href = `/viewer?studyKey=${studyKey}`;
            } catch (error) {
                console.error("PACS 버튼 처리 중 오류:", error.message);
                alert(`작업 실패: ${error.message}`);
            }
        });
    });
}


