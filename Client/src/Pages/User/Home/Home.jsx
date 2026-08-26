import React from "react";
import { Sidebar } from "../Sidebar/Sidebar";
import { Outlet } from "react-router-dom";

export const Home = () => {
  return (
    <div>
      <Sidebar />
      <Outlet />
    </div>
  );
};
