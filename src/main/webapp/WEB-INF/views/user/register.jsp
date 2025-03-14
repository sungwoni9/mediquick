<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<html>
<head>
    <script src="/script/user/register.js"></script>
    <link rel="stylesheet" href="/style/user/form.css">
    <title>Register account</title>
</head>
<c:import url="/header"/>
<body>
<div id="content-container">
    <h2 id="tit">Create an account</h2>
    <form>
        <div class="input-wrap">
            <input type="text" name="username" id="username" placeholder="Username" required
                   pattern="^[a-zA-Z][a-zA-Z0-9]{4,19}$" title="영문으로 시작하는 숫자와 영문으로 이루어진 5~20자">
            <p id="error-msg-username" class="error-msg"></p>
        </div>

        <div class="input-wrap">
            <input type="password" name="password" id="password" placeholder="Password"
                   required pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{4,20}$"
                   title="대문자, 소문자, 숫자, 특수기호(!@#$%^&*)를 하나씩 포함한 4~20자">
            <p id="error-msg-password" class="error-msg"></p>
        </div>

        <div class="input-wrap">
            <input type="password" name="password-chk" id="password-chk" placeholder="Password check"
                   required pattern="^[a-zA-Z\d!@#$%^&*]{,20}$" title="비밀번호와 일치">
            <p id="error-msg-password-chk" class="error-msg"></p>
        </div>

        <input type="text" name="name" id="name" placeholder="Name" required
               pattern="^[a-zA-Z가-힣][a-zA-Z가-힣 ]{1,19}$" title="영문이나 한글로 시작하는 영문,한글,빈칸으로 이루어진 2~20자">
        <div class="input-wrap">
            <input type="tel" name="phone" id="contact" placeholder="Contact"
                   required pattern="^01\d-?\d{3,4}-?\d{4}$" title="올바른 전화번호를 입력하세요 (예: 010-1234-5678, 01123456789)">
            <p id="error-msg-contact" class="error-msg"></p>
        </div>

        <div>
            <div class="send-code">
                <input type="email" name="email" id="email" placeholder="Email"
                       required pattern="^(?!.*\.\.)[a-zA-Z\d](?:[a-zA-Z\d._%+\-]*[a-zA-Z\d])?@(?:[a-zA-Z\d](?:[a-zA-Z\d\-]*[a-zA-Z\d])?\.)+[a-zA-Z]{2,10}$"
                       title="올바른 이메일 주소를 입력하세요 (예: user@example.com)">

                <input type="button" id="send-code-btn" value="인증 코드 전송" disabled>
            </div>
            <p id="error-msg-email" class="error-msg"></p>
        </div>

        <div class="send-code">
            <input type="text" name="verifyCode" id="verify-code"  placeholder="Verify Code" disabled>
            <input type="button" id="verify-code-btn" value="인증 코드 확인" disabled>
        </div>
        <input type="hidden" name="verifiedEmail" id="verified-email">

        <div class="input-block">
            <input type="text" name="address" id="address" placeholder="Address" required>
            <input type="text" name="addressDetail" id="detailed-address" placeholder="Detailed Address">
        </div>

        <div class="input-block">
            <input type="radio" name="roleCode" value="2" id="doctor" checked/>
            <label for="doctor">진료의</label>
            <input type="radio" name="roleCode" value="3" id="radiologist"/>
            <label for="radiologist">판독의</label>
        </div>

        <input id="create-acc-btn" type="submit" value="Create Account">
        <div id="login-txt">
            <span id="text">Already have an account?</span> <a href="login">Login</a>
        </div>
    </form>
</div>
<c:import url="/footer"/>
</body>
</html>
