function initializeMedicalContent() {
    const searchForm = document.querySelector('#searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            filterMedicalRecords();
        });

        const resetButton = searchForm.querySelector('button[type="button"]');
        if (resetButton) {
            resetButton.addEventListener('click', () => {
                resetForm();
            });
        }
    }
}

function filterMedicalRecords() {
    const recordCode = document.querySelector('#recordCode')?.value.toLowerCase() || '';
    const patientCode = document.querySelector('#patientCode')?.value.toLowerCase() || '';
    const username = document.querySelector('#username')?.value.toLowerCase() || '';
    const medicalDate = document.querySelector('#medicalDate')?.value.toLowerCase() || '';

    const medicalRecords = document.getElementsByClassName('list-element');
    for (let i = 1; i < medicalRecords.length; i++) {
        const record = medicalRecords[i];
        const rCode = record.querySelector('.record-code')?.textContent.toLowerCase() || '';
        const pCode = record.querySelector('.patient-code')?.textContent.toLowerCase() || '';
        const uName = record.querySelector('.username')?.textContent.toLowerCase() || '';
        const mDate = record.querySelector('.medical-date')?.textContent.toLowerCase() || '';

        const matches = (!recordCode || rCode.includes(recordCode)) &&
            (!patientCode || pCode.includes(patientCode)) &&
            (!username || uName.includes(username)) &&
            (!medicalDate || mDate.includes(medicalDate));

        record.style.display = matches ? '' : 'none';
    }
}

function resetForm() {
    const form = document.getElementById('searchForm');
    if (!form)
        return;

    form.reset();
    filterMedicalRecords();
}

window.initializeMedicalContent = initializeMedicalContent;
window.filterMedicalRecords = filterMedicalRecords;
window.resetForm = resetForm;