document.addEventListener("DOMContentLoaded", e=> {
    const form = document.querySelector("form");

    form.addEventListener("submit", async e => {
        e.preventDefault(); // 기본 제출 방지

        const formData = new FormData(form);
        const jsonData = {};
        formData.forEach((value, key) => {
            jsonData[key] = value;
        });

        try {
            const response = await fetch("/user/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(jsonData),
            });

            const data = await response.json();
            if (response.ok && data.token) {                
                // JWT 저장
                localStorage.setItem("jwtToken", data.token);
                alert("로그인 성공!");
                location.href = '/user/profile';
            } else {
                // 로그인 실패 시 토큰 삭제
                localStorage.removeItem("jwtToken");
                alert(`로그인 실패: ${data.message || "아이디 또는 비밀번호를 확인하세요."}`);
            }
        } catch (error) {
            console.error("로그인 요청 중 오류 발생:", error);
            alert("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
        }
    });
});