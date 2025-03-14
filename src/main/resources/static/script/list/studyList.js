if (typeof window.toggleRecord === 'undefined') {
    window.toggleRecord = false;
}

const contentArea = document.getElementById('content-area');

document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM fully loaded');
    const statusDots = document.querySelectorAll('.status-dot');
    console.log('Found status dots:', statusDots.length);

    if (statusDots.length === 0) {
        console.error('No .status-dot elements found in the DOM');
        return;
    }

    for (const dot of statusDots) {
        const listElement = dot.closest('.list-element');
        const studykey = listElement.id.split('study-')[1];
        console.log('Processing studykey:', studykey);

        try {
            const response = await fetch(`/report/${studykey}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            if (!response.ok) {
                console.error('Fetch failed for studykey:', studykey, 'Status:', response.status);
                dot.classList.add('status-none');
                continue;
            }
            const data = await response.json();
            console.log('Response data:', data);
            const urgencyLevel = data.urgencyLevel || 0;
            console.log('Urgency level for', studykey, ':', urgencyLevel);

            let statusClass;
            switch (parseInt(urgencyLevel)) {
                case 0: statusClass = 'status-none'; break;
                case 1: statusClass = 'status-normal'; break;
                case 2: statusClass = 'status-bad'; break;
                case 3: statusClass = 'status-good'; break;
                default: statusClass = 'status-none';
            }
            dot.classList.add(statusClass);
            dot.setAttribute('data-urgency-level', urgencyLevel);
        } catch (error) {
            dot.classList.add('status-normal');
        }
    }
});

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


