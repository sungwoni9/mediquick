<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<html>
<head>
    <link rel="stylesheet" href="/style/list/form.css">
    <title>진료 리스트</title>
</head>
<body>
<div class="main-container">
    <!-- 검색 폼 -->
    <div>
        <div>
            <form id="searchForm" class="search-form">
                <div class="form-row">
                    <div class="form-group">
                        Record Code
                        <input id="recordCode" name="code" type="text" placeholder="Enter record code">
                    </div>
                    <div class="form-group">
                        Patient Code
                        <input id="patientCode" name="pid" type="text" placeholder="Enter patient code">
                    </div>
                    <div class="form-group">
                        Username
                        <input id="username" name="username" type="text" placeholder="Enter username">
                    </div>
                    <div class="form-group">
                        Medical Date
                        <input id="medicalDate" name="medicalDate" type="text" placeholder="Enter medical date">
                    </div>
                </div>
                <div class="form-actions">
                    <button type="submit">Search</button>
                    <button type="button" onclick="resetForm()">Reset</button>
                </div>
            </form>
        </div>
    </div>

    <!-- 진료 리스트 -->
    <div class="medical-list-container">
        <div id="list-header" class="list-element">
            <div class="record-code">Record Code</div>
            <div class="patient-name">patient name</div>
            <div class="patient-code">Patient Code</div>
            <div class="username">Medical Doctor</div>
            <div class="patient-symptoms">Patient Symptoms</div>
            <div class="order-desc">Order Description</div>
            <div class="medical-date">Medical Date</div>
        </div>

        <c:forEach var="medical" items="${medical}">
            <div class="list-element" id="medical-${medical.code}">
                <div class="record-code">${medical.code}</div>
                <div class="username">${medical.username}</div>
                <div class="patient-code">${medical.pid}</div>
                <div class="patient-name">${medical.pname != null ? medical.pname : '-'}</div>
                <div class="patient-symptoms">${medical.patientSymptoms}</div>
                <div class="order-desc">${medical.orderDesc}</div>
                <div class="medical-date">${medical.medicalDate}</div>
            </div>
        </c:forEach>
    </div>
</div>
</body>
</html>