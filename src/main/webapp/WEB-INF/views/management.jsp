<%--
  Created by IntelliJ IDEA.
  User: TJ
  Date: 25. 2. 19.
  Time: 오후 1:58
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<html>
<head>
    <title>관리자 화면</title>
    <link rel="stylesheet" href="/style/global.css">
    <link rel="stylesheet" href="/style/reset.css">
    <script type="module" src="/script/validation-management.js"></script>
</head>
<c:import url="/header"/>
<body>
<div id="content-container">
    <button class="button" id="btn-user">사용자 관리</button>
    <button class="button" id="btn-log">로그 조회</button>
</div>

</body>
<c:import url="/footer"/>
</html>
