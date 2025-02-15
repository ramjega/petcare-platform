import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    InputAdornment,
    CircularProgress
} from "@mui/material";
import { AccountCircle, Lock } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/authSlice";
import PetsIcon from "@mui/icons-material/Pets";
import { motion } from "framer-motion"; // Import Framer Motion for smooth animation

const LoginPage = () => {
    const [credentials, setCredentials] = useState({ mobile: "", password: "" });
    const [errors, setErrors] = useState({});
    const [shake, setShake] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { status, error } = useSelector((state) => state.auth);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
        setErrors((prevErrors) => ({ ...prevErrors, [name]: "" })); // Clear errors when user types
    };

    const validateInputs = () => {
        let newErrors = {};

        // Validate Mobile Number (Start with 07 or 9 digits)
        if (!credentials.mobile) {
            newErrors.mobile = "Mobile number is required";
        } else if (!/^(07\d{8}|\d{9})$/.test(credentials.mobile)) {
            newErrors.mobile = "Enter a valid mobile number (e.g., 0771234567 or 771234567)";
        }

        // Validate Password
        if (!credentials.password) {
            newErrors.password = "Password is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateInputs()) {
            setShake(true);
            setTimeout(() => setShake(false), 500); // Reset shake effect
            return;
        }

        const resultAction = await dispatch(loginUser(credentials));
        if (loginUser.fulfilled.match(resultAction)) {
            navigate("/dashboard"); // Redirect on successful login
        } else {
            setShake(true); // Trigger shake effect on API error
            setTimeout(() => setShake(false), 500);
        }
    };

    return (

        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
                backgroundColor: "#f0f4f8",
                padding: { xs: 2, md: 4 },
                minHeight: "100vh",
                flexGrow: 1,
            }}
        >
            <Paper
                elevation={6}
                sx={{
                    padding: { xs: 3, md: 5 },
                    marginTop: { xs: "60px", md: "80px" },
                    borderRadius: 4,
                    maxWidth: { xs: "90%", sm: 420 },
                    width: "100%",
                    textAlign: "center",
                    backgroundColor: "#ffffff",
                    boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
                }}
            >
                {/* Petcare Icon */}
                <PetsIcon sx={{ fontSize: 60, color: "#1976d2", marginBottom: 2 }} />

                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Welcome to PetCare 🐾
                </Typography>
                <Typography variant="body2" sx={{ color: "#555", marginBottom: 3 }}>
                    Login to manage your pet’s health & appointments
                </Typography>

                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <motion.div
                        animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
                        transition={{ duration: 0.3 }}
                    >
                        <Box
                            component="form"
                            onSubmit={handleSubmit}
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                            }}
                        >
                            <TextField
                                label="Mobile Number"
                                name="mobile"
                                value={credentials.mobile}
                                onChange={handleChange}
                                variant="outlined"
                                fullWidth
                                error={!!errors.mobile}
                                helperText={errors.mobile}
                                sx={{
                                    backgroundColor: "#f7f9fc",
                                    borderRadius: 1,
                                    "& .MuiOutlinedInput-root": { // Adjusts border radius for input
                                        borderRadius: "8px",
                                    }
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AccountCircle />
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <TextField
                                label="Password"
                                name="password"
                                type="password"
                                value={credentials.password}
                                onChange={handleChange}
                                variant="outlined"
                                fullWidth
                                error={!!errors.password}
                                helperText={errors.password}
                                sx={{
                                    backgroundColor: "#f7f9fc",
                                    borderRadius: 1,
                                    "& .MuiOutlinedInput-root": { // Adjusts border radius for input
                                        borderRadius: "8px",
                                    }
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Lock />
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            {error && (
                                <Typography
                                    color="error"
                                    variant="body1"
                                >
                                    {error}
                                </Typography>
                            )}

                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                sx={{
                                    padding: 1.5,
                                    fontWeight: "bold",
                                    backgroundColor: "#1976d2", // Blue Button
                                    "&:hover": { backgroundColor: "#115293" }, // Darker blue on hover
                                }}
                                disabled={status === "loading"}
                            >
                                {status === "loading" ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Login"}
                            </Button>

                            {/* Forgot Password Link */}
                            <Typography
                                variant="body2"
                                sx={{
                                    marginTop: 1,
                                    color: "#1976d2",
                                    cursor: "pointer",
                                    textAlign: "right",
                                    fontWeight: "bold",
                                    "&:hover": { textDecoration: "underline" },
                                }}
                                onClick={() => navigate("/forgot-password")}
                            >
                                Forgot Password?
                            </Typography>
                        </Box>
                    </motion.div>
                </motion.div>

                <Typography
                    variant="body2"
                    sx={{
                        marginTop: 2,
                        cursor: "pointer",
                        color: "#1976d2",
                        fontWeight: "bold",
                        "&:hover": { textDecoration: "underline" },
                    }}
                    onClick={() => navigate("/signup")}
                >
                    Don't have an account? Sign Up
                </Typography>
            </Paper>
        </Box>
    );
};

export default LoginPage;
