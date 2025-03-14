const contentAreaPatient = document.getElementById('content-area');

const searchFormPatient = document.querySelector('#searchForm');

if (searchFormPatient) {
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

        try {
            const userResponse = await fetch('/user/valid/info', {credentials: 'include'});
            const doctorName = userResponse.ok ? (await userResponse.json()).name || 'Unknown' : 'Unknown';

            const formResponse = await fetch('/medical/form', {credentials: 'include'});
            if (!formResponse.ok) throw new Error('진료 폼 로드 실패');

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

                const studySelect = document.getElementById('studykey');
                studySelect.innerHTML = '';

                const studyResponse = await fetch(`/studies/patient/${selectedPid}`, {credentials: 'include'});
                if (studyResponse.ok) {
                    const studies = await studyResponse.json();
                    if (studies.length > 0) {
                        studies.forEach(study => {
                            const option = document.createElement('option');
                            option.value = study.studykey;
                            option.textContent = `${study.studykey}`;
                            studySelect.appendChild(option);
                        });
                    } else {
                        const option = document.createElement('option');
                        option.textContent = '해당 환자의 검사 정보 없음';
                        option.disabled = true;
                        studySelect.appendChild(option);
                    }
                }

                form.addEventListener('submit', async (e) => {
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

                    if (!medicalRecord.studykey || !medicalRecord.patientSymptoms || !medicalRecord.orderDesc || !medicalRecord.medicalDate) {
                        alert('모든 필드를 입력하세요.');
                        return;
                    }

                    try {
                        const response = await fetch('/medical', {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify(medicalRecord),
                            credentials: 'include'
                        });

                        if (!response.ok) {
                            const errorText = await response.text();
                            throw new Error(errorText || '저장 실패');
                        }

                        alert('저장 완료');
                        document.getElementById('medical-form')?.remove();
                    } catch (error) {
                        console.error('Error saving medical record:', error);
                        alert(`저장 실패: ${error.message}`);
                    }
                });
            }
        } catch (error) {
            console.error(error);
            contentAreaPatient.innerHTML = '<p>진료 폼을 불러오는 데 실패했습니다.</p>';
        }
    });
});

