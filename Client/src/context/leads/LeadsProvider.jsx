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
  const [updateLeadStatus, setUpdateLeadStatus] = useState("idle");
  const [deleteLeadStatus, setDeleteLeadStatus] = useState("idle");
  const [leadsError, setLeadsError] = useState(null);

  const authorizedConfig = useCallback(
    () => ({ headers: { Authorization: `Bearer ${accessToken}` } }),
    [accessToken],
  );

  const fetchLeads = useCallback(async () => {
    setLeadsStatus("loading");
    setLeadsError(null);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/leads`,
        authorizedConfig(),
      );
      setLeads(response.data.leads || []);
      setLeadsStatus("succeeded");
    } catch (error) {
      const message = error.response?.data?.message || "Unable to load leads.";
      setLeads([]);
      setLeadsStatus("failed");
      setLeadsError(message);
      throw new Error(message, { cause: error });
    }
  }, [authorizedConfig]);

  const searchAndFilterLeads = useCallback(
    async (filters) => {
      setLeadsStatus("loading");
      setLeadsError(null);
      try {
        const params = Object.fromEntries(
          Object.entries(filters).filter(([, value]) => value !== ""),
        );
        const response = await axios.get(`${API_BASE_URL}/leads/search`, {
          ...authorizedConfig(),
          params,
        });
        setLeads(response.data.leads || []);
        setLeadsStatus("succeeded");
      } catch (error) {
        const message =
          error.response?.data?.message || "Unable to search leads.";
        setLeads([]);
        setLeadsStatus("failed");
        setLeadsError(message);
        throw new Error(message, { cause: error });
      }
    },
    [authorizedConfig],
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

  const updateLead = useCallback(
    async (leadId, leadData) => {
      setUpdateLeadStatus("loading");
      setLeadsError(null);
      try {
        const response = await axios.put(
          `${API_BASE_URL}/lead/${leadId}`,
          leadData,
          authorizedConfig(),
        );
        const updatedLead = response.data.lead;
        setLeads((prevLeads) =>
          prevLeads.map((lead) =>
            lead.id === updatedLead.id ? updatedLead : lead,
          ),
        );
        setUpdateLeadStatus("succeeded");
        return response.data;
      } catch (error) {
        const message =
          error.response?.data?.message || "Unable to update lead.";
        setUpdateLeadStatus("failed");
        setLeadsError(message);
        throw new Error(message, { cause: error });
      }
    },
    [authorizedConfig],
  );

  const deleteLead = useCallback(
    async (leadId) => {
      setDeleteLeadStatus("loading");
      setLeadsError(null);
      try {
        const response = await axios.delete(
          `${API_BASE_URL}/lead/${leadId}`,
          authorizedConfig(),
        );
        setLeads((prevLeads) => prevLeads.filter((lead) => lead.id !== leadId));
        setDeleteLeadStatus("succeeded");
        return response.data;
      } catch (error) {
        const message =
          error.response?.data?.message || "Unable to delete lead.";
        setDeleteLeadStatus("failed");
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
      updateLeadStatus,
      deleteLeadStatus,
      leadsError,
      fetchLeads,
      searchAndFilterLeads,
      createLead,
      updateLead,
      deleteLead,
      setLeads,
      setLeadsStatus,
      setLeadsError,
      clearLeads,
    }),
    [
      leads,
      leadsStatus,
      createLeadStatus,
      updateLeadStatus,
      deleteLeadStatus,
      leadsError,
      fetchLeads,
      searchAndFilterLeads,
      createLead,
      updateLead,
      clearLeads,
      deleteLead,
    ],
  );

  return (
    <LeadsContext.Provider value={value}>{children}</LeadsContext.Provider>
  );
};
