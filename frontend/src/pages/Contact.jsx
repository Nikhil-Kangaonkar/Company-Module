import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  Snackbar,
  Alert
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LanguageIcon from "@mui/icons-material/Language";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Contact = () => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [website, setWebsite] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const navigate = useNavigate();

  const companyId = localStorage.getItem("companyId"); // Get from earlier step

  const showSnackbar = (msg, severity = "success") => {
    setSnackbar({ open: true, message: msg, severity });
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  const handleSubmit = async () => {
    if (!email || !phone || !address || !website) {
      showSnackbar("Please fill all fields", "error");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/contact/save", {
        companyId,
        email,
        phone,
        address,
        website
      });


      if (res.data.success) {
        showSnackbar("Contact info saved successfully!");
        navigate("/CompanyInfo");
      } else {
        showSnackbar("Failed to save contact info", "error");
      }
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to save contact info", "error");
    }
  };

  return (
    <Box sx={{ width: "100vw", minHeight: "100vh", bgcolor: "#f5f5f5", p: { xs: 2, md: 5 }, display: "flex", justifyContent: "center" }}>
      <Box sx={{ bgcolor: "#fff", borderRadius: 2, p: { xs: 2, md: 4 }, boxShadow: "0px 2px 8px rgba(0,0,0,0.1)", width: "100%", maxWidth: "1200px" }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3, color: "#000" }}>
          Contact Information
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <TextField
            label="Email Address"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><EmailIcon /></InputAdornment>
            }}
          />
          <TextField
            label="Phone Number"
            variant="outlined"
            fullWidth
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><PhoneIcon /></InputAdornment>
            }}
          />
          <TextField
            label="Company Address"
            variant="outlined"
            fullWidth
            multiline
            rows={3}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><LocationOnIcon /></InputAdornment>
            }}
          />
          <TextField
            label="Website URL"
            variant="outlined"
            fullWidth
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><LanguageIcon /></InputAdornment>
            }}
          />

          <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
            <Button variant="contained" color="primary" size="large" onClick={handleSubmit}>
              Save & Continue
            </Button>
          </Box>
        </Box>
      </Box>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Contact;
