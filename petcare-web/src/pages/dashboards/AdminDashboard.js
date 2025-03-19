import React, { useState } from "react";
import { Box, Typography, Button, Card, CardContent, Grid } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import GroupIcon from "@mui/icons-material/Group";
import BusinessIcon from "@mui/icons-material/Business";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import UserManagement from "./admin/UserManagement";
import OrganizationManagement from "./admin/OrganizationManagement";
import CityManagement from "./admin/CityManagement";

const AdminDashboard = () => {
    const [view, setView] = useState("dashboard");

    // Function to render the selected component
    const renderView = () => {
        switch (view) {
            case "users":
                return <UserManagement />;
            case "organizations":
                return <OrganizationManagement />;
            case "cities":
                return <CityManagement />;
            default:
                return null;
        }
    };

    return (
        <Box sx={{ textAlign: "center", padding: 3 }}>


            {/* Grid Layout for Cards */}
            <Grid container spacing={3} justifyContent="center" sx={{ mt: 3 }}>
                <Grid item xs={12} sm={6} md={4}>
                    <Card
                        sx={{ textAlign: "center", cursor: "pointer", "&:hover": { backgroundColor: "#f5f5f5" } }}
                        onClick={() => setView("users")}
                    >
                        <CardContent>
                            <GroupIcon sx={{ fontSize: 50, color: "#1976d2" }} />
                            <Typography variant="h6" sx={{ mt: 1 }}>Manage Users</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <Card
                        sx={{ textAlign: "center", cursor: "pointer", "&:hover": { backgroundColor: "#f5f5f5" } }}
                        onClick={() => setView("organizations")}
                    >
                        <CardContent>
                            <BusinessIcon sx={{ fontSize: 50, color: "#1976d2" }} />
                            <Typography variant="h6" sx={{ mt: 1 }}>Manage Organizations</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <Card
                        sx={{ textAlign: "center", cursor: "pointer", "&:hover": { backgroundColor: "#f5f5f5" } }}
                        onClick={() => setView("cities")}
                    >
                        <CardContent>
                            <LocationCityIcon sx={{ fontSize: 50, color: "#1976d2" }} />
                            <Typography variant="h6" sx={{ mt: 1 }}>Manage Cities</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Display Selected View */}
            <Box sx={{ mt: 3 }}>{renderView()}</Box>
        </Box>
    );
};

export default AdminDashboard;
