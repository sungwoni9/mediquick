<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<link rel="stylesheet" href="/style/medical/form.css">

<div class="medical-form" id="medical-form" style="display: none;">
    <form id="medicalRecordForm" style="display: none;">
        <div>Doctor: <span id="doctorName"></span></div>
        <label>Study Key</label>
        <textarea id="studykey" name="studykey" rows="3"></textarea>
        <div>Patient name: <span id="patientName"></span></div>
        <input type="hidden" id="pid" name="pid">
        <label>patient Symptoms</label>
        <textarea id="patientSymptoms" name="patientSymptoms" rows="3"></textarea>
        <label>Order Desc</label>
        <textarea id="orderDesc" name="orderDesc" rows="3"></textarea>
        <label>Medical Date</label>
        <input type="datetime-local" id="medicalDate" name="medicalDate" required>
        <button type="submit">save</button>
        <button type="button" onclick="closeMedicalForm()">cancel</button>
    </form>
</div>
