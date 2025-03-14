<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>

<html>
<head>
    <title>mediquick</title>
    <link rel="stylesheet" href="<c:url value="/style/reset.css"/>">
    <link rel="stylesheet" href="<c:url value="/style/global.css"/>">
<%--    <link rel="stylesheet" href="<c:url value="/style/layout/header.css"/>--%>

    <script src="<c:url value="/script/user/header.js"/>"></script>
    <script type="module" src="<c:url value="/script/block-screenshot.js"/>"></script>
    <script type="module" src="<c:url value="/script/auto-logout.js"/>"></script>
</head>
<body>
<header>
    <div id="header-cont">
        <h2><a href="<c:url value="/dashboard"/>">MediQuick</a></h2>
        <div id="user-info">
            <div id="user-details"></div>
            <div id="user-profile-image"></div>
            <div id="user-menu">
                <button id="manager-button"></button>
                <button id="login-profile-button"></button>
                <button id="register-logout-button"></button>
            </div>
        </div>
        <div id="token-timer">남은 시간:</div>
        <button id="btn-extend">시간 연장</button>
    </div>
</header>

</body>
</html>
