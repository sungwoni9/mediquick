<%--
  Created by IntelliJ IDEA.
  User: TJ
  Date: 25. 2. 19.
  Time: 오후 2:57
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<html>
<head>
    <title>로그 조회</title>
    <link rel="stylesheet" href="/style/admin/check.css">
    <script type="module" src="/script/userPaging.js"></script>
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
                <th>이메일</th>
                <th>연락처</th>
                <th>주소</th>
                <th>상세 주소</th>
                <th>소속 병원</th>
                <th>소속 부서</th>
                <th>삭제 날짜</th>
                <th>수정 일시</th>
            </tr>
            </thead>
            <tbody id="user-table-body">
            <c:choose>
                <c:when test="${empty users}">
                    <p>사용자 목록이 없습니다.</p>
                </c:when>
                <c:otherwise>
                    <c:forEach var="user" items="${users}">
                        <tr>
                            <td><a href="#" onclick="redirectToLogList('${user.username}')">${user.username}</a></td>
                            <td>${user.email}</td>
                            <td>${user.phone}</td>
                            <td>${user.address}</td>
                            <td>${user.addressDetail}</td>
                            <td>${user.institutionName}</td>
                            <td>${user.department}</td>
                            <td>${user.deleteTime}</td>
                            <td><fmt:formatDate value="${user.modDate}" pattern="yyyy-MM-dd HH:mm:ss"/></td>
                        </tr>
                    </c:forEach>
                </c:otherwise>
            </c:choose>
            </tbody>
        </table>
    </div>
    <div id="pagination">
        <button id="prev-btn">이전</button>
        <span id="page-info">1/1</span>
        <button id="next-btn">다음</button>
    </div>
</div>
</body>
<c:import url="/footer"/>
</html>
