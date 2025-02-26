<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>mediquick</title>
    <link rel="stylesheet" href="/style/reset.css">
    <link rel="stylesheet" href="/style/global.css">
    <script src="/script/auto-logout.js"></script>
</head>
<body>
<header>
    <div id="header-cont">
        <h2>MediQuick</h2>
        <div id="user-info">
            <div id="user-details">
                <p>테스터</p>
                <p>담당부서</p>
            </div>
            <img src="https://ca.slack-edge.com/T07GQKB796Y-U07H88MAF6J-ed560c702e4e-512" alt="profile-img">
            <div id="token-timer">남은 시간: -</div>
            <button onclick="extendToken()">시간 연장</button>
        </div>
    </div>
</header>
</body>
</html>
