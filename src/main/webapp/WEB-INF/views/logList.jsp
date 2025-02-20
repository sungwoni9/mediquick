<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<html>
<head>
    <title>로그 리스트</title>
    <link rel="stylesheet" href="/style/global.css">
    <link rel="stylesheet" href="/style/reset.css">
    <link rel="stylesheet" href="/style/admin/log.css">
    <script type="module" src="/script/logList.js"></script>
</head>
<c:import url="/header"/>
<body>
<div id="content-container">
    <div id="search-container">
        <label for="log-select">조회할 로그 :</label>
        <select id="log-select" name="log-select">
            <option value="" selected disabled>선택</option>
            <option value="login">로그인</option>
            <option value="logout">로그아웃</option>
            <option value="view">영상 조회</option>
            <option value="medical">진료 조회</option>
            <option value="admin">관리자 활동 로그</option>
        </select>
        <button id="btn-search">검색</button>
    </div>

    <div class="table-content">
        <table class="log-list">
            <thead>
            <tr>
                <th>날짜</th>
                <th>내용</th>
            </tr>
            </thead>
            <tbody id="log-table-body">
            <tr>
                <td colspan="2">로그 리스트</td>
            </tr>
            </tbody>
        </table>
    </div>
</div>
</body>
<c:import url="/footer"/>
</html>
