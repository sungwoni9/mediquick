<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<div class="medical-form" id="medical-form" style="display: none;">
    <h3>진료 기록 작성 <span class="toggle-icon" onclick="toggleMedicalForm()">▼</span></h3>
    <form id="medicalRecordForm" style="display: none;">
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