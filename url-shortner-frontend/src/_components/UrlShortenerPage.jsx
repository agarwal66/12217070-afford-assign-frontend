import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Alert,
  CircularProgress,
  IconButton,
  Fade,
  Stack,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import LinkIcon from "@mui/icons-material/Link";
import axios from "axios";

const API_BASE = "http://localhost:4000";
const emptyInput = { url: "", validity: "", shortcode: "" };

function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export default function UrlShortenerPage() {
  const [inputs, setInputs] = useState([{ ...emptyInput }]);
  const [results, setResults] = useState([]);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (index, field, value) => {
    setInputs((prev) =>
      prev.map((input, i) => (i === index ? { ...input, [field]: value } : input))
    );
  };

  const addInput = () => {
    if (inputs.length < 5) setInputs((prev) => [...prev, { ...emptyInput }]);
  };

  const removeInput = (index) => {
    setInputs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setErrors([]);
    setResults([]);
    setLoading(true);

    const validationErrors = [];

    inputs.forEach(({ url, validity, shortcode }, i) => {
      if (!url || !isValidUrl(url)) {
        validationErrors.push(`Row ${i + 1}: Invalid URL`);
      }
      if (validity && (!/^\d+$/.test(validity) || parseInt(validity) <= 0)) {
        validationErrors.push(`Row ${i + 1}: Validity must be a positive integer`);
      }
      if (shortcode && !/^[a-zA-Z0-9]{4,10}$/.test(shortcode)) {
        validationErrors.push(`Row ${i + 1}: Shortcode must be 4-10 alphanumeric chars`);
      }
    });

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    try {
      const responses = await Promise.all(
        inputs.map(({ url, validity, shortcode }) => {
          const data = { url };
          if (validity) data.validity = parseInt(validity);
          if (shortcode) data.shortcode = shortcode;
          return axios.post(`${API_BASE}/shorturls`, data);
        })
      );

      const newResults = responses.map((res, i) => ({
        originalUrl: inputs[i].url,
        shortLink: res.data.shortLink,
        expiry: res.data.expiry,
      }));

      setResults(newResults);
    } catch (error) {
      if (error.response?.data?.error) {
        setErrors([error.response.data.error]);
      } else {
        setErrors(["An unexpected error occurred."]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 620,
        mx: "auto",
        mt: 4,
        px: { xs: 1, sm: 3 },
        pb: 6,
      }}
    >
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
        URL Shortener
      </Typography>
      <Typography
        variant="subtitle1"
        color="text.secondary"
        textAlign="center"
        mb={4}
      >
        Paste up to <b>5</b> URLs, set expiry or custom code, and get short links instantly!
      </Typography>

      <Stack spacing={3} mb={3}>
        {inputs.map((input, index) => (
          <Fade in key={index}>
            <Paper
              elevation={3}
              sx={{
                borderRadius: 4,
                px: 2,
                py: 2.5,
                backdropFilter: "blur(4px)",
                background: "rgba(255,255,255,0.8)",
                boxShadow: "0 8px 32px 0 rgba(25, 118, 210, 0.14)",
                position: "relative",
              }}
            >
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={7}>
                  <TextField
                    label="Paste URL"
                    placeholder="https://example.com/..."
                    fullWidth
                    required
                    value={input.url}
                    onChange={(e) => handleChange(index, "url", e.target.value)}
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <LinkIcon sx={{ color: "#707c88", mr: 1 }} />
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={6} sm={2.5}>
                  <TextField
                    label="Minutes"
                    type="number"
                    inputProps={{ min: 1 }}
                    fullWidth
                    value={input.validity}
                    onChange={(e) =>
                      handleChange(index, "validity", e.target.value)
                    }
                    size="small"
                    placeholder="30"
                  />
                </Grid>
                <Grid item xs={6} sm={2.5}>
                  <TextField
                    label="Shortcode"
                    fullWidth
                    value={input.shortcode}
                    onChange={(e) =>
                      handleChange(index, "shortcode", e.target.value)
                    }
                    size="small"
                    inputProps={{ maxLength: 10 }}
                  />
                </Grid>
                {inputs.length > 1 && (
                  <IconButton
                    aria-label="remove"
                    onClick={() => removeInput(index)}
                    sx={{
                      position: "absolute",
                      top: 6,
                      right: 6,
                      color: "#e53935",
                    }}
                  >
                    <DeleteOutlineIcon />
                  </IconButton>
                )}
              </Grid>
            </Paper>
          </Fade>
        ))}
      </Stack>

      <Box sx={{ textAlign: "right", mb: 1 }}>
        <Button
          startIcon={<AddCircleIcon />}
          onClick={addInput}
          variant="outlined"
          color="primary"
          size="small"
          disabled={inputs.length >= 5}
          sx={{
            borderRadius: 2,
            fontWeight: "bold",
            textTransform: "none",
            boxShadow: 1,
          }}
        >
          Add URL
        </Button>
      </Box>

      <Box sx={{ textAlign: "center", mb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          size="large"
          disabled={loading}
          sx={{
            px: 6,
            py: 1.5,
            borderRadius: 3,
            fontWeight: "bold",
            letterSpacing: 1,
            fontSize: "1.1rem",
            boxShadow: "0 4px 16px 0 rgba(25, 118, 210, 0.18)",
          }}
        >
          {loading ? <CircularProgress size={28} color="inherit" /> : "Shorten URLs"}
        </Button>
      </Box>

      {errors.length > 0 && (
        <Box mb={3}>
          {errors.map((err, i) => (
            <Alert severity="error" key={i} sx={{ mb: 1 }}>
              {err}
            </Alert>
          ))}
        </Box>
      )}

      {results.length > 0 && (
        <Box>
          <Typography
            variant="h6"
            fontWeight="bold"
            mb={2}
            color="primary"
            textAlign="center"
            letterSpacing={1}
          >
            🎉 Short Links
          </Typography>
          <Stack spacing={2}>
            {results.map(({ originalUrl, shortLink, expiry }, i) => (
              <Fade in key={i}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 2.5,
                    borderRadius: 3,
                    background: "rgba(227,242,253,0.75)",
                    cursor: "pointer",
                    transition: "box-shadow 0.2s",
                    "&:hover": { boxShadow: "0 8px 32px 0 #1976d233" },
                  }}
                  onClick={() => window.open(shortLink, "_blank")}
                  title="Open short link"
                >
                  <Typography
                    variant="subtitle1"
                    color="primary"
                    fontWeight="bold"
                    sx={{ wordBreak: "break-all" }}
                  >
                    {shortLink}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ wordBreak: "break-all" }}
                  >
                    {originalUrl}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Expires: {new Date(expiry).toLocaleString()}
                  </Typography>
                </Paper>
              </Fade>
            ))}
          </Stack>
        </Box>
      )}
    </Box>
  );
}
