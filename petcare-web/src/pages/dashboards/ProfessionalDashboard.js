import React from "react";
import { Typography, Box, Button } from "@mui/material";
import EventIcon from "@mui/icons-material/Event";

const ProfessionalDashboard = () => {
    return (
        <Box sx={{ textAlign: "center", padding: 3 }}>
            <EventIcon sx={{ fontSize: 60, color: "#1976d2" }} />
            <Typography variant="h4" sx={{ fontWeight: "bold", mt: 2 }}>
                Welcome, Pet Professional! 🏥
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
                Manage your schedules, services, and appointments.
            </Typography>
            <Button variant="contained" sx={{ mt: 3, backgroundColor: "#1976d2", "&:hover": { backgroundColor: "#115293" } }}>
                View Appointments
            </Button>
        </Box>
    );
};

export default ProfessionalDashboard;