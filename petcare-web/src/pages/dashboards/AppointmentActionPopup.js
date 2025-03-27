import React, {useEffect, useState} from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Typography, Avatar, Button, Box, Divider, TextField, MenuItem, InputAdornment
} from "@mui/material";
import PetsIcon from "@mui/icons-material/Pets";
import PersonIcon from "@mui/icons-material/Person";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";

import { format } from "date-fns";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import { useSelector, useDispatch } from "react-redux";
import { fetchDispensesByAppointment } from "../../redux/dispenseSlice";
import { fetchObservationsByAppointment } from "../../redux/observationSlice";
import { fetchRemindersByAppointment } from "../../redux/reminderSlice";

const AppointmentActionPopup = ({
                                    open,
                                    appointment,
                                    onClose,
                                    onAddObservation,
                                    onScheduleReminder,
                                    onPrescriptionSubmit
                                }) => {
    const [mode, setMode] = useState("default");
    const [observationForm, setObservationForm] = useState({
        type: "",
        notes: ""
    });

    const [reminderDate, setReminderDate] = useState(null);
    const [reminderMessage, setReminderMessage] = useState("")

    const [form, setForm] = useState({
        medicineId: "",
        quantity: 1,
        frequency: "",
        notes: ""
    });

    const dispatch = useDispatch();

    useEffect(() => {
        if (mode === "prescribe" && appointment?.id) {
            dispatch(fetchDispensesByAppointment(appointment.id));
        } else  if (mode === "observe" && appointment?.id) {
            dispatch(fetchObservationsByAppointment(appointment.id));
        } else if (mode === "remind" && appointment?.id) {
            dispatch(fetchRemindersByAppointment(appointment.id));
        }
    }, [mode, appointment?.id, dispatch]);


    const { medicinalProducts } = useSelector(state => state.medicinalProduct);
    const { dispenses } = useSelector((state) => state.dispense);
    const { observations } = useSelector(state => state.observation);
    const { reminders } = useSelector((state) => state.reminder);

    const handleSubmit = () => {
        if (!form.medicineId || !form.quantity || !form.frequency) {
            alert("Please fill required fields");
            return;
        }

        const payload = {
            appointmentId: appointment.id,
            petId: appointment.pet.id,

            medicineId: form.medicineId,
            quantity: form.quantity,
            frequency: form.frequency,
            notes: form.notes
        };

        onPrescriptionSubmit(payload);
        setMode("default");
        onClose();
    };

    const handleObservationSubmit = () => {
        if (!observationForm.type || !observationForm.notes) {
            alert("Please fill all fields");
            return;
        }

        const payload = {
            appointmentId: appointment.id,
            petId: appointment.pet.id,
            type: observationForm.type,
            notes: observationForm.notes,
        };

        onAddObservation(payload);
        setMode("default");
        onClose();
    };

    const handleScheduleReminder = () => {
        if (!reminderDate || !reminderMessage) {
            alert("Please select a date and enter a message");
            return;
        }

        const timestamp = reminderDate.getTime();

        const payload = {
            appointmentId: appointment.id,
            petId: appointment.pet.id,
            message: reminderMessage,
            reminderDate: timestamp,
        };

        onScheduleReminder(payload);
        setReminderDate(null);
        setReminderMessage("");
        setMode("default");
        onClose();
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleObservationChange = (e) => {
        setObservationForm({ ...observationForm, [e.target.name]: e.target.value });
    };

    const handleReminderDateChange = (date) => {
        setReminderDate(date);
    };

    const renderDefaultView = () => (
        <>
            <DialogTitle sx={{ textAlign: "center", fontWeight: "bold", backgroundColor: "#1976d2", color: "white" }}>
                Appointment Actions
            </DialogTitle>

            <DialogContent sx={{ textAlign: "center", pt: 3, mt: 1 }}>
                <Avatar
                    src={appointment.pet?.imageUrl || "https://via.placeholder.com/150"}
                    sx={{ width: 100, height: 100, mx: "auto", border: "3px solid #1976d2" }}
                />
                <Typography variant="h6" fontWeight="bold" sx={{ mt: 2 }}>
                    {appointment.pet?.name}
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 1 }}>
                    <Typography>
                        <PetsIcon sx={{ verticalAlign: "middle", color: "#1976d2" }} /> {appointment.pet?.type}
                    </Typography>
                    <Typography>
                        <PersonIcon sx={{ verticalAlign: "middle", color: "green" }} /> {appointment.customer?.name}
                    </Typography>
                    <Typography>
                        <ConfirmationNumberIcon sx={{ verticalAlign: "middle", color: "#f57c00" }} /> #{appointment.token}
                    </Typography>
                </Box>
                <Divider sx={{ my: 3 }} />
                <Typography variant="body1" sx={{ mb: 2 }}>
                    Choose an action to perform for this appointment.
                </Typography>
            </DialogContent>

            <DialogActions sx={{ justifyContent: "center", pb: 3, gap: 2 }}>
                <Button variant="contained" color="primary" onClick={() => setMode("observe")}>
                    📝 Add Observation
                </Button>
                <Button variant="contained" color="success" onClick={() => setMode("prescribe")}>
                    💊 Prescribe Medicine
                </Button>
                <Button variant="contained" color="warning" onClick={() => setMode("remind")}>
                    📅 Schedule Reminder
                </Button>
            </DialogActions>
        </>
    );

    const renderPrescriptionForm = () => (
        <>
            <DialogTitle sx={{ backgroundColor: "#1976d2", color: "white", textAlign: "center" }}>
                Prescribe Medicine
            </DialogTitle>
            <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
                <TextField
                    select
                    label="Select Medicine"
                    name="medicineId"
                    value={form.medicineId}
                    onChange={handleChange}
                    fullWidth
                    sx={{ mt: 1 }}
                >
                    {medicinalProducts.map((product) => (
                        <MenuItem key={product.id} value={product.id}>
                            {product.medicineName} ({product.brandName}) - {product.type}
                        </MenuItem>
                    ))}
                </TextField>

                <TextField
                    type="number"
                    label="Quantity"
                    name="quantity"
                    value={form.quantity}
                    onChange={handleChange}
                    fullWidth
                />

                <TextField
                    label="Frequency"
                    name="frequency"
                    placeholder="e.g., Twice a day"
                    value={form.frequency}
                    onChange={handleChange}
                    fullWidth
                />

                <TextField
                    label="Notes"
                    name="notes"
                    multiline
                    rows={3}
                    value={form.notes}
                    onChange={handleChange}
                    fullWidth
                />
            </DialogContent>
            <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 3 }}>
                <Button variant="outlined" onClick={() => setMode("default")}>Back</Button>
                <Button variant="contained" color="primary" onClick={handleSubmit}>Save Prescription</Button>
            </DialogActions>
            {dispenses.length > 0 && (
                <Box sx={{ mt: 4 }}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ ml: 1 }}>
                      Previously Prescribed Medicines
                    </Typography>

                    <Box
                        sx={{
                            maxHeight: 200,
                            overflowY: "auto",
                            border: "1px solid #ddd",
                            borderRadius: 2,
                            padding: 2,
                            backgroundColor: "#fefefe",
                        }}
                    >
                        {dispenses.map((item) => (
                            <Box
                                key={item.id}
                                sx={{
                                    border: "1px solid #e0e0e0",
                                    borderRadius: 2,
                                    padding: 2,
                                    backgroundColor: "#ffffff",
                                    mb: 2,
                                    transition: "background-color 0.2s",
                                    "&:hover": {
                                        backgroundColor: "#f1f1f1",
                                    },
                                }}
                            >
                                <Typography fontWeight="bold" gutterBottom>
                                    {item.medicinalProduct?.medicineName} ({item.medicinalProduct?.brandName}) -{" "}
                                    <i>{item.medicinalProduct?.type}</i>
                                </Typography>

                                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", pl: 1 }}>
                                    <Typography variant="body2">💊 <strong>Quantity:</strong> {item.quantity}</Typography>
                                    <Typography variant="body2">🔁 <strong>Frequency:</strong> {item.frequency}</Typography>
                                    {item.notes && (
                                        <Typography variant="body2">📝 <strong>Notes:</strong> {item.notes}</Typography>
                                    )}
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </Box>
            )}
        </>
    );

    const renderObservationForm = () => (
        <>
            <DialogTitle sx={{ backgroundColor: "#1976d2", color: "white", textAlign: "center" }}>
                Add Observation
            </DialogTitle>
            <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
                <TextField
                    select
                    label="Observation Type"
                    name="type"
                    value={observationForm.type}
                    onChange={handleObservationChange}
                    fullWidth
                    sx={{mt: 1 }}
                >
                    <MenuItem value="General">General</MenuItem>
                    <MenuItem value="Diet">Diet</MenuItem>
                    <MenuItem value="Behavior">Behavior</MenuItem>
                    <MenuItem value="Vaccination">Vaccination</MenuItem>
                </TextField>

                <TextField
                    label="Notes"
                    name="notes"
                    multiline
                    rows={4}
                    value={observationForm.notes}
                    onChange={handleObservationChange}
                    fullWidth
                />
            </DialogContent>
            <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 3 }}>
                <Button variant="outlined" onClick={() => setMode("default")}>Back</Button>
                <Button variant="contained" color="primary" onClick={handleObservationSubmit}>
                    Save Observation
                </Button>
            </DialogActions>

            {observations.length > 0 && (
                <Box sx={{ mt: 4 }}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ ml: 1 }}>
                       Previously Added Observations
                    </Typography>

                    <Box
                        sx={{
                            maxHeight: 200,
                            overflowY: "auto",
                            border: "1px solid #ddd",
                            borderRadius: 2,
                            padding: 1,
                            backgroundColor: "#fafafa",
                        }}
                    >
                        {observations.map((obs) => (
                            <Box
                                key={obs.id}
                                sx={{
                                    border: "1px solid #e0e0e0",
                                    borderRadius: 2,
                                    padding: 2,
                                    backgroundColor: "#f9f9f9",
                                    mb: 1,
                                }}
                            >
                                <Typography>
                                    <MedicalInformationIcon sx={{ fontSize: 16, verticalAlign: "middle", color: "#1976d2" }} />{" "}
                                    <strong>{obs.type}</strong>
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                    {obs.notes}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>
            )}

        </>
    );

    const renderScheduleReminderForm = () => (
        <>
            <DialogTitle sx={{ backgroundColor: "#1976d2", color: "white", textAlign: "center" }}>
                Schedule Reminder
            </DialogTitle>
            <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                        label="Reminder Date"
                        value={reminderDate}
                        onChange={handleReminderDateChange}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                fullWidth
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <CalendarTodayIcon color="action" />
                                        </InputAdornment>
                                    )
                                }}
                            />
                        )}
                        sx={{ mt: 1 }}
                    />
                </LocalizationProvider>

                <TextField
                    label="Reminder Message"
                    multiline
                    rows={3}
                    value={reminderMessage}
                    onChange={(e) => setReminderMessage(e.target.value)}
                    fullWidth
                />
            </DialogContent>
            <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 3 }}>
                <Button variant="outlined" onClick={() => setMode("default")}>Back</Button>
                <Button variant="contained" color="primary" onClick={handleScheduleReminder}>
                    Schedule
                </Button>
            </DialogActions>
            {reminders.length > 0 && (
                <Box sx={{ mt: 4 }}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ ml: 1 }}>
                        Previously Scheduled Reminders
                    </Typography>

                    <Box
                        sx={{
                            maxHeight: 200,
                            overflowY: "auto",
                            border: "1px solid #ddd",
                            borderRadius: 2,
                            padding: 1,
                            backgroundColor: "#fafafa",
                        }}
                    >
                        {reminders.map((reminder) => (
                            <Box
                                key={reminder.id}
                                sx={{
                                    border: "1px solid #e0e0e0",
                                    borderRadius: 2,
                                    padding: 2,
                                    backgroundColor: "#f9f9f9",
                                    mb: 1,
                                }}
                            >
                                <Typography>
                                    <NotificationsActiveIcon
                                        sx={{fontSize: 16, verticalAlign: "middle", color: "#f57c00"}}/>{" "}
                                    <strong>{format(new Date(reminder.reminderDate), "dd MMM yyyy")}</strong>
                                </Typography>
                                <Typography variant="body2" sx={{mt: 1}}>
                                {reminder.message}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>
            )}

        </>
    );



    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            {appointment && (
                mode === "default"
                    ? renderDefaultView()
                    : mode === "prescribe"
                        ? renderPrescriptionForm()
                        : mode === "observe"
                            ? renderObservationForm()
                            : renderScheduleReminderForm()
            )}
        </Dialog>
    );


};

export default AppointmentActionPopup;
