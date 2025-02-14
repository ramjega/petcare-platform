import React, { useState } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button,
    Grid, TextField, Typography, CircularProgress, Avatar, Box, Divider
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { bookAppointment } from "../../redux/appointmentSlice";
import PetsIcon from "@mui/icons-material/Pets";
import PersonIcon from "@mui/icons-material/Person";
import EventIcon from "@mui/icons-material/Event";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import NoteIcon from "@mui/icons-material/Note";

const AppointmentBookingDialog = ({ open, onClose, bookingRequest, setSnackbar}) => {
    const dispatch = useDispatch();
    const [note, setNote] = useState("");
    const [error, setError] = useState("");
    const { loading } = useSelector((state) => state.appointment);

    const handleBookAppointment = () => {
        if (!note.trim()) {
            setError("Appointment note is required.");
            return;
        }
        setError("");

        const bookingReq = {
            sessionId: bookingRequest.sessionId,
            petId: bookingRequest.petId,
            note: note,
        };

        dispatch(bookAppointment(bookingReq))
            .then((response) => {
                if (response.meta.requestStatus === "fulfilled") {
                    setSnackbar({open: true, message: "Appointment placed successfully!", severity: "success"});
                    onClose();
                }
            })
            .catch(() => {
                setSnackbar({open: true, message: "Failed to place Appointment!", severity: "error"});
            });
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ textAlign: "center", fontWeight: "bold", bgcolor: "#1976d2", color: "#fff", mb: 2 }}>
                Confirm Appointment
            </DialogTitle>

            <DialogContent sx={{ maxHeight: "70vh", overflowY: "auto", px: 3 }}>
                {bookingRequest && (
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 2,
                            mb: 2,
                        }}
                    >
                        {/* Left Side: Pet Details */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Avatar
                                src={bookingRequest.petImageUrl || ""}
                                sx={{ width: 50, height: 50, bgcolor: "#eee" }}
                            />
                            <Typography variant="h6" fontWeight="bold">{bookingRequest.petName}</Typography>
                        </Box>

                        {/* Right Side: Professional Image (If exists) */}
                        <Avatar
                            src={bookingRequest.professionalImageUrl || ""}
                            sx={{ width: 50, height: 50, bgcolor: "#eee" }}
                        />
                    </Box>
                )}

                <Divider sx={{ my: 2 }} />

                {/* Appointment Details */}
                {bookingRequest && (
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <PersonIcon sx={{ color: "#1976d2" }} />
                                <Typography>
                                    <b>{bookingRequest.professional}</b> ({bookingRequest.speciality})
                                </Typography>
                            </Box>
                        </Grid>

                        <Grid item xs={12}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <EventIcon sx={{ color: "#2e7d32" }} />
                                <Typography>
                                    <b>Date & Time:</b> {bookingRequest.dateTime}
                                </Typography>
                            </Box>
                        </Grid>

                        <Grid item xs={12}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <LocationOnIcon sx={{ color: "#d32f2f" }} />
                                <Typography>
                                    <b>Location:</b> {bookingRequest.organization}, {bookingRequest.city}
                                </Typography>
                            </Box>
                        </Grid>

                        {/* Appointment Note Input */}
                        <Grid item xs={12}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <NoteIcon sx={{ color: "#f57c00" }} />
                                <Typography><b>Appointment Note</b></Typography>
                            </Box>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                placeholder="Enter the purpose of the appointment..."
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                error={!!error}
                                helperText={error}
                                sx={{ mt: 1 }}
                            />
                        </Grid>
                    </Grid>
                )}
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2, justifyContent: "space-between" }}>
                <Button onClick={onClose} sx={{ color: "#555" }}>Cancel</Button>
                <Button
                    variant="contained"
                    onClick={handleBookAppointment}
                    disabled={loading}
                    sx={{
                        bgcolor: "#1976d2",
                        "&:hover": { bgcolor: "#115293" }
                    }}
                >
                    {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Confirm Booking"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AppointmentBookingDialog;
