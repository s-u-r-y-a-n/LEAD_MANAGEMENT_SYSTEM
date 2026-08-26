import { useCallback, useMemo, useState } from "react";
import axios from "axios";
import { AuthContext } from "./authContext";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(() =>
    localStorage.getItem("accessToken"),
  );
  const [refreshToken, setRefreshToken] = useState(() =>
    localStorage.getItem("refreshToken"),
  );
  const [authStatus, setAuthStatus] = useState("idle");
  const [authError, setAuthError] = useState(null);

  const login = useCallback(async ({ credentials, isAdminLogin }) => {
    setAuthStatus("loading");
    setAuthError(null);

    try {
      const response = await axios.post(
        `${API_BASE_URL}${isAdminLogin ? "/admin/login" : "/user/login"}`,
        credentials,
      );
      const { accessToken: nextAccessToken, refreshToken: nextRefreshToken } =
        response.data.data;

      localStorage.setItem("accessToken", nextAccessToken);
      localStorage.setItem("refreshToken", nextRefreshToken);
      setAccessToken(nextAccessToken);
      setRefreshToken(nextRefreshToken);
      setAuthStatus("succeeded");
    } catch (error) {
      const message =
        error.response?.data?.message || "Unable to log in. Please try again.";
      setAuthStatus("failed");
      setAuthError(message);
      throw new Error(message, { cause: error });
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setAccessToken(null);
    setRefreshToken(null);
    setAuthStatus("idle");
    setAuthError(null);
  }, []);

  const value = useMemo(
    () => ({ accessToken, refreshToken, authStatus, authError, login, logout }),
    [accessToken, refreshToken, authStatus, authError, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
