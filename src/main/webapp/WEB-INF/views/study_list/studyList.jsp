<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@taglib prefix="c" uri="jakarta.tags.core" %>
<html>
<head>
    <link rel="stylesheet" href="/style/study/form.css">
    <title>검사 리스트</title>
</head>
<c:import url="/header"/>
<body>
<div class="main-container">
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
                </div>
                <div class="form-actions">
                    <button type="submit">Search</button>
                    <button type="button" onclick="resetForm()">Reset</button>
                </div>
            </form>
        </div>
    </div>

    <div class="study-list-container">
        <div id="list-header" class="list-element">
            <div class="study-id">Study Id</div>
            <div class="patients-name">Patients Name</div>
            <div class="study-time">Study Time</div>
            <div class="study-desc">Study Description</div>
            <div class="modality">Modality</div>
            <div class="body-part">BodyPart</div>
            <div class="series-count">Series Count</div>
            <div class="image-count">Image Count</div>
        </div>

        <c:forEach var="study" items="${studies}">
            <div class="list-element" id="study-${study.studykey}">
                <div class="study-id">${study.studykey}</div>
                <div class="patients-name">${study.pname}</div>
                <div class="study-time">${study.studytime}</div>
                <div class="study-desc">${study.studydesc}</div>
                <div class="modality">${study.modality}</div>
                <div class="body-part">${study.bodypart}</div>
                <div class="series-count">${study.seriescnt}</div>
                <div class="image-count">${study.imagecnt}</div>
                <img src="/icons/pacs-icon.png" alt="PACS Icon" class="pacs-button"/>
            </div>
        </c:forEach>
    </div>
</div>
</body>
<script src="/script/studyList.js"></script>
</html>