import React, {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
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
    InputLabel,
    Snackbar,
    TextField,
    Typography,
    useMediaQuery,
} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import {AccessTime, Add, Group} from "@mui/icons-material";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {DatePicker, TimePicker} from "@mui/x-date-pickers";
import {statusColors} from "../../utils/colors";

import {
    activateSchedule,
    cancelSchedule,
    createSchedule,
    deleteSchedule,
    fetchSchedules
} from "../../redux/scheduleSlice";

import EventIcon from "@mui/icons-material/Event";

const ScheduleManagementComponent = () => {
    const {schedules, status, error} = useSelector((state) => state.schedule);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [confirmationDialog, setConfirmationDialog] = useState({open: false, action: null, id: null});
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({open: false, message: "", severity: "success"});
    const formRef = useRef(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchSchedules());
    }, [dispatch]);

    const [scheduleData, setScheduleData] = useState({
        days: [],
        startDate: null,
        endDate: null,
        startTime: null,
        maxAppointments: "",
    });

    const [pickerValues, setPickerValues] = useState({
        startDate: null,
        endDate: null,
        startTime: null,
    });

    const handleOpenDialog = () => {
        setScheduleData({
            days: [],
            startDate: null,
            endDate: null,
            startTime: null,
            maxAppointments: "",
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

    const handleDateChange = (field, newValue) => {
        setPickerValues((prev) => ({
            ...prev,
            [field]: newValue,
        }));

        // Store formatted value in `scheduleData`
        if (newValue) {
            setScheduleData((prev) => ({
                ...prev,
                [field]: dayjs(newValue).format("YYYY-MM-DD"),
            }));
        }

        setErrors((prev) => ({...prev, [field]: ""}))
    };

    const handleTimeChange = (newValue) => {
        setPickerValues((prev) => ({
            ...prev,
            startTime: newValue,
        }));

        // Store formatted value in `scheduleData`
        if (newValue) {
            setScheduleData((prev) => ({
                ...prev,
                startTime: dayjs(newValue).format("HH:mm"),
            }));
        }

        setErrors((prev) => ({...prev, startTime: ""}));
    };

    const handleNumberChange = (value) => {
        setScheduleData((prev) => ({...prev, maxAppointments: value}));
        setErrors((prev) => ({...prev, maxAppointments: ""}));
    };

    const dayMap = {
        Monday: "MO",
        Tuesday: "TU",
        Wednesday: "WE",
        Thursday: "TH",
        Friday: "FR",
        Saturday: "SA",
        Sunday: "SU",
    };

    const handleDayChange = (event) => {
        const {value, checked} = event.target;
        const rruleDay = dayMap[value];

        setScheduleData((prev) => {
            const updatedDays = checked
                ? [...prev.days, rruleDay]
                : prev.days.filter((day) => day !== rruleDay);
            return {...prev, days: updatedDays};
        });
    };

    const validateForm = () => {
        let newErrors = {};

        if (scheduleData.days.length === 0) newErrors.days = "Select at least one day";
        if (!scheduleData.startDate) newErrors.startDate = "Start Date is required";
        if (!scheduleData.endDate) newErrors.endDate = "End Date is required";
        if (!scheduleData.startTime) newErrors.startTime = "Start time is required";
        if (!scheduleData.maxAppointments || scheduleData.maxAppointments <= 0) newErrors.maxAppointments = "Max Appointments must be greater than 0";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return false;
        }
        return true;
    };

    const handleSubmit = () => {
        if (!validateForm()) return;

        setLoading(true);

        const combineDateTime = (date, time) => {
            if (!date || !time) return "";
            const dateTimeString = `${date}T${time}:00`;
            return new Date(dateTimeString).toISOString().replace(/[-:.]/g, "").slice(0, 15) + "Z";
        }

        const schedulePayload = {
            maxAllowed: scheduleData.maxAppointments,
            recurringRule: `FREQ=WEEKLY;BYDAY=${scheduleData.days.join(",")};DTSTART=${combineDateTime(scheduleData.startDate, scheduleData.startTime)};UNTIL=${combineDateTime(scheduleData.endDate, "23:59")};INTERVAL=1`,
        };

        dispatch(createSchedule(schedulePayload))
            .then((result) => {
                if (createSchedule.fulfilled.match(result)) {
                    setDialogOpen(false);
                    setSnackbar({open: true, message: "Schedule created successfully!", severity: "success"});
                }
            })
            .finally(() => setLoading(false));
    };

    const handleConfirmAction = () => {
        const {action, id} = confirmationDialog;
        setLoading(true);
        setConfirmationDialog({open: false, action: null, id: null});

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
                    .then(() => setSnackbar({open: true, message: "Schedule deleted successfully!", severity: "error"}))
                    .finally(() => setLoading(false));
                break;
            default:
                setLoading(false);
        }
    };

    const handleCloseConfirmationDialog = () => {
        setConfirmationDialog({open: false, action: null, id: null});
    };

    const parseRRuleManually = (rruleString) => {
        try {
            const ruleParts = rruleString.split(";");
            let days = "",
                startDate = "",
                endDate = "",
                startTime = "";

            ruleParts.forEach((part) => {
                const [key, value] = part.split("=");

                switch (key) {
                    case "BYDAY":
                        const dayMap = {
                            MO: "Mon",
                            TU: "Tue",
                            WE: "Wed",
                            TH: "Thu",
                            FR: "Fri",
                            SA: "Sat",
                            SU: "Sun",
                        };
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
            return {days: "Invalid RRule", startDate: "-", endDate: "-", startTime: "-"};
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{padding: 3, backgroundColor: "#f4f6f9", minHeight: "100vh"}}>
                <Box sx={{display: "flex", justifyContent: "flex-end", mb: 3}}>
                    <Button
                        variant="contained"
                        startIcon={<Add/>}
                        onClick={handleOpenDialog}
                        sx={{
                            backgroundColor: "#1976d2",
                            "&:hover": {backgroundColor: "#1565c0"},
                            width: isMobile ? "100%" : "auto",
                        }}
                    >
                        Schedule
                    </Button>
                </Box>

                {status === "loading" ? (
                    <CircularProgress sx={{display: "block", margin: "20px auto"}}/>
                ) : error ? (
                    <Typography color="error" textAlign="center">{error}</Typography>
                ) : schedules.length === 0 ? (
                    <Typography textAlign="center">No schedules.</Typography>
                ) : (
                    <Grid container spacing={3}>
                        {schedules.map((schedule, index) => {
                            const parsedRule = parseRRuleManually(schedule.recurringRule);
                            const {border, text} = statusColors[schedule.status] || statusColors.draft;
                            return (
                                <Grid item key={schedule.id} xs={12} sm={6} md={4}>
                                    <Card
                                        sx={{
                                            borderRadius: 2,
                                            boxShadow: 3,
                                            position: "relative",
                                            transition: "0.3s",
                                            "&:hover": {transform: "scale(1.02)", boxShadow: 6},
                                            cursor: "pointer",
                                        }}
                                        onClick={() => navigate(`/dashboard/schedule/${schedule.id}`)}
                                    >
                                        <Chip
                                            label={schedule.status}
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
                                            <Typography variant="h6" color="primary">
                                                Schedule {index + 1}
                                            </Typography>
                                            <Divider sx={{my: 1}}/>
                                            <Typography variant="body2">📅 Days: <b>{parsedRule.days}</b></Typography>
                                            <Typography variant="body2">📆
                                                From: <b>{parsedRule.startDate}</b></Typography>
                                            <Typography variant="body2">📆 To: <b>{parsedRule.endDate}</b></Typography>
                                            <Typography variant="body2">⏰ Start
                                                Time: <b>{parsedRule.startTime}</b></Typography>
                                            <Typography variant="body2">👥 Max
                                                Allowed: <b>{schedule.maxAllowed}</b></Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            );
                        })}
                    </Grid>
                )}

                {/* Schedule Creation Dialog */}
                <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="sm">
                    <DialogTitle sx={{textAlign: "center", fontWeight: "bold", color: "#1976d2"}}>
                        Create Recurring Schedule
                    </DialogTitle>
                    <DialogContent ref={formRef} sx={{maxHeight: "70vh", overflowY: "auto"}}>
                        <InputLabel sx={{mt: 2, fontWeight: "bold"}}>Select Days</InputLabel>
                        <Grid container spacing={1}>
                            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                                <Grid item xs={6} sm={4} key={day}>
                                    <FormControlLabel
                                        control={<Checkbox value={day} onChange={handleDayChange}
                                                           checked={scheduleData.days.includes(dayMap[day])}/>}
                                        label={day}
                                    />
                                </Grid>
                            ))}
                        </Grid>

                        <Grid container spacing={2} sx={{mt: 2}}>
                            <Grid item xs={6}>
                                <Box sx={{display: 'flex', alignItems: 'center'}}>
                                    <Box sx={{mr: 1}}>
                                        <EventIcon color="action"/>
                                    </Box>
                                    <DatePicker
                                        label="From"
                                        value={pickerValues.startDate}
                                        onChange={(newValue) => handleDateChange("startDate", newValue)}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                fullWidth
                                                error={!!errors.startDate}
                                                helperText={errors.startDate}
                                                InputLabelProps={{shrink: true}}
                                            />
                                        )}
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={6}>
                                <Box sx={{display: 'flex', alignItems: 'center'}}>
                                    <Box sx={{mr: 1}}>
                                        <EventIcon color="action"/>
                                    </Box>
                                    <DatePicker
                                        label="To"
                                        value={pickerValues.endDate}
                                        onChange={(newValue) => handleDateChange("endDate", newValue)}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                fullWidth
                                                error={!!errors.endDate}
                                                helperText={errors.endDate}
                                            />
                                        )}
                                    />
                                </Box>
                            </Grid>
                        </Grid>

                        <Grid container spacing={2} sx={{mt: 2}}>
                            <Grid item xs={6}>
                                <Box sx={{display: 'flex', alignItems: 'center'}}>
                                    <Box sx={{mr: 1}}>
                                        <AccessTime color="action"/>
                                    </Box>

                                    <TimePicker
                                        label="Time"
                                        value={pickerValues.startTime}
                                        onChange={handleTimeChange}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                fullWidth
                                                error={!!errors.startTime}
                                                helperText={errors.startTime}
                                            />
                                        )}
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={6}>
                                <Box sx={{display: 'flex', alignItems: 'center'}}>
                                    <Box sx={{mr: 1}}>
                                        <Group color="action"/>
                                    </Box>
                                    <TextField
                                        label="Max Bookings"
                                        type="number"
                                        name="maxAppointments"
                                        value={scheduleData.maxAppointments}
                                        onChange={(e) => handleNumberChange(e.target.value)}
                                        error={!!errors.maxAppointments}
                                        helperText={errors.maxAppointments}
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Cancel</Button>
                        <Button variant="contained" onClick={handleSubmit} disabled={loading}>
                            {loading ? <CircularProgress size={24} sx={{color: "white"}}/> : "Save"}
                        </Button>
                    </DialogActions>
                </Dialog>
                {/* Confirmation Dialog */}
                <Dialog open={confirmationDialog.open} onClose={handleCloseConfirmationDialog}>
                    <DialogTitle>Confirm Action</DialogTitle>
                    <DialogContent>
                        <Typography>Are you sure you want to {confirmationDialog.action} this schedule?</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseConfirmationDialog}>Cancel</Button>
                        <Button onClick={handleConfirmAction} color="primary" variant="contained">
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
        </LocalizationProvider>
    );
};

export default ScheduleManagementComponent;