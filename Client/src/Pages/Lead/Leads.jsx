import { Box, Stack } from "@mui/material";
import { CreateLead } from "./CreateLead.jsx";
import { FetchLeads } from "./FetchLeads.jsx";

export const Leads = () => {
  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <Stack direction="row" justifyContent="flex-end">
          <CreateLead />
        </Stack>
        <FetchLeads />
      </Box>
    </>
  );
};
