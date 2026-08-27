import { Box } from "@mui/material";
import { Sidebar } from "./Sidebar";
import { Outlet } from "react-router-dom";

export const Home = () => {
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#f5f6fa",
      }}
    >
      <Sidebar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          p: 3,
          transition: "margin 0.3s ease",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center" }}>
          <h2 style={{ marginTop: 0 }}>Lead Management System</h2>
        </div>
        <Outlet />
      </Box>
    </Box>
  );
};
