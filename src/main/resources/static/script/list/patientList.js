
function initializePatientContent() {
    const patientNames = document.querySelectorAll('.patients-name');
    patientNames.forEach(nameElement => {
        nameElement.addEventListener('click', (e) => {
            const listElement = e.target.closest('.list-element');
            const selectedPid = listElement.querySelector('.patient-code').textContent;
            console.log('Clicked patient PID:', selectedPid);
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
        const pName = patient.querySelector('.patients-name')?.textContent.toLowerCase() || '';
        const pSex = patient.querySelector('.patient-sex')?.textContent.toLowerCase() || '';
        const pBirth = patient.querySelector('.patient-birth')?.textContent.toLowerCase() || '';

        const matches = (!patientCode || pCode.includes(patientCode)) &&
            (!patientName || pName.includes(patientName)) &&
            (!patientSex || pSex.includes(patientSex)) &&
            (!patientBirth || pBirth.includes(patientBirth));

        patient.style.display = matches ? '' : 'none';
    }
}

// 전역 함수 노출
window.initializePatientContent = initializePatientContent;
window.filterPatients = filterPatients;