import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Stack,
  Fade,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import axios from "axios";

const API_BASE = "http://localhost:4000";

export default function UrlStatsPage() {
  const [shortcodes, setShortcodes] = useState([]);
  const [inputCode, setInputCode] = useState("");
  const [statsList, setStatsList] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("shortcodes") || "[]");
    setShortcodes(saved);
  }, []);

  useEffect(() => {
    shortcodes.forEach((code) => {
      fetchStats(code);
    });
    // eslint-disable-next-line
  }, [shortcodes]);

  const fetchStats = async (code) => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${API_BASE}/shorturls/${code}`);
      setStatsList((prev) => {
        if (prev.find((s) => s.shortcode === code)) return prev;
        return [...prev, res.data];
      });
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch stats");
    } finally {
      setLoading(false);
    }
  };

  const addShortcode = () => {
    if (!inputCode.match(/^[a-zA-Z0-9]{4,10}$/)) {
      setError("Shortcode must be 4-10 alphanumeric characters");
      return;
    }
    if (shortcodes.includes(inputCode)) {
      setError("Shortcode already added");
      return;
    }
    const updated = [...shortcodes, inputCode];
    setShortcodes(updated);
    localStorage.setItem("shortcodes", JSON.stringify(updated));
    fetchStats(inputCode);
    setInputCode("");
    setError("");
  };

  const removeShortcode = (code) => {
    const updated = shortcodes.filter((c) => c !== code);
    setShortcodes(updated);
    localStorage.setItem("shortcodes", JSON.stringify(updated));
    setStatsList((prev) => prev.filter((s) => s.shortcode !== code));
  };

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", mt: 4, px: { xs: 1, sm: 3 }, pb: 6 }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        mb={2}
        letterSpacing={1}
        textAlign="center"
        sx={{
          background: "linear-gradient(90deg, #1976d2 30%, #42a5f5 90%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        URL Stats
      </Typography>
      <Typography
        variant="subtitle1"
        color="text.secondary"
        textAlign="center"
        mb={4}
      >
        Track your short URLs. Add a shortcode to view its analytics.
      </Typography>

      <Stack direction="row" gap={2} alignItems="center" sx={{ mb: 3 }}>
        <TextField
          label="Shortcode"
          value={inputCode}
          onChange={(e) => setInputCode(e.target.value)}
          helperText="4-10 alphanumeric chars"
          sx={{ flexGrow: 1, minWidth: 220 }}
          size="small"
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddCircleIcon />}
          onClick={addShortcode}
          sx={{ fontWeight: "bold", borderRadius: 2, px: 3 }}
        >
          Add
        </Button>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading && <CircularProgress sx={{ mb: 3, display: "block", mx: "auto" }} />}

      {!loading && statsList.length === 0 && (
        <Typography color="text.secondary" textAlign="center" sx={{ mt: 4 }}>
          No statistics available. Add shortcodes above.
        </Typography>
      )}

      <Stack spacing={3} mt={2}>
        {statsList.map(
          ({
            shortcode,
            originalUrl,
            createdAt,
            expiry,
            totalClicks,
            clicks,
          }) => (
            <Fade in key={shortcode}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  borderRadius: 4,
                  background: "rgba(227,242,253,0.85)",
                  position: "relative",
                  boxShadow: "0 8px 32px 0 #1976d233",
                }}
              >
                <Box sx={{ position: "absolute", top: 8, right: 8 }}>
                  <IconButton
                    aria-label="remove"
                    onClick={() => removeShortcode(shortcode)}
                    size="small"
                    sx={{
                      color: "#e53935",
                      background: "#fff",
                      boxShadow: 1,
                      "&:hover": { background: "#ffebee" },
                    }}
                  >
                    <DeleteOutlineIcon />
                  </IconButton>
                </Box>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  mb={1}
                  color="primary"
                  sx={{ letterSpacing: 1 }}
                >
                  {shortcode}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap mb={1}>
                  <span style={{ fontWeight: 500 }}>Original URL:</span>{" "}
                  <a
                    href={originalUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: "#1976d2", wordBreak: "break-all" }}
                  >
                    {originalUrl}
                  </a>
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={1}>
                  <span style={{ fontWeight: 500 }}>Created:</span>{" "}
                  {new Date(createdAt).toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={1}>
                  <span style={{ fontWeight: 500 }}>Expires:</span>{" "}
                  {new Date(expiry).toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  <span style={{ fontWeight: 500 }}>Total Clicks:</span> {totalClicks}
                </Typography>

                <Accordion sx={{ borderRadius: 2, bgcolor: "background.paper" }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography fontWeight="bold">Click Details</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {clicks.length === 0 ? (
                      <Typography color="text.secondary">
                        No clicks recorded yet.
                      </Typography>
                    ) : (
                      <Table size="small" sx={{ minWidth: 320 }}>
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontWeight: "bold" }}>
                              Timestamp
                            </TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>
                              Referrer
                            </TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>
                              Location
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {clicks.map((click, i) => (
                            <TableRow key={i}>
                              <TableCell>
                                {new Date(click.timestamp).toLocaleString()}
                              </TableCell>
                              <TableCell>{click.referrer || "-"}</TableCell>
                              <TableCell>{click.location || "-"}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </AccordionDetails>
                </Accordion>
              </Paper>
            </Fade>
          )
        )}
      </Stack>
    </Box>
  );
}
