<%--
  Created by IntelliJ IDEA.
  User: TJ
  Date: 2025-02-20
  Time: 오전 11:32
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<html>
<head>
    <title>Register account</title>
</head>
<c:import url="/header"/>
<body>
<div id="content-container">
    <h2>Create an account</h2>
    <form method="POST" action="user/register">
        <input type="text" name="username" id="username" placeholder="Username">
        <p id="error-msg-username" class="error-msg"></p>
        <input type="password" name="password" id="password" placeholder="Password">
        <p id="error-msg-password" class="error-msg"></p>
        <input type="password" name="password-chk" id="password-chk" placeholder="Password check">
        <p id="error-msg-password-chk" class="error-msg"></p>
        <input type="text" name="contact" id="contact" placeholder="Contact">
        <p id="error-msg-contact" class="error-msg"></p>
        <input type="text" name="email" id="email" placeholder="Email">
        <p id="error-msg-email" class="error-msg"></p>
        <div>
            <input type="text" name="address" id="address" placeholder="Address">
            <p id="error-msg-address" class="error-msg"></p>
            <input type="text" name="detailed-address" id="detailed-address" placeholder="Detailed Address">
            <p id="error-msg-detailed-address" class="error-msg"></p>
        </div>
        <div>
            <input type="text" name="hospital" id="hospital" placeholder="Hospital Affililation">
            <p id="error-msg-hospital" class="error-msg"></p>
            <input type="text" name="department" id="department" placeholder="Department">
            <p id="error-msg-department" class="error-msg"></p>
        </div>
        <input type="submit" value="Register">
    </form>
</div>
</body>
<c:import url="/footer"/>
</html>
