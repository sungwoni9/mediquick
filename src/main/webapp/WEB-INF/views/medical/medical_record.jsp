<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@taglib prefix="c" uri="jakarta.tags.core" %>
<html>
<head>
    <title>Medical Record Creation</title>
    <link rel="stylesheet" href="/style/medical_record/form.css">
</head>
<c:import url="/header"/>
<body>
<c:import url="/layout/navigation"/>
<div class="medical-record-container">
    <h2>진료 기록 작성</h2>
    <form id="medicalRecordForm" action="/medical-records" method="post" class="medical-record-form">
        <div class="form-row">
            <div class="form-group">
                <label for="username">의사 이름 (Username):</label>
                <input type="text" id="username" name="username" value="${pageContext.request.userPrincipal.name}" readonly
                       placeholder="현재 로그인된 사용자 이름">
            </div>
            <div class="form-group">
                <label for="pid">환자 ID (PID):</label>
                <input type="text" id="pid" name="pid" required placeholder="환자 ID 입력 (예: PAT001)">
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label for="patientSymptoms">환자 증상:</label>
                <textarea id="patientSymptoms" name="patientSymptoms" required
                          placeholder="환자의 증상 입력 (예: Headache and fever)"></textarea>
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label for="orderDesc">처방 내용:</label>
                <textarea id="orderDesc" name="orderDesc" required
                          placeholder="의사의 처방 내용 입력 (예: Prescribe painkillers and monitor)"></textarea>
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label for="medicalDate">진료 날짜:</label>
                <input type="datetime-local" id="medicalDate" name="medicalDate" required
                       value="${currentDateTime}">
            </div>
        </div>
        <div class="form-actions">
            <button type="submit">저장</button>
        </div>
    </form>
</div>
</body>
</html>