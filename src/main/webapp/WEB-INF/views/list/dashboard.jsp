<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@taglib prefix="c" uri="jakarta.tags.core" %>
<html>
<head>
    <link rel="stylesheet" href="/style/dashboard/form.css">
    <link rel="stylesheet" href="/style/report/detail.css">
    <script src="/script/dashboard.js"></script>
    <title>Dashboard</title>
</head>
<body>
<c:import url="/header"/>
<nav class="navigation-bar">
    <ul>
        <li class="nav-item" data-page="study">Study List</li>
        <li class="nav-item" data-page="patient">Patient List</li>
        <li class="nav-item" data-page="medical">Medical List</li>
    </ul>
</nav>
<div id="content-area" class="content-area"></div>
<c:import url="/report/detail"/>
</body>
<c:import url="/footer"/>
</html>
