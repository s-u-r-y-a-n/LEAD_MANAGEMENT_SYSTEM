import React from "react";
import { Route, Routes } from "react-router-dom";
import { Login } from "../Login/Login.jsx";
import { Home } from "../User/Home/Home.jsx";
import { Dashboard } from "../User/Dashboard/Dashboard.jsx";

export const Navigation = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/admin/login" element={<Login />} />
      <Route path="/home" element={<Home />}>
        <Route index element={<Dashboard />} />
      </Route>
    </Routes>
  );
};
