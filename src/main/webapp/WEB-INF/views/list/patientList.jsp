<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<html>
<head>
    <link rel="stylesheet" href="/style/list/form.css">
    <title>환자 리스트</title>
</head>
<body>
<div class="main-container">
    <!-- 검색 폼 -->
    <div>
        <div>
            <form id="searchForm" class="search-form">
                <div class="form-row">
                    <div class="form-group">
                        Patients Code
                        <input id="patientCode" name="patientCode" type="text" placeholder="Enter patient code">
                    </div>
                    <div class="form-group">
                        Patients Name
                        <input id="patientName" name="patientName" type="text" placeholder="Enter patient name">
                    </div>
                    <div class="form-group">
                        Patient Sex
                        <input id="patientSex" name="patientSex" type="text" placeholder="Enter patient sex">
                    </div>
                    <div class="form-group">
                        Patient Birth
                        <input id="patientBirth" name="patientBirth" type="text" placeholder="Enter patient birth">
                    </div>
                </div>
                <div class="form-actions">
                    <button type="submit">Search</button>
                    <button type="button" onclick="resetForm()">Reset</button>
                </div>
            </form>
        </div>
    </div>

    <!-- 환자 리스트 -->
    <div class="patient-list-container">
        <div id="list-header" class="list-element">
            <div class="patient-code">Patient Code</div>
            <div class="patient-name">Patient Name</div>
            <div class="patient-sex">Patient Sex</div>
            <div class="patient-birth">Patient Birth</div>
        </div>

        <c:forEach var="patient" items="${patient}">
            <div class="list-element" id="patient-${patient.pid}">
                <div class="patient-code">${patient.pid}</div>
                <div class="patient-name">${patient.pname}</div>
                <div class="patient-sex">${patient.psex}</div>
                <div class="patient-birth">${patient.pbirthdate}</div>
            </div>
        </c:forEach>
    </div>
</div>
</body>
</html>