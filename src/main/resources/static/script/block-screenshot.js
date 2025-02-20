// 스크린샷 차단
document.addEventListener("keydown", function (e) {
    if (e.key === "PrintScreen") {
        alert("스크린샷 기능은 사용할 수 없습니다.");
        e.preventDefault();
    }
});

// 마우스 우클릭 차단
document.addEventListener("contextmenu", function (e) {
    alert("우클릭은 사용할 수 없습니다.");
    e.preventDefault();
});

