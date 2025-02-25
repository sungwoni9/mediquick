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
            const response = await fetch("/user/delete", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(jsonData),
            });

            const data = await response.json();
            if (response.ok) {
                alert("탈퇴 성공!");
                location.href = '/user/register';
            } else {
                alert(`탈퇴 실패: ${data.message || "비밀번호를 확인하세요."}`);
            }
        } catch (error) {
            console.error("탈퇴 요청 중 오류 발생:", error);
            alert("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
        }
    });
});