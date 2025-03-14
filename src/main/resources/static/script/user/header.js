document.addEventListener("DOMContentLoaded", async () => {
    setupEventListeners();
    await fetchUserInfo();
});

const ROLES = {1: "관리자", 2: "진료의", 3: "판독의"};

function setupEventListeners() {
    const userInfo = document.getElementById('user-info');
    const userMenu = document.getElementById('user-menu');
    const extendButton = document.getElementById("btn-extend");

    userInfo.addEventListener("click", () => toggleUserMenu(userMenu));
    document.addEventListener("click", (e) => closeUserMenuOnClickOutside(e, userInfo, userMenu));
    extendButton.addEventListener("click", (e) => {
        e.stopPropagation();
        extendToken();
    });
}

function toggleUserMenu(userMenu) {
    const isVisible = userMenu.classList.contains("show");
    userMenu.style.display = isVisible ? "none" : "flex";
    setTimeout(() => userMenu.classList.toggle("show"), 1);
}

function closeUserMenuOnClickOutside(e, userInfo, userMenu) {
    if (!userInfo.contains(e.target) && !userMenu.contains(e.target)) {
        userMenu.classList.remove("show");
        setTimeout(() => userMenu.style.display = "none", 300);
    }
}

async function fetchUserInfo(retries = 3) {
    const token = localStorage.getItem("jwtToken");
    if (!token) return showGuestMenu();

    for (let attempt = 0; attempt < retries; attempt++) {
        try {
            const response = await fetch('/user/valid/info', {
                method: "GET",
                headers: {'Authorization': `Bearer ${token}`},
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                return showUserMenu(data);
            }
        } catch (error) {
            console.error("Fetch error:", error);
        }
        await new Promise(res => setTimeout(res, 1000));
    }
    showGuestMenu();
}

function showGuestMenu() {
    updateUserUI({
        name: "Guest",
        department: "",
        institutionName: "",
        role: "Guest",
        isGuest: true
    });
}

function showUserMenu(data) {
    updateUserUI({
        name: data.name || "이름없음",
        department: data.department || "부서없음",
        institutionName: data.institutionName || "소속병원없음",
        role: ROLES[data.roleCode] || "권한없음",
        isGuest: false
    });
}

function updateUserUI({name, department, institutionName, role, isGuest}) {
    const userDetails = document.getElementById('user-details');
    const userProfileImage = document.getElementById('user-profile-image');
    const loginProfileButton = document.getElementById('login-profile-button');
    const registerLogoutButton = document.getElementById('register-logout-button');
    const managerButton = document.getElementById('manager-button');
    const tokenTimer = document.getElementById("token-timer");
    const extendButton = document.getElementById("btn-extend");

    userDetails.innerHTML = isGuest ? `<p>Guest</p>` : `<p>${institutionName} ${department}</p><p>${role} ${name}</p>`;
    userProfileImage.innerHTML = `<svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="35" height="35" rx="10" fill="#275B9B"/>
        <path d="M9.4347 9.45455H12.6591L16.9773 19.9943H17.1477L21.4659 9.45455H24.6903V24H22.1619V14.0071H22.027L18.0071 23.9574H16.1179L12.098 13.9858H11.9631V24H9.4347V9.45455Z" fill="white"/>
    </svg>`;

    if (isGuest) {
        loginProfileButton.innerText = "로그인";
        loginProfileButton.onclick = () => location.href = '/user/login';
        registerLogoutButton.innerText = "회원가입";
        registerLogoutButton.onclick = () => location.href = '/user/register';
        tokenTimer.style.display = "none";
        extendButton.style.display = "none";
        managerButton.style.display = "none";
    } else {
        loginProfileButton.innerText = "회원정보";
        loginProfileButton.onclick = () => location.href = '/user/profile';
        registerLogoutButton.innerText = "로그아웃";
        registerLogoutButton.onclick = logoutUser;
        if (role === "관리자") {
            managerButton.style.display = "block";
            managerButton.innerText = "관리자 페이지";
            managerButton.onclick = () => location.href = '/management';
        } else {
            managerButton.style.display = "none";
        }
        tokenTimer.style.display = "block";
        extendButton.style.display = "block";
    }
}

async function logoutUser() {
    try {
        const response = await fetch('/user/logout');
        if (!response.ok) throw new Error("로그아웃 실패");
        localStorage.removeItem("jwtToken");
        location.href = '/user/login';
    } catch (error) {
        alert(error.message);
    }
}
