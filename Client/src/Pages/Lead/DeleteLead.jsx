import { Typography } from "@mui/material";
import { DialogComponent } from "../../Components/Dialog/Dialog.jsx";
import { useLeads } from "../../context/leads/useLeads.js";

export const DeleteLead = ({ lead, open, onClose }) => {
  const { deleteLead, deleteLeadStatus } = useLeads();
  const isDeleting = deleteLeadStatus === "loading";

  const handleDeleteLead = async () => {
    if (!lead?.id) return;
    try {
      await deleteLead(lead.id);
      onClose();
    } catch (error) {
      console.error("Failed to delete lead:", error);
    }
  };

  return (
    <DialogComponent
      open={open}
      onClose={onClose}
      onSubmit={handleDeleteLead}
      title="Delete Lead"
      submitText="Delete"
      maxWidth="xs"
      loading={isDeleting}
    >
      <Typography variant="body1">
        Are you sure you want to delete lead{" "}
        <strong>
          {lead?.leadNumber} ({lead?.firstName} {lead?.lastName})
        </strong>
        ? This action cannot be undone.
      </Typography>
    </DialogComponent>
  );
};
