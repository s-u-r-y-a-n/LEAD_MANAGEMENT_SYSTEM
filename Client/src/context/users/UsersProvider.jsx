import { useCallback, useMemo, useState } from "react";
import axios from "axios";
import { useAuth } from "../auth/useAuth";
import { UsersContext } from "./usersContext";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const UsersProvider = ({ children }) => {
  const { accessToken } = useAuth();
  const [users, setUsers] = useState([]);
  const [usersStatus, setUsersStatus] = useState("idle");
  const [createUserStatus, setCreateUserStatus] = useState("idle");
  const [usersError, setUsersError] = useState(null);

  const authorizedConfig = useCallback(
    () => ({ headers: { Authorization: `Bearer ${accessToken}` } }),
    [accessToken],
  );

  const fetchUsers = useCallback(async () => {
    setUsersStatus("loading");
    setUsersError(null);

    try {
      const response = await axios.get(
        `${API_BASE_URL}/users`,
        authorizedConfig(),
      );
      setUsers(response.data.users || []);
      setUsersStatus("succeeded");
    } catch (error) {
      const message = error.response?.data?.message || "Unable to load users.";
      setUsers([]);
      setUsersStatus("failed");
      setUsersError(message);
      throw new Error(message, { cause: error });
    }
  }, [authorizedConfig]);

  const createUser = useCallback(
    async (userData) => {
      setCreateUserStatus("loading");
      setUsersError(null);

      try {
        const response = await axios.post(
          `${API_BASE_URL}/user`,
          userData,
          authorizedConfig(),
        );
        setCreateUserStatus("succeeded");
        return response.data;
      } catch (error) {
        const message = error.response?.data?.message || "Unable to create user.";
        setCreateUserStatus("failed");
        setUsersError(message);
        throw new Error(message, { cause: error });
      }
    },
    [authorizedConfig],
  );

  const value = useMemo(
    () => ({
      users,
      usersStatus,
      createUserStatus,
      usersError,
      fetchUsers,
      createUser,
    }),
    [users, usersStatus, createUserStatus, usersError, fetchUsers, createUser],
  );

  return <UsersContext.Provider value={value}>{children}</UsersContext.Provider>;
};
