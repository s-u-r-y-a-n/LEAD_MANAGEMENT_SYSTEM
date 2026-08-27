import React from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth/useAuth";

import { NavLink } from "react-router-dom";

const drawerWidth = 240;

export const Sidebar = () => {
  const [open, setOpen] = React.useState(true);

  const toggleSidebar = () => {
    setOpen((prev) => !prev);
  };

  const { logout, isAdmin } = useAuth();

  const menuItems = [
    {
      text: "Dashboard",
      icon: <DashboardIcon />,
      path: "/home/dashboard",
    },
    ...(isAdmin
      ? [
          {
            text: "Users",
            icon: <PeopleIcon />,
            path: "/home/users",
          },
        ]
      : []),
    {
      text: "Leads",
      icon: <SettingsIcon />,
      path: "/home/leads",
    },
  ];

  const navigate = useNavigate();
  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          top: 12,
          left: 12,
          zIndex: 1300,
        }}
      >
        <IconButton
          onClick={toggleSidebar}
          sx={{
            backgroundColor: "white",
            boxShadow: 2,

            "&:hover": {
              backgroundColor: "#f5f5f5",
            },
          }}
        >
          <MenuIcon />
        </IconButton>
      </Box>

      <Drawer
        variant="persistent"
        anchor="left"
        open={open}
        sx={{
          width: open ? drawerWidth : 35,
          flexShrink: 0,

          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Box
          sx={{
            height: 64,
            display: "flex",
            alignItems: "center",
            px: 8,
            fontSize: 20,
            fontWeight: 700,
          }}
        >
        </Box>

        <Divider />

        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                component={NavLink}
                to={item.path}
                sx={{
                  mx: 1,
                  borderRadius: 1,

                  color: "text.primary",
                  textDecoration: "none",

                  "&.active": {
                    backgroundColor: "primary.main",
                    color: "white",

                    "& .MuiListItemIcon-root": {
                      color: "white",
                    },
                  },
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>

                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Box sx={{ flexGrow: 1 }} />

        <Divider />

        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>

              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </>
  );
};
