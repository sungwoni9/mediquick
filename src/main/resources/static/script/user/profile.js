document.addEventListener("DOMContentLoaded", async e=> {
    const form = document.querySelector("form");
    const username = document.getElementById('username');
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const passwordChk = document.getElementById('password-chk');
    const contact = document.getElementById('contact');
    const address = document.getElementById('address');
    const detailedAddress = document.getElementById('detailed-address');
    const hospital = document.getElementById('hospital');
    const department = document.getElementById('department');
    const doctorLabel = document.getElementById('doctor-label');
    const doctor = document.getElementById('doctor');
    const radiologistLabel = document.getElementById('radiologist-label');
    const radiologist = document.getElementById('radiologist');

    // 사용자 데이터 가져오기
    const response = await fetch('/user/myaccount', { method: "GET" });
    if (!response.ok) {
        location.href = '/user/login';
        return;
    }

    const data = await response.json();
    console.log(data);

    // 입력 필드 채우기
    username.innerText = data.username;
    name.value = data.name;
    email.value = data.email;
    contact.value = data.phone;
    address.value = data.address;
    detailedAddress.value = data.addressDetail;
    hospital.value = data.institutionName;
    department.value = data.department;
    if(data.roleCode===1){
        doctor.checked = false;
        radiologist.checked = false;
        doctorLabel.style.display="none";
        doctor.style.display="none";
        radiologistLabel.style.display="none";
        radiologist.style.display="none";
    }else if(data.roleCode===2){
        doctor.checked = true;
        radiologist.checked = false;
    }else if(data.roleCode===3){
        doctor.checked = false;
        radiologist.checked = true;
    }



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

    // 비밀번호 입력 시 비밀번호 확인 패턴 동기화
    password.addEventListener("change", () => {
        if (password.value) {
            passwordChk.setAttribute("pattern", password.value);
            passwordChk.setAttribute("required", "required");
        } else {
            passwordChk.removeAttribute("pattern");
            passwordChk.removeAttribute("required");
        }
    });

    // 비밀번호 확인 입력 시 비밀번호와 일치 여부 체크
    passwordChk.addEventListener("change", () => {
        if (password.value && passwordChk.value !== password.value) {
            showError(passwordChk, "비밀번호와 일치해야 합니다.");
        } else {
            clearError(passwordChk);
        }
    });

    let validPhone = true, validEmail = true;

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

        if(data.phone === phone)
            return;

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
        if(data.email === e.target.value)
            return;

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

        // 비밀번호 조건 검증
        if (password.value && passwordChk.value !== password.value) {
            showError(passwordChk, "비밀번호와 일치해야 합니다.");
            return;
        }

        if (!validPhone || !validEmail){
            alert("회원정보를 확인해주세요.");
            return;
        }

        // 폼 데이터를 JSON으로 변환하여 서버로 전송
        const formData = new FormData(form);
        const jsonData = {};
        formData.forEach((value, key) => {
            jsonData[key] = value;
        });

        const response = await fetch("/user/update", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(jsonData),
        });
        const data = await response.json();
        if(response.ok) {
            alert("회원정보수정이 완료되었습니다!");
        } else {
            alert("회원정보수정 요청 중 오류가 발생했습니다." + data.message);
        }
    });
});