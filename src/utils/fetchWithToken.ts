import axios, { AxiosRequestConfig } from "axios";
import { refreshAccessToken, getAccessToken } from "./auth";
import authStore from "../stores/authStore";

export const fetchWithToken = async (url: string, config: AxiosRequestConfig = {}) => {
  let token = getAccessToken();

  if (!token) {
    console.warn("액세스 토큰 없음, 리프레시 시도");
    token = await refreshAccessToken();
  }

  try {
    const response = await axios({
      url,
      method: config.method || "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        ...config.headers,
      },
      ...config,
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      console.warn("토큰 만료: 리프레시 시도 중...");
      token = await refreshAccessToken();

      if (token) {
        try {
          console.log("토큰 갱신 성공, 재요청 진행");
          return await axios({
            url,
            method: config.method || "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              ...config.headers,
            },
            ...config,
          }).then((res) => res.data);
        } catch (retryError) {
          console.error("갱신 후 재요청 실패:", retryError);
        }
      } else {
        console.error("리프레시 토큰 만료, 로그아웃 진행");
        authStore.clearAuth();
      }
    }
    throw error;
  }
};
