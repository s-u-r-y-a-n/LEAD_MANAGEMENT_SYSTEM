import { useCallback, useMemo, useState } from "react";
import axios from "axios";
import { AuthContext } from "./authContext";
import { useToast } from "../../Components/Toast/useToast";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const decodeToken = (token) => {
  if (!token) return null;
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const { success, error: showError } = useToast();
  const [accessToken, setAccessToken] = useState(() =>
    localStorage.getItem("accessToken"),
  );
  const [refreshToken, setRefreshToken] = useState(() =>
    localStorage.getItem("refreshToken"),
  );
  const [authStatus, setAuthStatus] = useState("idle");
  const [authError, setAuthError] = useState(null);
  const user = useMemo(() => decodeToken(accessToken), [accessToken]);
  const isAdmin = user?.role === "admin";

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
      success(response.data.message || "You have been logged in.", "Login successful");
    } catch (error) {
      const message =
        error.response?.data?.message || "Unable to log in. Please try again.";
      setAuthStatus("failed");
      setAuthError(message);
      showError(message, "Login failed");
      throw new Error(message, { cause: error });
    }
  }, [showError, success]);

  const logout = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setAccessToken(null);
    setRefreshToken(null);
    setAuthStatus("idle");
    setAuthError(null);
    success("You have been logged out.", "Logged out");
  }, [success]);

  const value = useMemo(
    () => ({
      accessToken,
      refreshToken,
      user,
      isAdmin,
      authStatus,
      authError,
      login,
      logout,
    }),
    [
      accessToken,
      refreshToken,
      user,
      isAdmin,
      authStatus,
      authError,
      login,
      logout,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
