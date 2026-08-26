import { useCallback, useMemo, useState } from "react";
import axios from "axios";
import { useAuth } from "../auth/useAuth.js";
import { LeadsContext } from "./leadsContext.js";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const LeadsProvider = ({ children }) => {
  const { accessToken } = useAuth();
  const [leads, setLeads] = useState([]);
  const [leadsStatus, setLeadsStatus] = useState("idle");
  const [createLeadStatus, setCreateLeadStatus] = useState("idle");
  const [leadsError, setLeadsError] = useState(null);

  const authorizedConfig = useCallback(
    () => ({ headers: { Authorization: `Bearer ${accessToken}` } }),
    [accessToken],
  );

  const createLead = useCallback(
    async (leadData) => {
      setCreateLeadStatus("loading");
      setLeadsError(null);
      try {
        const response = await axios.post(
          `${API_BASE_URL}/lead`,
          leadData,
          authorizedConfig(),
        );
        const newLead = response.data.lead;
        setLeads((prevLeads) => [newLead, ...prevLeads]);
        setCreateLeadStatus("succeeded");
        return response.data;
      } catch (error) {
        const message =
          error.response?.data?.message || "Unable to create lead.";
        setCreateLeadStatus("failed");
        setLeadsError(message);
        throw new Error(message, { cause: error });
      }
    },
    [authorizedConfig],
  );

  const clearLeads = useCallback(() => {
    setLeads([]);
    setLeadsStatus("idle");
    setLeadsError(null);
  }, []);

  const value = useMemo(
    () => ({
      leads,
      leadsStatus,
      createLeadStatus,
      leadsError,
      createLead,
      setLeads,
      setLeadsStatus,
      setLeadsError,
      clearLeads,
    }),
    [leads, leadsStatus, createLeadStatus, leadsError, createLead, clearLeads],
  );

  return (
    <LeadsContext.Provider value={value}>{children}</LeadsContext.Provider>
  );
};
