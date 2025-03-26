import React, { useState } from "react";
import { Box, Typography, Card, CardContent, Grid } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import GroupIcon from "@mui/icons-material/Group";
import BusinessIcon from "@mui/icons-material/Business";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import LocalPharmacyIcon from "@mui/icons-material/LocalPharmacy"; // Medicine Icon
import UserManagement from "./admin/UserManagement";
import OrganizationManagement from "./admin/OrganizationManagement";
import CityManagement from "./admin/CityManagement";
import MedicineManagement from "./admin/MedicineManagement";

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
            case "medicines":
                return <MedicineManagement />;
            default:
                return null;
        }
    };

    return (
        <Box sx={{ textAlign: "center", padding: 3 }}>
            <SettingsIcon sx={{ fontSize: 60, color: "#1976d2" }} />
            <Typography variant="h4" sx={{ fontWeight: "bold", mt: 2 }}>
                Admin Control Panel
            </Typography>

            {/* Grid Layout for Cards */}
            <Grid container spacing={3} justifyContent="center" sx={{ mt: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card
                        sx={{
                            textAlign: "center",
                            cursor: "pointer",
                            backgroundColor: view === "users" ? "#e3f2fd" : "white",
                            boxShadow: view === "users" ? 4 : 1,
                            border: view === "users" ? "2px solid #1976d2" : "1px solid #ccc",
                            "&:hover": { backgroundColor: "#f5f5f5" }
                        }}
                        onClick={() => setView("users")}
                    >
                        <CardContent>
                            <GroupIcon sx={{ fontSize: 50, color: "#1976d2" }} />
                            <Typography variant="h6" sx={{ mt: 1 }}>Manage Users</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card
                        sx={{
                            textAlign: "center",
                            cursor: "pointer",
                            backgroundColor: view === "organizations" ? "#e3f2fd" : "white",
                            boxShadow: view === "organizations" ? 4 : 1,
                            border: view === "organizations" ? "2px solid #1976d2" : "1px solid #ccc",
                            "&:hover": { backgroundColor: "#f5f5f5" }
                        }}
                        onClick={() => setView("organizations")}
                    >
                        <CardContent>
                            <BusinessIcon sx={{ fontSize: 50, color: "#1976d2" }} />
                            <Typography variant="h6" sx={{ mt: 1 }}>Manage Organizations</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card
                        sx={{
                            textAlign: "center",
                            cursor: "pointer",
                            backgroundColor: view === "cities" ? "#e3f2fd" : "white",
                            boxShadow: view === "cities" ? 4 : 1,
                            border: view === "cities" ? "2px solid #1976d2" : "1px solid #ccc",
                            "&:hover": { backgroundColor: "#f5f5f5" }
                        }}
                        onClick={() => setView("cities")}
                    >
                        <CardContent>
                            <LocationCityIcon sx={{ fontSize: 50, color: "#1976d2" }} />
                            <Typography variant="h6" sx={{ mt: 1 }}>Manage Cities</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* New Manage Medicines Card */}
                <Grid item xs={12} sm={6} md={3}>
                    <Card
                        sx={{
                            textAlign: "center",
                            cursor: "pointer",
                            backgroundColor: view === "medicines" ? "#e3f2fd" : "white",
                            boxShadow: view === "medicines" ? 4 : 1,
                            border: view === "medicines" ? "2px solid #1976d2" : "1px solid #ccc",
                            "&:hover": { backgroundColor: "#f5f5f5" }
                        }}
                        onClick={() => setView("medicines")}
                    >
                        <CardContent>
                            <LocalPharmacyIcon sx={{ fontSize: 50, color: "#1976d2" }} />
                            <Typography variant="h6" sx={{ mt: 1 }}>Manage Medicines</Typography>
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