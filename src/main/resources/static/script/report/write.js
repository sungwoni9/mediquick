document.addEventListener("DOMContentLoaded", async e => {
    const form = document.querySelector("form");
    const studykey = 1;
    let hasExistingReport = false;

    await fetchPatientData(studykey);
    hasExistingReport = await fetchFindingData(studykey);

    form.addEventListener("submit", async e => {
        e.preventDefault();

        const data = {
            code: hasExistingReport.code,
            radiologistName: document.querySelector('input[name="radiologistName"]').value,
            institutionName: document.querySelector('input[name="institutionName"]').value,
            urgencyLevel: document.querySelector('input[name="urgencyLevel"]:checked')?.value,
            reportStatus: document.querySelector('input[name="reportStatus"]:checked')?.value,
            comparisonStudies: document.querySelector('#previous').value,
            possibleDiagnosis: document.querySelector('input[name="possibleDiagnosis"]').value,
            clinicalSignificance: document.querySelector('input[name="clinicalSignificance"]').value,
            morphology: document.querySelector('input[name="morphology"]').value,
            lesionCount: document.querySelector('input[name="lesionCount"]').value,
            lesionSize: document.querySelector('input[name="lesionSize"]').value,
            lesionLocation: document.querySelector('input[name="lesionLocation"]').value,
            normal: document.querySelector('input[name="normal"]:checked')?.value,
            recommendedStudies: document.querySelector('input[name="recommendedStudies"]:checked')?.value,
            additionalFindings: document.querySelector('#findings').value,
            additionalComment: document.querySelector('#opinion').value,
            additionalNotes: document.querySelector('input[name="additionalNotes"]').value
        };

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
            method: hasExistingReport.code !== null ? "PUT" : "POST",
            headers: myHeaders,
            body: JSON.stringify(data)
        };

        const url = hasExistingReport ? `/report` : `/report/write`;
        const response = await fetch(url, requestOptions);

        if(response.ok) {
            alert(`판독 소견서가 ${hasExistingReport ? "수정" : "저장"}되었습니다.`);
        }
    });
});

function formatDate(dateString) {
    if (!dateString || dateString.length !== 8) return "date error";
    return `${dateString.substring(0, 4)}-${dateString.substring(4, 6)}-${dateString.substring(6, 8)}`;
}

// 환자 정보 로드 메서드
async function fetchPatientData(studykey) {
    try {
        const response = await fetch(`/report/patient/${studykey}`);
        if (!response.ok) {
            console.log("환자정보를 찾을 수 없습니다.");
            return;
        }
        const data = await response.json();
        document.getElementById("chartNo").innerText = data.pid;
        document.getElementById("patientName").innerText = data.pname;
        document.getElementById("patientGender").innerText = data.psex;
        document.getElementById("patientBirth").innerText = formatDate(data.pbirthdatetime);
    } catch (error) {
        console.error("오류 발생:", error.message);
    }
}

// 소견서 정보 로드 메서드
async function fetchFindingData(studykey) {
    try {
        const response = await fetch(`/report/${studykey}`);
        if (!response.ok) {
            console.log("판독 소견서를 불러오지 못했습니다.");
            return false;
        }

        const data = await response.json();

        document.querySelector('input[name="radiologistName"]').value = data.radiologistName || '';
        document.querySelector('input[name="institutionName"]').value = data.institutionName || '';
        document.querySelector('input[name="possibleDiagnosis"]').value = data.possibleDiagnosis || '';
        document.querySelector('input[name="clinicalSignificance"]').value = data.clinicalSignificance || '';
        document.querySelector('#previous').value = data.comparisonStudies || '';
        document.querySelector('input[name="morphology"]').value = data.morphology || '';
        document.querySelector('input[name="lesionCount"]').value = data.lesionCount || '';
        document.querySelector('input[name="lesionSize"]').value = data.lesionSize || '';
        document.querySelector('input[name="lesionLocation"]').value = data.lesionLocation || '';
        document.querySelector('input[name="additionalNotes"]').value = data.additionalNotes || '';
        document.querySelector('#findings').value = data.additionalFindings || '';
        document.querySelector('#opinion').value = data.additionalComment || '';

        function setRadioButtonValue(name, value) {
            const radioButtons = document.getElementsByName(name);
            radioButtons.forEach(button => {
                button.checked = button.value === String(value);
            });
        }

        setRadioButtonValue('urgencyLevel', data.urgencyLevel);
        setRadioButtonValue('reportStatus', data.reportStatus);
        setRadioButtonValue('normal', data.normal);
        setRadioButtonValue('recommendedStudies', data.recommendedStudies);

        return data;
    } catch (error) {
        console.log(error.message);
        return false;
    }
}
