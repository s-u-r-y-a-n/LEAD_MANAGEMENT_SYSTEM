import { CreateUser } from "./CreateUser/CreateUser.jsx";
import { FetchUsers } from "./Fetch Users/FetchUsers.jsx";
import { Box, Stack } from "@mui/material";

export const Users = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Stack direction="row" justifyContent="flex-end">
        <CreateUser />
      </Stack>
      <FetchUsers />
    </Box>
  );
};
