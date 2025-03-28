import React, { useEffect, useState } from "react";
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
    Typography,
    useTheme
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { cancelSession, completeSession, fetchSessionById, startSession } from "../../redux/sessionSlice";
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
import ScheduleIcon from '@mui/icons-material/Schedule';
import PetsOutlinedIcon from '@mui/icons-material/PetsOutlined';

import AppointmentActionPopup from "./AppointmentActionPopup";
import { statusColors } from "../../utils/colors";

const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-GB", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
};

const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // Convert 24h to 12h format
    const twelveHour = hours % 12 || 12; // 0 becomes 12

    return `${twelveHour}:${minutes} ${ampm}`;
};


const SessionView = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const theme = useTheme();
    const { session, status, error } = useSelector((state) => state.session);
    const { appointments, status: appointmentStatus } = useSelector((state) => state.appointment);

    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [confirmDialog, setConfirmDialog] = useState({
        open: false,
        action: null,
        entityType: null,
        appointmentId: null
    });
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

    useEffect(() => {
        dispatch(fetchSessionById(id));
        dispatch(fetchAppointmentsBySession(id));
        dispatch(fetchMedicinalProducts());
    }, [dispatch, id]);

    if (status === "loading") {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <CircularProgress size={60} thickness={4} />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3, textAlign: "center" }}>
                <Alert severity="error" sx={{ maxWidth: 600, mx: "auto" }}>
                    {error}
                </Alert>
            </Box>
        );
    }

    if (!session) {
        return (
            <Box sx={{ p: 3, textAlign: "center" }}>
                <Alert severity="warning" sx={{ maxWidth: 600, mx: "auto" }}>
                    Session not found
                </Alert>
            </Box>
        );
    }

    const { border, text } = statusColors[session.status] || statusColors.Scheduled;

    const handleActionConfirm = (action, entityType, appointmentId) => {
        setConfirmDialog({ open: true, action, entityType, appointmentId });
    };

    const executeAction = () => {
        setConfirmDialog({ open: false });

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
                setSnackbar({ open: true, message: actionText, severity: "success" });

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
            pet: { id: payload.petId },
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
            pet: { id: payload.petId },
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
            pet: { id: payload.petId },
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
        <Box sx={{ padding: 3, maxWidth: 1400, mx: "auto" }}>
            {/* Session Header */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h4" fontWeight="bold" sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <PetsOutlinedIcon fontSize="large" color="primary" />
                    Pet Care Session
                </Typography>
                <Chip
                    label={session.status === "Started" ? "Ongoing" : session.status}
                    variant="filled"
                    sx={{
                        fontWeight: "bold",
                        borderRadius: 16,
                        backgroundColor: border,
                        color: theme.palette.getContrastText(border),
                        padding: "6px 16px",
                        fontSize: "0.9rem",
                        height: "auto",
                    }}
                />
            </Box>

            {/* Session Details Card */}
            <Card
                sx={{
                    mb: 4,
                    borderRadius: 3,
                    boxShadow: "0 8px 16px rgba(0,0,0,0.08)",
                    borderLeft: `4px solid ${border}`,
                }}
            >
                <CardContent>
                    <Typography variant="h6" color="text.primary" sx={{ mb: 3, fontWeight: 600 }}>
                        Session Overview
                    </Typography>
                    <Divider sx={{ mb: 3 }} />

                    <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                        {/* Session Information */}
                        <Box sx={{ flex: 1, minWidth: 300 }}>
                            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 2 }}>
                                <DetailItem
                                    icon={<EventIcon color="primary" />}
                                    label="Date"
                                    value={
                                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                            <Typography>{formatDate(session.start)}</Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <ScheduleIcon fontSize="small" />
                                                {formatTime(session.start)}
                                            </Typography>
                                        </Box>
                                    }
                                />
                                <DetailItem
                                    icon={<GroupIcon color="secondary" />}
                                    label="Max Allowed"
                                    value={session.maxAllowed}
                                />
                                <DetailItem
                                    icon={<ConfirmationNumberIcon color="action" />}
                                    label="Next Token"
                                    value={session.nextToken}
                                />
                                <DetailItem
                                    icon={<BookmarkIcon color="primary" />}
                                    label="Booked"
                                    value={`${session.booked} / ${session.maxAllowed}`}
                                />
                            </Box>
                        </Box>

                        {/* Description & Actions */}
                        <Box sx={{ flex: 1, minWidth: 300, display: "flex", flexDirection: "column", gap: 3 }}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    backgroundColor: theme.palette.mode === 'light' ? '#f5f7fa' : '#1e1e1e',
                                    borderLeft: `3px solid ${theme.palette.primary.main}`,
                                }}
                            >
                                <Typography variant="body2" color="text.secondary">
                                    {session.status === "Scheduled" && "This session is scheduled and ready to begin. Click 'Start' to begin managing appointments."}
                                    {session.status === "Started" && "This session is currently in progress. Manage appointments as needed and mark the session as 'Complete' once finished."}
                                    {session.status === "Completed" && "This session has ended, but you can 'Re-open' it to handle any missed or no-show appointments."}
                                    {session.status === "Cancelled" && "This session has been cancelled along with all its appointments. No further actions can be taken."}
                                </Typography>
                            </Paper>

                            <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", flexWrap: "wrap" }}>
                                {(session.status === "Scheduled" || session.status === "Completed") && (
                                    <Button
                                        variant="contained"
                                        startIcon={<PlayArrowIcon />}
                                        onClick={() => handleActionConfirm("start", "session")}
                                        sx={{
                                            minWidth: 120,
                                            textTransform: "none",
                                            fontWeight: 600,
                                            boxShadow: "none",
                                            backgroundColor: '#2e7d32', // Green base color
                                            color: '#fff',
                                            transition: 'all 0.2s ease-in-out',
                                            '&:hover': {
                                                backgroundColor: '#1b5e20', // Darker green
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                                transform: 'translateY(-1px)'
                                            },
                                            '&:active': {
                                                transform: 'translateY(0)',
                                                boxShadow: 'none'
                                            },
                                            '&:focus-visible': {
                                                outline: '2px solid #90caf9',
                                                outlineOffset: '2px'
                                            }
                                        }}
                                    >
                                        {session.status === "Scheduled" ? "Start Session" : "Re-open"}
                                    </Button>
                                )}

                                {session.status === "Scheduled" && (
                                    <Button
                                        variant="outlined"
                                        startIcon={<CancelIcon />}
                                        onClick={() => handleActionConfirm("cancel", "session")}
                                        sx={{
                                            minWidth: 120,
                                            textTransform: "none",
                                            fontWeight: 600,
                                            boxShadow: "none",
                                            border: '1px solid #d32f2f', // Red border
                                            color: '#d32f2f', // Red text
                                            transition: 'all 0.2s ease-in-out',
                                            '&:hover': {
                                                backgroundColor: '#d32f2f', // Solid red
                                                color: '#fff',
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                                transform: 'translateY(-1px)'
                                            },
                                            '&:active': {
                                                transform: 'translateY(0)',
                                                boxShadow: 'none'
                                            },
                                            '&:focus-visible': {
                                                outline: '2px solid #90caf9',
                                                outlineOffset: '2px'
                                            }
                                        }}
                                    >
                                        Cancel Session
                                    </Button>
                                )}

                                {session.status === "Started" && (
                                    <Button
                                        variant="outlined"
                                        startIcon={<CheckCircleIcon />}
                                        onClick={() => handleActionConfirm("complete", "session")}
                                        sx={{
                                            minWidth: 120,
                                            textTransform: "none",
                                            fontWeight: 600,
                                            boxShadow: "none",
                                            border: '1px solid #333',
                                            color: '#000',

                                            transition: 'all 0.2s ease-in-out',
                                            '&:hover': {
                                                backgroundColor: '#000',
                                                color: '#fff',
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                                transform: 'translateY(-1px)'
                                            },
                                            '&:active': {
                                                transform: 'translateY(0)',
                                                boxShadow: 'none'
                                            },
                                            '&:focus-visible': {
                                                outline: '2px solid #90caf9',
                                                outlineOffset: '2px'
                                            }
                                        }}
                                    >
                                        Complete
                                    </Button>
                                )}
                            </Box>                        </Box>
                    </Box>
                </CardContent>
            </Card>

            {/* Appointments Section */}
            <Card sx={{ borderRadius: 3, boxShadow: "0 8px 16px rgba(0,0,0,0.08)" }}>
                <CardContent>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                        <Typography variant="h6" fontWeight={600} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <ScheduleIcon color="primary" />
                            Appointments ({appointments.length})
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Showing {appointments.length} of {session.maxAllowed} possible appointments
                        </Typography>
                    </Box>

                    <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2 }}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: theme.palette.mode === 'light' ? '#f5f7fa' : '#1e1e1e' }}>
                                    <TableCell sx={{ fontWeight: 600 }}>Token</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Pet</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Customer</TableCell>
                                    <TableCell sx={{ fontWeight: 600, textAlign: "center" }}>Status</TableCell>
                                    <TableCell sx={{ fontWeight: 600, textAlign: "center" }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {appointments.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} sx={{ textAlign: "center", py: 4 }}>
                                            <Typography color="text.secondary">
                                                No appointments found for this session
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    appointments
                                        .slice()
                                        .sort((a, b) => a.token - b.token)
                                        .map((appointment) => {
                                            const { border, text } = statusColors[appointment.status] || statusColors.booked;
                                            return (
                                                <TableRow
                                                    key={appointment.id}
                                                    hover
                                                    sx={{
                                                        cursor: "pointer",
                                                        backgroundColor: appointment.status === "arrived" ? "rgba(67,160,71,0.1)" : "inherit",
                                                        transition: "background-color 0.2s ease",
                                                    }}
                                                    onClick={() => setSelectedAppointment(appointment)}
                                                >
                                                    <TableCell>
                                                        <Chip
                                                            label={`#${appointment.token}`}
                                                            color="primary"
                                                            variant="outlined"
                                                            size="small"
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                                            <Avatar
                                                                src={appointment.pet.imageUrl || "/static/images/avatar/pet-avatar-default.jpg"}
                                                                sx={{ width: 36, height: 36 }}
                                                            />
                                                            <Box>
                                                                <Typography fontWeight={500}>{appointment.pet.name}</Typography>
                                                                <Typography variant="body2" color="text.secondary">
                                                                    {appointment.pet.breed || "Unknown breed"}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={appointment.pet.type}
                                                            variant="outlined"
                                                            size="small"
                                                            icon={<PetsIcon fontSize="small" />}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                                            <Avatar
                                                                src={appointment.customer.imageUrl}
                                                                sx={{ width: 36, height: 36 }}
                                                            >
                                                                {appointment.customer.name.charAt(0)}
                                                            </Avatar>
                                                            <Typography>{appointment.customer.name}</Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell sx={{ textAlign: "center" }}>
                                                        <Chip
                                                            label={statusColors[appointment.status]?.label || appointment.status}
                                                            variant="filled"
                                                            size="small"
                                                            sx={{
                                                                minWidth: 100,
                                                                fontWeight: 500,
                                                                backgroundColor: border,
                                                                color: theme.palette.getContrastText(border),
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell sx={{ textAlign: "center" }}>
                                                        <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                                                            {session.status === "Started" && appointment.status === "booked" && (
                                                                <Button
                                                                    size="small"
                                                                    variant="outlined"
                                                                    startIcon={<DoneIcon fontSize="small" />}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleActionConfirm("attend", "appointment", appointment.id);
                                                                    }}
                                                                    sx={{
                                                                        textTransform: "none",
                                                                        fontWeight: 500,
                                                                        boxShadow: "none",
                                                                        border: '1px solid #2e7d32', // Dark green border
                                                                        backgroundColor: '#2e7d32',
                                                                        color: '#fff', // Dark green text
                                                                        transition: 'all 0.2s ease-in-out',
                                                                        '&:hover': {
                                                                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                                                            transform: 'translateY(-1px)',
                                                                            '&:focus-visible': {
                                                                                outline: '2px solid #90caf9',
                                                                                outlineOffset: '2px'
                                                                            }
                                                                        },
                                                                        '&:active': {
                                                                            transform: 'translateY(0)',
                                                                            boxShadow: 'none'
                                                                        }
                                                                    }}
                                                                >
                                                                    Attend
                                                                </Button>
                                                            )}

                                                            {appointment.status === "booked" && (
                                                                <Button
                                                                    size="small"
                                                                    variant="outlined"
                                                                    startIcon={<CancelIcon fontSize="small" />}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleActionConfirm("cancel", "appointment", appointment.id);
                                                                    }}
                                                                    sx={{
                                                                        textTransform: "none",
                                                                        fontWeight: 500,
                                                                        boxShadow: "none",
                                                                        border: '1px solid #d32f2f', // Dark red border
                                                                        color: '#d32f2f', // Dark red text
                                                                        transition: 'all 0.2s ease-in-out',
                                                                        '&:hover': {
                                                                            backgroundColor: '#d32f2f', // Solid red background
                                                                            border: '1px solid #d32f2f',
                                                                            color: '#fff', // White text
                                                                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                                                            transform: 'translateY(-1px)',
                                                                            '&:focus-visible': {
                                                                                outline: '2px solid #90caf9',
                                                                                outlineOffset: '2px'
                                                                            }
                                                                        },
                                                                        '&:active': {
                                                                            transform: 'translateY(0)',
                                                                            boxShadow: 'none'
                                                                        }
                                                                    }}
                                                                >
                                                                    Cancel
                                                                </Button>                                                            )}

                                                            {appointment.status === "arrived" && (
                                                                <Button
                                                                    size="small"
                                                                    variant="outlined"
                                                                    startIcon={<CheckCircleIcon fontSize="small" />}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleActionConfirm("complete", "appointment", appointment.id);
                                                                    }}
                                                                    sx={{
                                                                        textTransform: "none",
                                                                        fontWeight: 500,
                                                                        boxShadow: "none",
                                                                        border: '1px solid #333',
                                                                        color: '#333',
                                                                        transition: 'all 0.2s ease-in-out',
                                                                        '&:hover': {
                                                                            backgroundColor: '#000',
                                                                            border: '1px solid #000',
                                                                            color: '#fff',
                                                                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                                                            transform: 'translateY(-1px)',
                                                                            '&:focus-visible': {
                                                                                outline: '2px solid #90caf9',
                                                                                outlineOffset: '2px'
                                                                            }
                                                                        },
                                                                        '&:active': {
                                                                            transform: 'translateY(0)',
                                                                            boxShadow: 'none'
                                                                        }
                                                                    }}
                                                                >
                                                                    Complete
                                                                </Button>
                                                            )}
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>

            {/* Confirmation Dialog */}
            <Dialog
                open={confirmDialog.open}
                onClose={() => setConfirmDialog({ open: false, action: null })}
                PaperProps={{ sx: { borderRadius: 3 } }}
            >
                <DialogTitle sx={{ fontWeight: 600 }}>Confirm Action</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to {confirmDialog.action} this {confirmDialog.entityType}?
                    </Typography>
                    {confirmDialog.action === "cancel" && confirmDialog.entityType === "session" && (
                        <Typography variant="body2" color="error.main" sx={{ mt: 1 }}>
                            Warning: This will cancel all {appointments.length} booked appointments
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button
                        onClick={() => setConfirmDialog({ open: false, action: null })}
                        sx={{ textTransform: "none", fontWeight: 500 }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={executeAction}
                        sx={{ textTransform: "none", fontWeight: 500, borderRadius: 2 }}
                    >
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar Alert */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{ width: "100%", borderRadius: 2, boxShadow: 2 }}
                    elevation={6}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>

            {/* Appointment Action Popup */}
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

// Helper component for consistent detail items
const DetailItem = ({ icon, label, value }) => (
    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
        <Box sx={{ color: "action.active", mt: 0.5 }}>{icon}</Box>
        <Box>
            <Typography variant="body2" color="text.secondary">
                {label}
            </Typography>
            {typeof value === 'string' ? (
                <Typography variant="body1" fontWeight={500}>
                    {value}
                </Typography>
            ) : (
                value
            )}
        </Box>
    </Box>
);

export default SessionView;