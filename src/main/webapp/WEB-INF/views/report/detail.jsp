<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@taglib prefix="c" uri="jakarta.tags.core" %>
<html>
<head>
    <link rel="stylesheet" href="/style/report/detail.css">
    <title>진료/판독 조회</title>
</head>
<c:import url="/header"/>
<body>
<div id="recode">
    <div id="top">MS0001 / Anonymous / 1979-01-22 / F</div>
    <div id="wrap">

<%-- 진료기록 --%>
        <div>
            <p>환자 증상 : </p>
            <p>의사 처방전 : </p>
            <p>진료의 이름 : </p>
            <p>병원/기관명 : </p>
            <p>소속 부서 : </p>
            <p>진료 날짜 : 2024-03-23</p>
        </div>


<%-- 판독--%>
        <div>
            <p>정상/비정상 여부 : 정상 </p>
            <p>추가 검사 필요 여부 : 불필요 </p>
            <p>병변 위치 : 우측 신장 상부 </p>
            <p>병변 크기 : 5cm </p>
            <p>병변 수 : 6 </p>
            <p>형태학적 특징 : Round </p>
            <p>특이 소견 : No additional findings</p>
            <p>의심되는 진단명 : No additional findings </p>
            <p>임상적 의미 : No additional findings </p>
            <p>참고할 과거 검사 : No additional findings</p>
            <p>추가적인 소견 : No additional findings </p>
            <p>전달 사항 : No additional findings</p>
            <p>판독의 이름 : tester</p>
            <p>병원/기관명 : 신촌연세병원</p>
            <p>소속부서 : 내과</p>
            <p>판독 등급 : 중요</p>
            <p>보고서 상태 : 초안</p>
            <p>보고 날짜 : 2023-06-22</p>
        </div>
    </div>

</div>
</body>
</html>
