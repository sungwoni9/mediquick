document.addEventListener("DOMContentLoaded", async e => {
    const userInfo = document.getElementById('user-info');
    const userDetails = document.getElementById('user-details');
    const userProfileImage = document.getElementById('user-profile-image');
    const userMenu = document.getElementById('user-menu');
    const loginProfileButton = document.getElementById('login-profile-button');
    const registerLogoutButton = document.getElementById('register-logout-button');
    const managerButton = document.getElementById('manager-button');
    const tokenTimer = document.getElementById("token-timer");
    const extendButton = document.querySelector("button[onclick='extendToken()']");


    userInfo.addEventListener("click", e => {
        userMenu.style.display = 'flex';
        setTimeout(() => {
            userMenu.classList.add('show');
        }, 1);
    })

    userInfo.addEventListener("mouseleave", e => {
        userMenu.classList.remove('show');
        setTimeout(() => {
            userMenu.style.display = 'none';
        }, 200);
    })

    const response = await fetch('/user/valid/info');
    if (!response.ok) {
        console.log("showGuestMenu");
        userDetails.innerHTML = `<p>Guest</p>`;
        userProfileImage.innerHTML = `<svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="35" height="35" rx="10" fill="#275B9B"/>
                <path d="M9.4347 9.45455H12.6591L16.9773 19.9943H17.1477L21.4659 9.45455H24.6903V24H22.1619V14.0071H22.027L18.0071 23.9574H16.1179L12.098 13.9858H11.9631V24H9.4347V9.45455Z" fill="white"/>
            </svg>`;
        loginProfileButton.innerText = "로그인";
        loginProfileButton.onclick = () => {
            location.href = '/user/login';
        };
        registerLogoutButton.innerText = "회원가입";
        registerLogoutButton.onclick = () => {
            location.href = '/user/register';
        };

        // 로그아웃 상태에서는 타이머 & 버튼 숨기기
        tokenTimer.style.display = "none";
        extendButton.style.display = "none";

        return;
    }
    const data = await response.json();

    const name = data.name || "이름없음";
    const department = data.department || "부서없음";
    const institutionName = data.institutionName || "소속병원없음";
    const roles = {
        1: "관리자",
        2: "진료의",
        3: "판독의"
    };
    const role = roles[data.roleCode] || "권한없음";

    userDetails.innerHTML = `
        <p>${institutionName} ${department}</p>
        <p>${role} ${name}</p>`;
    userProfileImage.innerHTML = `
        <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="35" height="35" rx="10" fill="#275B9B"/>
            <path d="M9.4347 9.45455H12.6591L16.9773 19.9943H17.1477L21.4659 9.45455H24.6903V24H22.1619V14.0071H22.027L18.0071 23.9574H16.1179L12.098 13.9858H11.9631V24H9.4347V9.45455Z" fill="white"/>
        </svg>`;

    managerButton.style.display = "none";

    if (role === "관리자") {
        managerButton.style.display = "block";
        managerButton.innerText = "관리자 페이지";
        managerButton.onclick = () => {
            location.href = '/management';
        };
    }

    loginProfileButton.innerText = "회원정보";
    loginProfileButton.onclick = () => {
        location.href = '/user/profile';
    };


    registerLogoutButton.innerText = "로그아웃";
    registerLogoutButton.onclick = async () => {
        const response = await fetch('/user/logout');
        if (!response.ok) {
            alert("로그아웃 실패.")
            return;
        }

        // 토큰 삭제
        localStorage.removeItem("jwtToken");

        location.href = '/user/login';
    };

    // 로그인 상태에서는 타이머 & 버튼 표시
    tokenTimer.style.display = "block";
    extendButton.style.display = "block";
});
