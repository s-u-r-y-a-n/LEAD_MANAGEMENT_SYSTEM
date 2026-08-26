import React from "react";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { DialogComponent } from "../../../Components/Dialog/Dialog";

const API_BASE_URL = "http://localhost:5000";

export const Users = () => {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState({
    username: false,
    email: false,
    password: false,
  });
  const [errorMessage, setErrorMessage] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);

  function handleChange(event) {
    const value = event.target.value;
    const sanitizedValue = value.replace(/\s/g, "");
    setUserData((prev) => {
      return {
        ...prev,
        [event.target.name]: sanitizedValue,
      };
    });
    setErrorMessage((prev) => {
      return { ...prev, [event.target.name]: "" };
    });
    setValidationError((prev) => {
      return { ...prev, [event.target.name]: false };
    });
  }

  function validateUserCredentials(form) {
    const errors = {
      username: "",
      email: "",
      password: "",
    };
    if (!form.username.trim()) {
      errors.username = "Username is required";
    }
    if (!form.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errors.email = "Please enter a valid email address";
    }
    if (!form.password.trim()) {
      errors.password = "Password is required";
    }
    setErrorMessage(errors);
    setValidationError({
      username: !!errors.username,
      email: !!errors.email,
      password: !!errors.password,
    });
    return !Object.values(errors).some(Boolean);
  }

  async function createUser(formValues) {
    const isValid = validateUserCredentials(formValues);
    if (!isValid) return;
    setIsSubmitting(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/user`, formValues);
      setUserData({
        username: "",
        email: "",
        password: "",
      });
      navigate("/home");
      //   showToast(
      //     "success",
      //     "Logged In",
      //     response.data.message || "You have been logged in successfully.",
      //   );
      //   navigate("/home");
    } catch (error) {
      console.error(error);
      //   showToast(
      //     "error",
      //     "Login Failed",
      //     error.response?.data?.message ||
      //       "We could not log you in. Please check your details and try again.",
      //   );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Subscribe
      </Button>

      <DialogComponent
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={createUser}
        title="Create User"
        submitText="Subscribe"
        maxWidth="xs"
        loading={isSubmitting}
      >
        <Box
          sx={{ "& .MuiTextField-root": { m: 1, width: "25ch" } }}
          noValidate
          autoComplete="on"
          // onSubmit={createUser}
        >
          <TextField
            id="outlined-password-input"
            label="Username"
            type="text"
            required
            value={userData.username}
            onChange={handleChange}
            name="username"
            error={validationError.username}
            helperText={errorMessage.username}
            style={{ width: "100%" }}
          />
          <TextField
            id="outlined-password-input"
            label="Email"
            type="text"
            required
            value={userData.email}
            onChange={handleChange}
            name="email"
            error={validationError.email}
            helperText={errorMessage.email}
            style={{ width: "100%" }}
          />
          <TextField
            id="outlined-password-input"
            label="Password"
            type={showPassword ? "text" : "password"}
            required
            value={userData.password}
            onChange={handleChange}
            name="password"
            error={validationError.password}
            helperText={errorMessage.password}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
                      edge="end"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
            style={{ width: "100%" }}
          />
        </Box>
      </DialogComponent>
    </div>
  );
};
