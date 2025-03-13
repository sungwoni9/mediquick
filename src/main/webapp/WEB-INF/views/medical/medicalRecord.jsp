<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<link rel="stylesheet" href="/style/medical/form.css">

<div class="medical-form" id="medical-form" style="display: none;">
    <form id="medicalRecordForm" style="display: none;">
        <h2>처방전</h2>
        <div class="information">
            <div class="doctor-name">
                진료의: <span id="doctorName">Unknown</span>
            </div>
            <span class="separator">|</span>
            <div class="patient-name">
                환자 성명: <span id="patientName">Unknown</span>
            </div>
            <span class="separator">|</span>
            <div class="study-key">
                <label for="studykey">검사 번호</label>
                <select id="studykey" name="studykey">
                    <option value="">검사를 선택하세요</option>
                </select>
            </div>
        </div>
        <div class="pid">
            <input type="hidden" id="pid" name="pid">
        </div>
        <div class="patient-symptoms">
            <label>환자 증상</label>
            <textarea id="patientSymptoms" name="patientSymptoms" rows="3"></textarea>
        </div>
        <div class="order-desc">
            <label>진료 처방</label>
            <textarea id="orderDesc" name="orderDesc" rows="3"></textarea>
        </div>
        <div class="medical-date">
            <label>진료 날자</label>
            <input type="datetime-local" id="medicalDate" name="medicalDate" required>
        </div>
        <div class="button-container">
            <button type="submit">save</button>
            <button type="button" onclick="closeMedicalForm()">cancel</button>
        </div>
    </form>
</div>
