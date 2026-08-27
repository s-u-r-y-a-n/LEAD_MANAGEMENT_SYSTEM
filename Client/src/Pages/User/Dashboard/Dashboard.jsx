
import { useEffect, useMemo } from "react";
import {
  Alert,
  Box,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import FiberNewIcon from "@mui/icons-material/FiberNew";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import CancelIcon from "@mui/icons-material/Cancel";
import PaidIcon from "@mui/icons-material/Paid";
import { useLeads } from "../../../context/leads/useLeads.js";

const STATUS_CONFIG = {
  New: { color: "#1976d2", icon: FiberNewIcon },
  Qualified: { color: "#7b1fa2", icon: WorkspacePremiumIcon },
  Won: { color: "#2e7d32", icon: EmojiEventsIcon },
  Lost: { color: "#d32f2f", icon: CancelIcon },
  Other: { color: "#94a3b8" },
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const MetricCard = ({ label, value, icon: Icon, color }) => (
  <Paper
    elevation={0}
    sx={{
      flex: "1 1 180px",
      minWidth: 180,
      p: 2.5,
      border: "1px solid",
      borderColor: "divider",
      borderRadius: 3,
    }}
  >
    <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
      <Box>
        <Typography color="text.secondary" variant="body2">
          {label}
        </Typography>
        <Typography sx={{ mt: 0.75, fontWeight: 700 }} variant="h4">
          {value}
        </Typography>
      </Box>
      <Box
        sx={{
          alignItems: "center",
          backgroundColor: `${color}1A`,
          borderRadius: 2,
          color,
          display: "flex",
          height: 46,
          justifyContent: "center",
          width: 46,
        }}
      >
        <Icon />
      </Box>
    </Box>
  </Paper>
);

const StatusDonut = ({ statusCounts, total }) => {
  const chartItems = Object.entries(statusCounts).filter(([, count]) => count);
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <Box sx={{ alignItems: "center", display: "flex", flex: 1, gap: 3, minWidth: 280 }}>
      <Box sx={{ height: 150, position: "relative", width: 150 }}>
        <svg height="150" viewBox="0 0 130 130" width="150">
          <circle cx="65" cy="65" fill="none" r={radius} stroke="#e2e8f0" strokeWidth="14" />
          {chartItems.map(([status, count]) => {
            const length = (count / total) * circumference;
            const segment = (
              <circle
                key={status}
                cx="65"
                cy="65"
                fill="none"
                r={radius}
                stroke={STATUS_CONFIG[status].color}
                strokeDasharray={`${length} ${circumference - length}`}
                strokeDashoffset={-offset}
                strokeLinecap="butt"
                strokeWidth="14"
                transform="rotate(-90 65 65)"
              />
            );
            offset += length;
            return segment;
          })}
        </svg>
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
            inset: 0,
            justifyContent: "center",
            position: "absolute",
          }}
        >
          <Typography fontWeight={700} variant="h5">
            {total}
          </Typography>
          <Typography color="text.secondary" variant="caption">
            Leads
          </Typography>
        </Box>
      </Box>
      <Box sx={{ display: "grid", gap: 1 }}>
        {chartItems.map(([status, count]) => (
          <Box alignItems="center" display="flex" gap={1} key={status}>
            <Box
              sx={{ backgroundColor: STATUS_CONFIG[status].color, borderRadius: "50%", height: 9, width: 9 }}
            />
            <Typography variant="body2">{status}</Typography>
            <Typography color="text.secondary" variant="body2">
              {count}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

const ValueByStatusChart = ({ values }) => {
  const maximum = Math.max(...Object.values(values), 1);

  return (
    <Box sx={{ display: "grid", flex: 1, gap: 2, minWidth: 280 }}>
      {Object.entries(values).map(([status, value]) => (
        <Box key={status}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.75 }}>
            <Typography variant="body2">{status}</Typography>
            <Typography color="text.secondary" variant="body2">
              {currencyFormatter.format(value)}
            </Typography>
          </Box>
          <Box sx={{ backgroundColor: "#e2e8f0", borderRadius: 99, height: 9, overflow: "hidden" }}>
            <Box
              sx={{
                backgroundColor: STATUS_CONFIG[status].color,
                borderRadius: 99,
                height: "100%",
                width: `${(value / maximum) * 100}%`,
              }}
            />
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export const Dashboard = () => {
  const { leads, leadsError, leadsStatus, fetchLeads } = useLeads();

  useEffect(() => {
    fetchLeads().catch((error) =>
      console.error("Failed to load dashboard data:", error),
    );
  }, [fetchLeads]);

  const dashboardData = useMemo(() => {
    const counts = { New: 0, Qualified: 0, Won: 0, Lost: 0, Other: 0 };
    const values = { New: 0, Qualified: 0, Won: 0, Lost: 0 };
    let totalExpectedValue = 0;

    leads.forEach((lead) => {
      const status = Object.hasOwn(counts, lead.status) ? lead.status : "Other";
      const expectedValue = Number(lead.expectedValue) || 0;
      counts[status] += 1;
      totalExpectedValue += expectedValue;

      if (Object.hasOwn(values, status)) {
        values[status] += expectedValue;
      }
    });

    return { counts, totalExpectedValue, values };
  }, [leads]);

  const isLoading = leadsStatus === "loading";

  return (
    <Box sx={{ display: "grid", gap: 3 }}>
      <Box>
        <Typography fontWeight={700} variant="h4">
          Dashboard
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          Lead pipeline summary and expected value.
        </Typography>
      </Box>

      {leadsError && <Alert severity="error">{leadsError}</Alert>}

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            <MetricCard color="#1976d2" icon={GroupsIcon} label="Total Leads" value={leads.length} />
            <MetricCard color="#0288d1" icon={FiberNewIcon} label="New Leads" value={dashboardData.counts.New} />
            <MetricCard color="#7b1fa2" icon={WorkspacePremiumIcon} label="Qualified Leads" value={dashboardData.counts.Qualified} />
            <MetricCard color="#2e7d32" icon={EmojiEventsIcon} label="Won Leads" value={dashboardData.counts.Won} />
            <MetricCard color="#d32f2f" icon={CancelIcon} label="Lost Leads" value={dashboardData.counts.Lost} />
            <MetricCard
              color="#ed6c02"
              icon={PaidIcon}
              label="Total Expected Value"
              value={currencyFormatter.format(dashboardData.totalExpectedValue)}
            />
          </Box>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
            <Paper
              elevation={0}
              sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3, flex: "1 1 400px", p: 3 }}
            >
              <Typography fontWeight={700} variant="h6">
                Lead status distribution
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }} variant="body2">
                Leads by current status
              </Typography>
              <StatusDonut statusCounts={dashboardData.counts} total={leads.length} />
            </Paper>

            <Paper
              elevation={0}
              sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3, flex: "1 1 400px", p: 3 }}
            >
              <Typography fontWeight={700} variant="h6">
                Expected value by status
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }} variant="body2">
                Value across your key pipeline stages
              </Typography>
              <ValueByStatusChart values={dashboardData.values} />
            </Paper>
          </Box>
        </>
      )}
    </Box>
  );
};
