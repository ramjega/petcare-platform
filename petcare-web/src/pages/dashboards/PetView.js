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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, ChartTooltip, Legend);

const PetView = () => {
    const {petId} = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {selectedPet, status} = useSelector((state) => state.pet);

    const [bookDialogOpen, setBookDialogOpen] = useState(false);
    const [appointmentType, setAppointmentType] = useState("");
    const [appointments, setAppointments] = useState([]);
    const [vaccinations, setVaccinations] = useState([]);
    const [specialNotes, setSpecialNotes] = useState("");
    const [healthRecords, setHealthRecords] = useState("");

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
    const [loading, setLoading] = useState(false);

    const cardRef = useRef(null);

    useEffect(() => {
        dispatch(fetchPetById(petId));
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

                    {/* 📌 Section: Past & Future Visits */}
                    <Card sx={{mt: 4, p: 3, boxShadow: 3}}>
                        <Typography variant="h6" fontWeight="bold" color="primary">
                            📅 Professional Visits
                        </Typography>
                        <Divider sx={{my: 2}}/>

                        {/* Visits List */}
                        {appointments.length > 0 ? (
                            <List>
                                {appointments.map((appointment) => (
                                    <ListItem key={appointment.id}>
                                        <ListItemText
                                            primary={`${appointment.type} on ${new Date(appointment.date).toLocaleDateString()}`}
                                            secondary={`Status: ${appointment.status}`}/>
                                    </ListItem>
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
                        {vaccinations.length > 0 ? (
                            <List>
                                {vaccinations.map((vaccine) => (
                                    <ListItem key={vaccine.id}>
                                        <ListItemText primary={`${vaccine.name} - ${vaccine.status}`}
                                                      secondary={`Date: ${new Date(vaccine.date).toLocaleDateString()}`}/>
                                    </ListItem>
                                ))}
                            </List>
                        ) : (
                            <Typography color="textSecondary">No vaccination records found.</Typography>
                        )}
                    </Card>

                    {/* 📌 Section: Special Notes & Dietary Plans */}
                    <Card sx={{mt: 4, p: 3, boxShadow: 3}}>
                        <Typography variant="h6" fontWeight="bold" color="primary">
                            📝 Special Notes & Dietary Plans
                        </Typography>
                        <Divider sx={{my: 2}}/>

                        {specialNotes ? (
                            <Typography>{specialNotes}</Typography>
                        ) : (
                            <Typography color="textSecondary">No special notes added yet.</Typography>
                        )}
                    </Card>

                    {/* Pet Social & Community Engagement */}
                    <Card sx={{mt: 4, p: 3, boxShadow: 3}}>
                        <Typography variant="h6" fontWeight="bold" color="primary">
                            🗓️ Upcoming Pet Events
                        </Typography>
                        <Divider sx={{my: 2}}/>
                        <Typography>🐶 Dog Show - March 15</Typography>
                        <Typography>🏆 Best Pet Contest - April 10</Typography>
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
                        {healthRecords.length > 0 ? (
                            <List>
                                {healthRecords.map((record) => (
                                    <ListItem key={record.id}>
                                        <ListItemText primary={`${record.condition} - ${record.date}`}
                                                      secondary={record.notes}/>
                                    </ListItem>
                                ))}
                            </List>
                        ) : (
                            <Typography color="textSecondary">No health records found.</Typography>
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