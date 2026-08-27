import { Navigate, Route, Routes } from "react-router-dom";
import { Login } from "./Login/Login.jsx";
import { Home } from "./User/Home.jsx";
import { Dashboard } from "./User/Dashboard.jsx";
import { Users } from "./User/Users/Users.jsx";
import { Leads } from "./Lead/Leads.jsx";
import { ProtectedRoutes } from "../utils/ProtectedRoute.jsx";

export const Navigation = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/admin/login" element={<Login />} />
      <Route element={<ProtectedRoutes />}>
        <Route path="/home" element={<Home />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route element={<ProtectedRoutes allowedRoles={["admin"]} />}>
            <Route path="users" element={<Users />} />
          </Route>
          <Route path="leads" element={<Leads />} />
        </Route>
      </Route>
    </Routes>
  );
};
