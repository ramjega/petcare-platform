import React, { useEffect, useState } from "react";
import { Box, Typography, Card, CardContent, CircularProgress, Button, Avatar, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPets } from "../../redux/petSlice";
import { Pets, EventNote, AddCircleOutline, CalendarToday } from "@mui/icons-material";

const DashboardHome = () => {
    const dispatch = useDispatch();
    const { pets, status } = useSelector((state) => state.pet);
    const [appointments, setAppointments] = useState([]); // Placeholder for future data
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(fetchPets());
    }, [dispatch]);

    return (
        <Box sx={{ padding: { xs: 2, md: 4 }, backgroundColor: "#f0f4f8", minHeight: "100vh" }}>
            <Typography variant="h5" fontWeight="bold" sx={{ textAlign: "center", mb: 3 }}>
                Welcome to Your Pet Dashboard 🏡
            </Typography>

            {/* Loading Indicator */}
            {status === "loading" ? (
                <CircularProgress sx={{ display: "block", margin: "20px auto" }} />
            ) : (
                <Grid container spacing={3} justifyContent="center">
                    {/* Your Pets Section */}
                    <Grid item xs={12} md={6}>
                        <Card sx={{ borderRadius: 3, boxShadow: 3, p: 2 }}>
                            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <Avatar sx={{ bgcolor: "#1976d2", width: 50, height: 50 }}>
                                    <Pets sx={{ fontSize: 30 }} />
                                </Avatar>
                                <Box>
                                    <Typography variant="h6" fontWeight="bold">Your Pets</Typography>
                                    <Typography>{pets.length} registered pets</Typography>
                                </Box>
                            </CardContent>
                            <Button
                                variant="contained"
                                fullWidth
                                sx={{ mt: 2, bgcolor: "#1976d2", "&:hover": { bgcolor: "#115293" } }}
                                onClick={() => navigate("/dashboard/pets")}
                            >
                                Manage Pets
                            </Button>
                        </Card>
                    </Grid>

                    {/* Add a New Pet Section */}
                    <Grid item xs={12} md={6}>
                        <Card sx={{ borderRadius: 3, boxShadow: 3, p: 2 }}>
                            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <Avatar sx={{ bgcolor: "#4caf50", width: 50, height: 50 }}>
                                    <AddCircleOutline sx={{ fontSize: 30 }} />
                                </Avatar>
                                <Box>
                                    <Typography variant="h6" fontWeight="bold">Add a New Pet</Typography>
                                    <Typography>Register your pet and track their health</Typography>
                                </Box>
                            </CardContent>
                            <Button
                                variant="contained"
                                fullWidth
                                sx={{ mt: 2, bgcolor: "#4caf50", "&:hover": { bgcolor: "#388e3c" } }}
                                onClick={() => navigate("/dashboard/pets")}
                            >
                                Add Pet
                            </Button>
                        </Card>
                    </Grid>

                    {/* Upcoming Appointments Section */}
                    <Grid item xs={12} md={6}>
                        <Card sx={{ borderRadius: 3, boxShadow: 3, p: 2 }}>
                            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <Avatar sx={{ bgcolor: "#ff9800", width: 50, height: 50 }}>
                                    <EventNote sx={{ fontSize: 30 }} />
                                </Avatar>
                                <Box>
                                    <Typography variant="h6" fontWeight="bold">Upcoming Appointments</Typography>
                                    {appointments.length === 0 ? (
                                        <Typography>No upcoming appointments</Typography>
                                    ) : (
                                        <Typography>{appointments.length} scheduled</Typography>
                                    )}
                                </Box>
                            </CardContent>
                            <Button
                                variant="contained"
                                fullWidth
                                sx={{ mt: 2, bgcolor: "#ff9800", "&:hover": { bgcolor: "#e65100" } }}
                                onClick={() => navigate("/dashboard/appointments")}
                            >
                                View Appointments
                            </Button>
                        </Card>
                    </Grid>

                    {/* View Calendar Section */}
                    <Grid item xs={12} md={6}>
                        <Card sx={{ borderRadius: 3, boxShadow: 3, p: 2 }}>
                            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <Avatar sx={{ bgcolor: "#9c27b0", width: 50, height: 50 }}>
                                    <CalendarToday sx={{ fontSize: 30 }} />
                                </Avatar>
                                <Box>
                                    <Typography variant="h6" fontWeight="bold">View Calendar</Typography>
                                    <Typography>Check your pet-related schedules</Typography>
                                </Box>
                            </CardContent>
                            <Button
                                variant="contained"
                                fullWidth
                                sx={{ mt: 2, bgcolor: "#9c27b0", "&:hover": { bgcolor: "#6a1b9a" } }}
                                onClick={() => navigate("/dashboard/calendar")}
                            >
                                Open Calendar
                            </Button>
                        </Card>
                    </Grid>
                </Grid>
            )}
        </Box>
    );
};

export default DashboardHome;
