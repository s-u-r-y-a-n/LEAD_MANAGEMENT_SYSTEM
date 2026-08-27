import { Typography } from "@mui/material";
import { DialogComponent } from "../../../Components/Dialog.jsx";
import { useUsers } from "../../../context/users/useUsers.js";

export const DeleteUser = ({ user, open, onClose }) => {
  const { deleteUser, deleteUserStatus } = useUsers();
  const isDeleting = deleteUserStatus === "loading";

  const handleDeleteUser = async () => {
    if (!user?.id) return;
    try {
      await deleteUser(user.id);
      onClose();
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  return (
    <DialogComponent
      open={open}
      onClose={onClose}
      onSubmit={handleDeleteUser}
      title="Delete User"
      submitText="Delete"
      maxWidth="xs"
      loading={isDeleting}
    >
      <Typography variant="body1">
        Are you sure you want to delete user{" "}
        <strong>{user?.username || user?.email}</strong>? This action cannot be
        undone.
      </Typography>
    </DialogComponent>
  );
};
