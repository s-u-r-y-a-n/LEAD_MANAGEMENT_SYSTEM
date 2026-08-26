import { Box, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { DialogComponent } from "../../../../Components/Dialog/Dialog.jsx";
import { useUsers } from "../../../../context/users/useUsers.js";

export const UpdateUser = ({ user, open, onClose }) => {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
  });

  const [validationError, setValidationError] = useState({
    username: false,
    email: false,
  });

  const [errorMessage, setErrorMessage] = useState({
    username: "",
    email: "",
  });

  const { updateUser, updateUserStatus } = useUsers();

  const isSubmitting = updateUserStatus === "loading";

  useEffect(() => {
    if (user) {
      setUserData({
        username: user.username || "",
        email: user.email || "",
      });

      setValidationError({
        username: false,
        email: false,
      });

      setErrorMessage({
        username: "",
        email: "",
      });
    }
  }, [user]);

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

  const validateUser = (form) => {
    const errors = {
      username: "",
      email: "",
    };

    if (!form.username.trim()) {
      errors.username = "Username is required";
    }

    if (!form.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errors.email = "Please enter a valid email address";
    }

    setErrorMessage(errors);

    setValidationError({
      username: !!errors.username,
      email: !!errors.email,
    });

    return !Object.values(errors).some(Boolean);
  };

  const handleUpdateUser = async (formValues) => {
    const isValid = validateUser(formValues);

    if (!isValid) return;

    try {
      await updateUser(user.id, formValues);

      onClose();
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  return (
    <DialogComponent
      open={open}
      onClose={onClose}
      onSubmit={handleUpdateUser}
      title="Update User"
      submitText="Update"
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
      </Box>
    </DialogComponent>
  );
};
