console.log('patientList.js 스크립트 시작');

const contentAreaPatient = document.getElementById('content-area');

// 검색 폼 이벤트
const searchFormPatient = document.querySelector('#searchForm');

if (searchFormPatient) {
    console.log('검색 폼 발견됨 (patient)');
    searchFormPatient.addEventListener('submit', (e) => {
        e.preventDefault();
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
    });

    const resetButtonPatient = searchFormPatient.querySelector('button[type="button"]');
    if (resetButtonPatient) {
        resetButtonPatient.addEventListener('click', () => {
            searchFormPatient.reset();
            const patients = document.getElementsByClassName('list-element');
            for (let i = 1; i < patients.length; i++) {
                patients[i].style.display = '';
            }
        });
    }
}

// 환자 이름 클릭 이벤트
const patientNamesPatient = document.querySelectorAll('.patient-name');
patientNamesPatient.forEach(nameElement => {
    nameElement.addEventListener('click', async (e) => {
        const listElement = e.target.closest('.list-element');
        const selectedPid = listElement.querySelector('.patient-code').textContent;
        const patientNameText = nameElement.textContent;

        let medicalForm = document.getElementById('medical-form');
        const patientElement = document.getElementById(`patient-${selectedPid}`);

        if (!patientElement) return;

        if (medicalForm) medicalForm.remove();

        const userResponse = await fetch('/user/valid/info', {credentials: 'include'});
        let doctorName = "Unknown";
        if (userResponse.ok) {
            const userData = await userResponse.json();
            doctorName = userData.name || "Unknown";
        } else {
            console.error('Failed to fetch user info:', userResponse.status);
        }

        const formResponse = await fetch('/medical/form', {credentials: 'include'});
        if (!formResponse.ok) {
            console.error('진료 폼 로드 실패:', formResponse.status);
            contentAreaPatient.innerHTML = '<p>진료 폼을 불러오는 데 실패했습니다.</p>';
        } else {
            const html = await formResponse.text();
            patientElement.insertAdjacentHTML('afterend', html);
            const medicalFormDiv = document.getElementById('medical-form');
            const form = document.getElementById('medicalRecordForm');

            if (medicalFormDiv && form) {
                medicalFormDiv.style.display = 'block';
                form.style.display = 'block';

                document.getElementById('pid').value = selectedPid;
                document.getElementById('medicalDate').value = new Date().toISOString().slice(0, 16);
                document.getElementById('patientName').textContent = patientNameText || 'Unknown';
                document.getElementById('doctorName').textContent = doctorName;

                form.addEventListener('submit', (e) => {
                    e.preventDefault();
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
                            const medicalFormToRemove = document.getElementById('medical-form');
                            if (medicalFormToRemove) medicalFormToRemove.remove();
                        })
                        .catch(error => {
                            console.error('Error saving medical record:', error);
                            alert(`저장 실패: ${error.message}`);
                        });
                });
            }
        }
    });
});