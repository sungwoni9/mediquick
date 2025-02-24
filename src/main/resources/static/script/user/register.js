document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    const username = document.getElementById("username");
    const password = document.getElementById("password");
    const passwordChk = document.getElementById("password-chk");

    const contact = document.getElementById("contact");
    const email = document.getElementById("email");


    // 오류 메시지 표시 함수
    function showError(input, message) {
        const errorMsg = document.getElementById(`error-msg-${input.id}`);
        errorMsg.textContent = message;
        input.classList.add("error");
    }

    // 오류 메시지 초기화 함수
    function clearError(input) {
        const errorMsg = document.getElementById(`error-msg-${input.id}`);
        errorMsg.textContent = "";
        input.classList.remove("error");
    }

    // 비밀번호 입력 시 비밀번호 확인 필드 패턴 업데이트
    password.addEventListener("change", function () {
        passwordChk.setAttribute("pattern", password.value);
    });

    let validUsername = true, validPhone = true, validEmail = true;

    username.addEventListener("change", async e => {
        try {
            const response = await fetch(`/user/valid/username?value=${e.target.value}`);
            if (response.status === 200) {
                validUsername = false;
                showError(e.target, "이미 사용 중인 유저네임입니다.");
            } else if (response.status === 204) {
                validUsername = true;
                clearError(e.target);
            } else {
                throw new Error();
            }
        } catch {
            showError(e.target, "유효성 검사를 수행할 수 없습니다.");
            validUsername = false;
        }
    });

    contact.addEventListener("change", async e => {
        let phone =e.target.value;
        const digits = phone.replace(/\D/g, "");
        console.log(digits);
        if (/^01\d{9}$/.test(digits)) {
            console.log(22);
            phone = digits.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
        }else if (/^01\d{8}$/.test(digits)) {
            console.log(33);
            phone = digits.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
        }
        e.target.value = phone;
        console.log(phone);

        try {
            const response = await fetch(`/user/valid/phone?value=${phone}`);
            if (response.status === 200) {
                validPhone = false;
                showError(e.target, "이미 등록된 전화번호입니다.");
            } else {
                validPhone = true;
                clearError(e.target);
            }
        } catch {
            showError(e.target, "유효성 검사를 수행할 수 없습니다.");
            validPhone = false;
        }
    });

    email.addEventListener("change", async e => {
        try {
            const response = await fetch(`/user/valid/email?value=${e.target.value}`);
            if (response.status === 200) {
                validEmail = false;
                showError(e.target, "이미 등록된 이메일입니다.");
            } else {
                validEmail = true;
                clearError(e.target);
            }
        } catch {
            showError(e.target, "유효성 검사를 수행할 수 없습니다.");
            validEmail = false;
        }
    });

    // 폼 제출 시 모든 입력값 검증 & 서버로 요청
    form.addEventListener("submit", async e=> {
        e.preventDefault(); // 기본 제출 방지

        if (!validUsername || !validPhone || !validEmail){
            alert("회원가입 정보를 확인해주세요.");
            return;
        }

        // 폼 데이터를 JSON으로 변환하여 서버로 전송
        const formData = new FormData(form);
        const jsonData = {};
        formData.forEach((value, key) => {
            jsonData[key] = value;
        });

        const response = await fetch("/user/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(jsonData),
        });
        if(response.ok) {
            alert("회원가입이 완료되었습니다!");
            location.href = "/user/login";
        } else {
            alert("회원가입 요청 중 오류가 발생했습니다.");
        }
    });
});
