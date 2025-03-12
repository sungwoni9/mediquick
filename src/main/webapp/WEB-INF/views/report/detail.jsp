<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@taglib prefix="c" uri="jakarta.tags.core" %>

<div id="recode">
    <div id="top">
        <p>Chart No</p>
        <p id="chartNo"></p>
        <p>Name</p>
        <p id="patientName"></p>
        <p>Birth</p>
        <p id="patientBirth"></p>
        <p>Gender</p>
        <p id="patientGender"></p>
    </div>

    <div id="wrap">
        <div class="grid">
            <div class="grid-item"><p class="label">진료의</p><p class="value" id="doctor-name">작성 내역이 비어있습니다.</p></div>
            <div class="grid-item"><p class="label">판독의</p><p class="value" id="reader">작성 내역이 비어있습니다.</p></div>
            <div class="grid-item"><p class="label">진료 날짜</p><p class="value" id="medical-date">작성 내역이 비어있습니다.</p></div>
            <div class="grid-item"><p class="label">판독 날짜</p><p class="value" id="report-date">작성 내역이 비어있습니다.</p></div>
            <div class="grid-item"><p class="label">병원/기관명</p><p class="value" id="hospital">작성 내역이 비어있습니다.</p></div>
            <div class="grid-item"><p class="label">환자 증상</p><p class="value" id="patient-symptoms">작성 내역이 비어있습니다.</p></div>
            <div class="grid-item"><p class="label">의사 처방</p><textarea disabled class="value" id="order-description">작성 내역이 비어있습니다.</textarea></div>
            <div class="grid-item"><p class="label">참고할 과거 검사</p><textarea disabled class="value" id="past-exam-reference">작성 내역이 비어있습니다.</textarea></div>
            <div class="grid-item"><p class="label">추가 검사 필요 여부</p><p class="value" id="additional-exam-needed">작성 내역이 비어있습니다.</p></div>
            <div class="grid-item"><p class="label">병변 위치</p><p class="value" id="lesion-location">작성 내역이 비어있습니다.</p></div>
            <div class="grid-item"><p class="label">병변 크기</p><p class="value" id="lesion-size">작성 내역이 비어있습니다.</p></div>
            <div class="grid-item"><p class="label">병변 수</p><p class="value" id="lesion-count">작성 내역이 비어있습니다.</p></div>
            <div class="grid-item"><p class="label">형태학적 특징</p><p class="value" id="morphological-features">작성 내역이 비어있습니다.</p></div>
            <div class="grid-item"><p class="label">임상적 의미</p><p class="value" id="clinical-significance">작성 내역이 비어있습니다.</p></div>
            <div class="grid-item"><p class="label">정상/비정상 여부</p><p class="value" id="normal-status">작성 내역이 비어있습니다.</p></div>
            <div class="grid-item"><p class="label">의심되는 진단명</p><p class="value" id="suspected-diagnosis">작성 내역이 비어있습니다.</p></div>
            <div class="grid-item"><p class="label">특이 소견</p><textarea disabled class="value" id="special-findings">작성 내역이 비어있습니다.</textarea></div>
            <div class="grid-item"><p class="label">추가적인 소견</p><textarea disabled class="value" id="additional-comments">작성 내역이 비어있습니다.</textarea></div>
            <div class="grid-item"><p class="label">전달 사항</p><p class="value" id="notes">작성 내역이 비어있습니다.</p></div>
            <div class="grid-item"><p class="label">보고서 상태</p><p class="value" id="report-status">작성 내역이 비어있습니다.</p></div>
            <div class="grid-item"><p class="label">판독 등급</p><p class="value" id="report-level">작성 내역이 비어있습니다.</p></div>
        </div>
    <button id="close-recode">CLOSE</button>
    </div>
</div>

