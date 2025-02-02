import React from "react";
import { Typography, Box, Button } from "@mui/material";
import PetsIcon from "@mui/icons-material/Pets";

const PetOwnerDashboard = () => {
    return (
        <Box sx={{ textAlign: "center", padding: 3 }}>
            <PetsIcon sx={{ fontSize: 60, color: "#1976d2" }} />
            <Typography variant="h4" sx={{ fontWeight: "bold", mt: 2 }}>
                Welcome, Pet Owner! 🐾
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
                Manage your pets, appointments, and medical records.
            </Typography>
            <Button variant="contained" sx={{ mt: 3, backgroundColor: "#1976d2", "&:hover": { backgroundColor: "#115293" } }}>
                Add a New Pet
            </Button>
        </Box>
    );
};

export default PetOwnerDashboard;