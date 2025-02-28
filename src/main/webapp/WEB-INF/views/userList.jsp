<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<html>
<head>
    <meta charset="UTF-8">
    <title>사용자 목록</title>
    <link rel="stylesheet" href="/style/admin/check.css">
</head>
<c:import url="/header"/>
<body>

<div id="content-container">
    <h2>사용자 목록</h2>
    <div class="table-content">
        <table class="user-table">
            <thead>
            <tr>
                <th>아이디</th>
                <th>이름</th>
                <th>전화번호</th>
                <th>이메일</th>
                <th>주소</th>
                <th>소속 병원</th>
                <th>부서</th>
                <th>가입일</th>
                <th>권한</th>
                <th>삭제 여부</th>
                <th>삭제 날짜</th>
            </tr>
            </thead>
            <tbody>
            <c:choose>
                <c:when test="${empty userList}">
                    <p>사용자 목록이 없습니다.</p>
                </c:when>
                <c:otherwise>
                    <c:forEach var="user" items="${userList}">
                        <tr>
                            <td>${user.username}</td>
                            <td>${user.name}</td>
                            <td>${user.phone}</td>
                            <td>${user.email}</td>
                            <td>${user.address} ${user.addressDetail}</td>
                            <td>${user.institutionName}</td>
                            <td>${user.department}</td>
                            <td><fmt:formatDate value="${user.regDate}" pattern="yyyy-MM-dd HH:mm:ss"/></td>
                            <td>${user.roleCode}</td>
                            <td><fmt:formatDate value="${user.deleteTime}" pattern="yyyy-MM-dd HH:mm:ss"/></td>
                            <td>${user.deleteTime}</td>
                        </tr>
                    </c:forEach>
                </c:otherwise>
            </c:choose>
            </tbody>
        </table>
    </div>
</div>
</body>
<c:import url="/footer"/>
</html>
