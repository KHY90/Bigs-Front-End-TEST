import { makeAutoObservable, runInAction } from "mobx";

class AuthStore {
  userName: string = sessionStorage.getItem("userName") || "User";
  userEmail: string = sessionStorage.getItem("userEmail") || "이메일 없음";
  userImage: string = sessionStorage.getItem("userImage") || "/image/avatar.png";
  accessToken: string | null = sessionStorage.getItem("accessToken");
  refreshToken: string | null = sessionStorage.getItem("refreshToken");
  isAuthenticated: boolean = !!this.accessToken;

  constructor() {
    makeAutoObservable(this);
  }

  // 로그인
  login = (name: string, email: string, accessToken: string, refreshToken: string, imageUrl?: string) => {
    runInAction(() => {
      this.userName = name;
      this.userEmail = email;
      this.userImage = imageUrl || "/image/avatar.png";
      this.accessToken = accessToken;
      this.refreshToken = refreshToken;
      this.isAuthenticated = true;
    });

    sessionStorage.setItem("userName", name);
    sessionStorage.setItem("userEmail", email);
    sessionStorage.setItem("userImage", imageUrl || "/image/avatar.png");
    sessionStorage.setItem("accessToken", accessToken);
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

    sessionStorage.removeItem("userName");
    sessionStorage.removeItem("userEmail");
    sessionStorage.removeItem("userImage");
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
  };

  // 토큰 갱신
  setAuthTokens = (accessToken: string, refreshToken: string) => {
    runInAction(() => {
      this.accessToken = accessToken;
      this.refreshToken = refreshToken;
      this.isAuthenticated = true;
    });

    sessionStorage.setItem("accessToken", accessToken);
    sessionStorage.setItem("refreshToken", refreshToken);
  };

  // 유저 정보 변경 (이름, 이메일, 이미지)
  setUserInfo = (name: string, email: string, imageUrl: string) => {
    runInAction(() => {
      this.userName = name;
      this.userEmail = email;
      this.userImage = imageUrl;
    });

    sessionStorage.setItem("userName", name);
    sessionStorage.setItem("userEmail", email);
    sessionStorage.setItem("userImage", imageUrl);
  };
}

const authStore = new AuthStore();
export default authStore;
