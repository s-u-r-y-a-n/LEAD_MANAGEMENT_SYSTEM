import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

export const DialogComponent = ({
  open,
  onClose,
  onSubmit,
  title,
  description,
  children,
  submitText = "Save",
  cancelText = "Cancel",
  maxWidth = "sm",
  loading = false,
}) => {
  const formId = React.useId();

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const formValues = Object.fromEntries(formData.entries());

    onSubmit?.(formValues);
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      fullWidth
      maxWidth={maxWidth}
    >
      <DialogTitle>{title}</DialogTitle>

      <DialogContent>
        {description && (
          <DialogContentText sx={{ mb: 2 }}>{description}</DialogContentText>
        )}

        <form id={formId} noValidate onSubmit={handleSubmit}>
          {children}
        </form>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          {cancelText}
        </Button>

        <Button
          type="submit"
          form={formId}
          variant="contained"
          disabled={loading}
        >
          {loading ? "Saving..." : submitText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
