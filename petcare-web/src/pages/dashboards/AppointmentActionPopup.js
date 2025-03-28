import React, {useEffect, useState} from "react";
import {
    Avatar,
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    InputAdornment,
    MenuItem,
    Paper,
    TextField,
    Typography,
    useTheme
} from "@mui/material";
import {
    ArrowBack as ArrowBackIcon,
    CalendarToday as CalendarTodayIcon,
    Close as CloseIcon,
    ConfirmationNumber as ConfirmationNumberIcon,
    MedicalInformation as MedicalInformationIcon,
    NotificationsActive as NotificationsActiveIcon,
    Person as PersonIcon,
    Pets as PetsIcon,
    Receipt as ReceiptIcon,
} from "@mui/icons-material";
import {format} from "date-fns";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {useDispatch, useSelector} from "react-redux";
import {fetchDispensesByAppointment} from "../../redux/dispenseSlice";
import {fetchObservationsByAppointment} from "../../redux/observationSlice";
import {fetchRemindersByAppointment} from "../../redux/reminderSlice";

const AppointmentActionPopup = ({
                                    open,
                                    appointment,
                                    onClose,
                                    onAddObservation,
                                    onScheduleReminder,
                                    onPrescriptionSubmit
                                }) => {
    const theme = useTheme();
    const [mode, setMode] = useState("default");
    const [observationForm, setObservationForm] = useState({type: "", notes: ""});
    const [reminderDate, setReminderDate] = useState(null);
    const [reminderMessage, setReminderMessage] = useState("");
    const [form, setForm] = useState({
        medicineId: "",
        quantity: 1,
        frequency: "",
        notes: ""
    });

    const dispatch = useDispatch();
    const {medicinalProducts} = useSelector(state => state.medicinalProduct);
    const {dispenses} = useSelector((state) => state.dispense);
    const {observations} = useSelector(state => state.observation);
    const {reminders} = useSelector((state) => state.reminder);

    useEffect(() => {
        if (appointment?.id) {
            if (mode === "prescribe") {
                dispatch(fetchDispensesByAppointment(appointment.id));
            } else if (mode === "observe") {
                dispatch(fetchObservationsByAppointment(appointment.id));
            } else if (mode === "remind") {
                dispatch(fetchRemindersByAppointment(appointment.id));
            }
        }
    }, [mode, appointment?.id, dispatch]);

    const handleSubmit = () => {
        if (!form.medicineId || !form.quantity || !form.frequency) {
            alert("Please fill required fields");
            return;
        }
        onPrescriptionSubmit({
            appointmentId: appointment.id,
            petId: appointment.pet.id,
            ...form
        });
        resetForms();
    };

    const handleObservationSubmit = () => {
        if (!observationForm.type || !observationForm.notes) {
            alert("Please fill all fields");
            return;
        }
        onAddObservation({
            appointmentId: appointment.id,
            petId: appointment.pet.id,
            ...observationForm
        });
        resetForms();
    };

    const handleScheduleReminder = () => {
        if (!reminderDate || !reminderMessage) {
            alert("Please select a date and enter a message");
            return;
        }
        onScheduleReminder({
            appointmentId: appointment.id,
            petId: appointment.pet.id,
            message: reminderMessage,
            reminderDate: reminderDate.getTime()
        });
        resetForms();
    };

    const resetForms = () => {
        setForm({medicineId: "", quantity: 1, frequency: "", notes: ""});
        setObservationForm({type: "", notes: ""});
        setReminderDate(null);
        setReminderMessage("");
        setMode("default");
    };

    const renderDefaultView = () => (
        <>
            <DialogTitle sx={{
                bgcolor: theme.palette.primary.main,
                color: theme.palette.common.white,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <Typography variant="h6" fontWeight={600}>Appointment Actions</Typography>
                <CloseIcon onClick={onClose} sx={{cursor: 'pointer'}}/>
            </DialogTitle>

            <DialogContent sx={{pt: 3, mt: 2}}>
                <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <Avatar
                        src={appointment.pet?.imageUrl}
                        sx={{
                            width: 100,
                            height: 100,
                            border: `3px solid ${theme.palette.primary.main}`,
                            mb: 2
                        }}
                    >
                        <PetsIcon fontSize="large"/>
                    </Avatar>

                    <Typography variant="h6" fontWeight={600} gutterBottom>
                        {appointment.pet?.name}
                    </Typography>

                    <Box sx={{display: 'flex', gap: 2, mb: 3}}>
                        <Chip
                            icon={<PetsIcon/>}
                            label={appointment.pet?.type}
                            size="small"
                            color="primary"
                            variant="outlined"
                        />
                        <Chip
                            icon={<PersonIcon/>}
                            label={appointment.customer?.name}
                            size="small"
                            color="secondary"
                            variant="outlined"
                        />
                        <Chip
                            icon={<ConfirmationNumberIcon/>}
                            label={`#${appointment.token}`}
                            size="small"
                            sx={{color: theme.palette.warning.dark}}
                            variant="outlined"
                        />
                    </Box>
                </Box>

                <Divider sx={{my: 2}}/>

                <Typography variant="body1" textAlign="center" color="text.secondary" mb={3}>
                    Choose an action to perform for this appointment
                </Typography>

                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: {xs: '1fr', sm: 'repeat(2, 1fr)'},
                    gap: 2
                }}>
                    <ActionCard
                        icon={<MedicalInformationIcon color="primary"/>}
                        title="Add Observation"
                        description="Record clinical findings or behavior notes"
                        onClick={() => setMode("observe")}
                        color={theme.palette.primary.main}
                    />
                    <ActionCard
                        icon={<MedicalInformationIcon color="success"/>}
                        title="Prescribe Medicine"
                        description="Create a new prescription for this pet"
                        onClick={() => setMode("prescribe")}
                        color={theme.palette.success.main}
                    />
                    <ActionCard
                        icon={<NotificationsActiveIcon color="warning"/>}
                        title="Schedule Reminder"
                        description="Set a follow-up reminder for the owner"
                        onClick={() => setMode("remind")}
                        color={theme.palette.warning.main}
                    />
                    <ActionCard
                        icon={<ReceiptIcon color="info"/>}
                        title="Create Invoice"
                        description="Generate a payment invoice for services"
                        onClick={() => setMode("invoice")}
                        color={theme.palette.info.main}
                    />
                </Box>
            </DialogContent>
        </>
    );

    const renderPrescriptionForm = () => (
        <FormLayout
            title="Prescribe Medicine"
            onBack={() => setMode("default")}
            onSubmit={handleSubmit}
            submitText="Save Prescription"
        >
            <TextField
                select
                label="Select Medicine"
                name="medicineId"
                value={form.medicineId}
                onChange={(e) => setForm({...form, medicineId: e.target.value})}
                fullWidth
                sx={{mt: 2, mb: 2}}
                size="small"
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
                onChange={(e) => setForm({...form, quantity: e.target.value})}
                fullWidth
                sx={{mb: 2}}
                size="small"
            />

            <TextField
                label="Frequency"
                name="frequency"
                placeholder="e.g., Twice a day"
                value={form.frequency}
                onChange={(e) => setForm({...form, frequency: e.target.value})}
                fullWidth
                sx={{mb: 2}}
                size="small"
            />

            <TextField
                label="Notes"
                name="notes"
                multiline
                rows={3}
                value={form.notes}
                onChange={(e) => setForm({...form, notes: e.target.value})}
                fullWidth
                size="small"
            />

            {dispenses.length > 0 && (
                <PreviousItemsSection
                    title="Previous Prescriptions"
                    items={dispenses}
                    renderItem={(item) => (
                        <>
                            <Typography fontWeight={600}>
                                {item.medicinalProduct?.medicineName} ({item.medicinalProduct?.brandName})
                            </Typography>
                            <Box sx={{display: 'flex', gap: 2, mt: 1}}>
                                <Typography variant="body2">Quantity: {item.quantity}</Typography>
                                <Typography variant="body2">Frequency: {item.frequency}</Typography>
                                {item.notes && <Typography variant="body2">Notes: {item.notes}</Typography>}
                            </Box>
                        </>
                    )}
                />
            )}
        </FormLayout>
    );

    const renderObservationForm = () => (
        <FormLayout
            title="Add Observation"
            onBack={() => setMode("default")}
            onSubmit={handleObservationSubmit}
            submitText="Save Observation"
        >
            <TextField
                select
                label="Observation Type"
                name="type"
                value={observationForm.type}
                onChange={(e) => setObservationForm({...observationForm, type: e.target.value})}
                fullWidth
                sx={{mt: 2, mb: 2}}
                size="small"
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
                onChange={(e) => setObservationForm({...observationForm, notes: e.target.value})}
                fullWidth
                size="small"
            />

            {observations.length > 0 && (
                <PreviousItemsSection
                    title="Previous Observations"
                    items={observations}
                    renderItem={(obs) => (
                        <>
                            <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                <MedicalInformationIcon fontSize="small" color="primary"/>
                                <Typography fontWeight={600}>{obs.type}</Typography>
                            </Box>
                            <Typography variant="body2" sx={{mt: 1}}>{obs.notes}</Typography>
                        </>
                    )}
                />
            )}
        </FormLayout>
    );

    const renderScheduleReminderForm = () => (
        <FormLayout
            title="Schedule Reminder"
            onBack={() => setMode("default")}
            onSubmit={handleScheduleReminder}
            submitText="Schedule Reminder"
        >
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                    label="Reminder Date"
                    value={reminderDate}
                    onChange={setReminderDate}
                    sx={{mt: 2, mb: 2}}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            fullWidth
                            sx={{mb: 2}}
                            size="small"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <CalendarTodayIcon color="action"/>
                                    </InputAdornment>
                                )
                            }}
                        />
                    )}
                />
            </LocalizationProvider>

            <TextField
                label="Reminder Message"
                multiline
                rows={3}
                value={reminderMessage}
                onChange={(e) => setReminderMessage(e.target.value)}
                fullWidth
                size="small"
            />

            {reminders.length > 0 && (
                <PreviousItemsSection
                    title="Previous Reminders"
                    items={reminders}
                    renderItem={(reminder) => (
                        <>
                            <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                <NotificationsActiveIcon fontSize="small" color="warning"/>
                                <Typography fontWeight={600}>
                                    {format(new Date(reminder.reminderDate), "MMM dd, yyyy")}
                                </Typography>
                            </Box>
                            <Typography variant="body2" sx={{mt: 1}}>{reminder.message}</Typography>
                        </>
                    )}
                />
            )}
        </FormLayout>
    );

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{sx: {borderRadius: 3}}}
        >
            {appointment && (
                mode === "default" ? renderDefaultView() :
                    mode === "prescribe" ? renderPrescriptionForm() :
                        mode === "observe" ? renderObservationForm() :
                            renderScheduleReminderForm()
            )}
        </Dialog>
    );
};

// Reusable components
const ActionCard = ({icon, title, description, onClick, color}) => (
    <Paper
        elevation={0}
        onClick={onClick}
        sx={{
            p: 2,
            borderRadius: 2,
            border: `1px solid ${color}`,
            cursor: 'pointer',
            transition: 'all 0.2s',
            '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: `0 4px 8px ${color}20`,
                borderColor: color,
                backgroundColor: `${color}08`
            }
        }}
    >
        <Box sx={{display: 'flex', alignItems: 'center', gap: 2, mb: 1}}>
            <Box sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                bgcolor: `${color}10`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {React.cloneElement(icon, {sx: {fontSize: 20}})}
            </Box>
            <Typography fontWeight={600}>{title}</Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">{description}</Typography>
    </Paper>
);

const FormLayout = ({title, onBack, onSubmit, submitText, children}) => {
    const theme = useTheme();

    return (
        <>
            <DialogTitle sx={{
                bgcolor: theme.palette.primary.main,
                color: theme.palette.common.white,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                    <ArrowBackIcon onClick={onBack} sx={{cursor: 'pointer'}}/>
                    <Typography variant="h6" fontWeight={600}>{title}</Typography>
                </Box>
                <CloseIcon sx={{opacity: 0}}/> {/* For alignment */}
            </DialogTitle>

            <DialogContent sx={{pt: 3}}>
                {children}
            </DialogContent>

            <DialogActions sx={{p: 2, borderTop: `1px solid ${theme.palette.divider}`}}>
                <Button
                    variant="outlined"
                    onClick={onBack}
                    sx={{textTransform: 'none'}}
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    onClick={onSubmit}
                    sx={{
                        textTransform: 'none',
                        boxShadow: 'none',
                        '&:hover': {boxShadow: 'none'}
                    }}
                >
                    {submitText}
                </Button>
            </DialogActions>
        </>
    );
};

const PreviousItemsSection = ({title, items, renderItem}) => (
    <Box sx={{mt: 4}}>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            {title}
        </Typography>
        <Box sx={{
            maxHeight: 200,
            overflowY: 'auto',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            p: 1
        }}>
            {items.map((item) => (
                <Paper
                    key={item.id}
                    elevation={0}
                    sx={{
                        p: 2,
                        mb: 1,
                        borderRadius: 1,
                        bgcolor: 'action.hover'
                    }}
                >
                    {renderItem(item)}
                </Paper>
            ))}
        </Box>
    </Box>
);

export default AppointmentActionPopup;