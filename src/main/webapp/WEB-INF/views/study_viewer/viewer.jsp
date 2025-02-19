<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>

<html>
<head>
    <title>MediQuick Viewer</title>
    <link rel="stylesheet" href="<c:url value="/style/viewer/viewer.css"/>">
    <link rel="stylesheet" href="<c:url value="/style/viewer/sidebar.css"/>">
    <link rel="stylesheet" href="<c:url value="/style/reset.css"/>">
    <link rel="stylesheet" href="<c:url value="/style/global.css"/>">

    <script src="<c:url value="/script/viewer/sidebar.js"/>"></script>
</head>
<body>
<div id="header-area"></div>
<div id="root">
    <c:import url="/viewer/sidebar"/>
    <div id="dcm-viewer"></div>
</div>
</body>
</html>
