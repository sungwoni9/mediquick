<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>mediquick</title>
    <link rel="stylesheet" href="/style/reset.css">
    <link rel="stylesheet" href="/style/global.css">
    <link rel="stylesheet" href="/style/user/header.css">
<%--    <script src="/script/user/header.js"></script>--%>
<%--    <script src="/script/auto-logout.js"></script>--%>
<%--    <script type="module" src="/script/block-screenshot.js"></script>--%>
</head>
<body>
<header>
    <div id="header-cont">
        <h2>MediQuick</h2>
        <div id="user-info">
            <div id="user-details">
            </div>
            <div id="user-profile-image">
            </div>
            <div id="user-menu">
                <button id="login-profile-button"></button>
                <button id="register-logout-button"></button>
            </div>
            <div id="token-timer">남은 시간:</div>
            <button id="btn-extend" onclick="extendToken()">시간 연장</button>
        </div>
    </div>
</header>
</body>
</html>
