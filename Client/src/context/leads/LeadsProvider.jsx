import { useCallback, useMemo, useState } from "react";
import { LeadsContext } from "./leadsContext";

// Lead API actions can be added here without affecting authentication or users.
export const LeadsProvider = ({ children }) => {
  const [leads, setLeads] = useState([]);
  const [leadsStatus, setLeadsStatus] = useState("idle");
  const [leadsError, setLeadsError] = useState(null);

  const clearLeads = useCallback(() => {
    setLeads([]);
    setLeadsStatus("idle");
    setLeadsError(null);
  }, []);

  const value = useMemo(
    () => ({ leads, leadsStatus, leadsError, setLeads, setLeadsStatus, setLeadsError, clearLeads }),
    [leads, leadsStatus, leadsError, clearLeads],
  );

  return <LeadsContext.Provider value={value}>{children}</LeadsContext.Provider>;
};
