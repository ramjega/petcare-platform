import React, { useEffect, useState } from "react";
import { Box, Typography, Card, CardContent, CardActions, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, TextField, MenuItem } from "@mui/material";
import axios from "axios";

const Appointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [newAppointment, setNewAppointment] = useState({ petId: "", date: "", time: "" });
    const [pets, setPets] = useState([]);

    useEffect(() => {
        fetchAppointments();
        fetchPets();
    }, []);

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:8000/api/appointments");
            setAppointments(response.data);
        } catch (error) {
            console.error("Error fetching appointments:", error);
        }
        setLoading(false);
    };

    const fetchPets = async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/pets");
            setPets(response.data);
        } catch (error) {
            console.error("Error fetching pets:", error);
        }
    };

    const handleBookAppointment = async () => {
        try {
            await axios.post("http://localhost:8000/api/appointments", newAppointment);
            setDialogOpen(false);
            fetchAppointments(); // Refresh appointments list
        } catch (error) {
            console.error("Error booking appointment:", error);
        }
    };

    return (
        <Box>
            <Typography variant="h5" fontWeight="bold">
                Manage Appointments 📅
            </Typography>

            <Button variant="contained" sx={{ mt: 2 }} onClick={() => setDialogOpen(true)}>
                Book Appointment
            </Button>

            {loading ? (
                <CircularProgress sx={{ display: "block", margin: "20px auto" }} />
            ) : (
                appointments.map((appointment) => (
                    <Card key={appointment.id} sx={{ mt: 2 }}>
                        <CardContent>
                            <Typography variant="h6">Pet: {appointment.petName}</Typography>
                            <Typography>Date: {appointment.date}</Typography>
                            <Typography>Time: {appointment.time}</Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small" color="error">
                                Cancel
                            </Button>
                        </CardActions>
                    </Card>
                ))
            )}

            {/* Appointment Booking Dialog */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle>Book an Appointment</DialogTitle>
                <DialogContent>
                    <TextField
                        select
                        label="Select Pet"
                        fullWidth
                        margin="dense"
                        value={newAppointment.petId}
                        onChange={(e) => setNewAppointment({ ...newAppointment, petId: e.target.value })}
                    >
                        {pets.map((pet) => (
                            <MenuItem key={pet.id} value={pet.id}>
                                {pet.name}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        type="date"
                        fullWidth
                        label="Appointment Date"
                        margin="dense"
                        value={newAppointment.date}
                        onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
                    />
                    <TextField
                        type="time"
                        fullWidth
                        label="Time"
                        margin="dense"
                        value={newAppointment.time}
                        onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleBookAppointment} variant="contained">
                        Book
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Appointments;
