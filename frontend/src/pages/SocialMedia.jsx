import React, { useState } from "react";
import {
  Box, Typography, TextField, Button, Paper, InputAdornment,
  Snackbar, Alert
} from "@mui/material";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";
import InstagramIcon from "@mui/icons-material/Instagram";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SocialMedia = () => {
  const [socialLinks, setSocialLinks] = useState({
    linkedin: "",
    facebook: "",
    twitter: "",
    youtube: "",
    instagram: ""
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const navigate = useNavigate();

  const companyId = localStorage.getItem("companyId");

  const handleChange = (platform, value) => {
    setSocialLinks(prev => ({ ...prev, [platform]: value }));
  };

  const showSnackbar = (msg, severity = "success") => {
    setSnackbar({ open: true, message: msg, severity });
  };

  const handleCloseSnackbar = () =>
    setSnackbar(prev => ({ ...prev, open: false }));

  const handleSubmit = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/social-media/save", {
        linkedin: socialLinks.linkedin,
        facebook: socialLinks.facebook,
        twitter: socialLinks.twitter,
        youtube: socialLinks.youtube,
        instagram: socialLinks.instagram,
        companyId
      });

      if (res.data.success) {
        showSnackbar("Social media info saved successfully!");
        setTimeout(() => navigate("/contact"), 800);
      } else {
        showSnackbar("Failed to save social media info", "error");
      }
    } catch (err) {
      console.error(err);
      showSnackbar("Server error while saving social media", "error");
    }
  };


  return (
    <Box sx={{ width: "100vw", minHeight: "100vh", bgcolor: "#f5f5f5", p: { xs: 2, md: 5 }, display: "flex", justifyContent: "center" }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 2, width: "100%", maxWidth: "1200px" }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3 }}>
          Social Media Profiles
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {[
            { label: "LinkedIn Profile URL", icon: <LinkedInIcon />, field: "linkedin" },
            { label: "Facebook Page URL", icon: <FacebookIcon />, field: "facebook" },
            { label: "Twitter Handle", icon: <TwitterIcon />, field: "twitter" },
            { label: "YouTube Channel URL", icon: <YouTubeIcon />, field: "youtube" },
            { label: "Instagram Profile URL", icon: <InstagramIcon />, field: "instagram" }
          ].map(({ label, icon, field }) => (
            <TextField
              key={field}
              label={label}
              variant="outlined"
              fullWidth
              value={socialLinks[field]}
              onChange={(e) => handleChange(field, e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {icon}
                  </InputAdornment>
                )
              }}
            />
          ))}
          <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
            <Button variant="contained" color="primary" size="large" onClick={handleSubmit}>
              Save & Continue
            </Button>
          </Box>
        </Box>
      </Paper>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SocialMedia;
