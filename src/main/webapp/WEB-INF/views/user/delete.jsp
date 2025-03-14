<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<html>
<head>
    <script src="/script/user/delete.js"></script>
    <link rel="stylesheet" href="/style/user/form.css">
    <title>Delete account</title>
</head>
<c:import url="/header"/>
<body>
<div id="content-container">
    <h2 id="tit">Account Deletion</h2>
    <form>
        <input type="password" name="password" id="password" placeholder="password">
        <p id="error-msg-password" class="error-msg"></p>
        <input type="submit" value="Delete">
    </form>
</div>
</body>
</html>
