console.log('medicalList.js 스크립트 시작');

// 검색 폼 이벤트
const searchFormMedical = document.querySelector('#searchForm');
if (searchFormMedical) {
    console.log('검색 폼 발견됨 (medical)');
    searchFormMedical.addEventListener('submit', (e) => {
        e.preventDefault();
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
    });

    const resetButtonMedical = searchFormMedical.querySelector('button[type="button"]');
    if (resetButtonMedical) {
        resetButtonMedical.addEventListener('click', () => {
            searchFormMedical.reset();
            const medicalRecords = document.getElementsByClassName('list-element');
            for (let i = 1; i < medicalRecords.length; i++) {
                medicalRecords[i].style.display = '';
            }
        });
    }
}