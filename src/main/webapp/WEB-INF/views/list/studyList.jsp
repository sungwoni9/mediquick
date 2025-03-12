<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@taglib prefix="c" uri="jakarta.tags.core" %>
<html>
<head>
    <link rel="stylesheet" href="/style/list/form.css">
    <title>검사 리스트</title>
</head>
<body>
<div class="main-container">
    <!-- 검색 폼 -->
    <div>
        <div>
            <form id="searchForm" class="search-form">
                <div class="form-row">
                    <div class="form-group">
                        Patients Name
                        <input id="patientName" name="patientName" type="text" placeholder="Enter patient name">
                    </div>
                    <div class="form-group">
                        Study Time
                        <input id="studyTime" name="studyTime" type="text" placeholder="Enter study time">
                    </div>
                    <div class="form-group">
                        Modality
                        <input id="modality" name="modality" type="text" placeholder="Enter modality">
                    </div>
                    <div class="form-group">
                        BodyPart
                        <input id="bodyPart" name="bodyPart" type="text" placeholder="Enter body part">
                    </div>
                    <div class="form-group">
                        Report Status
                        <select id="urgencyLevel" name="urgencyLevel">
                            <option value="">All</option>
                            <option value="none">None</option>
                            <option value="bad">Bad</option>
                            <option value="normal">Normal</option>
                            <option value="good">Good</option>
                        </select>
                    </div>
                </div>
                <div class="form-actions">
                    <button type="submit">Search</button>
                    <button type="button">Reset</button>
                </div>
            </form>
        </div>
    </div>

    <!-- 검사 리스트 -->
    <div class="study-list-container">
        <div id="list-header" class="list-element">
            <div class="study-id">Study Key</div>
            <div class="patient-id">Patients Id</div>
            <div class="patient-name">Patients Name</div>
            <div class="study-time">Study Time</div>
            <div class="study-desc">Study Description</div>
            <div class="modality">Modality</div>
            <div class="body-part">BodyPart</div>
            <div class="series-count">Series Count</div>
            <div class="image-count">Image Count</div>
            <div class="urgency-level">Urgency Level</div>
            <div class="pacs-viewer">Pacs Viewer</div>
        </div>

        <c:forEach var="study" items="${studies}">
            <div class="list-element" id="study-${study.studykey}">
                <div class="study-key">${study.studykey}</div>
                <div class="patient-id">${study.pid}</div>
                <div class="patient-name">${study.pname}</div>
                <div class="study-time">${study.studytime}</div>
                <div class="study-desc">${study.studydesc}</div>
                <div class="modality">${study.modality}</div>
                <div class="body-part">${study.bodypart}</div>
                <div class="series-count">${study.seriescnt}</div>
                <div class="image-count">${study.imagecnt}</div>
                <img class="pacs-button" src="/icons/pacs-icon.png" alt="PACS Icon"/>
            </div>
        </c:forEach>
    </div>
</div>
</body>
</html>