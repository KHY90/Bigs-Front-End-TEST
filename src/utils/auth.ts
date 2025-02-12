import axios from "axios";
import authStore from "../stores/authStore";

export const getAccessToken = (): string | null => authStore.accessToken;
export const getRefreshToken = (): string | null => authStore.refreshToken;

export const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    console.error("리프레시 토큰 없음, 로그아웃 진행");
    authStore.clearAuth();
    return null;
  }

  try {
    const response = await axios.post("/auth/refresh", { refreshToken });
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;

    if (newAccessToken && newRefreshToken) {
      console.log("새 토큰 발급 성공, 세션에 저장");
      authStore.setAuthTokens(newAccessToken, newRefreshToken);
      return newAccessToken;
    }
  } catch (error) {
    console.error("토큰 갱신 실패:", error);
    authStore.clearAuth();
  }

  return null;
};
