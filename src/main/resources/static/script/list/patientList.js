function initializePatientContent() {
    // 검색 폼 이벤트
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
    patientNames.forEach(nameElement => {
        nameElement.addEventListener('click', (e) => {
            const listElement = e.target.closest('.list-element');
            const selectedPid = listElement.querySelector('.patient-code').textContent;
            const patientName = nameElement.textContent;
            showMedicalForm(selectedPid, patientName);
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

async function showMedicalForm(selectedPid, patientName) {
    let medicalForm = document.getElementById('medical-form');
    const patientElement = document.getElementById(`patient-${selectedPid}`);

    if (!patientElement) return;

    if (medicalForm) medicalForm.remove();

    try {
        // 사용자 정보 가져오기
        const userResponse = await fetch('/user/valid/info', {credentials: 'include'});
        let doctorName = "Unknown";
        if (userResponse.ok) {
            const userData = await userResponse.json();
            doctorName = userData.name || "Unknown";
        } else {
            console.error('Failed to fetch user info:', userResponse.status);
        }

        // 진료 폼 가져오기
        const formResponse = await fetch('/medical/form', { credentials: 'include' });
        if(!formResponse.ok)
            throw new Error(`HTTP error! status: ${formResponse.status}`);

        const html = await formResponse.text();

        patientElement.insertAdjacentHTML('afterend', html);
        const medicalFormDiv = document.getElementById('medical-form');
        const form = document.getElementById('medicalRecordForm');

        if (medicalFormDiv && form) {
            medicalFormDiv.style.display = 'block';
            form.style.display = 'block';

            // 폼 필드 초기화
            document.getElementById('pid').value = selectedPid;
            document.getElementById('medicalDate').value = new Date().toISOString().slice(0, 16);
            document.getElementById('patientName').textContent = patientName || 'Unknown';
            document.getElementById('doctorName').textContent = doctorName; -

            form.addEventListener('submit', (e) => {
                e.preventDefault();
                saveMedicalRecord();
            });
        }
    } catch (error) {
        console.error('Error loading medical form:', error);
        alert('진료 기록 폼을 로드하는 데 실패했습니다: ' + error.message);
    }
}

    function closeMedicalForm() {
        const medicalForm = document.getElementById('medical-form');
        if (medicalForm)
            medicalForm.remove();
    }

    function saveMedicalRecord() {
        const form = document.getElementById('medicalRecordForm');
        if (!form)
            return;

        const formData = new FormData(form);
        const medicalRecord = {
            username: document.getElementById('doctorName').textContent,
            pid: formData.get('pid'),
            studykey: formData.get('studykey'),
            patientSymptoms: formData.get('patientSymptoms'),
            orderDesc: formData.get('orderDesc'),
            medicalDate: formData.get('medicalDate')
        };

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

        fetch('/medical', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(medicalRecord),
            credentials: 'include'
        })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => {
                        throw new Error(text || '저장 실패');
                    });
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
        if (!form)
            return;
        form.reset();
        filterPatients();
    }

// 전역 함수 노출
    window.initializePatientContent = initializePatientContent;
    window.showMedicalForm = showMedicalForm;
    window.closeMedicalForm = closeMedicalForm;
    window.saveMedicalRecord = saveMedicalRecord;
    window.filterPatients = filterPatients;
    window.resetForm = resetForm;