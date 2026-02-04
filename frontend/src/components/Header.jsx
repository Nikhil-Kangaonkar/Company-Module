import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Tabs,
  Tab,
  LinearProgress
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

import BusinessIcon from "@mui/icons-material/Business";
import InfoIcon from "@mui/icons-material/Info";
import ShareIcon from "@mui/icons-material/Share";
import CallIcon from "@mui/icons-material/Call";

const Header = ({ progress }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabRoutes = ["/", "/founding-info", "/social-media", "/contact"];
  const currentTab = tabRoutes.indexOf(location.pathname);

  return (
    <AppBar position="static" elevation={1} sx={{ bgcolor: "#fff", color: "#000" }}>
      {/* First Row */}
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #e0e0e0",
          px: { xs: 2, md: 4 }
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            color: "#1976d2",
            whiteSpace: "nowrap"
          }}
        >
          HireNext
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: { xs: 150, md: 200 } }}>
          <Typography
            variant="body2"
            sx={{
              color: "#555",
              whiteSpace: "nowrap",
              fontWeight: "bold"
            }}
          >
            Setup Progress: {progress}%
          </Typography>
          <Box sx={{ flexGrow: 1 }}>
            <LinearProgress variant="determinate" value={progress} sx={{ height: 6, borderRadius: 3 }} />
          </Box>
        </Box>
      </Toolbar>

      {/* Second Row */}
      <Toolbar sx={{ px: { xs: 0, md: 4 }, justifyContent: "center" }}>
        <Tabs
          value={currentTab === -1 ? 0 : currentTab}
          onChange={(e, newValue) => navigate(tabRoutes[newValue])}
          indicatorColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            "& .MuiTabs-indicator": {
              height: 3,
              borderRadius: "3px 3px 0 0"
            },
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 500,
              minWidth: "auto",
              px: { xs: 1, sm: 2, md: 3 },
              display: "flex",
              gap: 1,
              alignItems: "center",
              color: "#555",
              "&.Mui-selected": {
                color: "#1976d2"
              }
            },
            "& .MuiTab-iconSizeMedium": {
              "& .MuiSvgIcon-root": {
                color: "#555"
              }
            },
            "& .Mui-selected .MuiSvgIcon-root": {
              color: "#1976d2"
            }
          }}
        >
          <Tab icon={<BusinessIcon />} label="Company Info" />
          <Tab icon={<InfoIcon />} label="Founding Info" />
          <Tab icon={<ShareIcon />} label="Social Media" />
          <Tab icon={<CallIcon />} label="Contact" />
        </Tabs>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
