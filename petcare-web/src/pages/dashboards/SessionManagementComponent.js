import React, {useCallback, useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import {
    Alert,
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
    Grid,
    IconButton,
    InputAdornment,
    MenuItem,
    Paper,
    Snackbar,
    styled,
    TextField,
    Typography,
    useMediaQuery,
    useTheme
} from "@mui/material";
import {
    AccessTime,
    Add,
    ArrowForward,
    Business,
    Cancel,
    CheckCircle,
    Close,
    Event,
    FilterList,
    Group,
    Schedule
} from "@mui/icons-material";
import {DateTimePicker} from "@mui/x-date-pickers/DateTimePicker";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {useDispatch, useSelector} from "react-redux";
import {createSession, fetchSessions, fetchUpcomingSessions} from "../../redux/sessionSlice";
import {fetchOrganizations} from "../../redux/organizationSlice";
import {statusColors} from "../../utils/colors";

const StatusChip = styled(Chip)(({ theme, status }) => ({
    fontWeight: 600,
    borderRadius: '8px',
    backgroundColor: statusColors[status]?.background || theme.palette.grey[200],
    color: statusColors[status]?.text || theme.palette.text.primary,
    border: `1px solid ${statusColors[status]?.border || theme.palette.grey[400]}`,
    // Remove position: absolute and related properties
    flexShrink: 0, // Prevent shrinking
    marginLeft: theme.spacing(1) // Add some spacing
}));

const SessionCard = styled(Card)(({theme}) => ({
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: theme.shadows[6],
        '& .session-arrow': {
            opacity: 1,
            transform: 'translateX(4px)'
        }
    }
}));

const SessionManagementComponent = () => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const navigate = useNavigate();

    const {sessions, status, error} = useSelector((state) => state.session);
    const {organizations} = useSelector((state) => state.organization);

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedStatus, setSelectedStatus] = useState("");
    const [showUpcoming, setShowUpcoming] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({open: false, message: "", severity: "success"});
    const formRef = useRef(null);

    const [sessionData, setSessionData] = useState({
        start: null,
        maxAllowed: "",
        organizationId: ""
    });

    const [errors, setErrors] = useState({});

    const fetchSessionsByDate = useCallback((date) => {
        const timestamp = new Date(date).getTime();
        dispatch(fetchSessions({date: timestamp}));
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

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString("en-GB", {
            weekday: "short",
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';

        // Convert 24h to 12h format
        const twelveHour = hours % 12 || 12; // 0 becomes 12

        return `${twelveHour}:${minutes} ${ampm}`;
    };

    const handleOpenDialog = () => {
        setSessionData({start: null, maxAllowed: "", organizationId: ""});
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setErrors({});
    };

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setSessionData((prev) => ({...prev, [name]: value}));
        setErrors((prev) => ({...prev, [name]: ""}));
    };

    const handleDateTimeChange = (date) => {
        setSessionData((prev) => ({...prev, start: date}));
        setErrors((prev) => ({...prev, start: ""}));
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
                fieldRef.scrollIntoView({behavior: "smooth", block: "center"});
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
            organization: {
                id: sessionData.organizationId
            }
        };

        dispatch(createSession(sessionPayload))
            .then((result) => {
                if (createSession.fulfilled.match(result)) {
                    setDialogOpen(false);
                    setSnackbar({open: true, message: "Session created successfully!", severity: "success"});
                    fetchSessionsByDate(selectedDate);
                }
            })
            .finally(() => setLoading(false));
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "Scheduled":
                return <Schedule color="inherit" fontSize="small"/>;
            case "Started":
                return <AccessTime color="inherit" fontSize="small"/>;
            case "Completed":
                return <CheckCircle color="inherit" fontSize="small"/>;
            case "Cancelled":
                return <Cancel color="inherit" fontSize="small"/>;
            default:
                return <Event color="inherit" fontSize="small"/>;
        }
    };

    return (
        <Box sx={{p: 2}}>
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
                    <Schedule sx={{verticalAlign: 'middle', mr: 1, color: theme.palette.primary.main}}/>
                    Manage Sessions
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<Add/>}
                    onClick={handleOpenDialog}
                    sx={{
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontWeight: 500,
                        boxShadow: 'none',
                        '&:hover': {
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }
                    }}
                >
                    New Session
                </Button>
            </Box>

            {/* Filters Section */}
            <Paper sx={{
                p: 2,
                mb: 3,
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
                <Grid container spacing={2} alignItems="center">
                    {/* Date Picker */}
                    <Grid item xs={12} sm={4}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                label="Select Date"
                                value={selectedDate}
                                onChange={handleDateChange}
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        InputProps: {
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Event color="action"/>
                                                </InputAdornment>
                                            ),
                                        }
                                    }
                                }}
                            />
                        </LocalizationProvider>
                    </Grid>

                    {/* Status Dropdown */}
                    <Grid item xs={12} sm={4}>
                        <TextField
                            select
                            fullWidth
                            label="Filter by Status"
                            value={selectedStatus}
                            onChange={handleStatusChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <FilterList color="action"/>
                                    </InputAdornment>
                                ),
                            }}
                        >
                            <MenuItem value="">All Statuses</MenuItem>
                            <MenuItem value="Scheduled">Scheduled</MenuItem>
                            <MenuItem value="Started">Ongoing</MenuItem>
                            <MenuItem value="Completed">Completed</MenuItem>
                            <MenuItem value="Cancelled">Cancelled</MenuItem>
                        </TextField>
                    </Grid>

                    {/* Upcoming Filter */}
                    <Grid item xs={12} sm={4}>
                        <Button
                            fullWidth
                            variant={showUpcoming ? "contained" : "outlined"}
                            onClick={toggleUpcomingFilter}
                            startIcon={<Event/>}
                            sx={{
                                borderRadius: '8px',
                                textTransform: 'none'
                            }}
                        >
                            {showUpcoming ? 'Showing Upcoming' : 'Show Upcoming'}
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* Session List */}
            <Box sx={{mt: 2}}>
                {status === "loading" ? (
                    <Box sx={{display: 'flex', justifyContent: 'center', pt: 4}}>
                        <CircularProgress size={60}/>
                    </Box>
                ) : error ? (
                    <Alert severity="error" sx={{mb: 3}}>
                        {error}
                    </Alert>
                ) : filteredSessions.length === 0 ? (
                    <Paper sx={{
                        p: 4,
                        textAlign: 'center',
                        borderRadius: '12px',
                        backgroundColor: theme.palette.background.paper
                    }}>
                        <Event sx={{fontSize: 60, color: theme.palette.text.disabled, mb: 2}}/>
                        <Typography variant="h6" color="text.secondary">
                            No sessions found
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{mt: 1}}>
                            Try adjusting your filters or create a new session
                        </Typography>
                    </Paper>
                ) : (
                    <Grid container spacing={3}>
                        {filteredSessions
                            .slice()
                            .sort((a, b) => a.start - b.start)
                            .map((session) => (
                                <Grid item key={session.id} xs={12} sm={6} lg={4}>
                                    <SessionCard onClick={() => navigate(`/dashboard/session/${session.id}`)}>
                                        <CardContent sx={{ flexGrow: 1 }}>
                                            {/* Time and Status in one line */}
                                            <Box sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                width: '100%',
                                                mb: 1.5
                                            }}>
                                                <Typography variant="body1" fontWeight="500">
                                                    {formatTime(session.start)}
                                                </Typography>
                                                <StatusChip
                                                    status={session.status}
                                                    icon={getStatusIcon(session.status)}
                                                    label={session.status === "Started" ? "Ongoing" : session.status}
                                                />
                                            </Box>

                                            <Divider sx={{ my: 1.5 }} />

                                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
                                                <DetailItem icon={<Group />} label="Max" value={session.maxAllowed} />
                                                <DetailItem icon={<CheckCircle />} label="Booked" value={session.booked} />
                                                <DetailItem icon={<AccessTime />} label="Next Token" value={session.nextToken} />
                                                <DetailItem
                                                    icon={<Business />}
                                                    label="Organization"
                                                    value={session.organization?.name?.substring(0, 12) +
                                                        (session.organization?.name?.length > 12 ? '...' : '')}
                                                />
                                            </Box>
                                        </CardContent>

                                        {/* View Details footer */}
                                        <Box sx={{
                                            p: 2,
                                            display: 'flex',
                                            justifyContent: 'flex-end',
                                            alignItems: 'center'
                                        }}>
                                            <Typography variant="body2" color="primary" sx={{ mr: 1 }}>
                                                View Details
                                            </Typography>
                                            <ArrowForward
                                                color="primary"
                                                sx={{
                                                    fontSize: 16,
                                                    opacity: 0.7,
                                                    transition: 'all 0.3s ease'
                                                }}
                                            />
                                        </Box>
                                    </SessionCard>
                                </Grid>
                            ))}
                    </Grid>
                )}
            </Box>
            {/* Create Session Dialog */}
            <Dialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                maxWidth="sm"
                fullWidth
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
                    py: 2,
                    pr: 6
                }}>
                    <Add color="primary"/>
                    Create New Session
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseDialog}
                        sx={{
                            position: 'absolute',
                            right: 12,
                            top: 12,
                        }}
                    >
                        <Close/>
                    </IconButton>
                </DialogTitle>
                <DialogContent ref={formRef} sx={{py: 3}}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DateTimePicker
                                    label="Start Time *"
                                    value={sessionData.start}
                                    onChange={handleDateTimeChange}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            error: !!errors.start,
                                            helperText: errors.start,
                                        },
                                        actionBar: {
                                            actions: ['accept', 'cancel', 'today', 'clear'],
                                        }
                                    }}
                                    disablePast
                                />
                            </LocalizationProvider>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Max Appointments *"
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
                                            <Group color="action"/>
                                        </InputAdornment>
                                    ),
                                    inputProps: {
                                        min: 1
                                    }
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                select
                                label="Organization *"
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
                        {loading ? <CircularProgress size={24}/> : 'Create Session'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar Alert */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({...snackbar, open: false})}
                anchorOrigin={{vertical: "bottom", horizontal: "right"}}
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
    );
};

// Helper component for session details
const DetailItem = ({icon, label, value}) => (
    <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 32,
            height: 32,
            borderRadius: '8px',
            bgcolor: 'action.hover'
        }}>
            {React.cloneElement(icon, {fontSize: 'small', color: 'action'})}
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

export default SessionManagementComponent;