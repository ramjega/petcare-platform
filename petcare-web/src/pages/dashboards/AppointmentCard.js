import React from "react";
import { useNavigate } from "react-router-dom";
import {
    Avatar,
    Box,
    Chip,
    Divider,
    Grid,
    Typography,
    Paper
} from "@mui/material";
import { Event, LocationOn, Person, Notes, Pets } from "@mui/icons-material";

const statusColors = {
    booked: { color: "#1976d2", label: "Booked" },
    completed: { color: "#2e7d32", label: "Completed" },
    cancelled: { color: "#d32f2f", label: "Cancelled" }
};

const AppointmentCard = ({ appointment }) => {
    const navigate = useNavigate();
    const appointmentDate = new Date(appointment.session.start);
    const statusInfo = statusColors[appointment.status] || statusColors.booked;

    const handleClick = () => navigate(`/appointment/${appointment.id}`);

    return (
        <Paper
            elevation={3}
            sx={{
                borderRadius: 3,
                padding: { xs: 2, md: 3 },
                mb: 3,
                boxShadow: "0px 3px 10px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#fff",
                cursor: "pointer"
            }}
            onClick={handleClick}
        >
            <Grid container spacing={1} alignItems="center">
                {/* Left Section: Pet Avatar */}
                <Grid item xs={12} sm={2} sx={{ textAlign: "center" }}>
                    <Avatar
                        src={appointment.pet.imageUrl || ""}
                        sx={{
                            width: { xs: 60, sm: 80 },
                            height: { xs: 60, sm: 80 },
                            border: "3px solid #1976d2",
                            boxShadow: 2,
                            backgroundColor: "#e3f2fd",
                        }}
                    >
                        {!appointment.pet.imageUrl && <Pets sx={{ fontSize: 40, color: "#1976d2" }} />}
                    </Avatar>
                </Grid>

                {/* Right Section: Details */}
                <Grid item xs={12} sm={10}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                        <Typography variant="h5" fontWeight="bold" sx={{ color: "#333" }}>
                            {appointment.pet.name}
                        </Typography>
                        <Chip label={statusInfo.label} sx={{ bgcolor: statusInfo.color, color: "#fff", fontWeight: "bold" }} />
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    {/* Professional */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                        <Person sx={{ color: "#1976d2" }} />
                        <Typography variant="body1" fontWeight="bold">
                            {appointment.session.professional.name} ({appointment.session.professional.speciality})
                        </Typography>
                    </Box>

                    {/* Date & Time */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                        <Event sx={{ color: "#2e7d32" }} />
                        <Typography variant="body2">
                            {appointmentDate.toLocaleDateString()} at {appointmentDate.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                        </Typography>
                    </Box>

                    {/* Location */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                        <LocationOn sx={{ color: "#d32f2f" }} />
                        <Typography variant="body2">
                            {appointment.session.organization.name}
                        </Typography>
                    </Box>

                    {/* Note (if available) */}
                    {appointment.note && (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
                            <Notes sx={{ color: "#666" }} />
                            <Typography
                                sx={{
                                    fontSize: "0.9rem",
                                    color: "#555",
                                    fontStyle: "italic",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    maxWidth: "90%"
                                }}
                            >
                                "{appointment.note}"
                            </Typography>
                        </Box>
                    )}
                </Grid>
            </Grid>
        </Paper>
    );
};

export default AppointmentCard;
