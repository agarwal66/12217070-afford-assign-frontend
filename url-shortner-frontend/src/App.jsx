import {
  ThemeProvider,
  CssBaseline,
  Box,
  Typography,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
} from "@mui/material";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import LinkIcon from "@mui/icons-material/Link";
import BarChartIcon from "@mui/icons-material/BarChart";
import { useState } from "react";
import { motion } from "framer-motion";
import UrlShortenerPage from "./_components/UrlShortenerPage";
import UrlStatsPage from "./_components/UrlStatsPage";
import theme from "./theme";
const gradientBg =
  "linear-gradient(135deg, #a599a2 0%, #eae0ef 50%, #9dc8d4 100%)";

const navItems = [
  { label: "Shorten", icon: <LinkIcon />, path: "/" },
  { label: "Stats", icon: <BarChartIcon />, path: "/stats" },
];
function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const value = navItems.findIndex((item) => location.pathname === item.path);

  return (
    <Paper
      elevation={10}
      sx={{
        position: "fixed",
        bottom: 24,
        left: "50%",
        transform: "translateX(-50%)",
        borderRadius: 4,
        px: 2,
        py: 0.5,
        bgcolor: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(8px)",
        zIndex: 100,
        width: 320,
      }}
    >
      <BottomNavigation
        showLabels
        value={value}
        onChange={(_, newValue) => navigate(navItems[newValue].path)}
        sx={{
          bgcolor: "transparent",
        }}
      >
        {navItems.map((item) => (
          <BottomNavigationAction
            key={item.label}
            label={item.label}
            icon={item.icon}
            sx={{
              color: "#a4508b",
              "&.Mui-selected": {
                color: "#5f0a87",
                fontWeight: "bold",
              },
              fontFamily: "Montserrat, sans-serif",
            }}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
}

export default function App() {
  const [navValue, setNavValue] = useState(0);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box
          sx={{
            minHeight: "100vh",
            background: gradientBg,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            fontFamily: "Montserrat, sans-serif",
            pb: 10, // For bottom nav space
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: 620,
              mx: "auto",
              mt: { xs: 4, md: 7 },
              mb: 2,
              py: 2,
              px: { xs: 2, md: 4 },
              borderRadius: 6,
              boxShadow: "0 8px 32px 0 rgba(164,80,139,0.25)",
              background: "rgba(255,255,255,0.18)",
              backdropFilter: "blur(8px)",
              border: "1.5px solid rgba(255,255,255,0.22)",
              textAlign: "center",
            }}
          >
            <Typography
              variant="h3"
              fontWeight="bold"
              sx={{
                background: "linear-gradient(90deg,#a4508b,#5f0a87,#00c6fb)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: 2,
                fontFamily: "Montserrat, sans-serif",
                mb: 1,
              }}
            >
              <span style={{ fontFamily: "Montserrat, sans-serif" }}>
                AFFORDMEDICALS
              </span>
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                color: "#fff",
                opacity: 0.85,
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 500,
                letterSpacing: 1,
              }}
            >
              Instantly shorten and track your links.
            </Typography>
          </Box>
          <Box
            component="main"
            sx={{
              width: "100%",
              maxWidth: 620,
              mx: "auto",
              flexGrow: 1,
              mt: 1,
              px: { xs: 1, md: 0 },
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Routes>
                <Route path="/" element={<UrlShortenerPage />} />
                <Route path="/stats" element={<UrlStatsPage />} />
              </Routes>
            </motion.div>
          </Box>
          <BottomNav />
        </Box>
      </Router>
    </ThemeProvider>
  );
}
