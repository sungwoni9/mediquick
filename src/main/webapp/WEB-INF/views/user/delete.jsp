<%--
  Created by IntelliJ IDEA.
  User: TJ
  Date: 2025-02-20
  Time: 오후 12:12
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<html>
<head>
    <title>Delete account</title>
</head>
<c:import url="/header"/>
<body>
<div id="content-container">
    <h2>Delete account</h2>
    <form method="POST" action="/user/delete">
        <input type="password" name="password" id="password" placeholder="password">
        <p id="error-msg-password" class="error-msg"></p>
        <input type="submit" value="Delete">
    </form>
</div>
</body>
<c:import url="/footer"/>
</html>
