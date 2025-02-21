document.addEventListener("DOMContentLoaded", e => {
    const form = document.querySelector("form");
    form.addEventListener("submit", async e => {
        e.preventDefault()

        const data = {
            radiologistName: document.querySelector('input[name="radiologistName"]').value,
            institutionName: document.querySelector('input[name="institutionName"]').value,
            urgencyLevel: document.querySelector('input[name="urgencyLevel"]:checked').value,
            reportStatus: document.querySelector('input[name="reportStatus"]:checked').value,
            comparisonStudies: document.querySelector('#previous').value,
            possibleDiagnosis: document.querySelector('input[name="possibleDiagnosis"]').value,
            clinicalSignificance: document.querySelector('input[name="clinicalSignificance"]').value,
            morphology: document.querySelector('input[name="morphology"]').value,
            lesionCount: document.querySelector('input[name="lesionCount"]').value,
            lesionSize: document.querySelector('input[name="lesionSize"]').value,
            lesionLocation: document.querySelector('input[name="lesionLocation"]').value,
            normal: document.querySelector('input[name="normal"]:checked').value,
            recommendedStudies: document.querySelector('input[name="recommendedStudies"]:checked').value,
            additionalFindings: document.querySelector('#findings').value,
            additionalComment: document.querySelector('#opinion').value,
            additionalNotes: document.querySelector('input[name="additionalNotes"]').value
        };

        console.log(data);

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify(data)
        };

        const response = await fetch("http://localhost:8080/report/write", requestOptions);

        if(response.ok) {
            alert("판독 소견서가 저장되었습니다.")
        }
    });
});