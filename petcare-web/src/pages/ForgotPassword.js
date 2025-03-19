import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    InputAdornment
} from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import PetsIcon from "@mui/icons-material/Pets"; // Petcare theme icon
import axios from "axios";

const ForgotPassword = () => {
    const [mobile, setMobile] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (!mobile) {
            setError("Please enter your mobile number.");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post("http://localhost:8000/api/auth/forgot-password", { mobile });
            setMessage(response.data.message || "Password reset instructions sent.");
        } catch (err) {
            setError(err.response?.data?.error || "Something went wrong. Try again.");
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
                backgroundColor: "#f0f4f8", // Blueish Background
            }}
        >
            <Paper
                elevation={6}
                sx={{
                    padding: 5,
                    borderRadius: 4,
                    maxWidth: 420,
                    width: "90%",
                    textAlign: "center",
                    backgroundColor: "#ffffff",
                    boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
                }}
            >
                {/* Petcare Icon */}
                <PetsIcon sx={{ fontSize: 60, color: "#1976d2", marginBottom: 2 }} />

                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Forgot Password? 🐾
                </Typography>
                <Typography variant="body2" sx={{ color: "#555", marginBottom: 3 }}>
                    Enter your mobile number to receive password reset instructions.
                </Typography>

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
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        variant="outlined"
                        fullWidth
                        sx={{ backgroundColor: "#f7f9fc", borderRadius: 1 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <AccountCircle />
                                </InputAdornment>
                            ),
                        }}
                    />
                    {error && (
                        <Typography
                            color="error"
                            variant="body1"
                            sx={{
                                marginBottom: 1,
                                fontWeight: "bold",
                            }}
                        >
                            {error}
                        </Typography>
                    )}
                    {message && (
                        <Typography
                            color="success"
                            variant="body1"
                            sx={{
                                marginBottom: 1,
                                fontWeight: "bold",
                            }}
                        >
                            {message}
                        </Typography>
                    )}
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{
                            padding: 1.5,
                            fontWeight: "bold",
                            backgroundColor: "#1976d2",
                            "&:hover": { backgroundColor: "#115293" },
                        }}
                        disabled={loading}
                    >
                        {loading ? "Processing..." : "Reset Password"}
                    </Button>
                </Box>

                {/* Back to Login Link */}
                <Typography
                    variant="body2"
                    sx={{
                        marginTop: 2,
                        cursor: "pointer",
                        color: "#1976d2",
                        fontWeight: "bold",
                    }}
                    onClick={() => navigate("/")}
                >
                    Back to Login
                </Typography>
            </Paper>
        </Box>
    );
};

export default ForgotPassword;
