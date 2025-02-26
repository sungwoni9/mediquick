async function updateTokenExpiry() {
    const token = localStorage.getItem("jwtToken");
    console.log("저장된 JWT:", localStorage.getItem("jwtToken"));

    if (!token) return;

    const response = await fetch("/user/token-expiry", {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
    });

    if (response.status === 401) {
        alert("세션이 만료되었습니다. 다시 로그인해주세요.");
        window.location.href = "user/login";
        return;
    }

    const data = await response.json();
    const remainingTime = data.remainingTime / 1000; // 초 단위 변환

    // 남은 시간 표시 (분:초 형식)
    const minutes = Math.floor(remainingTime / 60);
    const seconds = Math.floor(remainingTime % 60);
    document.getElementById("token-timer").innerText = `남은 시간: ${minutes}분 ${seconds}초`;
}

async function extendToken() {
    const token = localStorage.getItem("jwtToken");
    if (!token) return;

    const response = await fetch("/user/extend-token", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
    });

    if (response.status === 401) {
        alert("세션이 만료되었습니다. 다시 로그인해주세요.");
        window.location.href = "user/login";
        return;
    }

    const data = await response.json();
    localStorage.setItem("jwtToken", data.newToken); // 새로운 JWT 저장
    alert("세션이 연장되었습니다!");
    updateTokenExpiry(); // 남은 시간 업데이트
}

// 1초마다 남은 시간 업데이트
setInterval(updateTokenExpiry, 1000);
