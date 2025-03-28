import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import rrulePlugin from "@fullcalendar/rrule";
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
    Snackbar,
    Typography,
    useTheme,
    Avatar,
    Paper,
    Stack,
    Grid
} from "@mui/material";
import {
    CheckCircle,
    Delete,
    CalendarMonth,
    AccessTime,
    Group,
    DateRange,
    Cancel
} from "@mui/icons-material";
import { activateSchedule, cancelSchedule, deleteSchedule, fetchScheduleById } from "../../redux/scheduleSlice";
import { parseRecurrenceRule, parseRRuleManually } from "../../utils/utilFunctions";
import { statusColors } from "../../utils/colors";

const ScheduleView = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const theme = useTheme();
    const { schedule, status, error } = useSelector((state) => state.schedule);

    const [confirmDialog, setConfirmDialog] = useState({
        open: false,
        action: null,
    });

    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

    useEffect(() => {
        dispatch(fetchScheduleById(id));
    }, [dispatch, id]);

    const handleActionConfirm = (action) => {
        setConfirmDialog({ open: true, action });
    };

    const executeAction = () => {
        setConfirmDialog({ open: false });
        let actionPromise;
        let actionText = "";

        switch (confirmDialog.action) {
            case "activate":
                actionPromise = dispatch(activateSchedule(schedule.id));
                actionText = "Schedule activated!";
                break;
            case "cancel":
                actionPromise = dispatch(cancelSchedule(schedule.id));
                actionText = "Schedule canceled!";
                break;
            case "delete":
                actionPromise = dispatch(deleteSchedule(schedule.id));
                actionText = "Schedule deleted!";
                break;
            default:
                break;
        }

        actionPromise?.then(() => {
            setSnackbar({ open: true, message: actionText, severity: "success" });
        });
    };

    if (status === "loading") {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', pt: 4 }}>
                <CircularProgress size={60} />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ m: 3 }}>
                {error}
            </Alert>
        );
    }

    if (!schedule) {
        return (
            <Typography textAlign="center" sx={{ mt: 3 }}>
                Schedule not found
            </Typography>
        );
    }

    const parsedRule = parseRRuleManually(schedule.recurringRule);
    const events = [parseRecurrenceRule(schedule.recurringRule, schedule.status)];
    const { border, text, background } = statusColors[schedule.status] || statusColors.draft;

    const getStatusDescription = () => {
        switch (schedule.status) {
            case "draft":
                return "This schedule is currently in draft mode. Mark it as 'Activate' to start generating sessions as per the defined schedule.";
            case "active":
                return "This schedule is active, and sessions are being generated automatically. Mark it as 'Cancel' to stop generating sessions.";
            case "cancelled":
                return "This schedule has been cancelled and will no longer generate new sessions. Create a new schedule to resume session generation.";
            default:
                return "";
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            {/* Main Schedule Card */}
            <Card sx={{
                p: 3,
                mb: 3,
                borderRadius: '12px',
                boxShadow: theme.shadows[2]
            }}>
                {/* Header with Status */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3
                }}>
                    <Typography variant="h5" fontWeight="600">
                        Schedule Details
                    </Typography>
                    <Chip
                        label={schedule.status}
                        sx={{
                            fontWeight: 600,
                            borderRadius: '8px',
                            backgroundColor: background,
                            color: text,
                            border: `1px solid ${border}`,
                            px: 1.5,
                            py: 0.5
                        }}
                    />
                </Box>

                <Divider sx={{ mb: 3 }} />

                {/* Schedule Details */}
                <Grid container spacing={3}>
                    {/* Left Column - Schedule Info */}
                    <Grid item xs={12} md={6}>
                        <Stack spacing={2}>
                            <DetailItem
                                icon={<CalendarMonth color="primary" />}
                                label="Recurring Days"
                                value={parsedRule.days}
                            />
                            <DetailItem
                                icon={<DateRange color="success" />}
                                label="Start Date"
                                value={parsedRule.startDate}
                            />
                            <DetailItem
                                icon={<DateRange color="error" />}
                                label="End Date"
                                value={parsedRule.endDate}
                            />
                            <DetailItem
                                icon={<AccessTime color="warning" />}
                                label="Start Time"
                                value={parsedRule.startTime}
                            />
                            <DetailItem
                                icon={<Group color="secondary" />}
                                label="Max Appointments"
                                value={schedule.maxAllowed}
                            />
                        </Stack>
                    </Grid>

                    {/* Right Column - Description and Actions */}
                    <Grid item xs={12} md={6}>
                        <Paper sx={{
                            p: 2,
                            mb: 3,
                            backgroundColor: theme.palette.primary.light,
                            color: theme.palette.primary.contrastText,
                            borderRadius: '8px'
                        }}>
                            <Typography variant="body2">
                                {getStatusDescription()}
                            </Typography>
                        </Paper>

                        {/* Action Buttons */}
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: 2,
                            flexWrap: 'wrap'
                        }}>
                            {schedule.status === "draft" && (
                                <>
                                    <Button
                                        startIcon={<CheckCircle />}
                                        onClick={() => handleActionConfirm("activate")}
                                        variant="contained"
                                        color="success"
                                        sx={{
                                            borderRadius: '8px',
                                            textTransform: 'none',
                                            fontWeight: 500
                                        }}
                                    >
                                        Activate
                                    </Button>
                                    <Button
                                        startIcon={<Delete />}
                                        onClick={() => handleActionConfirm("delete")}
                                        variant="contained"
                                        color="error"
                                        sx={{
                                            borderRadius: '8px',
                                            textTransform: 'none',
                                            fontWeight: 500
                                        }}
                                    >
                                        Delete
                                    </Button>
                                </>
                            )}

                            {schedule.status === "active" && (
                                <Button
                                    startIcon={<Cancel />}
                                    onClick={() => handleActionConfirm("cancel")}
                                    variant="contained"
                                    color="error"
                                    sx={{
                                        borderRadius: '8px',
                                        textTransform: 'none',
                                        fontWeight: 500
                                    }}
                                >
                                    Cancel Schedule
                                </Button>
                            )}
                        </Box>
                    </Grid>
                </Grid>

                {/* Calendar Section */}
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Session Calendar
                    </Typography>
                    <Divider sx={{ mb: 3 }} />
                    <Paper sx={{ p: 2, borderRadius: '8px' }}>
                        <FullCalendar
                            plugins={[dayGridPlugin, rrulePlugin]}
                            initialView="dayGridMonth"
                            events={events}
                            height="auto"
                        />
                    </Paper>
                </Box>
            </Card>

            {/* Confirmation Dialog */}
            <Dialog
                open={confirmDialog.open}
                onClose={() => setConfirmDialog({ open: false, action: null })}
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
                        Are you sure you want to {confirmDialog.action} this schedule?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setConfirmDialog({ open: false, action: null })}
                        sx={{
                            borderRadius: '8px',
                            textTransform: 'none'
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={executeAction}
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
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
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

// Reusable Detail Item Component
const DetailItem = ({ icon, label, value }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar sx={{
            bgcolor: 'action.hover',
            color: 'inherit',
            width: 40,
            height: 40
        }}>
            {icon}
        </Avatar>
        <Box>
            <Typography variant="body2" color="text.secondary">
                {label}
            </Typography>
            <Typography variant="body1" fontWeight="500">
                {value}
            </Typography>
        </Box>
    </Box>
);

export default ScheduleView;