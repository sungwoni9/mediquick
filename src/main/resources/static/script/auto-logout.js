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
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (!response.ok) {
                this.handleSessionExpired();
                return;
            }

            const data = await response.json();
            this.updateTokenTimer(data.remainingTime);
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
                headers: { "Authorization": `Bearer ${token}` }
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
        window.location.href = "/user/login";
    }

    static updateTokenTimer(remainingTime) {
        const minutes = Math.floor(remainingTime / 1000 / 60);
        const seconds = Math.floor((remainingTime / 1000) % 60);
        document.getElementById("token-timer").innerText = `남은 시간: ${minutes}분 ${seconds}초`;
    }
}

// 로그인 상태일 때만 실행
if (TokenService.isLoggedIn()) {
    setInterval(() => AuthService.checkTokenExpiry(), 1000);
    window.extendToken = () => AuthService.extendToken();
}
