import React, { useEffect, useState } from "react";
import { Box, Typography, Card, CardContent, CircularProgress, Button, Avatar, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPets } from "../../redux/petSlice";
import { Pets, EventNote, AddCircleOutline, CalendarToday } from "@mui/icons-material";
import PetDialog from "./PetDialog";

const DashboardHome = () => {
    const dispatch = useDispatch();
    const { pets, status } = useSelector((state) => state.pet);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [appointments, setAppointments] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(fetchPets());
    }, [dispatch]);

    return (
        <Box
            sx={{
                padding: { xs: 2, md: 4 },
                backgroundColor: "#f0f4f8",
                minHeight: "100vh",
                background: "linear-gradient(135deg, #f0f4f8 0%, #dfe9f3 100%)",
            }}
        >
            <Box
                sx={{
                    textAlign: "center",
                    mb: 4,
                    padding: { xs: 2, md: 3 },
                    background: "linear-gradient(135deg, #1E88E5 0%, #1565C0 100%)",
                    borderRadius: 3,
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                    color: "#fff",
                }}
            >
                <Typography
                    variant="h4"
                    fontWeight="bold"
                    sx={{
                        fontSize: { xs: "1.75rem", md: "2.5rem" },
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 2,
                    }}
                >
                    <Pets sx={{ fontSize: { xs: 40, md: 50 }, color: "#FFEB3B" }} />
                    Pet Dashboard
                </Typography>
                <Typography
                    variant="subtitle1"
                    sx={{
                        mt: 1,
                        fontSize: { xs: "0.9rem", md: "1.1rem" },
                        color: "rgba(255, 255, 255, 0.9)",
                    }}
                >
                    Manage your pets, appointments, and schedules with ease 🐾
                </Typography>
            </Box>
            {/* Loading Indicator */}
            {status === "loading" ? (
                <CircularProgress sx={{ display: "block", margin: "20px auto" }} />
            ) : (
                <Grid container spacing={3} justifyContent="left">
                    {/* Add a New Pet Section */}
                    <Grid item xs={12} md={6} lg={4}>
                        <Card
                            sx={{
                                borderRadius: 4,
                                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                                p: 2,
                                background: "linear-gradient(135deg, #4caf50 0%, #388e3c 100%)",
                                color: "#fff",
                                transition: "transform 0.3s ease-in-out",
                                "&:hover": { transform: "scale(1.05)" },
                            }}
                        >
                            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <Avatar sx={{ bgcolor: "rgba(255, 255, 255, 0.2)", width: 50, height: 50 }}>
                                    <AddCircleOutline sx={{ fontSize: 30, color: "#fff" }} />
                                </Avatar>
                                <Box>
                                    <Typography variant="h6" fontWeight="bold">Add a New Pet</Typography>
                                    <Typography>Register your pet and track</Typography>
                                </Box>
                            </CardContent>
                            <Button
                                variant="contained"
                                fullWidth
                                sx={{
                                    mt: 2,
                                    bgcolor: "rgba(255, 255, 255, 0.2)",
                                    color: "#fff",
                                    "&:hover": { bgcolor: "rgba(255, 255, 255, 0.3)" },
                                }}
                                onClick={() => setDialogOpen(true)}
                            >
                                Add Pet
                            </Button>
                        </Card>
                    </Grid>

                    {/* Your Pets Section */}
                    <Grid item xs={12} md={6} lg={4}>
                        <Card
                            sx={{
                                borderRadius: 4,
                                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                                p: 2,
                                background: "linear-gradient(135deg, #1976d2 0%, #115293 100%)",
                                color: "#fff",
                                transition: "transform 0.3s ease-in-out",
                                "&:hover": { transform: "scale(1.05)" },
                            }}
                        >
                            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <Avatar sx={{ bgcolor: "rgba(255, 255, 255, 0.2)", width: 50, height: 50 }}>
                                    <Pets sx={{ fontSize: 30, color: "#fff" }} />
                                </Avatar>
                                <Box>
                                    <Typography variant="h6" fontWeight="bold">My Pets</Typography>
                                    <Typography>{pets.length} registered pets</Typography>
                                </Box>
                            </CardContent>
                            <Button
                                variant="contained"
                                fullWidth
                                sx={{
                                    mt: 2,
                                    bgcolor: "rgba(255, 255, 255, 0.2)",
                                    color: "#fff",
                                    "&:hover": { bgcolor: "rgba(255, 255, 255, 0.3)" },
                                }}
                                onClick={() => navigate("/dashboard/pets")}
                            >
                                Manage Pets
                            </Button>
                        </Card>
                    </Grid>

                    {/* Upcoming Appointments Section */}
                    <Grid item xs={12} md={6} lg={4}>
                        <Card
                            sx={{
                                borderRadius: 4,
                                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                                p: 2,
                                background: "linear-gradient(135deg, #ff9800 0%, #e65100 100%)",
                                color: "#fff",
                                transition: "transform 0.3s ease-in-out",
                                "&:hover": { transform: "scale(1.05)" },
                            }}
                        >
                            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <Avatar sx={{ bgcolor: "rgba(255, 255, 255, 0.2)", width: 50, height: 50 }}>
                                    <EventNote sx={{ fontSize: 30, color: "#fff" }} />
                                </Avatar>
                                <Box>
                                    <Typography variant="h6" fontWeight="bold">Appointments</Typography>
                                    {appointments.length === 0 ? (
                                        <Typography>Not scheduled yet</Typography>
                                    ) : (
                                        <Typography>{appointments.length} scheduled</Typography>
                                    )}
                                </Box>
                            </CardContent>
                            <Button
                                variant="contained"
                                fullWidth
                                sx={{
                                    mt: 2,
                                    bgcolor: "rgba(255, 255, 255, 0.2)",
                                    color: "#fff",
                                    "&:hover": { bgcolor: "rgba(255, 255, 255, 0.3)" },
                                }}
                                onClick={() => navigate("/dashboard/appointments")}
                            >
                                View Appointments
                            </Button>
                        </Card>
                    </Grid>

                    {/* View Calendar Section */}
                    <Grid item xs={12} md={6} lg={4}>
                        <Card
                            sx={{
                                borderRadius: 4,
                                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                                p: 2,
                                background: "linear-gradient(135deg, #9c27b0 0%, #6a1b9a 100%)",
                                color: "#fff",
                                transition: "transform 0.3s ease-in-out",
                                "&:hover": { transform: "scale(1.05)" },
                            }}
                        >
                            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <Avatar sx={{ bgcolor: "rgba(255, 255, 255, 0.2)", width: 50, height: 50 }}>
                                    <CalendarToday sx={{ fontSize: 30, color: "#fff" }} />
                                </Avatar>
                                <Box>
                                    <Typography variant="h6" fontWeight="bold">View Calendar</Typography>
                                    <Typography>Check your schedules</Typography>
                                </Box>
                            </CardContent>
                            <Button
                                variant="contained"
                                fullWidth
                                sx={{
                                    mt: 2,
                                    bgcolor: "rgba(255, 255, 255, 0.2)",
                                    color: "#fff",
                                    "&:hover": { bgcolor: "rgba(255, 255, 255, 0.3)" },
                                }}
                                onClick={() => navigate("/dashboard/calendar")}
                            >
                                Open Calendar
                            </Button>
                        </Card>
                    </Grid>
                </Grid>
            )}
            {/* Add Pet Dialog */}
            <PetDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                mode={"create"}
            />
        </Box>
    );
};

export default DashboardHome;
