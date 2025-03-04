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

    // 환자 이름 클릭 이벤트 추가
    const patientNames = document.querySelectorAll('.patients-name');
    patientNames.forEach(nameElement => {
        nameElement.addEventListener('click', (e) => {
            const listElement = e.target.closest('.list-element');
            const selectedPid = listElement.querySelector('.study-key').textContent;
            showMedicalForm(selectedPid);
        });
    });

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
                        body: JSON.stringify({ studyKey })
                    });

                    if (!response.ok) {
                        if (response.status === 401) {
                            throw new Error("인증 실패: 로그인 정보를 다시 확인하세요.");
                        } else {
                            throw new Error(`오류 발생: ${response.status}`);
                        }
                    }

                    console.log("로그 저장 완료", studyKey);

                } catch (error) {
                    console.error("로그 저장 실패:", error);
                    alert(error.message);
                }
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

function showMedicalForm(selectedPid) {
    let medicalForm = document.getElementById('medical-form');
    const studyElement = document.getElementById(`study-${selectedPid}`);

    if (medicalForm) {
        medicalForm.remove();
    }

    fetch('/medical/form')
        .then(response => response.text())
        .then(html => {
            studyElement.insertAdjacentHTML('afterend', html);
            const medicalFormDiv = document.getElementById('medical-form');
            const form = document.getElementById('medicalRecordForm');
            if (medicalFormDiv && form) {
                medicalFormDiv.style.display = 'block';
                form.style.display = 'block';
                document.getElementById('pid').value = selectedPid;
                document.getElementById('medicalDate').value = new Date().toISOString().slice(0, 16);
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    saveMedicalRecord();
                });
            }
        })
        .catch(error => console.error('Error loading medical form:', error));
}

function toggleMedicalForm() {
    const form = document.getElementById('medicalRecordForm');
    const toggleIcon = document.querySelector('.toggle-icon');
    if (form.style.display === 'block' || form.style.display === '') {
        form.style.display = 'none';
        toggleIcon.classList.remove('open');
    } else {
        form.style.display = 'block';
        toggleIcon.classList.add('open');
    }
}

function closeMedicalForm() {
    const medicalForm = document.getElementById('medical-form');
    if (medicalForm) {
        medicalForm.remove();
    }
}

function saveMedicalRecord() {
    const form = document.getElementById('medicalRecordForm');
    const formData = new FormData(form);
    const medicalRecord = {
        pid: formData.get('pid'),
        patientSymptoms: formData.get('patientSymptoms'),
        orderDesc: formData.get('orderDesc'),
        medicalDate: formData.get('medicalDate')
    };

    fetch('/medical', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(medicalRecord)
    })
        .then(response => {
            if (!response.ok) throw new Error('저장 실패');
            return response.json();
        })
        .then(data => {
            alert('저장 완료');
            closeMedicalForm();
        })
        .catch(error => {
            console.error('Error saving medical record:', error);
            alert('저장 실패');
        });
}

// 전역에서 함수 노출
window.initializeStudyContent = initializeStudyContent;

// DOM 로드 후 초기화
document.addEventListener('DOMContentLoaded', initializeStudyContent);