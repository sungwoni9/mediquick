<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<html>
<head>
    <title>로그 리스트</title>
    <link rel="stylesheet" href="/style/global.css">
    <link rel="stylesheet" href="/style/reset.css">
    <link rel="stylesheet" href="/style/admin/log.css">
    <script type="module" src="/script/logList.js"></script>
</head>
<c:import url="/header"/>
<body>
<div id="content-container">
    <div id="filter-container">
        <div id="search-container">
            <label for="log-select">조회할 로그 :</label>
            <select id="log-select" name="log-select">
                <option value="" selected disabled>선택</option>
                <option value="LOGIN">로그인</option>
                <option value="LOGOUT">로그아웃</option>
                <option value="VIEW_VIDEO">영상 조회</option>
                <option value="VIEW_RECORD">진료 조회</option>
            </select>
            <button id="btn-search">검색</button>
        </div>
        <div id="sort-container">
            <label for="sort-order">정렬:</label>
            <select id="sort-order">
                <option value="newest" selected>최신순</option>
                <option value="oldest">오래된 순</option>
            </select>
        </div>
    </div>
    <div class="table-content">
        <table class="log-list">
            <thead>
            <tr>
                <th>날짜</th>
                <th>내용</th>
                <th>코드</th>
            </tr>
            </thead>
            <tbody id="log-table-body">
            <c:choose>
                <c:when test="${empty logs}">
                    <tr>
                        <td colspan="3">로그 리스트가 없습니다.</td>
                    </tr>
                </c:when>
                <c:otherwise>
                    <c:forEach var="log" items="${logs}">
                        <tr>
                            <td data-log-date="<fmt:formatDate value="${log.regDate}" pattern="yyyy-MM-dd HH:mm:ss"/>">
                                <fmt:formatDate value="${log.regDate}" pattern="yyyy-MM-dd HH:mm:ss"/>
                            </td>
                            <td id="logType">${log.activityType}</td>
                            <td>${log.studykey}</td>
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
