import React, {useEffect, useState} from "react";
import {
    Alert,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Paper,
    Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import {cancelSession, completeSession, fetchSessionById, startSession} from "../../redux/sessionSlice";
import {
    attendAppointment,
    cancelAppointment,
    completeAppointment,
    fetchAppointmentsBySession
} from "../../redux/appointmentSlice";
import { fetchMedicinalProducts } from "../../redux/medicinalProductSlice";
import { createDispense } from "../../redux/dispenseSlice";
import { createObservation } from "../../redux/observationSlice";
import { createReminder } from "../../redux/reminderSlice";

import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DoneIcon from "@mui/icons-material/Done";
import PetsIcon from "@mui/icons-material/Pets";
import PersonIcon from "@mui/icons-material/Person";
import EventIcon from '@mui/icons-material/Event';
import GroupIcon from '@mui/icons-material/Group';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import BookmarkIcon from '@mui/icons-material/Bookmark';

import AppointmentActionPopup from "./AppointmentActionPopup";


import {statusColors} from "../../utils/colors";

const formatDateTime = (timestamp) => {
    return new Date(timestamp).toLocaleString("en-GB", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
};

const SessionView = () => {
    const {id} = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {session, status, error} = useSelector((state) => state.session);
    const {appointments, status: appointmentStatus} = useSelector((state) => state.appointment);

    const [selectedAppointment, setSelectedAppointment] = useState(null);

    const [confirmDialog, setConfirmDialog] = useState({
        open: false,
        action: null,
        entityType: null,
        appointmentId: null
    });
    const [snackbar, setSnackbar] = useState({open: false, message: "", severity: "info"});

    useEffect(() => {
        dispatch(fetchSessionById(id));
        dispatch(fetchAppointmentsBySession(id));
        dispatch(fetchMedicinalProducts());
    }, [dispatch, id]);

    if (status === "loading") {
        return <CircularProgress sx={{display: "block", margin: "20px auto"}}/>;
    }

    if (error) {
        return <Typography color="error" textAlign="center">{error}</Typography>;
    }

    if (!session) {
        return <Typography textAlign="center">Session not found</Typography>;
    }

    const {border, text} = statusColors[session.status] || statusColors.Scheduled;

    const handleActionConfirm = (action, entityType, appointmentId) => {
        setConfirmDialog({open: true, action, entityType, appointmentId});
    };

    const executeAction = () => {
        setConfirmDialog({open: false});

        let actionPromise;
        let actionText = "";

        if (confirmDialog.action === "start" && confirmDialog.entityType === "session") {
            actionPromise = dispatch(startSession(session.id));
            actionText = "Session started!";
        } else if (confirmDialog.action === "complete" && confirmDialog.entityType === "session") {
            actionPromise = dispatch(completeSession(session.id));
            actionText = "Session completed!";
        } else if (confirmDialog.action === "cancel" && confirmDialog.entityType === "session") {
            actionPromise = dispatch(cancelSession(session.id));
            actionText = "Session cancelled!";
        } else if (confirmDialog.action === "attend" && confirmDialog.entityType === "appointment") {
            actionPromise = dispatch(attendAppointment(confirmDialog.appointmentId));
            actionText = "Appointment attended!";
        } else if (confirmDialog.action === "complete" && confirmDialog.entityType === "appointment") {
            actionPromise = dispatch(completeAppointment(confirmDialog.appointmentId));
            actionText = "Appointment completed!";
        } else if (confirmDialog.action === "cancel" && confirmDialog.entityType === "appointment") {
            actionPromise = dispatch(cancelAppointment(confirmDialog.appointmentId));
            actionText = "Appointment cancelled!";
        }

        if (actionPromise) {
            actionPromise.then(() => {
                setSnackbar({open: true, message: actionText, severity: "success"});

                if (confirmDialog.entityType === "session") {
                    dispatch(fetchAppointmentsBySession(id));
                }
            });
        }
    };

    const handlePrescriptionSubmit = (payload) => {
        const formattedPayload = {
            quantity: payload.quantity,
            frequency: payload.frequency,
            notes: payload.notes,
            medicinalProduct: { id: payload.medicineId },
            pet: { id: payload.petId},
            appointment: { id: payload.appointmentId },
            professional: { id: session.professional.id },
        };

        dispatch(createDispense(formattedPayload)).then(() => {
            setSnackbar({
                open: true,
                message: "Prescription saved successfully!",
                severity: "success",
            });
        });
    };

    const handleAddObservation = (payload) => {
        const formattedPayload = {
            type: payload.type,
            notes: payload.notes,
            pet: { id: payload.petId},
            appointment: { id: payload.appointmentId },
            professional: { id: session.professional.id },
        };

        dispatch(createObservation(formattedPayload)).then(() => {
            setSnackbar({
                open: true,
                message: "Observation added successfully!",
                severity: "success",
            });
        });
    };

    const handleScheduleReminder = (payload) => {
        const formattedPayload = {
            message: payload.message,
            reminderDate: payload.reminderDate,
            pet: { id: payload.petId},
            appointment: { id: payload.appointmentId },
            professional: { id: session.professional.id },
        };

        dispatch(createReminder(formattedPayload)).then(() => {
            setSnackbar({
                open: true,
                message: "Reminder scheduled!",
                severity: "success",
            });
        });
    };

    return (
        <Box sx={{padding: 3}}>
            {/* Session Details Card */}
            <Card
                sx={{
                    padding: 3,
                    marginBottom: 3,
                    borderRadius: 2,
                    boxShadow: 3,
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    minHeight: 220,
                }}
            >
                {/* Status Chip */}
                <Chip
                    label={session.status === "Started" ? "Ongoing" : session.status}
                    variant="outlined"
                    sx={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        fontWeight: "bold",
                        borderRadius: 16,
                        borderColor: border,
                        color: text,
                        padding: "6px 12px",
                        fontSize: "1rem",
                    }}
                />

                <CardContent sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
                    {/* Title */}
                    <Typography variant="h6" color="primary" sx={{ mb: 2, textAlign: "center" }}>
                        Session Details
                    </Typography>
                    <Divider sx={{ mb: 2 }} />

                    {/* Two-column layout */}
                    <Box sx={{ display: "flex", gap: 2 }}>
                        {/* Left Column: Session Information */}
                        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 1 }}>
                            <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <EventIcon sx={{ color: "#1976d2" }} /> <b>Start:</b> {formatDateTime(session.start)}
                            </Typography>
                            <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <GroupIcon sx={{ color: "#2e7d32" }} /> <b>Max Allowed:</b> {session.maxAllowed}
                            </Typography>
                            <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <ConfirmationNumberIcon sx={{ color: "#f57c00" }} /> <b>Next Token:</b> {session.nextToken}
                            </Typography>
                            <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <BookmarkIcon sx={{ color: "#6a1b9a" }} /> <b>Booked:</b> {session.booked}
                            </Typography>
                        </Box>

                        {/* Right Column: Description Box & Action Buttons */}
                        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                            {/* Description Box */}
                            <Box sx={{ backgroundColor: "#e3f2fd", padding: 2, borderRadius: 2 }}>
                                <Typography variant="body2" sx={{ color: "#1565c0"}}>
                                    {session.status === "Scheduled" && "This session is scheduled and ready to begin. Click 'Start' to begin managing appointments."}
                                    {session.status === "Started" && "This session is currently in progress. Manage appointments as needed and mark the session as 'Complete' once finished."}
                                    {session.status === "Completed" && "This session has ended, but you can 'Re-open' it to handle any missed or no-show appointments."}
                                    {session.status === "Cancelled" && "This session has been cancelled along with all its appointments. No further actions can be taken."}
                                </Typography>
                            </Box>



                            {/* Action Buttons */}
                            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
                                {(session.status === "Scheduled" || session.status === "Completed") && (
                                    <Button
                                        variant="contained"
                                        startIcon={<PlayArrowIcon />}
                                        onClick={() => handleActionConfirm("start", "session")}
                                        sx={{
                                            backgroundColor: "rgba(67,160,71,0.75)",
                                            color: "#fff",
                                            borderRadius: 1,
                                            fontWeight: "bold",
                                            boxShadow: 1,
                                            "&:hover": { backgroundColor: "#43a047" },
                                        }}
                                    >
                                        {session.status === "Scheduled" ? "Start" : "Re-open"}
                                    </Button>
                                )}

                                {session.status === "Scheduled" && (
                                    <Button
                                        variant="contained"
                                        startIcon={<CancelIcon />}
                                        onClick={() => handleActionConfirm("cancel", "session")}
                                        sx={{
                                            backgroundColor: "rgba(211,47,47,0.72)",
                                            color: "#fff",
                                            borderRadius: 1,
                                            fontWeight: "bold",
                                            boxShadow: 1,
                                            "&:hover": { backgroundColor: "#d32f2f" },
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                )}

                                {session.status === "Started" && (
                                    <Button
                                        variant="contained"
                                        startIcon={<CheckCircleIcon />}
                                        onClick={() => handleActionConfirm("complete", "session")}
                                        sx={{
                                            backgroundColor: "rgba(51,51,51,0.85)",
                                            color: "#fff",
                                            borderRadius: 1,
                                            fontWeight: "bold",
                                            boxShadow: 1,
                                            "&:hover": { backgroundColor: "#333" },
                                        }}
                                    >
                                        Complete
                                    </Button>
                                )}
                            </Box>
                        </Box>
                    </Box>
                </CardContent>
            </Card>

            {/* Appointment List */}
            <Typography variant="h6" fontWeight="bold" sx={{mt: 3, mb: 2}}>
                🗓 Appointments
            </Typography>

            <TableContainer component={Paper} sx={{mt: 2, borderRadius: 2, boxShadow: 3}}>
                <Table>
                    <TableHead>
                        <TableRow sx={{backgroundColor: "#f4f6f9"}}>
                            <TableCell sx={{fontWeight: "bold", color: "#1976d2"}}>Token</TableCell>
                            <TableCell sx={{fontWeight: "bold", color: "#1976d2"}}>Pet</TableCell>
                            <TableCell sx={{fontWeight: "bold", color: "#1976d2"}}>Pet Type</TableCell>
                            <TableCell sx={{fontWeight: "bold", color: "#1976d2"}}>Customer</TableCell>
                            <TableCell
                                sx={{fontWeight: "bold", color: "#1976d2", textAlign: "center"}}>Status</TableCell>
                            <TableCell sx={{fontWeight: "bold", color: "#1976d2", textAlign: "center"}}></TableCell>
                            <TableCell sx={{fontWeight: "bold", color: "#1976d2", textAlign: "center"}}></TableCell>
                            <TableCell sx={{fontWeight: "bold", color: "#1976d2", textAlign: "center"}}></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {appointments
                            .slice()
                            .sort((a, b) => a.token - b.token)
                            .map((appointment) => {
                                const {border, text} = statusColors[appointment.status] || statusColors.booked;
                                return (
                                    <TableRow key={appointment.id}
                                              sx={{
                                                  "&:hover": {backgroundColor: "#f5f5f5"},
                                                  backgroundColor: appointment.status === "arrived" ? "rgba(67,160,71,0.2)" : "inherit",
                                                  transition: "background-color 0.3s ease",
                                              }}
                                              onClick={() => setSelectedAppointment(appointment)}
                                    >
                                        <TableCell>
                                            <Chip label={`#${appointment.token}`} color="primary" variant="outlined"/>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
                                                <Avatar
                                                    src={appointment.pet.imageUrl || "https://via.placeholder.com/50"}
                                                    sx={{width: 32, height: 32}}
                                                />
                                                {appointment.pet.name}
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
                                                <PetsIcon sx={{color: "#1976d2"}}/>
                                                {appointment.pet.type}
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
                                                <PersonIcon sx={{color: "#43a047"}}/>
                                                {appointment.customer.name}
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{width: "120px", textAlign: "center"}}>
                                            <Chip
                                                label={statusColors[appointment.status]?.label || appointment.status}
                                                variant="outlined"
                                                sx={{
                                                    minWidth: "100px",
                                                    textAlign: "center",
                                                    justifyContent: "center",
                                                    fontWeight: "bold",
                                                    borderColor: border,
                                                    color: text,
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell sx={{textAlign: "center"}}>
                                            {session.status === "Started" && appointment.status === "booked" && (
                                                <>
                                                    <Button
                                                        startIcon={<DoneIcon/>}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleActionConfirm("attend", "appointment", appointment.id);
                                                        }}
                                                        sx={{
                                                            backgroundColor: "rgba(67,160,71,0.75)",
                                                            color: "#fff",
                                                            borderRadius: 1,
                                                            padding: "4px 12px",
                                                            fontSize: "0.75rem",
                                                            minWidth: "auto",
                                                            fontWeight: "bold",
                                                            boxShadow: 1,
                                                            "&:hover": {
                                                                backgroundColor: "#43a047",
                                                            },
                                                        }}
                                                    >
                                                        Attend
                                                    </Button>

                                                </>
                                            )}
                                        </TableCell>
                                        <TableCell sx={{textAlign: "center"}}>
                                            {appointment.status === "booked" && (
                                                <>
                                                    <Button
                                                        startIcon={<CancelIcon/>}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleActionConfirm("cancel", "appointment", appointment.id)
                                                        }}

                                                        sx={{
                                                            backgroundColor: "rgba(211,47,47,0.72)",
                                                            color: "#fff",
                                                            borderRadius: 1,
                                                            padding: "4px 12px",
                                                            fontSize: "0.75rem",
                                                            minWidth: "auto",
                                                            fontWeight: "bold",
                                                            boxShadow: 1,
                                                            "&:hover": {
                                                                backgroundColor: "#d32f2f",
                                                            },
                                                        }}
                                                    >
                                                        Cancel
                                                    </Button>                                        </>
                                            )}
                                        </TableCell>
                                        <TableCell sx={{textAlign: "center"}}>
                                            {appointment.status === "arrived" && (
                                                <Button
                                                    startIcon={<CheckCircleIcon/>}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleActionConfirm("complete", "appointment", appointment.id)
                                                    }}
                                                    sx={{
                                                        backgroundColor: "rgba(51,51,51,0.85)",
                                                        color: "#fff",
                                                        borderRadius: 1,
                                                        padding: "4px 12px",
                                                        fontSize: "0.75rem",
                                                        minWidth: "auto",
                                                        fontWeight: "bold",
                                                        boxShadow: 1,
                                                        "&:hover": {
                                                            backgroundColor: "#333",
                                                        },
                                                    }}
                                                >
                                                    Complete
                                                </Button>

                                            )}
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Confirmation Dialog */}
            <Dialog open={confirmDialog.open} onClose={() => setConfirmDialog({open: false, action: null})}>
                <DialogTitle>Confirm Action</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want
                        to {confirmDialog.action} this {confirmDialog.entityType}?</Typography>
                    {confirmDialog.action === "cancel" && confirmDialog.entityType === "session" && (
                        <Typography sx={{color: "#f44336"}}>All {appointments.length} booked appointments will be
                            canceled</Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDialog({open: false, action: null})}>Cancel</Button>
                    <Button variant="contained" onClick={executeAction} color="primary">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar Alert */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({...snackbar, open: false})}
                anchorOrigin={{vertical: "top", horizontal: "center"}}
            >
                <Alert onClose={() => setSnackbar({...snackbar, open: false})} severity={snackbar.severity}
                       sx={{width: "100%"}}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
            <AppointmentActionPopup
                open={!!selectedAppointment}
                appointment={selectedAppointment}
                onClose={() => setSelectedAppointment(null)}
                onPrescriptionSubmit={handlePrescriptionSubmit}
                onAddObservation={handleAddObservation}
                onScheduleReminder={handleScheduleReminder}
            />

        </Box>
    );
};

export default SessionView;
