function showMedicalForm(selectedPid, patientName) {
    console.log('Selected PID:', selectedPid); // 디버깅용: selectedPid 확인
    let medicalForm = document.getElementById('medical-form');
    const studyElement = document.getElementById(`study-${selectedPid}`);

    console.log('Study Element:', studyElement); // 디버깅용: studyElement 값 확인

    if (medicalForm) {
        medicalForm.remove();
    }

    // studyElement가 null인지 확인
    if (!studyElement) {
        console.error(`Element with ID 'study-${selectedPid}' not found in DOM`);
        alert(`해당 ID('study-${selectedPid}')를 가진 요소를 찾을 수 없습니다.`);
        return; // 요소가 없으면 함수 종료
    }

    fetch(`/medical/form?pid=${selectedPid}`)
        .then(response => response.text())
        .then(html => {
            studyElement.insertAdjacentHTML('afterend', html);
            const medicalFormDiv = document.getElementById('medical-form');
            const form = document.getElementById('medicalRecordForm');
            if (medicalFormDiv && form) {
                medicalFormDiv.style.display = 'block';
                form.style.display = 'block';

                // 선택된 환자 이름을 표시하기 위한 요소 추가
                const patientNameElement = document.createElement('div');
                patientNameElement.id = 'selectedPatientName';
                patientNameElement.textContent = `선택된 환자: ${patientName}`;
                patientNameElement.style.marginBottom = '10px';
                patientNameElement.style.fontWeight = 'bold';
                form.insertBefore(patientNameElement, form.firstChild); // 폼 상단에 추가

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

window.showMedicalForm = showMedicalForm;
window.toggleMedicalForm = toggleMedicalForm;
window.closeMedicalForm = closeMedicalForm;
window.saveMedicalRecord = saveMedicalRecord;