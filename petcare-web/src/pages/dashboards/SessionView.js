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
    Typography,
    TextField
} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import {
    fetchSessionById
} from "../../redux/sessionSlice";
import {
    fetchAppointmentsBySession
} from "../../redux/appointmentSlice";
import {statusColors} from "../../utils/colors";
import PetsIcon from "@mui/icons-material/Pets";
import PersonIcon from "@mui/icons-material/Person";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import NotesIcon from "@mui/icons-material/Notes";
import VaccinesIcon from "@mui/icons-material/Vaccines";

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
    const {session, status, error} = useSelector((state) => state.session);
    const {appointments, status: appointmentStatus} = useSelector((state) => state.appointment);

    const [selectedAppointment, setSelectedAppointment] = useState(null);
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

    const {border, text} = statusColors[session.status] || statusColors.Scheduled;

    // Function to open the appointment popup
    const handleAppointmentClick = (appointment) => {
        console.log("Clicked appointment:", appointment);
        setSelectedAppointment(appointment);
    };

    // Function to close the appointment popup
    const handleClosePopup = () => {
        setSelectedAppointment(null);
    };

    return (
        <Box sx={{padding: 3}}>
            {/* Session Details Card */}
            <Card sx={{ padding: 3, marginBottom: 3, borderRadius: 2, boxShadow: 3 }}>
                <CardContent>
                    <Typography variant="h6" color="primary" sx={{ mb: 2, textAlign: "center" }}>
                        Session Details
                    </Typography>
                    <Divider sx={{ mb: 2 }} />

                    {/* Session Info */}
                    <Box sx={{ display: "flex", gap: 2 }}>
                        <Box sx={{ flex: 1 }}>
                            <Typography><b>Start:</b> {formatDateTime(session.start)}</Typography>
                            <Typography><b>Max Allowed:</b> {session.maxAllowed}</Typography>
                            <Typography><b>Next Token:</b> {session.nextToken}</Typography>
                            <Typography><b>Booked:</b> {session.booked}</Typography>
                        </Box>
                        <Box sx={{ flex: 1, backgroundColor: "#e3f2fd", padding: 2, borderRadius: 2 }}>
                            <Typography sx={{ color: "#1565c0"}}>
                                {session.status === "Scheduled" && "This session is scheduled and ready to begin. Click 'Start' to begin managing appointments."}
                            </Typography>
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
                            <TableCell sx={{fontWeight: "bold", color: "#1976d2"}}>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {appointments.map((appointment) => (
                            <TableRow
                                key={appointment.id}
                                sx={{ cursor: "pointer", "&:hover": { backgroundColor: "#f5f5f5" } }}
                                onClick={() => handleAppointmentClick(appointment)}
                            >
                                <TableCell>
                                    <Chip label={`#${appointment.token}`} color="primary" variant="outlined"/>
                                </TableCell>
                                <TableCell>
                                    <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
                                        <Avatar src={appointment.pet.imageUrl || "https://via.placeholder.com/50"} sx={{width: 32, height: 32}} />
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
                                <TableCell>
                                    <Chip label={appointment.status} variant="outlined"/>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Appointment Popup */}
            <Dialog open={!!selectedAppointment} onClose={handleClosePopup} fullWidth maxWidth="sm">
                {selectedAppointment && (
                    <>
                        {/* Header with Bell Icon */}
                        <DialogTitle sx={{
                            backgroundColor: "#1976d2",
                            color: "white",
                            textAlign: "center",
                            fontWeight: "bold",
                            padding: "12px 20px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 1
                        }}>
                <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ color: "orange", fontSize: "1.5rem" }}>🔔</span>
                    Reminder for {selectedAppointment.pet.name}
                </span>
                        </DialogTitle>

                        <DialogContent sx={{ padding: 3 }}>
                            {/* Pet Profile & Info */}
                            <Box sx={{ textAlign: "center", mb: 3, mt: 1 }}>
                                <Avatar
                                    src={selectedAppointment.pet.imageUrl || "https://via.placeholder.com/100"}
                                    sx={{ width: 100, height: 100, margin: "auto", boxShadow: 2, border: "3px solid #1976d2" }}
                                />
                                <Typography variant="h6" sx={{ fontWeight: "bold", mt: 1 }}>
                                    {selectedAppointment.pet.name}
                                </Typography>
                                <Typography variant="body1" sx={{ color: "#555" }}>
                                    <b>Pet Type:</b> {selectedAppointment.pet.type}
                                </Typography>
                                <Typography variant="body1" sx={{ color: "#555" }}>
                                    <b>Professional:</b> Dr. Kumaran
                                </Typography>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            {/* Reminder Message (Read-Only) */}
                            <Box sx={{ backgroundColor: "#fff3cd", padding: 2, borderRadius: 2, borderLeft: "5px solid orange" }}>
                                <Typography variant="body1" sx={{ textAlign: "center", fontStyle: "italic", fontSize: "1rem", color: "#d48806" }}>
                                    Reminder: Mittens is scheduled for a **vaccination appointment** on **March 28, 2025, at 10:00 AM**.
                                    Please bring all necessary medical records and ensure your pet has eaten beforehand.
                                </Typography>
                            </Box>
                        </DialogContent>

                        {/* Footer */}
                        <DialogActions sx={{ justifyContent: "center", paddingBottom: 3 }}>
                            <Button
                                onClick={handleClosePopup}
                                variant="contained"
                                color="primary"
                                sx={{ fontSize: "1rem", fontWeight: "bold", padding: "8px 16px", borderRadius: 2 }}
                            >
                                OK, Got It
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>

            {/*<Dialog open={!!selectedAppointment} onClose={handleClosePopup} fullWidth maxWidth="sm">*/}
            {/*    {selectedAppointment && (*/}
            {/*        <>*/}
            {/*            /!* Header *!/*/}
            {/*            <DialogTitle sx={{*/}
            {/*                backgroundColor: "#1976d2",*/}
            {/*                color: "white",*/}
            {/*                textAlign: "center",*/}
            {/*                fontWeight: "bold",*/}
            {/*                padding: "12px 20px"*/}
            {/*            }}>*/}
            {/*                Appointment Details*/}
            {/*            </DialogTitle>*/}

            {/*            <DialogContent sx={{ padding: 3 }}>*/}
            {/*                /!* Pet Profile & Info *!/*/}
            {/*                <Box sx={{ textAlign: "center", mb: 3, mt: 1 }}>*/}
            {/*                    <Avatar*/}
            {/*                        src={selectedAppointment.pet.imageUrl || "https://via.placeholder.com/100"}*/}
            {/*                        sx={{ width: 100, height: 100, margin: "auto", boxShadow: 2, border: "3px solid #1976d2" }}*/}
            {/*                    />*/}
            {/*                    <Typography variant="h6" sx={{ fontWeight: "bold", mt: 1 }}>*/}
            {/*                        {selectedAppointment.pet.name}*/}
            {/*                    </Typography>*/}
            {/*                    <Typography variant="body1" sx={{ color: "#555" }}>*/}
            {/*                        <b>Pet Type:</b> {selectedAppointment.pet.type}*/}
            {/*                    </Typography>*/}
            {/*                    <Typography variant="body1" sx={{ color: "#555" }}>*/}
            {/*                        <b>Customer:</b> {selectedAppointment.customer.name}*/}
            {/*                    </Typography>*/}
            {/*                </Box>*/}

            {/*                <Divider sx={{ my: 2 }} />*/}

            {/*                /!* Action Buttons (Aligned in One Row) *!/*/}
            {/*                <Box sx={{ display: "flex", justifyContent: "center", gap: 2, flexWrap: "wrap", mt: 2 }}>*/}
            {/*                    <Button*/}
            {/*                        variant="contained"*/}
            {/*                        color="primary"*/}
            {/*                        startIcon={<MedicalServicesIcon />}*/}
            {/*                        sx={{ fontSize: "0.9rem", fontWeight: "bold", padding: "10px 16px", borderRadius: 2 }}*/}
            {/*                    >*/}
            {/*                        Prescribe Medicine*/}
            {/*                    </Button>*/}

            {/*                    <Button*/}
            {/*                        variant="contained"*/}
            {/*                        color="secondary"*/}
            {/*                        startIcon={<NotesIcon />}*/}
            {/*                        sx={{ fontSize: "0.9rem", fontWeight: "bold", padding: "10px 16px", borderRadius: 2 }}*/}
            {/*                    >*/}
            {/*                        Add Observations*/}
            {/*                    </Button>*/}

            {/*                    <Button*/}
            {/*                        variant="contained"*/}
            {/*                        color="success"*/}
            {/*                        startIcon={<VaccinesIcon />}*/}
            {/*                        sx={{ fontSize: "0.9rem", fontWeight: "bold", padding: "10px 16px", borderRadius: 2 }}*/}
            {/*                    >*/}
            {/*                        Schedule Vaccination*/}
            {/*                    </Button>*/}
            {/*                </Box>*/}
            {/*            </DialogContent>*/}

            {/*            /!* Footer *!/*/}
            {/*            <DialogActions sx={{ justifyContent: "center", paddingBottom: 3 }}>*/}
            {/*                <Button*/}
            {/*                    onClick={handleClosePopup}*/}
            {/*                    variant="outlined"*/}
            {/*                    sx={{ fontSize: "1rem", fontWeight: "bold", padding: "8px 16px", borderRadius: 2 }}*/}
            {/*                >*/}
            {/*                    Close*/}
            {/*                </Button>*/}
            {/*            </DialogActions>*/}
            {/*        </>*/}
            {/*    )}*/}
            {/*</Dialog>*/}


        </Box>
    );
};

export default SessionView;
