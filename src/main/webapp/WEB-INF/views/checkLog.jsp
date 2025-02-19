<%--
  Created by IntelliJ IDEA.
  User: TJ
  Date: 25. 2. 19.
  Time: 오후 2:57
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<html>
<head>
    <title>로그 조회</title>
    <link rel="stylesheet" href="/style/global.css">
    <link rel="stylesheet" href="/style/reset.css">
</head>
<c:import url="/header"/>
<body>
<div id="content-container">
    <h2>사용자 목록</h2>
    <div class="table-content">
        <table class="user-table">
            <thead>
            <tr>
                <th>아이디</th>
                <th>이름</th>
                <th>이메일</th>
                <th>연락처</th>
                <th>주소</th>
                <th>소속 병원</th>
                <th>소속 부서</th>
                <th>삭제 여부</th>
                <th>삭제 날짜</th>
                <th>가입 일시</th>
                <th>수정 일시</th>
            </tr>
            </thead>
        </table>
    </div>
</div>
</body>
<c:import url="/footer"/>
</html>
