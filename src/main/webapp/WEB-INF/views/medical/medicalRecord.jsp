<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<link rel="stylesheet" href="/style/medical/form.css">

<div class="medical-form" id="medical-form" style="display: none;">
    <form id="medicalRecordForm" style="display: none;">
        <h2>Medical Certicicate</h2>
        <div class="doctor-name">
            Doctor: <span
                id="doctorName"><%= session.getAttribute("username") != null ? session.getAttribute("username") : "Unknown" %></span>
        </div>
        <div class="patient-name">
            Patient name: <span id="patientName"></span>
        </div>
        <div class="study-key">
            <label>Study Key</label>
            <textarea id="studykey" name="studykey" rows="3"></textarea>
        </div>
        <div class="pid">
            <input type="hidden" id="pid" name="pid">
        </div>
        <div class="patient-symptoms">
            <label>patient Symptoms</label>
            <textarea id="patientSymptoms" name="patientSymptoms" rows="3"></textarea>
        </div>
        <div class="order-desc">
            <label>Order Desc</label>
            <textarea id="orderDesc" name="orderDesc" rows="3"></textarea>
        </div>
        <div class="medical-date">
            <label>Medical Date</label>
            <input type="datetime-local" id="medicalDate" name="medicalDate" required>
        </div>
        <div class="button-container">
            <button type="submit">save</button>
            <button type="button" onclick="closeMedicalForm()">cancel</button>
        </div>
    </form>
</div>
