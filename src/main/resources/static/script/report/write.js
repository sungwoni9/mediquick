let isReportOpen = false;
const reportButton = document.querySelector('#report-btn');
const closeButton = document.querySelector('#report-root #close');
const resetButton = document.querySelector('#report-root #reset');

// 필드 전체 reset
resetButton.addEventListener("click", () => {
    document.querySelector('input[name="radiologistName"]').value = '';
    document.querySelector('input[name="institutionName"]').value = '';
    document.querySelector('input[name="possibleDiagnosis"]').value = '';
    document.querySelector('input[name="clinicalSignificance"]').value = '';
    document.querySelector('input[name="morphology"]').value = '';
    document.querySelector('input[name="lesionCount"]').value = '';
    document.querySelector('input[name="lesionSize"]').value = '';
    document.querySelector('input[name="lesionLocation"]').value = '';
    document.querySelector('input[name="additionalNotes"]').value = '';
    document.querySelector('#previous').value = '';
    document.querySelector('#findings').value = '';
    document.querySelector('#opinion').value = '';

    setDefaultRadioButtons();
});

closeButton.addEventListener("click",()=>{
    const root = document.querySelector("#report-root");
    root.style.display = 'none';
    isReportOpen = false;
})

reportButton.addEventListener("click", async () => {
    const root = document.querySelector("#report-root");

    if (isReportOpen) {
        root.style.display = 'none';
        isReportOpen = false;
        return;
    }

    isReportOpen = true;
    root.style.display = 'flex';

    const form = document.querySelector("#report-root form");
    const urlParams = new URLSearchParams(window.location.search);
    const studykey = urlParams.get('studyKey');
    let hasExistingReport = false;

    await fetchPatientData(studykey);
    hasExistingReport = await fetchFindingData(studykey);

    if(!hasExistingReport) {
        setDefaultRadioButtons();
    }

    form.addEventListener("submit", async (e) =>  await submitForm(e, hasExistingReport ,studykey));
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
        console.error("error:", error.message);
    }
}



// 소견서 정보 로드 메서드
async function fetchFindingData(studykey) {
    try {
        let response = await fetch(`/report/${studykey}`);

        if(response.status === 404) {
            response = await fetch(`/report/tab/${studykey}`);
        }

        if (!response.ok) {
            return false;
        }
        const data = await response.json();

        document.querySelector('input[name="radiologistName"]').value = data.radiologistName || data.readingerid || '';
        document.querySelector('input[name="institutionName"]').value = data.institutionName || '';
        document.querySelector('input[name="possibleDiagnosis"]').value = data.possibleDiagnosis ||data.studydesc || '';
        document.querySelector('input[name="clinicalSignificance"]').value = data.clinicalSignificance || data.modality || '';
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

        return data.code !== undefined ? data : false;
    } catch (error) {
        console.log(error.message);
        return false;
    }
}

async function submitForm(event, hasExistingReport, studykey) {
    event.preventDefault();

    const data = {
        code: hasExistingReport?.code,
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
        method: hasExistingReport.code !== undefined ? "PUT" : "POST",
        headers: myHeaders,
        body: JSON.stringify(data)
    };

    const url = hasExistingReport ? `/report` : `/report/write/${studykey}`;
    let response = await fetch(url, requestOptions);

    if(response.status === 409) {
        location.reload();
    }

    if (response.ok) {
        alert(`판독 소견서가 ${hasExistingReport ? "수정" : "저장"}되었습니다.`);
    }
}

function setDefaultRadioButtons() {
    const radioGroups = ['urgencyLevel', 'reportStatus', 'normal', 'recommendedStudies'];

    radioGroups.forEach(name => {
        const radioButtons = document.getElementsByName(name);
        if (radioButtons.length > 0) {
            radioButtons[0].checked = true;
        }
    });
}