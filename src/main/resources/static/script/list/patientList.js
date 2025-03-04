
function initializePatientContent() {
    console.log('initializePatientContent 호출됨'); // 디버깅용

    // 검색 폼 이벤트
    const searchForm = document.querySelector('#searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault(); // 새로고침 방지
            filterPatients();
        });

        const resetButton = searchForm.querySelector('button[type="button"]');
        if (resetButton) {
            resetButton.addEventListener('click', () => {
                resetForm();
            });
        }
    }

    // 환자 이름 클릭 이벤트 추가
    const patientNames = document.querySelectorAll('.patient-name');
    console.log('환자 이름 요소 수:', patientNames.length); // 디버깅용
    patientNames.forEach(nameElement => {
        nameElement.addEventListener('click', (e) => {
            console.log('환자 이름 클릭됨'); // 디버깅용
            const listElement = e.target.closest('.list-element');
            const selectedPid = listElement.querySelector('.patient-code').textContent;
            showMedicalForm(selectedPid);
        });
    });
}

function filterPatients() {
    const patientCode = document.querySelector('#patientCode')?.value.toLowerCase() || '';
    const patientName = document.querySelector('#patientName')?.value.toLowerCase() || '';
    const patientSex = document.querySelector('#patientSex')?.value.toLowerCase() || '';
    const patientBirth = document.querySelector('#patientBirth')?.value.toLowerCase() || '';

    const patients = document.getElementsByClassName('list-element');
    for (let i = 1; i < patients.length; i++) {
        const patient = patients[i];
        const pCode = patient.querySelector('.patient-code')?.textContent.toLowerCase() || '';
        const pName = patient.querySelector('.patient-name')?.textContent.toLowerCase() || '';
        const pSex = patient.querySelector('.patient-sex')?.textContent.toLowerCase() || '';
        const pBirth = patient.querySelector('.patient-birth')?.textContent.toLowerCase() || '';

        const matches = (!patientCode || pCode.includes(patientCode)) &&
            (!patientName || pName.includes(patientName)) &&
            (!patientSex || pSex.includes(patientSex)) &&
            (!patientBirth || pBirth.includes(patientBirth));

        patient.style.display = matches ? '' : 'none';
    }
}

function showMedicalForm(selectedPid) {
    let medicalForm = document.getElementById('medical-form');
    const patientElement = document.getElementById(`patient-${selectedPid}`);

    if (medicalForm) {
        medicalForm.remove();
    }

    fetch('/medical/form')
        .then(response => response.text())
        .then(html => {
            patientElement.insertAdjacentHTML('afterend', html);
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
        username: formData.get('username'),
        pid: formData.get('pid'),
        patientSymptoms: formData.get('patientSymptoms'),
        orderDesc: formData.get('orderDesc'),
        medicalDate: formData.get('medicalDate')
    };

    // 필수 필드 검증
    if (!medicalRecord.username) {
        alert('사용자 ID를 입력해주세요.');
        return;
    }
    if (!medicalRecord.pid) {
        alert('환자 ID가 필요합니다.');
        return;
    }
    if (!medicalRecord.medicalDate) {
        alert('진료 날짜를 입력해주세요.');
        return;
    }

    fetch('/medical', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(medicalRecord)
    })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => { throw new Error(text || '저장 실패'); });
            }
            return response.json();
        })
        .then(data => {
            alert('저장 완료');
            closeMedicalForm();
        })
        .catch(error => {
            console.error('Error saving medical record:', error);
            alert(`저장 실패: ${error.message}`);
        });
}

function resetForm() {
    const form = document.getElementById('searchForm');
    form.reset();
    filterPatients(); // 필터 초기화 후 리스트 새로고침
}

// 전역 함수 노출
window.initializePatientContent = initializePatientContent;
window.filterPatients = filterPatients;