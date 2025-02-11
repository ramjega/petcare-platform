import React, {useEffect, useState} from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Snackbar,
    Alert,
    Chip,
    Divider,
    Avatar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper
} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {useParams, useNavigate} from "react-router-dom";
import {fetchSessionById, startSession, completeSession, cancelSession} from "../../redux/sessionSlice";
import {
    fetchAppointmentsBySession,
    attendAppointment,
    completeAppointment,
    cancelAppointment
} from "../../redux/appointmentSlice";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DoneIcon from "@mui/icons-material/Done";
import PetsIcon from "@mui/icons-material/Pets";
import PersonIcon from "@mui/icons-material/Person";


const statusColors = {
    // session card colors
    Scheduled: {background: "#e3f2fd", border: "#1976d2", text: "#1976d2"},
    booked: {background: "#e3f2fd", border: "#1976d2", text: "#1976d2"},
    Completed: {background: "#efecef", border: "#090909", text: "#120719"},
    Cancelled: {background: "#ffebee", border: "#d32f2f", text: "#d32f2f"},

    // appointment card colors
    Started: {background: "#e8f5e9", border: "#2e7d32", text: "#2e7d32"},
    arrived: {background: "#e8f5e9", border: "#2e7d32", text: "#2e7d32"},
    fulfilled: {background: "#f3e5f5", border: "#090909", text: "#120719"},
    cancelled: {background: "#ffebee", border: "#d32f2f", text: "#d32f2f"},
    noShow: {background: "#ffebee", border: "#cf4fbe", text: "#ca35b6"},
};

const appointmentStatusColors = {
    booked: {label: "Booked", color: "default"},
    arrived: {label: "Arrived", color: "success"},
    fulfilled: {label: "Completed", color: "#6a1b9a"},
    cancelled: {label: "Cancelled", color: "error"},
};

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

    const {background, border, text} = statusColors[session.status] || statusColors.Scheduled;

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

    return (
        <Box sx={{padding: 3}}>
            {/* Session Details Card */}
            <Card
                sx={{
                    padding: 2,
                    marginBottom: 3,
                    borderRadius: 2,
                    background: background,
                    boxShadow: 3,
                    position: "relative",
                }}
            >
                <Chip
                    label={session.status === "Started" ? "Ongoing" : session.status}
                    variant="outlined"
                    sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        fontWeight: "bold",
                        borderRadius: 16,
                        borderColor: border,
                        color: text,
                    }}
                />
                <CardContent>
                    <Typography variant="h6" fontWeight="bold" color="primary">
                        Session Details
                    </Typography>
                    <Divider sx={{my: 1}}/>
                    <Typography>📆 Start: <b>{formatDateTime(session.start)}</b></Typography>
                    <Typography>👥 Max Allowed: <b>{session.maxAllowed}</b></Typography>
                    <Typography>🎟 Next Token: <b>{session.nextToken}</b></Typography>
                    <Typography>📌 Booked: <b>{session.booked}</b></Typography>

                    {/* Session Actions */}
                    <Box sx={{mt: 2, display: "flex", gap: 2}}>
                        {(session.status === "Scheduled" || session.status === "Completed") && (
                            <Button
                                variant="contained"
                                startIcon={<PlayArrowIcon/>}
                                onClick={() => handleActionConfirm("start", "session")}
                                sx={{backgroundColor: "#bbdefb", color: "#1976d2"}}
                            >
                                {session.status === "Scheduled" ? "Start" : "Re-open"}
                            </Button>)}
                        {session.status === "Scheduled" && (
                            <Button
                                variant="contained"
                                startIcon={<CancelIcon/>}
                                onClick={() => handleActionConfirm("cancel", "session")}
                                sx={{backgroundColor: "#ffcdd2", color: "#d32f2f"}}
                            >
                                Cancel
                            </Button>
                        )}

                        {session.status === "Started" && (
                            <Button
                                variant="contained"
                                startIcon={<CheckCircleIcon/>}
                                onClick={() => handleActionConfirm("complete", "session")}
                                sx={{backgroundColor: "#c8e6c9", color: "#388e3c"}}
                            >
                                Complete
                            </Button>
                        )}
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
                                const {
                                    background,
                                    border,
                                    text
                                } = statusColors[appointment.status] || appointment.booked;
                                return (
                                    <TableRow key={appointment.id} key={appointment.id}
                                              sx={{
                                                  "&:hover": {backgroundColor: "#f5f5f5"},
                                                  backgroundColor: appointment.status === "arrived" ? "rgba(67,160,71,0.2)" : "inherit",
                                                  transition: "background-color 0.3s ease",
                                              }}>
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
                                                label={appointmentStatusColors[appointment.status]?.label || appointment.status}
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
                                                        onClick={() => handleActionConfirm("attend", "appointment", appointment.id)}
                                                        sx={{
                                                            backgroundColor: "rgba(67,160,71,0.75)",
                                                            color: "#fff",
                                                            borderRadius: 2,
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
                                                        onClick={() => handleActionConfirm("cancel", "appointment", appointment.id)}
                                                        sx={{
                                                            backgroundColor: "rgba(211,47,47,0.72)",
                                                            color: "#fff",
                                                            borderRadius: 2,
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
                                                    startIcon={<DoneIcon/>}
                                                    onClick={() => handleActionConfirm("complete", "appointment", appointment.id)}
                                                    sx={{
                                                        backgroundColor: "rgba(51,51,51,0.85)",
                                                        color: "#fff",
                                                        borderRadius: 2,
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
                        <Typography  sx={{ color: "#f44336" }}>All {appointments.length} booked appointments will be canceled</Typography>
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
        </Box>
    );
};

export default SessionView;
