import { makeAutoObservable, runInAction } from "mobx";

class AuthStore {
  userName: string = localStorage.getItem("userName") || "User";
  userEmail: string = localStorage.getItem("userEmail") || "이메일 없음";
  userImage: string = localStorage.getItem("userImage") || "/image/avatar.png";
  accessToken: string | null = localStorage.getItem("accessToken");
  refreshToken: string | null = sessionStorage.getItem("refreshToken");
  isAuthenticated: boolean = !!this.accessToken;

  constructor() {
    makeAutoObservable(this);
  }

  // 로그인
  login = (name: string, email: string, accessToken: string, refreshToken: string) => {
    runInAction(() => {
      this.userName = name;
      this.userEmail = email;
      this.accessToken = accessToken;
      this.refreshToken = refreshToken;
      this.isAuthenticated = true;
    });

    localStorage.setItem("userName", name);
    localStorage.setItem("userEmail", email);
    localStorage.setItem("accessToken", accessToken);
    sessionStorage.setItem("refreshToken", refreshToken);
  };

  // 로그아웃 
  clearAuth = () => {
    runInAction(() => {
      this.userName = "User";
      this.userEmail = "이메일 없음";
      this.userImage = "/image/avatar.png";
      this.accessToken = null;
      this.refreshToken = null;
      this.isAuthenticated = false;
    });

    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
  };

  // 토큰 갱신
  setAuthTokens = (accessToken: string, refreshToken: string) => {
    runInAction(() => {
      this.accessToken = accessToken;
      this.refreshToken = refreshToken;
      this.isAuthenticated = true;
    });

    localStorage.setItem("accessToken", accessToken);
    sessionStorage.setItem("refreshToken", refreshToken);
  };
}

const authStore = new AuthStore();
export default authStore;
