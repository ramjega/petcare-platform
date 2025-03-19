import React, {useEffect} from "react";
import {Avatar, Box, Chip, CircularProgress, Divider, Grid, Paper, Typography} from "@mui/material";
import {Email, Event, Home, LocationOn, Notes, Pets, Phone} from "@mui/icons-material";
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import {fetchAppointmentById} from "../../redux/appointmentSlice";

const statusColors = {
    booked: {color: "#1976d2", label: "Booked"},
    completed: {color: "#2e7d32", label: "Completed"},
    cancelled: {color: "#d32f2f", label: "Cancelled"}
};

const AppointmentView = () => {
    const {id} = useParams();
    const dispatch = useDispatch();
    const {appointment, status} = useSelector((state) => state.appointment);

    useEffect(() => {
        dispatch(fetchAppointmentById(id));
    }, [dispatch, id]);

    if (status === "loading") {
        return <CircularProgress sx={{display: "block", margin: "20px auto"}}/>;
    }

    if (!appointment) {
        return (
            <Typography textAlign="center" variant="h6" sx={{mt: 4, color: "#d32f2f"}}>
                Appointment not found.
            </Typography>
        );
    }

    const appointmentDate = new Date(appointment.session.start);
    const statusInfo = statusColors[appointment.status] || statusColors.booked;

    return (
        <Box sx={{padding: {xs: 2, md: 4}, backgroundColor: "#f5f5f5", minHeight: "100vh"}}>
            <Paper
                elevation={3}
                sx={{
                    borderRadius: 3,
                    padding: {xs: 3, md: 4},
                    maxWidth: "900px",
                    margin: "auto",
                    boxShadow: "0px 3px 10px rgba(0, 0, 0, 0.1)",
                    backgroundColor: "#fff"
                }}
            >
                {/* Appointment Header */}
                <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3}}>
                    <Typography variant="h5" fontWeight="bold">Appointment Details</Typography>
                    <Chip label={statusInfo.label} sx={{bgcolor: statusInfo.color, color: "#fff", fontWeight: "bold"}}/>
                </Box>

                <Divider sx={{mb: 3}}/>

                {/* Layout Adjustments for Desktop */}
                <Grid container spacing={4}>
                    {/* Left Column */}
                    <Grid item xs={12} md={6}>
                        {/* Pet Details */}
                        <Box sx={{textAlign: "center", mb: 3}}>
                            <Avatar
                                src={appointment.pet.imageUrl || ""}
                                sx={{
                                    width: 120,
                                    height: 120,
                                    border: "3px solid #1976d2",
                                    boxShadow: 2,
                                    backgroundColor: "#e3f2fd",
                                    mx: "auto"
                                }}
                            >
                                {!appointment.pet.imageUrl && <Pets sx={{fontSize: 60, color: "#1976d2"}}/>}
                            </Avatar>
                            <Typography variant="h6" fontWeight="bold" sx={{mt: 1}}>
                                {appointment.pet.name}
                            </Typography>
                            <Typography variant="body2" sx={{color: "gray"}}>
                                🐾 {appointment.pet.type} - {appointment.pet.breed}
                            </Typography>
                            <Typography variant="body2">⚥ {appointment.pet.gender} |
                                🎂 {appointment.pet.birthDate[0]}</Typography>
                        </Box>

                        <Divider sx={{my: 3}}/>

                        {/* Appointment Info */}
                        <Typography variant="h6" fontWeight="bold">Appointment Info</Typography>

                        <Box sx={{display: "flex", alignItems: "center", gap: 1, mt: 1}}>
                            <Typography variant="body2" fontWeight="bold">Token:</Typography>
                            <Chip label={appointment.token}
                                  sx={{bgcolor: "#ff9800", color: "#fff", fontWeight: "bold"}}/>
                        </Box>

                        <Box sx={{display: "flex", alignItems: "center", gap: 1, mt: 1}}>
                            <Event sx={{color: "#2e7d32"}}/>
                            <Typography variant="body2">
                                {appointmentDate.toLocaleDateString()} at {appointmentDate.toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                            </Typography>
                        </Box>

                        <Divider sx={{my: 3}}/>

                        {/* Location Info */}
                        <Typography variant="h6" fontWeight="bold">Location</Typography>
                        <Box sx={{display: "flex", alignItems: "center", gap: 1, mt: 1}}>
                            <LocationOn sx={{color: "#d32f2f"}}/>
                            <Typography variant="body2">
                                {appointment.session.organization.name}, {appointment.session.organization.city.name}
                            </Typography>
                        </Box>
                    </Grid>

                    {/* Right Column */}
                    <Grid item xs={12} md={6}>
                        {/* Professional Info */}
                        <Typography variant="h6" fontWeight="bold">Professional</Typography>
                        <Box sx={{display: "flex", alignItems: "center", gap: 1, mt: 1}}>
                            <Avatar src={appointment.session.professional.imageUrl || ""}/>
                            <Typography variant="body2">
                                <b>{appointment.session.professional.name}</b> ({appointment.session.professional.speciality})
                            </Typography>
                        </Box>
                        <Box sx={{display: "flex", alignItems: "center", gap: 1, mt: 1}}>
                            <Phone sx={{color: "#d32f2f"}}/>
                            <Typography variant="body2">{appointment.session.professional.mobile}</Typography>
                        </Box>
                        {appointment.session.professional.email && (
                            <Box sx={{display: "flex", alignItems: "center", gap: 1, mt: 1}}>
                                <Email sx={{color: "#1976d2"}}/>
                                <Typography variant="body2">{appointment.session.professional.email}</Typography>
                            </Box>
                        )}

                        <Divider sx={{my: 3}}/>

                        {/* Customer (Pet Owner) Info */}
                        <Typography variant="h6" fontWeight="bold">Pet Owner</Typography>
                        <Box sx={{display: "flex", alignItems: "center", gap: 1, mt: 1}}>
                            <Avatar src={appointment.customer.imageUrl || ""}/>
                            <Typography variant="body2" fontWeight="bold">{appointment.customer.name}</Typography>
                        </Box>
                        <Box sx={{display: "flex", alignItems: "center", gap: 1, mt: 1}}>
                            <Phone sx={{color: "#d32f2f"}}/>
                            <Typography variant="body2">{appointment.customer.mobile}</Typography>
                        </Box>
                        {appointment.customer.email && (
                            <Box sx={{display: "flex", alignItems: "center", gap: 1, mt: 1}}>
                                <Email sx={{color: "#1976d2"}}/>
                                <Typography variant="body2">{appointment.customer.email}</Typography>
                            </Box>
                        )}
                        {appointment.customer.address && (
                            <Box sx={{display: "flex", alignItems: "center", gap: 1, mt: 1}}>
                                <Home sx={{color: "#ff9800"}}/>
                                <Typography variant="body2">{appointment.customer.address}</Typography>
                            </Box>
                        )}

                        {/* Appointment Notes */}
                        {appointment.note && (
                            <Box sx={{mt: 3}}>
                                <Typography variant="h6" fontWeight="bold">Appointment Note</Typography>
                                <Box sx={{
                                    backgroundColor: "#f0f4f8",
                                    padding: 2,
                                    borderRadius: 2,
                                    mt: 1
                                }}>
                                    <Typography variant="body2">
                                        <Notes sx={{
                                            fontSize: 20,
                                            verticalAlign: "middle",
                                            color: "#616161"
                                        }}/> {appointment.note}
                                    </Typography>
                                </Box>
                            </Box>
                        )}
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default AppointmentView;
