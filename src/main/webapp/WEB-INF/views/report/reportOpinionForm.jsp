<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>

<div id="report-root">
    <%--  환자 정보--%>
    <div class="grid-table">
        <div>차트번호</div>
        <div id="chartNo">불러오는중...</div>
        <div>성&emsp;&emsp;명</div>
        <div id="patientName">불러오는중...</div>
        <div>성&emsp;&emsp;별</div>
        <div id="patientGender">불러오는중...</div>
        <div>생년월일</div>
        <div id="patientBirth">불러오는중...</div>
    </div>
    <%--  소견 작성 폼 --%>
    <form method="POST" action="<c:url value="/report/write"/>">
        <div id="btn-group">
            <input type="submit" value="save">
            <button id="close">close</button>
        </div>

        <div id="radiologist-grid">
            <p>Radiologist name</p>
            <p>Institution name</p>
            <input type="text" name="radiologistName">
            <input type="text" name="institutionName">
        </div>

        <div id="report-grid">
            <p>Urgency level</p>
            <p>Report status</p>
            <div>
                <div>
                    <input type="radio" id="routine" name="urgencyLevel" value="1" checked>
                    <label for="routine">일반</label>
                </div>
                <div>
                    <input type="radio" id="semi" name="urgencyLevel" value="2">
                    <label for="semi">긴급</label>
                </div>
                <div>
                    <input type="radio" id="urgent" name="urgencyLevel" value="3">
                    <label for="urgent">중요</label>
                </div>
            </div>

            <div>
                <div>
                    <input type="radio" id="draft" name="reportStatus" value="1" checked>
                    <label for="draft">초안</label>
                </div>
                <div>
                    <input type="radio" id="revision" name="reportStatus" value="2">
                    <label for="revision">수정</label>
                </div>

                <div>
                    <input type="radio" id="finalized" name="reportStatus" value="3">
                    <label for="finalized">완료</label>
                </div>
            </div>
        </div>

        <div class="f-tit">
            <p>Previous Medical Records</p>
        </div>
        <textarea id="previous" name="comparisonStudies"></textarea>

        <div class="f-tit">
            <p>Possible diagnosis</p>
        </div>
        <input type="text" name="possibleDiagnosis">

        <div class="f-tit">
            <p>Clinical significance</p>
        </div>
        <input type="text" name="clinicalSignificance">

        <div class="f-tit">
            <p>Morphological Features</p>
        </div>
        <input type="text" name="morphology">

        <div id="lesion-grid">
            <p>Lesions count</p>
            <p>Lesion size</p>
            <p>Lesion location</p>
            <input type="text" name="lesionCount">
            <input type="text" name="lesionSize">
            <input type="text" name="lesionLocation">
        </div>

        <div id="radio-grid">
            <p>Patient status</p>
            <p>Recommended studies</p>
            <div>
                <div>
                    <input type="radio" id="normal" name="normal" value="true" checked>
                    <label for="normal">정상</label>
                </div>
                <div>
                    <input type="radio" id="abnormal" name="normal" value="false">
                    <label for="abnormal">비정상</label>
                </div>
            </div>

            <div>
                <div>
                    <input type="radio" id="necessary" name="recommendedStudies" value="true" checked>
                    <label for="necessary">필요</label>
                </div>

                <div>
                    <input type="radio" id="unnecessary" name="recommendedStudies" value="false">
                    <label for="unnecessary">불필요</label>
                </div>
            </div>
        </div>

        <div class="f-tit">
            <p>Additional findings</p>
        </div>
        <textarea id="findings" name="additionalFindings"></textarea>

        <div class="f-tit">
            <p>Additional opinion</p>
        </div>
        <textarea id="opinion" name="additionalComment"></textarea>

        <div class="f-tit">
            <p>Additional notes</p>
        </div>
        <input type="text" name="additionalNotes">
    </form>
</div>

