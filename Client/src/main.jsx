import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/auth/AuthProvider";
import { UsersProvider } from "./context/users/UsersProvider";
import { LeadsProvider } from "./context/leads/LeadsProvider";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <UsersProvider>
        <LeadsProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </LeadsProvider>
      </UsersProvider>
    </AuthProvider>
  </StrictMode>,
);
