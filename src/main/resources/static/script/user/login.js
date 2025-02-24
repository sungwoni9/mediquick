document.addEventListener("DOMContentLoaded", function () {
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
                credentials: "include" // 쿠키 포함
            });

            if (response.ok) {
                alert("로그인 성공!");
                window.location.href = "/user/profile"; // 로그인 후 이동할 페이지
            } else {
                const errorData = await response.json();
                alert(`로그인 실패: ${errorData.message || "아이디 또는 비밀번호를 확인하세요."}`);
            }
        } catch (error) {
            console.error("로그인 요청 중 오류 발생:", error);
            alert("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
        }
    });
});