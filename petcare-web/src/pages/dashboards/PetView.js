import React, {useEffect, useRef, useState} from "react";
import {
    Avatar,
    Box,
    Button,
    Card,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    Select,
    Tooltip,
    Typography
} from "@mui/material";
import {ArrowBack, Delete, Edit, Pets as PetsIcon} from "@mui/icons-material";
import {useDispatch, useSelector} from "react-redux";
import {deletePet, fetchPetById} from "../../redux/petSlice";
import {useNavigate, useParams} from "react-router-dom";
import PetDialog from "./PetDialog";
import ColorThief from "colorthief";
import {Line} from "react-chartjs-2";

import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip as ChartTooltip
} from "chart.js";

import { fetchAppointmentsByPet } from "../../redux/appointmentSlice";
import { fetchDispensesByPet } from "../../redux/dispenseSlice";
import { fetchObservationsByPet } from "../../redux/observationSlice";
import { fetchRemindersByPet } from "../../redux/reminderSlice";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, ChartTooltip, Legend);

const PetView = () => {
    const {petId} = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {selectedPet, status} = useSelector((state) => state.pet);

    const [bookDialogOpen, setBookDialogOpen] = useState(false);
    const [appointmentType, setAppointmentType] = useState("");

    const {appointments} = useSelector((state) => state.appointment);
    const {dispenses} = useSelector((state) => state.dispense);
    const {observations} = useSelector((state) => state.observation);
    const {reminders} = useSelector((state) => state.reminder);

    const weightData = {
        labels: ["Jan", "Feb", "Mar", "Apr"],
        datasets: [
            {
                label: "Weight (kg)",
                data: [2.5, 3.2, 3.8, 4.5],
                borderColor: "#1976d2",
                fill: false,
            },
        ],
    };

    const handleBookAppointment = () => {
        // Add logic to book an appointment
        console.log("Booked an appointment:", appointmentType);
        setBookDialogOpen(false);
    };
    const [petDialogOpen, setPetDialogOpen] = useState(false);

    const cardRef = useRef(null);

    useEffect(() => {
        dispatch(fetchPetById(petId));
        dispatch(fetchAppointmentsByPet(petId));
        dispatch(fetchDispensesByPet(petId));
        dispatch(fetchObservationsByPet(petId));
        dispatch(fetchRemindersByPet(petId));
    }, [dispatch, petId]);

    const handleDeletePet = () => {
        if (window.confirm("Are you sure you want to delete this pet?")) {
            dispatch(deletePet(petId)).then((result) => {
                if (deletePet.fulfilled.match(result)) {
                    navigate("/dashboard/pets"); // Redirect after deletion
                }
            });
        }
    };

    // Function to extract dominant color from the avatar image
    const getDominantColor = (imageUrl, callback) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = imageUrl;
        img.onload = () => {
            const colorThief = new ColorThief();
            const dominantColor = colorThief.getColor(img);
            callback(`rgb(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]})`);
        };
        img.onerror = () => {
            console.log("Image failed to load, using default background");
            callback("#a1c4fd"); // Fallback to a default color
        };
    };

    return (
        <Box sx={{padding: {xs: 2, md: 4}, backgroundColor: "#f5f5f5", minHeight: "100vh"}}>
            {/* Back Button */}
            <IconButton onClick={() => navigate("/dashboard/pets")} sx={{mb: 2}}>
                <ArrowBack sx={{fontSize: 30, color: "#1976d2"}}/>
            </IconButton>

            {status === "loading" ? (
                <CircularProgress sx={{display: "block", margin: "20px auto"}}/>
            ) : selectedPet ? (
                <>
                    {/* Pet Detail Card */}
                    <Card
                        ref={cardRef}
                        sx={{
                            borderRadius: 4,
                            boxShadow: 3,
                            padding: 3,
                            color: "#fff",
                            marginBottom: 3,
                            background: "linear-gradient(135deg, #90caf9, #42a5f5, #1e88e5)"
                        }}
                    >
                        <Grid container spacing={3} alignItems="center">
                            <Grid item xs={12} md={4} sx={{textAlign: "center"}}>
                                <Avatar
                                    src={selectedPet.imageUrl || undefined}
                                    sx={{
                                        width: 150,
                                        height: 150,
                                        border: "4px solid white",
                                        boxShadow: 3,
                                        margin: "0 auto",
                                        backgroundColor: selectedPet.imageUrl ? "transparent" : "#e0e0e0"
                                    }}
                                    onLoad={(e) => {
                                        if (selectedPet.imageUrl) {
                                            getDominantColor(selectedPet.imageUrl, (color) => {
                                                if (cardRef.current) {
                                                    cardRef.current.style.background = `linear-gradient(135deg, ${color}, rgba(0, 0, 0, 0.8))`;
                                                    cardRef.current.style.transition = "background 0.5s ease";
                                                }
                                            });
                                        }
                                    }}
                                >
                                    {!selectedPet.imageUrl && <PetsIcon sx={{fontSize: 60, color: "gray"}}/>}
                                </Avatar>
                            </Grid>
                            <Grid item xs={12} md={8}>
                                <Typography variant="h4" fontWeight="bold" gutterBottom>
                                    {selectedPet.name}
                                </Typography>
                                <Chip label={selectedPet.type} sx={{bgcolor: "#ffffff", color: "#000", mb: 2}}/>
                                <Typography variant="body1">📌 Breed: {selectedPet.breed}</Typography>
                                <Typography variant="body1">⚥ Gender: {selectedPet.gender}</Typography>
                                <Typography variant="body1">🎨 Color: {selectedPet.color}</Typography>
                                <Typography variant="body1">🎂 Birth
                                    Date: {selectedPet.birthDate ? new Date(selectedPet.birthDate).toLocaleDateString() : "Unknown"}</Typography>
                            </Grid>
                        </Grid>

                        <Divider sx={{my: 3, bgcolor: "#ffffff"}}/>

                        {/* Action Buttons */}
                        <Box sx={{display: "flex", justifyContent: "flex-end", gap: 1}}>
                            <Tooltip title="Edit Pet">
                                <IconButton onClick={() => setPetDialogOpen(true)} sx={{
                                    backgroundColor: "#ffffff88",
                                    "&:hover": {backgroundColor: "#ffffffaa"}
                                }}>
                                    <Edit sx={{color: "#1976d2"}}/>
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="Delete Pet">
                                <IconButton onClick={handleDeletePet} sx={{
                                    backgroundColor: "#ffffff88",
                                    "&:hover": {backgroundColor: "#ffffffaa"}
                                }}>
                                    <Delete sx={{color: "red"}}/>
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Card>

                    {/*Growth & Weight Tracker */}
                    <Card sx={{mt: 4, p: 3, boxShadow: 3}}>
                        <Typography variant="h6" fontWeight="bold" color="primary">
                            📊 Growth & Weight Tracker
                        </Typography>
                        <Divider sx={{my: 2}}/>
                        <Line data={weightData}/>
                    </Card>

                    {/* Pet Gallery & Memories */}
                    {/*<Card sx={{ mt: 4, p: 3, boxShadow: 3 }}>*/}
                    {/*    <Typography variant="h6" fontWeight="bold" color="primary">*/}
                    {/*        📸 Pet Gallery*/}
                    {/*    </Typography>*/}
                    {/*    <Divider sx={{ my: 2 }} />*/}
                    {/*    <ImageGallery items={images} />*/}
                    {/*</Card>*/}

                    {/* Daily Activity Log */}
                    <Card sx={{mt: 4, p: 3, boxShadow: 3}}>
                        <Typography variant="h6" fontWeight="bold" color="primary">
                            🏃‍♂️ Daily Activity Log
                        </Typography>
                        <Divider sx={{my: 2}}/>
                        <Typography>🏋️ Exercise: 30 mins ✅</Typography>
                        <Typography>🚶 Walk Distance: 2 km ✅</Typography>
                        <Typography>💤 Sleep: 8 hours</Typography>
                    </Card>

                    {/* Upcoming Reminders */}
                    <Card sx={{ mt: 4, p: 3, boxShadow: 3 }}>
                        <Typography variant="h6" fontWeight="bold" color="primary">
                            🔔 Reminders
                        </Typography>
                        <Divider sx={{ my: 2 }} />

                        {reminders.length > 0 ? (
                            <List sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                {reminders
                                    .slice()
                                    .sort((a, b) => a.date - b.date)
                                    .map((reminder) => (
                                        <Box
                                            key={reminder.id}
                                            sx={{
                                                border: "1px solid #e0e0e0",
                                                borderRadius: 2,
                                                padding: 2,
                                                backgroundColor: "#f9f9f9",
                                                boxShadow: 1,
                                            }}
                                        >
                                            <Typography variant="subtitle1" fontWeight="bold" sx={{ color: "#1976d2" }}>
                                                {new Date(reminder.createdTime).toLocaleDateString()}
                                            </Typography>
                                            <Typography variant="body2" sx={{ mt: 0.5 }}>
                                                📌 {reminder.message}
                                            </Typography>
                                        </Box>
                                    ))}
                            </List>
                        ) : (
                            <Typography color="textSecondary">No reminders scheduled.</Typography>
                        )}
                    </Card>

                    {/* 📌 Section: Past & Future Visits */}
                    <Card sx={{mt: 4, p: 3, boxShadow: 3}}>
                        <Typography variant="h6" fontWeight="bold" color="primary">
                            📆 Appointments
                        </Typography>
                        <Divider sx={{my: 2}}/>

                        {/* Visits List */}
                        {appointments.length > 0 ? (
                            <List sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                {appointments.map((appointment) => (
                                    <Box
                                        key={appointment.id}
                                        sx={{
                                            border: "1px solid #e0e0e0",
                                            borderRadius: 2,
                                            padding: 2,
                                            backgroundColor: "#f9f9f9",
                                            boxShadow: 1,
                                        }}
                                    >
                                        <Typography variant="subtitle1" fontWeight="bold" sx={{ color: "#1976d2" }}>
                                           Visit with {appointment.session.professional.name}
                                        </Typography>
                                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                                            🕒 Date: {new Date(appointment.session.start).toLocaleDateString()}
                                        </Typography>
                                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                                            🩺 Type: {appointment.session.professional.speciality}
                                        </Typography>
                                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                                            📌 Status: <strong>{appointment.status}</strong>
                                        </Typography>
                                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                                            🏥 Organization: {appointment.session.organization.name}
                                        </Typography>
                                    </Box>
                                ))}
                            </List>

                        ) : (
                            <Typography color="textSecondary">No visits recorded yet.</Typography>
                        )}

                        {/* Book New Appointment */}
                        <Button variant="contained"
                                sx={{mt: 2, backgroundColor: "#4caf50", "&:hover": {backgroundColor: "#388e3c"}}}
                                onClick={() => setBookDialogOpen(true)}>
                            ➕ Book New Appointment
                        </Button>
                    </Card>

                    {/* 📌 Section: Vaccinations & Medications */}
                    <Card sx={{mt: 4, p: 3, boxShadow: 3}}>
                        <Typography variant="h6" fontWeight="bold" color="primary">
                            💉 Vaccinations & Medications
                        </Typography>
                        <Divider sx={{my: 2}}/>

                        {/* Vaccination List */}
                        {dispenses.length > 0 ? (
                            <List sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                {dispenses.map((vaccine) => (
                                    <Box
                                        key={vaccine.id}
                                        sx={{
                                            border: "1px solid #e0e0e0",
                                            borderRadius: 2,
                                            padding: 2,
                                            backgroundColor: "#f9f9f9",
                                            boxShadow: 1,
                                        }}
                                    >
                                        <Typography variant="subtitle1" fontWeight="bold" sx={{ color: "#1976d2" }}>
                                            💊 {vaccine.medicinalProduct.medicineName} ({vaccine.medicinalProduct.brandName})
                                        </Typography>
                                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                                            📅 Prescribed On: {new Date(vaccine.createdTime).toLocaleDateString()}
                                        </Typography>
                                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                                            🧪 Type: {vaccine.medicinalProduct.type}
                                        </Typography>
                                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                                            🔁 Frequency: {vaccine.frequency}
                                        </Typography>
                                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                                            💊 Quantity: {vaccine.quantity}
                                        </Typography>
                                        {vaccine.notes && (
                                            <Typography variant="body2" sx={{ mt: 0.5 }}>
                                                📝 Notes: {vaccine.notes}
                                            </Typography>
                                        )}
                                    </Box>
                                ))}
                            </List>
                        ) : (
                            <Typography color="textSecondary">No vaccination or medication records found.</Typography>
                        )}
                    </Card>

                    {/* 📌 Book Appointment Dialog */}
                    <Dialog open={bookDialogOpen} onClose={() => setBookDialogOpen(false)}>
                        <DialogTitle>Book Appointment</DialogTitle>
                        <DialogContent>
                            <FormControl fullWidth sx={{mt: 2}}>
                                <InputLabel>Select Type</InputLabel>
                                <Select value={appointmentType} onChange={(e) => setAppointmentType(e.target.value)}>
                                    <MenuItem value="Medical">Medical</MenuItem>
                                    <MenuItem value="Grooming">Grooming</MenuItem>
                                    <MenuItem value="Training">Training</MenuItem>
                                </Select>
                            </FormControl>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setBookDialogOpen(false)}>Cancel</Button>
                            <Button variant="contained" onClick={handleBookAppointment} color="primary">Confirm</Button>
                        </DialogActions>
                    </Dialog>

                    <Card sx={{mt: 4, p: 3, boxShadow: 3}}>
                        <Typography variant="h6" fontWeight="bold" color="primary">
                            🏥 Health History
                        </Typography>
                        <Divider sx={{my: 2}}/>
                        {observations.length > 0 ? (
                            <List sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                {observations.map((record) => (
                                    <Box
                                        key={record.id}
                                        sx={{
                                            border: "1px solid #e0e0e0",
                                            borderRadius: 2,
                                            padding: 2,
                                            backgroundColor: "#f9f9f9",
                                            boxShadow: 1,
                                        }}
                                    >
                                        <Typography variant="subtitle1" fontWeight="bold" sx={{ color: "#1976d2" }}>
                                            🩺 {record.type}
                                        </Typography>
                                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                                            📅 Date: {new Date(record.createdTime).toLocaleDateString()}
                                        </Typography>
                                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                                            👨‍⚕️ By: {record.professional?.name || "Unknown"}
                                        </Typography>
                                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                                            📝 Notes: {record.notes}
                                        </Typography>
                                    </Box>
                                ))}
                            </List>
                        ) : (
                            <Typography color="textSecondary">No health history records found.</Typography>
                        )}

                    </Card>


                    {/* Edit Pet Dialog */}
                    <PetDialog
                        open={petDialogOpen}
                        onClose={() => setPetDialogOpen(false)}
                        pet={selectedPet}
                        mode={"edit"}/>
                </>
            ) : (
                <Typography variant="h6" textAlign="center" sx={{mt: 4}}>
                    Pet not found. 🐾
                </Typography>
            )}
        </Box>
    );
};

export default PetView;