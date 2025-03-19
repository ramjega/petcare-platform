import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import UserManagement from "./UserManagement"; // Import User Management

const AdminDashboard = () => {
    const [view, setView] = useState("dashboard");

    return (
        <Box sx={{ textAlign: "center", padding: 3 }}>
            <SettingsIcon sx={{ fontSize: 60, color: "#1976d2" }} />
            <Typography variant="h4" sx={{ fontWeight: "bold", mt: 2 }}>
                Admin Control Panel ⚙️
            </Typography>

            <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 3 }}>
                <Button
                    variant="contained"
                    sx={{ backgroundColor: "#1976d2", "&:hover": { backgroundColor: "#115293" } }}
                    onClick={() => setView("users")}
                >
                    Manage Users
                </Button>
            </Box>

            <Box sx={{ mt: 3 }}>
                {view === "users" && <UserManagement />}
            </Box>
        </Box>
    );
};

export default AdminDashboard;
