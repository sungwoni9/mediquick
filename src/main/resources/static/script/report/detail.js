document.addEventListener("DOMContentLoaded", async ()=>{
    // 클릭한 리스트의 studykey 넣기
    const studykey = 1;

    await fetchPatientData(studykey);
    await fetchFindingData(studykey);

    function formatDate(dateString) {
        return `${dateString.slice(0, 4)}-${dateString.slice(4, 6)}-${dateString.slice(6, 8)}`;
    }

    async function fetchPatientData(studykey) {
        try {
            const response = await fetch(`/report/patient/${studykey}`);
            if (!response.ok) {
                console.log("환자정보를 찾을 수 없습니다.");
                return;
            }
            const data = await response.json();
            document.getElementById("chartNo").innerText = data.pid + " / ";
            document.getElementById("patientName").innerText = data.pname + " / ";
            document.getElementById("patientBirth").innerText = formatDate(data.pbirthdatetime) + " / ";
            document.getElementById("patientGender").innerText = data.psex;
        } catch (error) {
            console.error("오류 발생:", error.message);
        }
    }

    async function fetchFindingData(studykey) {
        const response = await fetch(`/report/${studykey}`);
        if (!response.ok) {
            console.log("판독 소견서를 불러오지 못했습니다.");
            return false;
        }

        const data = await response.json();
        // 판독 레벨
        let urgencyText = '';
        let textColor = '';
        if (data.urgencyLevel === 1) {
            urgencyText = '일반';
            textColor = 'green';
        } else if (data.urgencyLevel === 2) {
            urgencyText = '중요';
            textColor = 'orange';
        } else if (data.urgencyLevel === 3) {
            urgencyText = '긴급';
            textColor = 'red';
        }
        // 보고서 상태
        let reportStatus = '';
        if (data.reportStatus === 1) {
            reportStatus = '초안';
        } else if (data.reportStatus === 2) {
            reportStatus = '수정 필요';
        } else if (data.reportStatus === 3) {
            reportStatus = '판독 완료';
        }
        // 보고서 날짜
        const formattedDate = new Date(data.regDate).toISOString().split('T')[0];
        document.getElementById("reader").textContent = data.radiologistName;
        document.getElementById("hospital").textContent = data.institutionName;
        document.getElementById("report-level").textContent = urgencyText;
        const urgencyTextEl = document.getElementById("report-level");
        urgencyTextEl.textContent = urgencyText;
        urgencyTextEl.style.color = textColor;
        document.getElementById("normal-status").textContent = data.normal ? "정상" : "비정상";
        document.getElementById("additional-exam-needed").textContent = data.recommendedStudies ? "필요" : "불필요";
        document.getElementById("lesion-location").textContent = data.lesionLocation;
        document.getElementById("lesion-size").textContent = data.lesionSize;
        document.getElementById("lesion-count").textContent = data.lesionCount;
        document.getElementById("morphological-features").textContent = data.morphology;
        document.getElementById("special-findings").textContent = data.additionalFindings;
        document.getElementById("suspected-diagnosis").textContent = data.possibleDiagnosis;
        document.getElementById("clinical-significance").textContent = data.clinicalSignificance;
        document.getElementById("past-exam-reference").textContent = data.comparisonStudies;
        document.getElementById("additional-comments").textContent = data.additionalComment;
        document.getElementById("notes").textContent = data.additionalNotes;
        document.getElementById("report-status").textContent = reportStatus;
        document.getElementById("report-date").textContent = formattedDate;
    }
})