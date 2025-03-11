if (typeof window.toggleRecord === 'undefined') {
    window.toggleRecord = false;
}

console.log('medicalReportLoader.js 스크립트 시작');

const patientNames = document.querySelectorAll('.patient-name');
patientNames.forEach(nameElement => {
    nameElement.addEventListener('click', async () => {
        const listElement = nameElement.closest('.list-element');
        const studyKey = listElement.querySelector('.study-key').textContent;
        const recode = document.querySelector('#recode');

        if (window.toggleRecord) {
            recode.style.display = "none";
            window.toggleRecord = false;
        } else {
            const token = sessionStorage.getItem('jwtToken') || localStorage.getItem('jwtToken');
            if (!token) {
                console.error("인증 토큰이 없습니다. 로그인이 필요합니다.");
                alert("로그인이 필요합니다.");
                return;
            }

            // 진료 기록 조회
            const medicalResponse = await fetch(`/medical/detail/${studyKey}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            let medicalData = {};
            if (!medicalResponse.ok) {
                console.log(`진료 기록 조회 실패: ${medicalResponse.status}`);
            } else {
                medicalData = await medicalResponse.json();
            }

            document.getElementById("doctor-name").innerText = medicalData.username || "정보 없음";
            document.getElementById("patient-symptoms").innerText = medicalData.patientSymptoms || "정보 없음";
            document.getElementById("order-description").innerText = medicalData.orderDesc || "정보 없음";
            document.getElementById("medical-date").innerText = medicalData.medicalDate ?
                new Date(medicalData.medicalDate).toISOString().split('T')[0] : "정보 없음";

            recode.style.display = "block";
            window.toggleRecord = true;

            const closeButton = document.createElement('button');
            closeButton.innerText = "닫기";
            closeButton.style.marginTop = "10px";
            recode.appendChild(closeButton);
            closeButton.addEventListener('click', () => {
                recode.style.display = "none";
                window.toggleRecord = false;
            });
        }
    });
});