import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControlLabel,
    Grid,
    InputAdornment,
    InputLabel,
    MenuItem,
    Snackbar,
    TextField,
    Typography,
    useMediaQuery,
    useTheme,
    Avatar,
    Paper,
    styled
} from "@mui/material";
import {
    AccessTime,
    Add,
    Business,
    Group,
    Event,
    Schedule,
    CheckCircle,
    Cancel
} from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { statusColors } from "../../utils/colors";
import {
    activateSchedule,
    cancelSchedule,
    createSchedule,
    deleteSchedule,
    fetchSchedules
} from "../../redux/scheduleSlice";
import { fetchOrganizations } from "../../redux/organizationSlice";

const StatusChip = styled(Chip)(({ theme, status }) => ({
    fontWeight: 600,
    borderRadius: '8px',
    backgroundColor: statusColors[status]?.background || theme.palette.grey[200],
    color: statusColors[status]?.text || theme.palette.text.primary,
    border: `1px solid ${statusColors[status]?.border || theme.palette.grey[400]}`,
    alignSelf: 'flex-start',
    margin: theme.spacing(1),
    width: 'auto',
    minWidth: '80px',
    justifyContent: 'center'
}))

const ScheduleCard = styled(Card)(({ theme }) => ({
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(1),
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: theme.shadows[6]
    }
}));

const ScheduleManagementComponent = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { schedules, status, error } = useSelector((state) => state.schedule);
    const { organizations } = useSelector((state) => state.organization);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [confirmationDialog, setConfirmationDialog] = useState({ open: false, action: null, id: null });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
    const formRef = useRef(null);

    const [scheduleData, setScheduleData] = useState({
        days: [],
        startDate: null,
        endDate: null,
        startTime: null,
        maxAppointments: "",
        organizationId: ""
    });

    const [pickerValues, setPickerValues] = useState({
        startDate: null,
        endDate: null,
        startTime: null
    });

    useEffect(() => {
        dispatch(fetchSchedules());
        dispatch(fetchOrganizations());
    }, [dispatch]);

    const dayMap = {
        Monday: "MO",
        Tuesday: "TU",
        Wednesday: "WE",
        Thursday: "TH",
        Friday: "FR",
        Saturday: "SA",
        Sunday: "SU",
    };

    const handleOpenDialog = () => {
        setScheduleData({
            days: [],
            startDate: null,
            endDate: null,
            startTime: null,
            maxAppointments: "",
            organizationId: ""
        });
        setPickerValues({
            startDate: null,
            endDate: null,
            startTime: null,
        });
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setErrors({});
    };

    const handleDayChange = (event) => {
        const { value, checked } = event.target;
        const rruleDay = dayMap[value];

        setScheduleData((prev) => {
            const updatedDays = checked
                ? [...prev.days, rruleDay]
                : prev.days.filter((day) => day !== rruleDay);
            return { ...prev, days: updatedDays };
        });
    };

    const handleDateChange = (field, newValue) => {
        setPickerValues((prev) => ({
            ...prev,
            [field]: newValue,
        }));

        if (newValue) {
            setScheduleData((prev) => ({
                ...prev,
                [field]: dayjs(newValue).format("YYYY-MM-DD"),
            }));
        }

        setErrors((prev) => ({ ...prev, [field]: "" }));
    };

    const handleTimeChange = (newValue) => {
        setPickerValues((prev) => ({
            ...prev,
            startTime: newValue,
        }));

        if (newValue) {
            setScheduleData((prev) => ({
                ...prev,
                startTime: dayjs(newValue).format("HH:mm"),
            }));
        }

        setErrors((prev) => ({ ...prev, startTime: "" }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setScheduleData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleSubmit = () => {
        if (!validateForm()) return;

        setLoading(true);

        const combineDateTime = (date, time) => {
            if (!date || !time) return "";
            const dateTimeString = `${date}T${time}:00`;
            return new Date(dateTimeString).toISOString().replace(/[-:.]/g, "").slice(0, 15) + "Z";
        };

        const schedulePayload = {
            maxAllowed: scheduleData.maxAppointments,
            recurringRule: `DTSTART=${combineDateTime(scheduleData.startDate, scheduleData.startTime)};UNTIL=${combineDateTime(scheduleData.endDate, "23:59")};FREQ=WEEKLY;BYDAY=${scheduleData.days.join(",")};INTERVAL=1`,
            organization: {
                id: scheduleData.organizationId
            }
        };

        dispatch(createSchedule(schedulePayload))
            .then((result) => {
                if (createSchedule.fulfilled.match(result)) {
                    setDialogOpen(false);
                    setSnackbar({ open: true, message: "Schedule created successfully!", severity: "success" });
                }
            })
            .finally(() => setLoading(false));
    };

    const validateForm = () => {
        let newErrors = {};

        if (scheduleData.days.length === 0) newErrors.days = "Select at least one day";
        if (!scheduleData.startDate) newErrors.startDate = "Start Date is required";
        if (!scheduleData.endDate) newErrors.endDate = "End Date is required";
        if (!scheduleData.startTime) newErrors.startTime = "Start time is required";
        if (!scheduleData.maxAppointments || scheduleData.maxAppointments <= 0) newErrors.maxAppointments = "Max Appointments must be greater than 0";
        if (!scheduleData.organizationId) newErrors.organizationId = "Organization required";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return false;
        }
        return true;
    };

    const handleConfirmAction = () => {
        const { action, id } = confirmationDialog;
        setLoading(true);
        setConfirmationDialog({ open: false, action: null, id: null });

        switch (action) {
            case "activate":
                dispatch(activateSchedule(id))
                    .then(() => setSnackbar({
                        open: true,
                        message: "Schedule activated successfully!",
                        severity: "success"
                    }))
                    .finally(() => setLoading(false));
                break;
            case "cancel":
                dispatch(cancelSchedule(id))
                    .then(() => setSnackbar({
                        open: true,
                        message: "Schedule canceled successfully!",
                        severity: "warning"
                    }))
                    .finally(() => setLoading(false));
                break;
            case "delete":
                dispatch(deleteSchedule(id))
                    .then(() => setSnackbar({ open: true, message: "Schedule deleted successfully!", severity: "error" }))
                    .finally(() => setLoading(false));
                break;
            default:
                setLoading(false);
        }
    };

    const handleCloseConfirmationDialog = () => {
        setConfirmationDialog({ open: false, action: null, id: null });
    };

    const parseRRuleManually = (rruleString) => {
        try {
            const ruleParts = rruleString.split(";");
            let days = "", startDate = "", endDate = "", startTime = "";

            ruleParts.forEach((part) => {
                const [key, value] = part.split("=");
                switch (key) {
                    case "BYDAY":
                        const dayMap = { MO: "Mon", TU: "Tue", WE: "Wed", TH: "Thu", FR: "Fri", SA: "Sat", SU: "Sun" };
                        days = value.split(",").map((day) => dayMap[day] || day).join(", ");
                        break;
                    case "DTSTART":
                        startDate = `${value.substring(0, 4)}-${value.substring(4, 6)}-${value.substring(6, 8)}`;
                        startTime = `${value.substring(9, 11)}:${value.substring(11, 13)}`;
                        break;
                    case "UNTIL":
                        endDate = `${value.substring(0, 4)}-${value.substring(4, 6)}-${value.substring(6, 8)}`;
                        break;
                    default:
                        break;
                }
            });

            return {
                days: days || "N/A",
                startDate: startDate ? new Date(startDate).toLocaleDateString("en-GB") : "N/A",
                endDate: endDate ? new Date(endDate).toLocaleDateString("en-GB") : "Ongoing",
                startTime: startTime
                    ? new Date(`1970-01-01T${startTime}:00Z`).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                    })
                    : "N/A",
            };
        } catch (error) {
            return { days: "Invalid RRule", startDate: "-", endDate: "-", startTime: "-" };
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "Active": return <CheckCircle color="inherit" fontSize="small" />;
            case "Cancelled": return <Cancel color="inherit" fontSize="small" />;
            default: return <Schedule color="inherit" fontSize="small" />;
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ p: 2 }}>
                {/* Header and Create Button */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3,
                    flexDirection: isMobile ? 'column' : 'row',
                    gap: 2
                }}>
                    <Typography variant="h5" fontWeight="600">
                        <Schedule sx={{ verticalAlign: 'middle', mr: 1, color: theme.palette.primary.main }} />
                        Manage Schedules
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={handleOpenDialog}
                        sx={{
                            borderRadius: '8px',
                            textTransform: 'none',
                            fontWeight: 500
                        }}
                    >
                        New Schedule
                    </Button>
                </Box>

                {/* Schedule List */}
                {status === "loading" ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', pt: 4 }}>
                        <CircularProgress size={60} />
                    </Box>
                ) : error ? (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                ) : schedules.length === 0 ? (
                    <Paper sx={{
                        p: 4,
                        textAlign: 'center',
                        borderRadius: '12px',
                        backgroundColor: theme.palette.background.paper
                    }}>
                        <Event sx={{ fontSize: 60, color: theme.palette.text.disabled, mb: 2 }} />
                        <Typography variant="h6" color="text.secondary">
                            No schedules found
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                            Create your first schedule to get started
                        </Typography>
                    </Paper>
                ) : (
                    <Grid container spacing={3} mb={1}>
                        {schedules.map((schedule) => {
                            const parsedRule = parseRRuleManually(schedule.recurringRule);
                            const { border } = statusColors[schedule.status] || statusColors.Scheduled;
                            return (
                                <Grid item key={schedule.id} xs={12} sm={6} lg={4}>
                                    <ScheduleCard onClick={() => navigate(`/dashboard/schedule/${schedule.id}`)}>
                                        <CardContent sx={{ flexGrow: 1 }}>
                                            {/* Time and Status in one line */}
                                            <Box sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                width: '100%',
                                                mb: 1.5
                                            }}>
                                                <Typography variant="body1" color="text.secondary">
                                                    {parsedRule.startTime}
                                                </Typography>
                                                <Chip
                                                    label={schedule.status}
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

                                            <Divider sx={{ my: 1.5 }} />

                                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
                                                <DetailItem
                                                    icon={<Event />}
                                                    label="Starts"
                                                    value={parsedRule.startDate}
                                                />
                                                <DetailItem
                                                    icon={<Event />}
                                                    label="Ends"
                                                    value={parsedRule.endDate}
                                                />
                                                <DetailItem
                                                    icon={<Group />}
                                                    label="Max Appts"
                                                    value={schedule.maxAllowed}
                                                />
                                                <DetailItem
                                                    icon={<Business />}
                                                    label="Organization"
                                                    value={schedule.organization?.name?.substring(0, 12) +
                                                        (schedule.organization?.name?.length > 12 ? '...' : '')}
                                                />
                                            </Box>
                                        </CardContent>
                                    </ScheduleCard>
                                </Grid>
                            );
                        })}
                    </Grid>
                )}

                {/* Create Schedule Dialog */}
                <Dialog
                    open={dialogOpen}
                    onClose={handleCloseDialog}
                    fullWidth
                    maxWidth="sm"
                    PaperProps={{
                        sx: {
                            borderRadius: '12px'
                        }
                    }}
                >
                    <DialogTitle sx={{
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        py: 2
                    }}>
                        <Add color="primary" />
                        Create New Schedule
                    </DialogTitle>
                    <DialogContent ref={formRef} sx={{ py: 3 }}>
                        <InputLabel sx={{ mb: 1, fontWeight: 500 }}>Recurring Days *</InputLabel>
                        <Grid container spacing={1} sx={{ mb: 2 }}>
                            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                                <Grid item xs={6} sm={4} key={day}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                value={day}
                                                onChange={handleDayChange}
                                                checked={scheduleData.days.includes(dayMap[day])}
                                            />
                                        }
                                        label={day}
                                    />
                                </Grid>
                            ))}
                            {errors.days && (
                                <Typography color="error" variant="body2" sx={{ ml: 2, mt: 1 }}>
                                    {errors.days}
                                </Typography>
                            )}
                        </Grid>

                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <DatePicker
                                    label="Start Date *"
                                    value={pickerValues.startDate}
                                    onChange={(newValue) => handleDateChange("startDate", newValue)}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            error: !!errors.startDate,
                                            helperText: errors.startDate,
                                        }
                                    }}
                                    disablePast
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <DatePicker
                                    label="End Date *"
                                    value={pickerValues.endDate}
                                    onChange={(newValue) => handleDateChange("endDate", newValue)}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            error: !!errors.endDate,
                                            helperText: errors.endDate,
                                        }
                                    }}
                                    minDate={pickerValues.startDate}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TimePicker
                                    label="Start Time *"
                                    value={pickerValues.startTime}
                                    onChange={handleTimeChange}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            error: !!errors.startTime,
                                            helperText: errors.startTime,
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Max Appointments *"
                                    type="number"
                                    name="maxAppointments"
                                    value={scheduleData.maxAppointments}
                                    onChange={handleInputChange}
                                    error={!!errors.maxAppointments}
                                    helperText={errors.maxAppointments}
                                    fullWidth
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Group color="action" />
                                            </InputAdornment>
                                        ),
                                        inputProps: {
                                            min: 1
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Organization *"
                                    name="organizationId"
                                    value={scheduleData.organizationId}
                                    onChange={handleInputChange}
                                    error={!!errors.organizationId}
                                    helperText={errors.organizationId}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Business color="action" />
                                            </InputAdornment>
                                        )
                                    }}
                                >
                                    {organizations.map((organization) => (
                                        <MenuItem key={organization.id} value={organization.id}>
                                            {organization.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{
                        px: 3,
                        py: 2,
                        borderTop: `1px solid ${theme.palette.divider}`
                    }}>
                        <Button
                            onClick={handleCloseDialog}
                            sx={{
                                borderRadius: '8px',
                                textTransform: 'none'
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleSubmit}
                            disabled={loading}
                            sx={{
                                borderRadius: '8px',
                                textTransform: 'none'
                            }}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Create Schedule'}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Confirmation Dialog */}
                <Dialog
                    open={confirmationDialog.open}
                    onClose={handleCloseConfirmationDialog}
                    PaperProps={{
                        sx: {
                            borderRadius: '12px'
                        }
                    }}
                >
                    <DialogTitle sx={{ fontWeight: 600 }}>
                        Confirm Action
                    </DialogTitle>
                    <DialogContent>
                        <Typography>
                            Are you sure you want to {confirmationDialog.action} this schedule?
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={handleCloseConfirmationDialog}
                            sx={{
                                borderRadius: '8px',
                                textTransform: 'none'
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleConfirmAction}
                            color="primary"
                            variant="contained"
                            sx={{
                                borderRadius: '8px',
                                textTransform: 'none'
                            }}
                        >
                            Confirm
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Snackbar Alert */}
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={6000}
                    onClose={() => setSnackbar({...snackbar, open: false})}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                >
                    <Alert
                        onClose={() => setSnackbar({...snackbar, open: false})}
                        severity={snackbar.severity}
                        sx={{
                            borderRadius: '12px',
                            boxShadow: theme.shadows[4]
                        }}
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Box>
        </LocalizationProvider>
    );
};

// Helper component for schedule details
const DetailItem = ({ icon, label, value }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 32,
            height: 32,
            borderRadius: '8px',
            bgcolor: 'action.hover'
        }}>
            {React.cloneElement(icon, { fontSize: 'small', color: 'action' })}
        </Box>
        <Box>
            <Typography variant="caption" color="text.secondary" display="block">
                {label}
            </Typography>
            <Typography variant="body2" fontWeight="500">
                {value}
            </Typography>
        </Box>
    </Box>
);

export default ScheduleManagementComponent;