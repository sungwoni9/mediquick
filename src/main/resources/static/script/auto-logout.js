function isLogin() {
    const token = localStorage.getItem("jwtToken");
    return token !== null;
}

async function updateTokenExpiry() {
    const token = localStorage.getItem("jwtToken");
    console.log("저장된 JWT:", token);

    if (!token) return;

    try {
        const response = await fetch("/user/token-expiry", {
            method: "GET",
            headers: {"Authorization": `Bearer ${token}`}
        });

        if (!response.ok) {
            alert("시간이 만료되었습니다. 다시 로그인해주세요.");
            await fetch('/user/logout');
            localStorage.removeItem("jwtToken");
            window.location.href = "/user/login";
            return;
        }

        const data = await response.json();
        const remainingTime = data.remainingTime / 1000; // 초 단위 변환

        // 남은 시간 표시 (분:초 형식)
        const minutes = Math.floor(remainingTime / 60);
        const seconds = Math.floor(remainingTime % 60);
        document.getElementById("token-timer").innerText = `남은 시간: ${minutes}분 ${seconds}초`;
    } catch (error) {
        console.error("토큰 만료 시간 조회 실패:", error);
    }
}

async function extendToken() {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
        alert("연장할 수 있는 토큰이 없습니다. 다시 로그인해주세요.");
        window.location.href = "/user/login";
        return;
    }

    try {
        const response = await fetch("/user/extend-token", {
            method: "POST",
            headers: {"Authorization": `Bearer ${token}`}
        });

        if (!response.ok) {
            alert("세션이 만료되었습니다. 다시 로그인해주세요.");
            window.location.href = "/user/login";
            return;
        }

        const data = await response.json();
        if (data.newToken) {
            localStorage.setItem("jwtToken", data.newToken); // 새로운 JWT 저장
            alert("시간이 연장되었습니다!");
            updateTokenExpiry(); // 남은 시간 업데이트
        } else {
            alert("토큰 연장에 실패했습니다. 다시 로그인해주세요.");
        }
    } catch (error) {
        console.error("토큰 연장 실패:", error);
    }
}

if (isLogin()) {
// 1초마다 남은 시간 업데이트
    setInterval(updateTokenExpiry, 1000);
// 전역에서 `extendToken()`을 호출할 수 있도록 등록
    window.extendToken = extendToken;
}

