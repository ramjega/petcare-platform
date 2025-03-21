import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Typography,
    CircularProgress,
    Grid,
    Card,
    CardContent,
    Divider,
    Button,
    MenuItem,
    FormControl,
    Select,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Chip,
    IconButton,
    InputAdornment,
    useMediaQuery,
    useTheme, Snackbar, Alert, InputLabel, FormLabel, RadioGroup, FormControlLabel, Radio
} from "@mui/material";
import {Add, Group, Event, FilterList, Close, Business, Male, Female} from "@mui/icons-material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { useDispatch, useSelector } from "react-redux";
import { fetchUpcomingSessions, createSession, fetchSessions } from "../../redux/sessionSlice";
import {fetchOrganizations} from "../../redux/organizationSlice";
import { statusColors } from "../../utils/colors";

const SessionManagementComponent = () => {
    const dispatch = useDispatch();

    const { sessions, status, error } = useSelector((state) => state.session);
    const {organizations} = useSelector((state) => state.organization);

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedStatus, setSelectedStatus] = useState("");
    const [showUpcoming, setShowUpcoming] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({open: false, message: "", severity: "success"});
    const formRef = useRef(null);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const [sessionData, setSessionData] = useState({
        start: null,
        maxAllowed: "",
    });

    const [errors, setErrors] = useState({});

    const navigate = useNavigate();


    const fetchSessionsByDate = useCallback((date) => {
        const timestamp = new Date(date).getTime();
        dispatch(fetchSessions({ date: timestamp }));
    }, [dispatch]);

    useEffect(() => {
        fetchSessionsByDate(selectedDate);
        dispatch(fetchOrganizations());
    }, [dispatch, fetchSessionsByDate, selectedDate]);

    const handleDateChange = (newDate) => {
        setSelectedDate(newDate);
        fetchSessionsByDate(newDate);
    };

    const handleStatusChange = (event) => {
        setSelectedStatus(event.target.value);
    };

    const toggleUpcomingFilter = () => {
        setShowUpcoming((prev) => !prev);
        if (!showUpcoming) {
            dispatch(fetchUpcomingSessions());
        } else {
            fetchSessionsByDate(selectedDate);
        }
    };

    const formatDateTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString("en-GB", {
            weekday: "short",
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };

    const handleOpenDialog = () => {
        setSessionData({ start: null, maxAllowed: "" });
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setErrors({});
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSessionData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleDateTimeChange = (date) => {
        setSessionData((prev) => ({ ...prev, start: date }));
        setErrors((prev) => ({ ...prev, start: "" }));
    };

    const filteredSessions = selectedStatus
        ? sessions.filter((session) => session.status === selectedStatus)
        : sessions;

    const validateForm = () => {
        let newErrors = {};
        if (!sessionData.start) newErrors.start = "Start time is required";
        if (!sessionData.maxAllowed) newErrors.maxAllowed = "Max Appointments is required";
        if (!sessionData.organizationId) newErrors.organizationId = "Organization required";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            const firstErrorField = Object.keys(newErrors)[0];
            const fieldRef = formRef.current?.querySelector(`[name="${firstErrorField}"]`);
            if (fieldRef) {
                fieldRef.scrollIntoView({ behavior: "smooth", block: "center" });
                fieldRef.focus();
            }
            return false;
        }
        return true;
    };

    const handleSubmit = () => {
        if (!validateForm()) return;

        setLoading(true);

        const sessionPayload = {
            maxAllowed: sessionData.maxAllowed,
            start: sessionData.start ? sessionData.start.getTime() : null,
            organization:{
                id: sessionData.organizationId
            }
        };

        dispatch(createSession(sessionPayload))
            .then((result) => {
                if (createSession.fulfilled.match(result)) {
                    setDialogOpen(false);
                    setSnackbar({open: true, message: "Session created successfully!", severity: "success"});
                }
            })
            .finally(() => setLoading(false));
    };


    return (
        <Box sx={{ padding: 3, backgroundColor: "#f4f6f9", minHeight: "100vh" }}>
            {/* Header */}
            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={handleOpenDialog}
                    sx={{
                        backgroundColor: "#1976d2",
                        "&:hover": { backgroundColor: "#1565c0" },
                        width: isMobile ? "100%" : "auto",
                    }}
                >
                    Session
                </Button>
            </Box>

            {/* Filters Section */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: "left",
                    gap: 2,
                    mb: 3,
                    backgroundColor: "#fff",
                    padding: 2,
                    borderRadius: 2,
                    boxShadow: 1,
                }}
            >
                {/* Date Picker */}
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                        label="Select Date"
                        value={selectedDate}
                        onChange={handleDateChange}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                fullWidth
                                sx={{ width: { xs: "100%", sm: "200px" } }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Event color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        )}
                    />
                </LocalizationProvider>

                {/* Status Dropdown */}
                <FormControl sx={{ width: { xs: "100%", sm: "200px" } }}>
                    <Select
                        value={selectedStatus}
                        onChange={handleStatusChange}
                        displayEmpty
                        startAdornment={
                            <InputAdornment position="start">
                                <FilterList color="action" />
                            </InputAdornment>
                        }
                    >
                        <MenuItem value="">All Statuses</MenuItem>
                        <MenuItem value="Scheduled">Scheduled</MenuItem>
                        <MenuItem value="Started">Ongoing</MenuItem>
                        <MenuItem value="Completed">Completed</MenuItem>
                        <MenuItem value="Cancelled">Cancelled</MenuItem>
                    </Select>
                </FormControl>

                {/* Upcoming Filter Toggle */}
                <Button
                    variant="outlined"
                    onClick={toggleUpcomingFilter}
                    sx={{
                        width: { xs: "100%", sm: "200px" },
                        borderRadius: 16,
                        borderColor: showUpcoming ? "#1976d2" : "#aaa",
                        color: showUpcoming ? "#fff" : "#1976d2",
                        backgroundColor: showUpcoming ? "#1976d2" : "transparent",
                        "&:hover": { backgroundColor: showUpcoming ? "#115293" : "#f0f0f0" },
                    }}
                >
                    Upcoming
                </Button>
            </Box>

            {/* Session List */}
            <Box sx={{ mt: 2 }}>
                {status === "loading" ? (
                    <CircularProgress sx={{ display: "block", margin: "20px auto" }} />
                ) : error ? (
                    <Typography color="error" textAlign="center">{error}</Typography>
                ) : filteredSessions.length === 0 ? (
                    <Typography textAlign="center">No sessions found. Try different dates</Typography>
                ) : (
                    <Grid container spacing={3} sx={{ minWidth: "100%" }}>
                        {filteredSessions
                            .slice()
                            .sort((a, b) => a.start - b.start)
                            .map((session, index) => {
                                const { border, text } = statusColors[session.status] || statusColors.Scheduled;
                                return (
                                    <Grid item key={session.id} xs={12} sm={6} md={4} sx={{ minWidth: "300px" }}>
                                        <Card
                                            sx={{
                                                borderRadius: 2,
                                                boxShadow: 3,
                                                position: "relative",
                                                transition: "0.3s",
                                                "&:hover": { transform: "scale(1.02)", boxShadow: 6 },
                                                cursor: "pointer",
                                            }}
                                            onClick={() => navigate(`/dashboard/session/${session.id}`)}
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
                                                <Typography variant="h6" color="primary">
                                                    Session {index + 1}
                                                </Typography>
                                                <Divider sx={{ my: 1 }} />
                                                <Typography variant="body2">📆 Start: <b>{formatDateTime(session.start)}</b></Typography>
                                                <Typography variant="body2">👥 Max Allowed: <b>{session.maxAllowed}</b></Typography>
                                                <Typography variant="body2">🎟 Next Token: <b>{session.nextToken}</b></Typography>
                                                <Typography variant="body2">📌 Booked: <b>{session.booked}</b></Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                );
                            })}
                    </Grid>
                )}
            </Box>

            {/* Create Session Dialog */}
            <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ textAlign: "center", fontWeight: "bold", color: "#1976d2" }}>
                    Create New Session
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseDialog}
                        sx={{
                            position: "absolute",
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <Close />
                    </IconButton>
                </DialogTitle>
                <DialogContent ref={formRef} sx={{ maxHeight: "70vh", overflowY: "auto", p: 2 }}>
                    <Grid container spacing={2} alignItems="center" mt={2}>
                        {/* Start Time Picker */}
                        <Grid item xs={12}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <FormControl fullWidth>
                                    <DateTimePicker
                                        label="Start Time"
                                        value={sessionData.start}
                                        onChange={handleDateTimeChange}
                                        slotProps={{
                                            textField: {
                                                variant: 'outlined',
                                                error: !!errors.start,
                                                helperText: errors.start,
                                            }
                                        }}
                                    />
                                </FormControl>
                            </LocalizationProvider>
                        </Grid>

                        {/* Max Appointments Input */}
                        <Grid item xs={12}>
                            <TextField
                                label="Max Appointments"
                                type="number"
                                name="maxAllowed"
                                value={sessionData.maxAllowed}
                                onChange={handleInputChange}
                                error={!!errors.maxAllowed}
                                helperText={errors.maxAllowed}
                                fullWidth
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Group color="action" />
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Grid>
                        {/* Organization Dropdown */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                select
                                label="Organization"
                                name="organizationId"
                                value={sessionData.organizationId}
                                onChange={handleInputChange}
                                error={!!errors.organizationId}
                                helperText={errors.organizationId}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Business color="action"/>
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
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={handleCloseDialog} sx={{ color: "#555" }}>Cancel</Button>
                    <Button variant="contained" onClick={handleSubmit} disabled={loading}>
                        {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Save"}
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

export default SessionManagementComponent;