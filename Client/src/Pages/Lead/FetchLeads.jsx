import { useEffect, useState } from "react";
import { useLeads } from "../../context/leads/useLeads.js";
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
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { UpdateLead } from "./UpdateLead.jsx";
import { DeleteLead } from "./DeleteLead.jsx";

const getStatusColor = (status) => {
  switch (status) {
    case "Won":
      return "success";
    case "Lost":
      return "error";
    case "Qualified":
    case "Proposal Sent":
    case "Negotiation":
      return "primary";
    case "Contacted":
      return "info";
    default:
      return "default";
  }
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case "High":
      return "error";
    case "Medium":
      return "warning";
    case "Low":
      return "default";
    default:
      return "default";
  }
};

export const FetchLeads = () => {
  const { leads, leadsStatus, fetchLeads } = useLeads();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedLead, setSelectedLead] = useState(null);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const isLoading = leadsStatus === "loading";

  useEffect(() => {
    fetchLeads().catch((error) =>
      console.error("Failed to fetch leads:", error),
    );
  }, [fetchLeads]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number(event.target.value));
    setPage(0);
  };

  const handleEdit = (lead) => {
    setSelectedLead(lead);
    setUpdateOpen(true);
  };

  const handleCloseUpdate = () => {
    setUpdateOpen(false);
    setSelectedLead(null);
  };

  const handleDelete = (lead) => {
    setSelectedLead(lead);
    setDeleteOpen(true);
  };

  const handleCloseDelete = () => {
    setDeleteOpen(false);
    setSelectedLead(null);
  };

  const paginatedLeads = leads.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  return (
    <>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ fontWeight: 600, width: 60 }}>
                  S.No
                </TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 120 }}>
                  Lead No
                </TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 150 }}>
                  Name
                </TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 180 }}>
                  Email / Phone
                </TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 130 }}>
                  Company
                </TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 110 }}>
                  Source
                </TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 110 }}>
                  Status
                </TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 100 }}>
                  Priority
                </TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 130 }}>
                  Assigned User
                </TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 110 }}>
                  Value
                </TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 120 }}>
                  Close Date
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontWeight: 600, minWidth: 80 }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={12}>
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
              ) : paginatedLeads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={12}>
                    <Box
                      sx={{ display: "flex", justifyContent: "center", py: 5 }}
                    >
                      <Typography color="text.secondary">
                        No leads found
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedLeads.map((lead, index) => (
                  <TableRow hover key={lead.id}>
                    <TableCell align="center">
                      {page * rowsPerPage + index + 1}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>
                      {lead.leadNumber}
                    </TableCell>
                    <TableCell>
                      {lead.firstName} {lead.lastName}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{lead.email}</Typography>
                      {lead.phone && (
                        <Typography variant="caption" color="text.secondary">
                          {lead.phone}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>{lead.companyName || "-"}</TableCell>
                    <TableCell>{lead.leadSource}</TableCell>
                    <TableCell>
                      <Chip
                        label={lead.status || "New"}
                        size="small"
                        color={getStatusColor(lead.status)}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={lead.priority || "Medium"}
                        size="small"
                        color={getPriorityColor(lead.priority)}
                      />
                    </TableCell>
                    <TableCell>{lead.assignedUser || "Unassigned"}</TableCell>
                    <TableCell>
                      {lead.expectedValue != null
                        ? `$${Number(lead.expectedValue).toLocaleString()}`
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {lead.expectedCloseDate
                        ? new Date(lead.expectedCloseDate).toLocaleDateString()
                        : "-"}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Edit Lead">
                        <IconButton
                          color="primary"
                          onClick={() => handleEdit(lead)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Lead">
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(lead)}
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
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={leads.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {selectedLead && (
        <UpdateLead
          lead={selectedLead}
          open={updateOpen}
          onClose={handleCloseUpdate}
        />
      )}

      {selectedLead && (
        <DeleteLead
          lead={selectedLead}
          open={deleteOpen}
          onClose={handleCloseDelete}
        />
      )}
    </>
  );
};
