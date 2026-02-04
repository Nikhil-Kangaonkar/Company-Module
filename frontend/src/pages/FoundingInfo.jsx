import React, { useState } from "react";
import {
  Box, Typography, TextField, Button, Paper, FormControl,
  InputLabel, Select, MenuItem, Chip, OutlinedInput,
  InputAdornment, Snackbar, Alert
} from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const organizationTypes = [
  "Private Limited", "Public Limited", "LLP", "Proprietorship", "Partnership"
];
const industryTypes = [
  "Fintech", "Engineering", "Software & IT", "Edtech", "Oil & Gas", "Other"
];

const FoundingInfo = () => {
  const [organizationType, setOrganizationType] = useState("");
  const [selectedIndustries, setSelectedIndustries] = useState([]);
  const [careersLink, setCareersLink] = useState("");
  const [vision, setVision] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  
  const navigate = useNavigate();
  const companyId = localStorage.getItem("companyId"); // 🔹 Get from profile step

  const showSnackbar = (msg, severity = "success") => {
    setSnackbar({ open: true, message: msg, severity });
  };
  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  const handleIndustryChange = (event) => {
    const { value } = event.target;
    setSelectedIndustries(typeof value === "string" ? value.split(",") : value);
  };

  const handleSubmit = async () => {
    if (!organizationType || selectedIndustries.length === 0 || !careersLink || !vision) {
      showSnackbar("Please fill all fields.", "error");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/company/founding-info", {
        companyId,
        organizationType,
        industries: selectedIndustries,
        careersLink,
        vision
      });

      if (res.data.success) {
        showSnackbar("Founding info saved successfully!");
        setTimeout(() => navigate("/social-media"), 800);
      } else {
        showSnackbar("Failed to save founding info", "error");
      }
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to save founding info", "error");
    }
  };

  return (
    <Box sx={{ width: "100vw", minHeight: "100vh", bgcolor: "#f5f5f5", p: { xs: 2, md: 5 }, display: "flex", justifyContent: "center" }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 2, width: "100%", maxWidth: "1200px" }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3 }}>
          Founding Information
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Organization Type */}
          <FormControl fullWidth>
            <InputLabel>Organization Type</InputLabel>
            <Select value={organizationType} onChange={(e) => setOrganizationType(e.target.value)}>
              {organizationTypes.map((type) => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Industry Types */}
          <FormControl fullWidth>
            <InputLabel>Industry Types</InputLabel>
            <Select
              multiple
              value={selectedIndustries}
              onChange={handleIndustryChange}
              input={<OutlinedInput label="Industry Types" />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => <Chip key={value} label={value} />)}
                </Box>
              )}
            >
              {industryTypes.map((type) => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Careers Link */}
          <TextField
            label="Official Careers Link"
            variant="outlined"
            fullWidth
            value={careersLink}
            onChange={(e) => setCareersLink(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LinkIcon />
                </InputAdornment>
              )
            }}
          />

          {/* Vision */}
          <TextField
            label="Company Vision"
            multiline
            rows={4}
            variant="outlined"
            fullWidth
            value={vision}
            onChange={(e) => setVision(e.target.value)}
            placeholder="Tell us about your company vision..."
          />

          {/* Save Button */}
          <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
            <Button variant="contained" color="primary" size="large" onClick={handleSubmit}>
              Save & Continue
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FoundingInfo;
