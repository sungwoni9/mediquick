<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@taglib prefix="c" uri="jakarta.tags.core" %>
<html>
<head>
  <link rel="stylesheet" href="/style/report/form.css">
  <title>판독소견서</title>
</head>
<c:import url="/header"/>
<body>
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
    <div id="report-grid">
      <p>Urgency level</p>
      <p>Report status</p>
      <div>
        <div>
          <input type="radio" id="routine" name="level" value="routine">
          <label for="routine">일반</label>
        </div>
        <div>
          <input type="radio" id="semi" name="level" value="semi">
          <label for="semi">긴급</label>
        </div>
        <div>
          <input type="radio" id="urgent" name="level" value="urgent">
          <label for="urgent">중요</label>
        </div>
      </div>

      <div>
        <div>
          <input type="radio" id="draft" name="status" value="draft">
          <label for="draft">초안</label>
        </div>
        <div>
          <input type="radio" id="revision" name="status" value="revision">
          <label for="revision">수정</label>
        </div>
        <div>
          <input type="radio" id="finalized" name="status" value="finalized">
          <label for="finalized">완료</label>
        </div>
      </div>
    </div>
    <div class="f-tit">
      <p>Previous Medical Records</p>
    </div>
    <label for="previous">
      <textarea id="previous">매복된 하악 우측 제 3대 구치과 하치조 신경관이 파노라마 상 겹쳐있어 정확한 위치 판단을 위해 촬영한 결과 신경손상의 위험성이 있음.</textarea>
    </label>

    <div class="f-tit">
      <p>Possible diagnosis</p>
    </div>
    <input type="text">

    <div class="f-tit">
      <p>Clinical significance</p>
    </div>
    <input type="text">

    <div class="f-tit">
      <p>Morphological Features</p>
    </div>
    <input type="text">

    <div id="lesion-grid">
      <p>Lesions count</p>
      <p>Lesion size</p>
      <p>Lesion location</p>
      <input type="text">
      <input type="text">
      <input type="text">
    </div>

    <div id="radio-grid">
      <p>Patient status</p>
      <p>Recommended studies</p>
      <div>
        <div>
          <input type="radio" id="normal" name="normal" value="normal">
          <label for="normal">정상</label>
        </div>
        <div>
          <input type="radio" id="abnormal" name="normal" value="abnormal">
          <label for="abnormal">비정상</label>
        </div>
      </div>

      <div>
        <div>
          <input type="radio" id="necessary" name="recommended" value="yes">
          <label for="necessary">필요</label>
        </div>
        <div>
          <input type="radio" id="unnecessary" name="recommended" value="no">
          <label for="unnecessary">불필요</label>
        </div>
      </div>
    </div>
    <div class="f-tit">
      <p>Additional findings</p>
    </div>
    <label for="findings">
      <textarea id="findings">특이 소견</textarea>
    </label>

    <div class="f-tit">
      <p>Additional opinion</p>
    </div>

    <label for="opinion">
      <textarea id="opinion">추가적인 소견</textarea>
    </label>

    <div class="f-tit">
      <p>Additional notes</p>
    </div>
    <input type="text">
  </form>
</div>
</body>
</html>
