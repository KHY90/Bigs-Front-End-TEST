import axios from "axios";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

export const getAccessToken = (): string | null => localStorage.getItem(ACCESS_TOKEN_KEY);
export const getRefreshToken = (): string | null => localStorage.getItem(REFRESH_TOKEN_KEY);

export const storeTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

export const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

export const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = getRefreshToken();
  
  if (!refreshToken) {
    console.error("🚨 리프레시 토큰 없음");
    clearTokens();
    return null;
  }

  try {
    const response = await axios.post(
      "/auth/refresh",
      { refreshToken },
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`, 
          "Content-Type": "application/json",
        },
      }
    );

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;
    if (newAccessToken && newRefreshToken) {
      // console.log("✅ 토큰 갱신 성공! 새 액세스 토큰:", newAccessToken);
      storeTokens(newAccessToken, newRefreshToken); 
      return newAccessToken;
    }
  } catch (error) {
    console.error("🚨 토큰 갱신 실패:", error);
    clearTokens();
    return null;
  }
  return null;
};

