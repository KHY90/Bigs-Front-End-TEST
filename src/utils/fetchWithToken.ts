import axios, { AxiosRequestConfig } from "axios";
import { refreshAccessToken, getAccessToken } from "./auth";
import authStore from "../stores/authStore";

export const fetchWithToken = async (url: string, config: AxiosRequestConfig = {}) => {
  let token: string | null = getAccessToken();

  if (!token) {
    console.warn("액세스 토큰 없음, 리프레시 시도");
    token = await refreshAccessToken();
  }

  if (!token) {
    console.error("토큰 갱신 실패, 로그아웃 진행");
    authStore.clearAuth();
    throw new Error("인증 실패: 유효한 토큰이 없습니다.");
  }

  const makeRequest = async (newToken: string) => {
    try {
      return await axios({
        url,
        method: config.method || "GET",
        headers: {
          Authorization: `Bearer ${newToken}`,
          ...config.headers, 
        },
        ...config,
      }).then((res) => res.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        console.warn("토큰 만료 감지: 리프레시 시도 중...");
        const refreshedToken = await refreshAccessToken();

        if (refreshedToken) {
          console.log("토큰 갱신 성공, 새로운 토큰으로 재요청 진행");
          authStore.setAuthTokens(refreshedToken, authStore.refreshToken || "");
          return await makeRequest(refreshedToken);
        } else {
          console.error("리프레시 토큰 만료, 로그아웃 진행");
          authStore.clearAuth();
          throw new Error("인증 실패: 새로운 토큰을 가져오지 못했습니다.");
        }
      }
      throw error;
    }
  };

  return await makeRequest(token);
};
