<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<html>
<head>
    <link rel="stylesheet" href="/style/user/login.css">
    <script src="/script/user/login.js"></script>
    <link rel="stylesheet" href="/style/user/form.css">
    <title>Log in</title>
</head>
<c:import url="/header"/>
<body>
<div id="content-container">
    <h2 id="tit">Login</h2>
    <form id="login-form">
        <input type="text" name="username" id="username" placeholder="username">
        <input type="password" name="password" id="password" placeholder="password">
        <input type="submit" value="Login" id="login-btn">
        <p id="find-password"><a href="">Forget your Password?</a></p>

        <div id="no-acc">
            <p id="acc-txt">Don't have an account?</p>
            <input type="button" id="register-btn" value="Create new account" onclick="location.href='register';">
        </div>
    </form>
</div>
<c:import url="/footer"/>
</body>
</html>
