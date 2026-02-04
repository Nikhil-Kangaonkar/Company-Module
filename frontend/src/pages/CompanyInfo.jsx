import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Grid,
  IconButton,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CompanyInfo = ({ setProgress }) => {
  const [logo, setLogo] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [banner, setBanner] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [aboutUs, setAboutUs] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  
  const navigate = useNavigate();

  const showSnackbar = (msg, severity = "success") => {
    setSnackbar({ open: true, message: msg, severity });
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  const handleFileChange = (event, type) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (type === "logo") {
        setLogo(url);
        setLogoFile(file);
        showSnackbar("Logo uploaded successfully!");
      }
      if (type === "banner") {
        setBanner(url);
        setBannerFile(file);
        showSnackbar("Banner uploaded successfully!");
      }
    }
  };

  const removeFile = (type) => {
    if (type === "logo") {
      setLogo(null);
      setLogoFile(null);
    }
    if (type === "banner") {
      setBanner(null);
      setBannerFile(null);
    }
  };

  useEffect(() => {
    let completed = 0;
    if (logo) completed += 25;
    if (banner) completed += 25;
    if (companyName.trim()) completed += 25;
    if (aboutUs.trim()) completed += 25;
    setProgress(completed);
  }, [logo, banner, companyName, aboutUs, setProgress]);

  const handleSubmit = async () => {
    if (!logoFile || !bannerFile || !companyName || !aboutUs) {
      showSnackbar("Please fill all fields and upload both images.", "error");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", companyName);
      formData.append("about", aboutUs);
      formData.append("logo", logoFile);
      formData.append("banner", bannerFile);

      const res = await axios.post(
        "http://localhost:5000/api/company/profile",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.data.success) {
        showSnackbar("Company info saved successfully!");
        localStorage.setItem("companyId", res.data.companyId);
        navigate("/founding-info");
      } else {
        showSnackbar("Failed to save company info", "error");
      }
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to save company info", "error");
    }
  };

  return (
    <Box sx={{ width: "100vw", minHeight: "100vh", bgcolor: "#f5f5f5", p: { xs: 2, md: 5 } }}>
      <Box sx={{ bgcolor: "#fff", borderRadius: 2, p: { xs: 2, md: 4 }, maxWidth: "1200px", mx: "auto" }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3, color: "#000" }}>
          Logo & Banner Image
        </Typography>

        <Grid container spacing={3}>
          {/* Logo Upload */}
          <Grid item xs={12} md={6}>
            <Typography sx={{ fontWeight: "bold", mb: 1, color: "#555" }}>Upload Logo</Typography>
            <Box
              sx={{
                border: "2px dashed #ccc",
                borderRadius: 2,
                height: 200,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                cursor: "pointer",
                position: "relative",
                bgcolor: "#fafafa",
                "&:hover": { borderColor: "#1976d2" },
              }}
              onClick={() => document.getElementById("logo-upload").click()}
            >
              {logo ? (
                <>
                  <img src={logo} alt="logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                  <IconButton
                    size="small"
                    sx={{ position: "absolute", top: 5, right: 5, bgcolor: "#fff" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile("logo");
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </>
              ) : (
                <>
                  <UploadFileIcon sx={{ color: "#1976d2", fontSize: 40 }} />
                  <Typography color="primary" sx={{ mt: 1 }}>
                    Drag & drop or click to upload
                  </Typography>
                  <Typography variant="caption" sx={{ textAlign: "center", px: 1, color: "#333" }}>
                    A photo larger than 400px works best. Max size 5MB.
                  </Typography>
                </>
              )}
            </Box>
            <input id="logo-upload" type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => handleFileChange(e, "logo")} />
          </Grid>

          {/* Banner Upload */}
          <Grid item xs={12} md={6}>
            <Typography sx={{ fontWeight: "bold", mb: 1, color: "#555" }}>Banner Image</Typography>
            <Box
              sx={{
                border: "2px dashed #ccc",
                borderRadius: 2,
                height: 200,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                cursor: "pointer",
                position: "relative",
                bgcolor: "#fafafa",
                "&:hover": { borderColor: "#1976d2" },
              }}
              onClick={() => document.getElementById("banner-upload").click()}
            >
              {banner ? (
                <>
                  <img src={banner} alt="banner" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                  <IconButton
                    size="small"
                    sx={{ position: "absolute", top: 5, right: 5, bgcolor: "#fff" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile("banner");
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </>
              ) : (
                <>
                  <UploadFileIcon sx={{ color: "#1976d2", fontSize: 40 }} />
                  <Typography color="primary" sx={{ mt: 1 }}>
                    Drag & drop or click to upload
                  </Typography>
                  <Typography variant="caption" sx={{ textAlign: "center", px: 1, color: "#333" }}>
                    Optimal size 1520×400. JPEG/PNG. Max size 5MB.
                  </Typography>
                </>
              )}
            </Box>
            <input id="banner-upload" type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => handleFileChange(e, "banner")} />
          </Grid>
        </Grid>

        {/* Company Name */}
        <Typography sx={{ fontWeight: "bold", mt: 4, mb: 1, color: "#555" }}>Company name</Typography>
        <TextField fullWidth placeholder="Enter your company name" variant="outlined" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />

        {/* About Us */}
        <Typography sx={{ fontWeight: "bold", mt: 4, mb: 1, color: "#555" }}>About Us</Typography>
        <TextField fullWidth placeholder="Write down about your company here..." variant="outlined" multiline rows={4} value={aboutUs} onChange={(e) => setAboutUs(e.target.value)} />

        {/* Save Button */}
        <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>Save & Continue</Button>
        </Box>
      </Box>

      {/* Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default CompanyInfo;
