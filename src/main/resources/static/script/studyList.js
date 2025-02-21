// 검색 폼 이벤트 처리
document.getElementById('searchForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const patientName = document.getElementById('patientName').value.toLowerCase();
    const studyTime = document.getElementById('studyTime').value.toLowerCase();
    const modality = document.getElementById('modality').value.toLowerCase();
    const bodyPart = document.getElementById('bodyPart').value.toLowerCase();

    const studies = document.getElementsByClassName('list-element');

    for (let i = 1; i < studies.length; i++) {
        const study = studies[i];
        const pName = study.querySelector('.patients-name').textContent.toLowerCase();
        const sTime = study.querySelector('.study-time').textContent.toLowerCase()
        const mod = study.querySelector('.modality').textContent.toLowerCase()
        const bPart = study.querySelector('.body-part').textContent.toLowerCase();

        const matches = (!patientName || pName.includes(patientName)) &&
            (!studyTime || sTime.includes(studyTime)) &&
            (!modality || mod.includes(modality)) &&
            (!bodyPart || bPart.includes(bodyPart));

        study.style.display = matches ? '' : 'none';
    }
});

// 리셋 버튼 이벤트 처리
function resetForm() {
    document.getElementById('searchForm').reset();
    const studies = document.getElementsByClassName('list-element');
    for (let i = 1; i < studies.length; i++) {
        studies[i].style.display = '';
    }
}