// Register.jsx
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  TextField, Button, Stepper, Step, StepLabel, Box, MenuItem
} from "@mui/material";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Firebase imports
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { app } from "../firebaseConfig";

const steps = ["User Info", "Company Info"];
const industryOptions = ["Fintech", "Engineering", "Software & IT", "Edtech", "Oil & Gas", "Other"];

export default function Register({ setIsRegistered }) {
  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();
  const auth = getAuth(app);

  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger
  } = useForm();

  // Next step
  const nextStep = async () => {
    const isStepValid = await trigger();
    if (isStepValid) setActiveStep((prev) => prev + 1);
  };

  const prevStep = () => setActiveStep((prev) => prev - 1);

  // Submit handler
  const onSubmit = async (data) => {
    try {
      // Create Firebase user
      const userCred = await createUserWithEmailAndPassword(auth, data.email, data.password);

      // Send verification email
      await sendEmailVerification(userCred.user);

      // Save user in backend
      const userRes = await axios.post("http://localhost:5000/api/users/register", {
        uid: userCred.user.uid,
        fullName: data.full_name,
        email: data.email,
        mobileNo: data.mobile_no
      });

      const ownerId = userRes.data.ownerId;

      // Create company in backend
      const companyRes = await axios.post("http://localhost:5000/api/company/profile", {
        owner_id: ownerId,
        companyName: data.company_name,
        address: data.address,
        industry: data.industry
      });

      // Store companyId
      localStorage.setItem("companyId", companyRes.data.companyId);

      // ✅ Mark user as registered and redirect
      setIsRegistered(true);
      navigate("/companyInfo");

    } catch (error) {
      console.error("Error during registration:", error);
      alert(error.message || "Registration failed");
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 600, margin: "auto", mt: 5, p: 3, bgcolor: "#fff", borderRadius: 2, boxShadow: 3 }}>
      {/* Stepper */}
      <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
        {steps.map((label) => (
          <Step key={label}><StepLabel>{label}</StepLabel></Step>
        ))}
      </Stepper>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Step 1: User Info */}
        {activeStep === 0 && (
          <Box>
            <Controller
              name="full_name"
              control={control}
              defaultValue=""
              rules={{ required: "Full name is required" }}
              render={({ field }) => (
                <TextField {...field} label="Full Name" fullWidth margin="normal"
                  error={!!errors.full_name} helperText={errors.full_name?.message} />
              )}
            />
            <Controller
              name="email"
              control={control}
              defaultValue=""
              rules={{ required: "Email is required" }}
              render={({ field }) => (
                <TextField {...field} label="Email" type="email" fullWidth margin="normal"
                  error={!!errors.email} helperText={errors.email?.message} />
              )}
            />
            <Controller
              name="password"
              control={control}
              defaultValue=""
              rules={{
                required: "Password is required",
                minLength: { value: 8, message: "Min 8 chars required" },
                pattern: { value: /^(?=.*[A-Z])(?=.*\d).+$/, message: "Must have 1 uppercase and 1 number" }
              }}
              render={({ field }) => (
                <TextField {...field} label="Password" type="password" fullWidth margin="normal"
                  error={!!errors.password} helperText={errors.password?.message} />
              )}
            />
            <Controller
              name="mobile_no"
              control={control}
              defaultValue=""
              rules={{ required: "Mobile number is required" }}
              render={({ field }) => (
                <PhoneInput
                  {...field}
                  country={"in"}
                  inputStyle={{ width: "100%", height: "56px" }}
                  specialLabel="Mobile Number"
                />
              )}
            />
          </Box>
        )}

        {/* Step 2: Company Info */}
        {activeStep === 1 && (
          <Box>
            <Controller
              name="company_name"
              control={control}
              defaultValue=""
              rules={{ required: "Company name is required" }}
              render={({ field }) => (
                <TextField {...field} label="Company Name" fullWidth margin="normal"
                  error={!!errors.company_name} helperText={errors.company_name?.message} />
              )}
            />
            <Controller
              name="address"
              control={control}
              defaultValue=""
              rules={{ required: "Address is required" }}
              render={({ field }) => (
                <TextField {...field} label="Address" fullWidth margin="normal"
                  error={!!errors.address} helperText={errors.address?.message} />
              )}
            />
            <Controller
              name="industry"
              control={control}
              defaultValue=""
              rules={{ required: "Industry is required" }}
              render={({ field }) => (
                <TextField {...field} label="Industry" select fullWidth margin="normal"
                  error={!!errors.industry} helperText={errors.industry?.message}>
                  {industryOptions.map((opt) => (
                    <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Box>
        )}

        {/* Buttons */}
        <Box mt={3} display="flex" justifyContent="space-between">
          {activeStep > 0 && (
            <Button onClick={prevStep}>Back</Button>
          )}
          {activeStep < steps.length - 1 ? (
            <Button variant="contained" onClick={nextStep}>Next</Button>
          ) : (
            <Button variant="contained" type="submit">Register</Button>
          )}
        </Box>
      </form>
    </Box>
  );
}
