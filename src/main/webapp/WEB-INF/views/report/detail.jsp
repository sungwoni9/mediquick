<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@taglib prefix="c" uri="jakarta.tags.core" %>

<div id="recode">
    <div id="top">
        <p>Chart No :</p>
        <p id="chartNo"></p>
        <p>Name :</p>
        <p id="patientName"></p>
        <p>Birth :</p>
        <p id="patientBirth"></p>
        <p>Gender :</p>
        <p id="patientGender"></p>
    </div>

    <div id="wrap">
        <%-- 진료기록 --%>
        <div class="medi-grid">
            <div class="grid-item"><p class="label">진료의 :</p><p class="value" id="test1">NULL</p></div>
            <div class="grid-item"><p class="label">병원/기관명 :</p><p class="value" id="test2">NULL</p></div>
            <div class="grid-item"><p class="label">소속 부서 :</p><p class="value" id="test3">NULL</p></div>
            <div class="grid-item"><p class="label">처방전 :</p><p class="value" id="test4">NULL</p></div>
            <div class="grid-item"><p class="label">진료일 :</p><p class="value" id="test5">NULL</p></div>
        </div>
        <%-- 판독--%>
        <div class="grid">
            <div class="grid-item"><p class="label">판독의 :</p><p class="value" id="reader">판독 정보가 없습니다.</p></div>
            <div class="grid-item"><p class="label">병원/기관명 :</p><p class="value" id="hospital">판독 정보가 없습니다.</p></div>
            <div class="grid-item"><p class="label">판독 등급 :</p><p class="value" id="report-level">판독 정보가 없습니다.</p></div>
            <div class="grid-item"><p class="label">정상/비정상 여부 :</p><p class="value" id="normal-status">판독 정보가 없습니다.</p></div>
            <div class="grid-item"><p class="label">추가 검사 필요 여부 :</p><p class="value" id="additional-exam-needed"></p></div>
            <div class="grid-item"><p class="label">병변 위치 :</p><p class="value" id="lesion-location">판독 정보가 없습니다.</p></div>
            <div class="grid-item"><p class="label">병변 크기 :</p><p class="value" id="lesion-size">판독 정보가 없습니다.</p></div>
            <div class="grid-item"><p class="label">병변 수 :</p><p class="value" id="lesion-count">판독 정보가 없습니다.</p></div>
            <div class="grid-item"><p class="label">형태학적 특징 :</p><p class="value" id="morphological-features">판독 정보가 없습니다.</p></div>
            <div class="grid-item"><p class="label">특이 소견 :</p><p class="value" id="special-findings">판독 정보가 없습니다.</p></div>
            <div class="grid-item"><p class="label">의심되는 진단명 :</p><p class="value" id="suspected-diagnosis">판독 정보가 없습니다.</p></div>
            <div class="grid-item"><p class="label">임상적 의미 :</p><p class="value" id="clinical-significance">판독 정보가 없습니다.</p></div>
            <div class="grid-item"><p class="label">참고할 과거 검사 :</p><p class="value" id="past-exam-reference">판독 정보가 없습니다.</p></div>
            <div class="grid-item"><p class="label">추가적인 소견 :</p><p class="value" id="additional-comments">판독 정보가 없습니다.</p></div>
            <div class="grid-item"><p class="label">전달 사항 :</p><p class="value" id="notes">판독 정보가 없습니다.</p></div>
            <div class="grid-item"><p class="label">보고서 상태 :</p><p class="value" id="report-status">판독 정보가 없습니다.</p></div>
            <div class="grid-item"><p class="label">보고 날짜 :</p><p class="value" id="report-date">판독 정보가 없습니다.</p></div>
        </div>
    </div>
</div>