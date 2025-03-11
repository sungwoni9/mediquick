const CHECK_INTERVAL = 60000;
const CHECK_SECONDS = 1000;
let intervalId;
let check = true;

class TokenService {
    static getToken() {
        return localStorage.getItem("jwtToken");
    }

    static setToken(token) {
        localStorage.setItem("jwtToken", token);
    }

    static removeToken() {
        localStorage.removeItem("jwtToken");
    }

    static isLoggedIn() {
        return this.getToken() !== null;
    }
}

class AuthService {
    static async checkTokenExpiry() {
        const token = TokenService.getToken();
        if (!token) return;

        try {
            const response = await fetch("/user/token-expiry", {
                method: "GET",
                headers: {"Authorization": `Bearer ${token}`}
            });

            if (!response.ok) {
                this.handleSessionExpired();
                return;
            }

            const data = await response.json();
            if (data.remainingTime !== undefined) {
                this.updateTokenTimer(data.remainingTime);
            } else {
                console.error("remainingTime이 undefined입니다.");
            }
        } catch (error) {
            console.error("토큰 만료 시간 조회 실패:", error);
        }
    }

    static async extendToken() {
        const token = TokenService.getToken();
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
                this.handleSessionExpired();
                return;
            }

            const data = await response.json();
            if (data.newToken) {
                TokenService.setToken(data.newToken);
                alert("시간이 연장되었습니다!");
                this.checkTokenExpiry();
            } else {
                alert("토큰 연장에 실패했습니다. 다시 로그인해주세요.");
            }
        } catch (error) {
            console.error("토큰 연장 실패:", error);
        }
    }

    static handleSessionExpired() {
        alert("시간이 만료되었습니다. 다시 로그인해주세요.");
        fetch('/user/logout');
        TokenService.removeToken();
        clearInterval(intervalId);
        window.location.href = "/user/login";
    }

    static updateTokenTimer(remainingTime) {
        const timerElement = document.getElementById("token-timer");

        if (!timerElement) {
            console.error("token-timer 요소가 없습니다!");
            return;
        }

        const minutes = Math.floor(remainingTime / 1000 / 60);
        const seconds = Math.floor((remainingTime / 1000) % 60);

        if (minutes > 0) {
            timerElement.innerText = `남은 시간: ${minutes}분`;
            if (!check) {
                check = true;
                restartTokenCheck();
            }
        } else {
            timerElement.innerText = `남은 시간: ${seconds}초`;
            if (check) {
                check = false;
                restartTokenCheck();
            }
        }
    }
}

function restartTokenCheck() {
    clearInterval(intervalId);
    startTokenCheck();
}

function startTokenCheck() {
    if (!TokenService.isLoggedIn()) return;

    intervalId = setInterval(() => {
        if (!TokenService.isLoggedIn()) {
            clearInterval(intervalId);
        } else {
            AuthService.checkTokenExpiry();
        }
    }, check ? CHECK_INTERVAL : CHECK_SECONDS);
}

if (TokenService.isLoggedIn()) {
    AuthService.checkTokenExpiry();
    startTokenCheck();
    window.extendToken = () => AuthService.extendToken();
}