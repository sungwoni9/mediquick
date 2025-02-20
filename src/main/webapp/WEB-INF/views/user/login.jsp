<%--
  Created by IntelliJ IDEA.
  User: TJ
  Date: 2025-02-20
  Time: 오전 11:41
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<html>
<head>
    <title>Log in</title>
</head>
<c:import url="/header"/>
<body>
<div id="content-container">
    <h2>Log in</h2>
    <form method="POST" action="/user/login">
        <input type="text" name="username" id="username" placeholder="username">
        <p id="error-msg-username" class="error-msg"></p>
        <input type="password" name="password" id="password" placeholder="password">
        <p id="error-msg-password" class="error-msg"></p>
        <input type="submit" value="Log in">
    </form>
</div>
</body>
<c:import url="/footer"/>
</html>
