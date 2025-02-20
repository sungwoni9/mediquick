<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@taglib prefix="c" uri="jakarta.tags.core" %>
<html>
<head>
  <link rel="stylesheet" href="/style/report/form.css">
  <link rel="stylesheet" href="/style/global.css">
  <link rel="stylesheet" href="/style/reset.css">
  <title>report form</title>
</head>
<body>
<%--<c:import url="/header"/>--%>
<div id="header"></div>
<div id="root">
  <div>
    <p>Patient Information</p>
    <div id="btn-group">
      <button>save</button>
      <button>close</button>
    </div>
  </div>
  <%--  환자 정보--%>
  <div class="grid-table">
    <div>차트번호</div>
    <div>P-3532498324</div>
    <div>성&emsp;&emsp;명</div>
    <div>이가탄</div>
    <div>성&emsp;&emsp;별</div>
    <div>男</div>
    <div>생년월일</div>
    <div>1999-05-26</div>
    <div>담당의사</div>
    <div>오소리</div>
    <div>판독일자</div>
    <div>2025-02-19</div>
  </div>
  <%--  소견 작성 폼 --%>
  <form>
    <div class="f-tit">
      <p>Previous Medical Records</p>
    </div>
    <label for="previous">
      <textarea id="previous">매복된 하악 우측 제 3대 구치과 하치조 신경관이 파노라마 상 겹쳐있어 정확한 위치 판단을 위해 촬영한 결과 신경손상의 위험성이 있음.</textarea>
    </label>

    <div class="f-tit">
      <p>possible diagnosis</p>
    </div>
    <input type="text">

    <div class="f-tit">
      <p>clinical significance</p>
    </div>
    <input type="text">

    <div class="f-tit">
      <p>morphology</p>
    </div>
    <input type="text">
  </form>
</div>
</body>
</html>
