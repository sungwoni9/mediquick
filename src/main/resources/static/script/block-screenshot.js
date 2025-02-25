// 스크린샷 차단
document.addEventListener("keydown", function (e) {
    if (e.key === "PrintScreen" || (e.ctrlKey && e.key === "c") || (e.ctrlKey && e.key === "v")) {
        alert("스크린샷 기능은 사용할 수 없습니다.");
        navigator.clipboard.writeText(""); // 클립보드 초기화
        e.preventDefault();
    }
});

// 마우스 우클릭 차단
document.addEventListener("contextmenu", function (e) {
    alert("우클릭은 사용할 수 없습니다.");
    navigator.clipboard.writeText(""); // 클립보드 초기화
    e.preventDefault();
});

// 클립보드 내용 초기화
document.addEventListener("copy", function (e) {
    e.clipboardData.setData('text/plain', '');
    e.preventDefault();
});
