import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import { useState } from "react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { DialogComponent } from "../../../Components/Dialog";
import { useUsers } from "../../../context/users/useUsers";

export const CreateUser = () => {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
  });

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

  const { createUser: createUserRequest, createUserStatus } = useUsers();

  const isSubmitting = createUserStatus === "loading";

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    const sanitizedValue = value.replace(/\s/g, "");

    setUserData((prev) => ({
      ...prev,
      [name]: sanitizedValue,
    }));

    setErrorMessage((prev) => ({
      ...prev,
      [name]: "",
    }));

    setValidationError((prev) => ({
      ...prev,
      [name]: false,
    }));
  };

  const validateUserCredentials = (form) => {
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
  };

  const createUser = async (formValues) => {
    const isValid = validateUserCredentials(formValues);

    if (!isValid) return;

    try {
      await createUserRequest(formValues);

      // Reset form after successful creation
      setUserData({
        username: "",
        email: "",
        password: "",
      });

      // Reset validation state
      setValidationError({
        username: false,
        email: false,
        password: false,
      });

      setErrorMessage({
        username: "",
        email: "",
        password: "",
      });

      // Close dialog
      setOpen(false);
    } catch (error) {
      console.error("Failed to create user:", error);
    }
  };

  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Create User
      </Button>

      <DialogComponent
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={createUser}
        title="Create User"
        submitText="Create"
        maxWidth="xs"
        loading={isSubmitting}
      >
        <Box
          sx={{
            "& .MuiTextField-root": {
              m: 1,
              width: "25ch",
            },
          }}
          noValidate
          autoComplete="on"
        >
          <TextField
            id="username"
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
            id="email"
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
            id="password"
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
    </>
  );
};
