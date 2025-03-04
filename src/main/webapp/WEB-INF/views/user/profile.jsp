<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<html>
<head>
    <script src="/script/user/profile.js"></script>
    <link rel="stylesheet" href="/style/user/form.css">
    <title>Mypage</title>
</head>
<c:import url="/header"/>
<body>
<div id="content-container">
    <h2 id="tit">프로필 수정</h2>
    <form>

        <label for="name">이름</label>
        <input type="text" name="name" id="name" placeholder="Name" required
               pattern="^[a-zA-Z가-힣][a-zA-Z가-힣 ]{1,19}$" title="영문이나 한글로 시작하는 영문,한글,빈칸으로 이루어진 2~20자">
            <label for="email">이메일</label>
        <div>
            <input type="email" name="email" id="email" placeholder="Email"
                   required pattern="^(?!.*\.\.)[a-zA-Z\d](?:[a-zA-Z\d._%+\-]*[a-zA-Z\d])?@(?:[a-zA-Z\d](?:[a-zA-Z\d\-]*[a-zA-Z\d])?\.)+[a-zA-Z]{2,10}$"
                   title="올바른 이메일 주소를 입력하세요 (예: user@example.com)">
            <p id="error-msg-email" class="error-msg"></p>
        </div>

        <label for="password">비밀번호</label>
        <div class="input-wrap">
            <input type="password" name="password" id="password" placeholder="Password"
                   pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{4,20}$"
                   title="대문자, 소문자, 숫자, 특수기호(!@#$%^&*)를 하나씩 포함한 4~20자">
            <p id="error-msg-password" class="error-msg"></p>
        </div>
        <label for="password-chk">비밀번호 확인</label>
        <div class="input-wrap">
            <input type="password" name="password-chk" id="password-chk" placeholder="Password check"
                   pattern="^[a-zA-Z\d!@#$%^&*]{,20}$" title="비밀번호와 일치">
            <p id="error-msg-password-chk" class="error-msg"></p>
        </div>

        <label for="contact">휴대전화번호</label>
        <div class="input-wrap">
            <input type="tel" name="phone" id="contact" placeholder="Contact"
                   required pattern="^01\d-?\d{3,4}-?\d{4}$" title="올바른 전화번호를 입력하세요 (예: 010-1234-5678, 01123456789)">
            <p id="error-msg-contact" class="error-msg"></p>
        </div>

        <div id="address-group">
            <div>
                <label for="address">주소</label>
                <input type="text" name="address" id="address" placeholder="Address" required>
            </div>
            <div>
                <label for="detailed-address">상세 주소</label>
                <input type="text" name="addressDetail" id="detailed-address" placeholder="Detailed Address">
            </div>
        </div>

        <label for="hospital">병원/기관명</label>
        <input type="text" name="institutionName" id="hospital" placeholder="Hospital Affililation">
        <label for="department">소속 부서</label>
        <input type="text" name="department" id="department" placeholder="Department">
        <div>
            <label for="doctor" id="doctor-label">진료의</label><input type='radio' name='roleCode' id="doctor" value='2' checked/>
            <label for="radiologist" id="radiologist-label">판독의</label><input type='radio' name='roleCode' id="radiologist" value='3' />
        </div>
        <div>
            <input type="submit" value="수정하기">
            <input type="button" value="회원탈퇴" onclick="location.href='delete'">
        </div>
    </form>
</div>
</body>
</html>