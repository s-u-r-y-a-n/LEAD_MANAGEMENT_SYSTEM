import { Alert, Snackbar } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { ToastContext } from "./ToastContext";

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const showToast = useCallback(
    ({
      severity = "info",
      summary = "",
      detail = "",
      life = 3000,
      closable = true,
    }) => {
      setToast({
        severity: severity === "warn" ? "warning" : severity,
        summary,
        detail,
        life,
        closable,
      });
    },
    [],
  );

  const success = useCallback(
    (detail, summary = "Success") =>
      showToast({ severity: "success", summary, detail }),
    [showToast],
  );

  const error = useCallback(
    (detail, summary = "Error") =>
      showToast({ severity: "error", summary, detail, life: 5000 }),
    [showToast],
  );

  const info = useCallback(
    (detail, summary = "Info") => showToast({ severity: "info", summary, detail }),
    [showToast],
  );

  const warn = useCallback(
    (detail, summary = "Warning") =>
      showToast({ severity: "warn", summary, detail }),
    [showToast],
  );

  const clear = useCallback(() => setToast(null), []);

  const handleClose = useCallback((_, reason) => {
    if (reason !== "clickaway") {
      clear();
    }
  }, [clear]);

  const value = useMemo(
    () => ({ showToast, success, error, info, warn, clear }),
    [showToast, success, error, info, warn, clear],
  );

  return (
    <ToastContext.Provider value={value}>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        autoHideDuration={toast?.life}
        onClose={handleClose}
        open={Boolean(toast)}
      >
        <Alert
          onClose={toast?.closable ? handleClose : undefined}
          severity={toast?.severity || "info"}
          sx={{ width: "100%" }}
          variant="filled"
        >
          {toast?.summary && <strong>{toast.summary}: </strong>}
          {toast?.detail}
        </Alert>
      </Snackbar>
      {children}
    </ToastContext.Provider>
  );
};
