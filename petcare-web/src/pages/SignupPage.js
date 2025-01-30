import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    InputAdornment,
    CircularProgress,
    MenuItem,
    IconButton,
    LinearProgress,
} from "@mui/material";
import { AccountCircle, Email, Lock, Phone, Home, ArrowBack, ArrowForward } from "@mui/icons-material";
import PetsIcon from "@mui/icons-material/Pets";
import axios from "axios";
import { motion } from "framer-motion"; // Import Framer Motion for animation

const SignupPage = () => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        mobile: "",
        role: "",
        email: "",
        address: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    };

    const roleOptions = [
        { label: "Pet Owner", value: "pet_owner" },
        { label: "Pet Professional", value: "professional" },
        { label: "Community", value: "community" },
    ];

    const validateStep1 = () => {
        let newErrors = {};
        if (!formData.name) newErrors.name = "Full Name is required";
        if (!formData.mobile) {
            newErrors.mobile = "Mobile number is required";
        } else if (!/^(07\d{8}|\d{9})$/.test(formData.mobile)) {
            newErrors.mobile = "Enter a valid mobile number (e.g., 0775228995 or 775228995)";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        let newErrors = {};
        if (!formData.role) newErrors.role = "Role selection is required";
        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Invalid email format";
        }
        if (!formData.address) newErrors.address = "Address is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep3 = () => {
        let newErrors = {};
        if (!formData.password) newErrors.password = "Password is required";
        if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters long";
        }
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (step === 1 && validateStep1()) setStep(2);
        else if (step === 2 && validateStep2()) setStep(3);
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateStep3()) return;

        setLoading(true);
        setSuccessMessage("");

        const apiData = {
            name: formData.name,
            mobile: formData.mobile,
            password: formData.password,
            role: formData.role,
            email: formData.email,
            address: formData.address,
            status: "active",
        };

        try {
            await axios.post("http://localhost:8000/api/profile/register", apiData);
            setSuccessMessage("Signup successful! Redirecting to login...");
            setTimeout(() => navigate("/"), 2000);
        } catch (error) {
            setErrors({ api: error.response?.data?.error || "Signup failed. Try again." });
        }

        setLoading(false);
    };

    return (
        <Box
            sx={{
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#f0f4f8",
                padding: { xs: 2, md: 0 }, // Adds padding on small screens
            }}
        >
            <Paper
                elevation={6}
                sx={{
                    padding: { xs: 3, md: 5 }, // Adjust padding for smaller screens
                    borderRadius: 4,
                    maxWidth: { xs: "90%", sm: 450 }, // Limits width dynamically
                    width: "100%",
                    textAlign: "center",
                    backgroundColor: "#ffffff",
                    boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
                }}
            >
                {/* Progress Bar */}
                <LinearProgress
                    variant="determinate"
                    value={(step - 1) * 50}
                    sx={{
                        mb: { xs: 1, md: 2 }, // Reduce margin on mobile
                        height: 6,
                        borderRadius: 5,
                    }}
                />

                <PetsIcon sx={{ fontSize: 60, color: "#1976d2", marginBottom: { xs: 1, md: 2 } }} />
                <Typography
                    variant="h5"
                    fontWeight="bold"
                    gutterBottom
                    sx={{ fontSize: { xs: "1.2rem", md: "1.5rem" } }} // Adjust text size dynamically
                >
                    {step === 1 ? "Join PetCare 🐾" : step === 2 ? "Complete Your Profile" : "Set Your Password"}
                </Typography>

                {/* Animated Form Content */}
                <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                    <Box component="form" onSubmit={step === 3 ? handleSubmit : handleNext} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        {step === 1 && (
                            <>
                                <TextField
                                    label="Full Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    fullWidth
                                    sx={{
                                        backgroundColor: "#f7f9fc",
                                        borderRadius: 1,
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: "8px",
                                        }
                                    }}
                                    error={!!errors.name}
                                    helperText={errors.name}
                                    InputProps={{ startAdornment: <InputAdornment position="start"><AccountCircle /></InputAdornment> }}
                                />
                                <TextField
                                    label="Mobile Number"
                                    name="mobile"
                                    value={formData.mobile}
                                    onChange={handleChange}
                                    fullWidth
                                    sx={{
                                        backgroundColor: "#f7f9fc",
                                        borderRadius: 1,
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: "8px",
                                        }
                                    }}
                                    error={!!errors.mobile}
                                    helperText={errors.mobile}
                                    InputProps={{ startAdornment: <InputAdornment position="start"><Phone /></InputAdornment> }}
                                />
                            </>
                        )}

                        {step === 2 && (
                            <>
                                <TextField
                                    select
                                    label="Select Role"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    fullWidth
                                    sx={{
                                        backgroundColor: "#f7f9fc",
                                        borderRadius: 1,
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: "8px",
                                        }
                                    }}
                                    error={!!errors.role}
                                    helperText={errors.role}
                                >
                                    {roleOptions.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                                <TextField
                                    label="Email Address"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    fullWidth
                                    sx={{
                                        backgroundColor: "#f7f9fc",
                                        borderRadius: 1,
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: "8px",
                                        }
                                    }}
                                    error={!!errors.email}
                                    helperText={errors.email}
                                    InputProps={{ startAdornment: <InputAdornment position="start"><Email /></InputAdornment> }}
                                />
                                <TextField
                                    label="Address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    fullWidth
                                    sx={{
                                        backgroundColor: "#f7f9fc",
                                        borderRadius: 1,
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: "8px",
                                        }
                                    }}
                                    error={!!errors.address}
                                    helperText={errors.address}
                                    InputProps={{ startAdornment: <InputAdornment position="start"><Home /></InputAdornment> }}
                                />
                            </>
                        )}

                        {step === 3 && (
                            <>
                                <TextField
                                    label="Password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    fullWidth
                                    sx={{
                                        backgroundColor: "#f7f9fc",
                                        borderRadius: 1,
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: "8px",
                                        }
                                    }}
                                    error={!!errors.password}
                                    helperText={errors.password}
                                    InputProps={{ startAdornment: <InputAdornment position="start"><Lock /></InputAdornment> }}
                                />
                                <TextField
                                    label="Confirm Password"
                                    name="confirmPassword"
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    fullWidth
                                    sx={{
                                        backgroundColor: "#f7f9fc",
                                        borderRadius: 1,
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: "8px",
                                        }
                                    }}
                                    error={!!errors.confirmPassword}
                                    helperText={errors.confirmPassword}
                                    InputProps={{ startAdornment: <InputAdornment position="start"><Lock /></InputAdornment> }}
                                />
                                {errors.api && <Typography color="error">{errors.api}</Typography>}
                                {successMessage && <Typography color="success">{successMessage}</Typography>}
                            </>
                        )}
                    </Box>
                </motion.div>

                {/* Navigation Arrows */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: step === 1 ? "flex-end" : "space-between",
                        marginTop: 3,
                    }}
                >
                    {step > 1 && (
                        <IconButton
                            onClick={handleBack}
                            sx={{
                                color: "#1976d2",
                                backgroundColor: "#e3f2fd",
                                borderRadius: "25px", // Oval Shape
                                padding: { xs: "8px 15px", md: "10px 20px" }, // Adjust padding for mobile
                                fontSize: "16px",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                "&:hover": { backgroundColor: "#bbdefb" },
                            }}
                        >
                            <ArrowBack /> Back
                        </IconButton>
                    )}

                    {step < 3 ? (
                        <IconButton
                            onClick={handleNext}
                            sx={{
                                color: "#ffffff",
                                backgroundColor: "#1976d2",
                                borderRadius: "25px", // Oval Shape
                                padding: { xs: "8px 15px", md: "10px 20px" },
                                fontSize: "16px",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                "&:hover": { backgroundColor: "#115293" },
                            }}
                        >
                            Next <ArrowForward />
                        </IconButton>
                    ) : (
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={loading}
                            sx={{
                                color: "#ffffff",
                                backgroundColor: "#1976d2",
                                borderRadius: "25px", // Oval Shape
                                padding: { xs: "8px 15px", md: "10px 20px" },
                                fontSize: "16px",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                "&:hover": { backgroundColor: "#115293" },
                            }}
                        >
                            {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Sign Up"}
                        </Button>
                    )}
                </Box>
            </Paper>
        </Box>
    );
};

export default SignupPage;
