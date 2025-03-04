function initializePatientContent() {
    console.log('initializePatientContent 호출됨'); // 디버깅용

    const searchForm = document.querySelector('#searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            filterPatients();
        });

        const resetButton = searchForm.querySelector('button[type="button"]');
        if (resetButton) {
            resetButton.addEventListener('click', () => {
                resetForm();
            });
        }
    }

    const patientNames = document.querySelectorAll('.patient-name');
    console.log('환자 이름 요소 수:', patientNames.length); // 디버깅용
    patientNames.forEach(nameElement => {
        nameElement.addEventListener('click', (e) => {
            const listElement = e.target.closest('.list-element');
            const selectedPid = listElement.querySelector('.patient-code').textContent;
            const patientName = nameElement.textContent;
            console.log('선택된 환자 PID:', selectedPid, '이름:', patientName); // 디버깅용
            showMedicalForm(selectedPid, patientName);
        });
    });
}

function filterPatients() {
    const patientCode = document.querySelector('#patientCode')?.value.toLowerCase() || '';
    const patientName = document.querySelector('#patientName')?.value.toLowerCase() || '';
    const patientSex = document.querySelector('#patientSex')?.value.toLowerCase() || '';
    const patientBirth = document.querySelector('#patientBirth')?.value.toLowerCase() || '';

    console.log('필터 조건:', { patientCode, patientName, patientSex, patientBirth }); // 디버깅용
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

    if (!patientElement) {
        console.error('환자 요소를 찾을 수 없음:', `patient-${selectedPid}`); // 디버깅용
        return;
    }

    if (medicalForm) {
        medicalForm.remove();
    }

    console.log('fetch 요청 시작: /medical/form'); // 디버깅용
    fetch('/medical/form', { credentials: 'include' }) // 세션 쿠키 포함
        .then(response => {
            console.log('fetch 응답 상태:', response.status, response.statusText); // 디버깅용
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            console.log('fetch 응답 HTML 길이:', html.length); // 디버깅용
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
            } else {
                console.error('medical-form 또는 medicalRecordForm 요소를 찾을 수 없음'); // 디버깅용
            }
        })
        .catch(error => {
            console.error('Error loading medical form:', error);
            alert('진료 기록 폼을 로드하는 데 실패했습니다: ' + error.message);
        });
}

function toggleMedicalForm() {
    const form = document.getElementById('medicalRecordForm');
    const toggleIcon = document.querySelector('.toggle-icon');
    if (!form || !toggleIcon) {
        console.error('toggleMedicalForm 실패: 요소를 찾을 수 없음', { form, toggleIcon }); // 디버깅용
        return;
    }
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
    } else {
        console.warn('medical-form 요소가 존재하지 않음'); // 디버깅용
    }
}

function saveMedicalRecord() {
    const form = document.getElementById('medicalRecordForm');
    if (!form) {
        console.error('medicalRecordForm 요소를 찾을 수 없음'); // 디버깅용
        return;
    }

    const formData = new FormData(form);
    const medicalRecord = {
        username: formData.get('username'),
        pid: formData.get('pid'),
        studykey: formData.get('studykey'),
        patientSymptoms: formData.get('patientSymptoms'),
        orderDesc: formData.get('orderDesc'),
        medicalDate: formData.get('medicalDate')
    };

    console.log('저장할 데이터:', medicalRecord); // 디버깅용

    if (!medicalRecord.studykey) {
        alert('검사 번호를 입력하세요.');
        return;
    }

    if (!medicalRecord.patientSymptoms) {
        alert('환자 증상을 입력하세요.');
        return;
    }

    if (!medicalRecord.orderDesc) {
        alert('의사 처방을 입력하세요.');
        return;
    }

    if (!medicalRecord.medicalDate) {
        alert('진료 날짜를 입력해주세요.');
        return;
    }

    console.log('fetch 요청 시작: /medical', JSON.stringify(medicalRecord)); // 디버깅용
    fetch('/medical', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(medicalRecord),
        credentials: 'include' // 세션 쿠키 포함
    })
        .then(response => {
            console.log('fetch 응답 상태:', response.status, response.statusText); // 디버깅용
            if (!response.ok) {
                return response.text().then(text => {
                    console.error('응답 본문:', text); // 디버깅용
                    throw new Error(text || '저장 실패');
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('저장 성공, 응답 데이터:', data); // 디버깅용
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
    if (!form) {
        console.error('searchForm 요소를 찾을 수 없음'); // 디버깅용
        return;
    }
    form.reset();
    filterPatients();
}

// 전역 함수 노출
window.initializePatientContent = initializePatientContent;
window.showMedicalForm = showMedicalForm;
window.toggleMedicalForm = toggleMedicalForm;
window.closeMedicalForm = closeMedicalForm;
window.saveMedicalRecord = saveMedicalRecord;
window.filterPatients = filterPatients;