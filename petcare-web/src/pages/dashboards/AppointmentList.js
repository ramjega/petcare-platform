import React from "react";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import AddCircleOutline from "@mui/icons-material/AddCircleOutline";
import AppointmentCard from "./AppointmentCard";

const AppointmentList = ({ status, upcomingAppointments, pastAppointments, handleOpenSearchDialog, isMobile }) => {
    return (
        <Box sx={{ padding: { xs: 2, md: 4 }, backgroundColor: "#f0f4f8", minHeight: "100vh" }}>

            {/* New Appointment Button */}
            {!isMobile && (
                <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
                    <Button
                        variant="contained"
                        startIcon={<AddCircleOutline />}
                        onClick={handleOpenSearchDialog}
                        sx={{
                            backgroundColor: "#1976d2",
                            "&:hover": { backgroundColor: "#1565c0" },
                            width: "auto",
                        }}
                    >
                        New Appointment
                    </Button>
                </Box>
            )}

            {status === "loading" ? (
                <CircularProgress sx={{ display: "block", margin: "20px auto" }} />
            ) : (
                <>
                    {/* Upcoming Appointments */}
                    {upcomingAppointments.length > 0 && (
                        <>
                            <Typography variant="h6" sx={{ mt: 3, mb: 2, fontWeight: "bold", color: "#1976d2" }}>
                                Upcoming Appointments
                            </Typography>
                            {upcomingAppointments.map((appointment) => (
                                <AppointmentCard key={appointment.id} appointment={appointment} />
                            ))}
                        </>
                    )}

                    {/* Past Appointments */}
                    {pastAppointments.length > 0 && (
                        <>
                            <Typography variant="h6" sx={{ mt: 3, mb: 2, fontWeight: "bold", color: "#9f9999" }}>
                                Past Appointments
                            </Typography>
                            {pastAppointments.map((appointment) => (
                                <AppointmentCard key={appointment.id} appointment={appointment} />
                            ))}
                        </>
                    )}
                </>
            )}
        </Box>
    );
};

export default AppointmentList;