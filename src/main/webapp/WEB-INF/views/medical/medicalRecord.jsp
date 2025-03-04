<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<link rel="stylesheet" href="/style/medical/form.css">

<div class="medical-form" id="medical-form" style="display: none;">
    <form id="medicalRecordForm" style="display: none;">
        <div>진료의: <span th:text="${doctorName}"></span></div>
        <label>검사 번호</label>
        <textarea id="studykey" name="studykey" rows="3"></textarea>
        <div>환자 이름: <span th:text="${patientName}"></span></div>
        <input type="hidden" id="pid" name="pid">
        <label>환자 증상</label>
        <textarea id="patientSymptoms" name="patientSymptoms" rows="3"></textarea>
        <label>처방 내용</label>
        <textarea id="orderDesc" name="orderDesc" rows="3"></textarea>
        <label>진료 날짜</label>
        <input type="datetime-local" id="medicalDate" name="medicalDate" required>
        <button type="submit">저장</button>
        <button type="button" onclick="closeMedicalForm()">취소</button>
    </form>
</div>
