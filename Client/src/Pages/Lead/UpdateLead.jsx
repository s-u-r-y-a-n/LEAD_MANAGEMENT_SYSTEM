import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { DialogComponent } from "../../../../Components/Dialog/Dialog.jsx";
import { useLeads } from "../../../../context/leads/useLeads.js";
import { useUsers } from "../../../../context/users/useUsers.js";
import { useAuth } from "../../../../context/auth/useAuth.js";

const LEAD_SOURCES = [
  "Website",
  "Google Ads",
  "Facebook",
  "Referral",
  "Phone",
  "Email",
  "Other",
];
const STATUSES = [
  "New",
  "Contacted",
  "Qualified",
  "Proposal Sent",
  "Negotiation",
  "Won",
  "Lost",
];
const PRIORITIES = ["High", "Medium", "Low"];

export const UpdateLead = ({ lead, open, onClose }) => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    companyName: "",
    leadSource: "Website",
    status: "New",
    priority: "Medium",
    assignedUser: "",
    assignedUserId: "",
    expectedValue: "",
    expectedCloseDate: "",
    notes: "",
  });
  const [errors, setErrors] = useState({});

  const { updateLead, updateLeadStatus } = useLeads();
  const { users, fetchUsers } = useUsers();
  const { isAdmin } = useAuth();
  const isSubmitting = updateLeadStatus === "loading";

  useEffect(() => {
    if (isAdmin && open && users.length === 0) {
      fetchUsers().catch((err) => console.error("Failed to load users:", err));
    }
  }, [isAdmin, open, users.length, fetchUsers]);

  useEffect(() => {
    if (lead) {
      setForm({
        firstName: lead.firstName || "",
        lastName: lead.lastName || "",
        email: lead.email || "",
        phone: lead.phone || "",
        companyName: lead.companyName || "",
        leadSource: lead.leadSource || "Website",
        status: lead.status || "New",
        priority: lead.priority || "Medium",
        assignedUser: lead.assignedUser || "",
        assignedUserId: lead.assignedUserId || "",
        expectedValue: lead.expectedValue != null ? lead.expectedValue : "",
        expectedCloseDate: lead.expectedCloseDate
          ? lead.expectedCloseDate.split("T")[0]
          : "",
        notes: lead.notes || "",
      });
      setErrors({});
    }
  }, [lead]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleUserAssignmentChange = (e) => {
    const selectedUserId = e.target.value;
    const selectedUserObj = users.find((u) => u.id === selectedUserId);
    setForm((prev) => ({
      ...prev,
      assignedUserId: selectedUserId,
      assignedUser: selectedUserObj ? selectedUserObj.username : "",
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.firstName.trim()) newErrors.firstName = "First name is required";
    if (!form.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      newErrors.email = "Invalid email format";
    }
    if (!form.leadSource) newErrors.leadSource = "Lead source is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async () => {
    if (!validate()) return;
    try {
      await updateLead(lead.id, form);
      onClose();
    } catch (err) {
      console.error("Failed to update lead:", err);
    }
  };

  return (
    <DialogComponent
      open={open}
      onClose={onClose}
      onSubmit={handleUpdate}
      title="Update Lead"
      submitText="Update"
      maxWidth="sm"
      loading={isSubmitting}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            label="First Name"
            name="firstName"
            required
            fullWidth
            value={form.firstName}
            onChange={handleChange}
            error={!!errors.firstName}
            helperText={errors.firstName}
          />
          <TextField
            label="Last Name"
            name="lastName"
            required
            fullWidth
            value={form.lastName}
            onChange={handleChange}
            error={!!errors.lastName}
            helperText={errors.lastName}
          />
        </Box>

        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            label="Email"
            name="email"
            type="email"
            required
            fullWidth
            value={form.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            label="Phone"
            name="phone"
            fullWidth
            value={form.phone}
            onChange={handleChange}
          />
        </Box>

        <TextField
          label="Company Name"
          name="companyName"
          fullWidth
          value={form.companyName}
          onChange={handleChange}
        />

        <Box sx={{ display: "flex", gap: 2 }}>
          <FormControl fullWidth>
            <InputLabel id="leadSource-label">Lead Source</InputLabel>
            <Select
              labelId="leadSource-label"
              name="leadSource"
              value={form.leadSource}
              label="Lead Source"
              onChange={handleChange}
            >
              {LEAD_SOURCES.map((src) => (
                <MenuItem key={src} value={src}>
                  {src}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              name="status"
              value={form.status}
              label="Status"
              onChange={handleChange}
            >
              {STATUSES.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="priority-label">Priority</InputLabel>
            <Select
              labelId="priority-label"
              name="priority"
              value={form.priority}
              label="Priority"
              onChange={handleChange}
            >
              {PRIORITIES.map((priority) => (
                <MenuItem key={priority} value={priority}>
                  {priority}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {isAdmin && (
          <FormControl fullWidth>
            <InputLabel id="assignedUser-label">Assigned User</InputLabel>
            <Select
              labelId="assignedUser-label"
              name="assignedUserId"
              value={form.assignedUserId}
              label="Assigned User"
              onChange={handleUserAssignmentChange}
            >
              <MenuItem value="">
                <em>Unassigned</em>
              </MenuItem>
              {users.map((u) => (
                <MenuItem key={u.id} value={u.id}>
                  {u.username}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            label="Expected Value ($)"
            name="expectedValue"
            type="number"
            fullWidth
            value={form.expectedValue}
            onChange={handleChange}
          />
          <TextField
            label="Expected Close Date"
            name="expectedCloseDate"
            type="date"
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
            value={form.expectedCloseDate}
            onChange={handleChange}
          />
        </Box>

        <TextField
          label="Notes"
          name="notes"
          multiline
          rows={3}
          fullWidth
          value={form.notes}
          onChange={handleChange}
        />
      </Box>
    </DialogComponent>
  );
};
