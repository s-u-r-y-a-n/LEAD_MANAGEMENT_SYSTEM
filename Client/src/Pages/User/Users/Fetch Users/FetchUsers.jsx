import { useEffect, useState } from "react";
import { useUsers } from "../../../../context/users/useUsers";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  CircularProgress,
  Box,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { UpdateUser } from "../UpdateUser/UpdateUser.jsx";
import { DeleteUser } from "../DeleteUser/DeleteUser.jsx";

export const FetchUsers = () => {
  const { users, usersStatus, fetchUsers, deleteUser, deleteUserStatus } =
    useUsers();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedUser, setSelectedUser] = useState(null);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  console.log("FETCH USERS", fetchUsers);
  console.log("USERS", users);

  const isLoading = usersStatus === "loading";
  const isDeleting = deleteUserStatus === "loading";

  useEffect(() => {
    fetchUsers().catch((error) =>
      console.error("Failed to fetch users:", error),
    );
  }, [fetchUsers]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number(event.target.value));
    setPage(0);
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setDeleteOpen(true);
  };

  const paginatedUsers = users.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const handleEdit = (user) => {
    console.log("Edit userrr:", user);
    setSelectedUser(user);
    setUpdateOpen(true);
  };

  const handleCloseUpdate = () => {
    setUpdateOpen(false);
    setSelectedUser(null);
  };

  const handleCloseDelete = () => {
    setDeleteOpen(false);
    setSelectedUser(null);
  };

  return (
    <>
      <Paper
        sx={{
          width: "100%",
          overflow: "hidden",
        }}
      >
        <TableContainer>
          <Table stickyHeader>
            {/* Table Header */}
            <TableHead>
              <TableRow>
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: 600,
                    width: 70,
                  }}
                >
                  S.No
                </TableCell>

                <TableCell
                  sx={{
                    fontWeight: 600,
                    minWidth: 150,
                  }}
                >
                  Username
                </TableCell>

                <TableCell
                  sx={{
                    fontWeight: 600,
                    minWidth: 220,
                  }}
                >
                  Email
                </TableCell>

                <TableCell
                  sx={{
                    fontWeight: 600,
                    minWidth: 130,
                  }}
                >
                  Created At
                </TableCell>

                <TableCell
                  sx={{
                    fontWeight: 600,
                    minWidth: 130,
                  }}
                >
                  Updated At
                </TableCell>

                <TableCell
                  align="center"
                  sx={{
                    fontWeight: 600,
                    minWidth: 150,
                  }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            {/* Table Body */}
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        py: 5,
                      }}
                    >
                      <CircularProgress />
                    </Box>
                  </TableCell>
                </TableRow>
              ) : paginatedUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        py: 5,
                      }}
                    >
                      <Typography color="text.secondary">
                        No users found
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedUsers.map((user, index) => (
                  <TableRow hover key={user.id}>
                    {/* S.No */}
                    <TableCell align="center">
                      {page * rowsPerPage + index + 1}
                    </TableCell>

                    {/* Username */}
                    <TableCell>{user.username}</TableCell>

                    {/* Email */}
                    <TableCell>{user.email}</TableCell>

                    {/* Created At */}
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>

                    {/* Updated At */}
                    <TableCell>
                      {new Date(user.updatedAt).toLocaleDateString()}
                    </TableCell>

                    {/* Actions */}
                    <TableCell align="center">
                      <Tooltip title="Edit User">
                        <IconButton
                          color="primary"
                          onClick={() => handleEdit(user)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Delete User">
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(user)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={users.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      {selectedUser && (
        <UpdateUser
          user={selectedUser}
          open={updateOpen}
          onClose={handleCloseUpdate}
        />
      )}

      {selectedUser && (
        <DeleteUser
          user={selectedUser}
          open={deleteOpen}
          onClose={handleCloseDelete}
        />
      )}
    </>
  );
};
