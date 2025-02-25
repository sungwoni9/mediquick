<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>

<html>
<head>
    <title>MediQuick Viewer</title>
    <link rel="stylesheet" href="<c:url value="/style/viewer/viewer.css"/>">
    <link rel="stylesheet" href="<c:url value="/style/viewer/viewerTools.css"/>">
    <link rel="stylesheet" href="<c:url value="/style/viewer/sidebar.css"/>">
    <script type="module" src="<c:url value="/dist/viewer.bundle.js"/>"></script>
</head>
<body>
<c:import url="/header"/>
<c:import url="/viewer/viewer-tools"/>
<div id="root">
    <c:import url="/viewer/sidebar"/>
    <c:import url="/viewer/dcm-viewer"/>
</div>
</body>
</html>
