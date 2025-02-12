import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
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
    Typography
} from "@mui/material";
import {CheckCircle, Cancel, Delete} from "@mui/icons-material";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import GroupIcon from '@mui/icons-material/Group';
import DateRangeIcon from '@mui/icons-material/DateRange';

import {activateSchedule, cancelSchedule, deleteSchedule, fetchScheduleById} from "../../redux/scheduleSlice";
import { parseRRuleManually } from "../../utils/utilFunctions";
import { statusColors } from "../../utils/colors";
import CancelIcon from "@mui/icons-material/Cancel";
import DoneIcon from "@mui/icons-material/Done";

const ScheduleView = () => {
    const {id} = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {schedule, status, error} = useSelector((state) => state.schedule);

    const [confirmDialog, setConfirmDialog] = useState({
        open: false,
        action: null,
    });

    const [snackbar, setSnackbar] = useState({open: false, message: "", severity: "info"});

    useEffect(() => {
        dispatch(fetchScheduleById(id));
    }, [dispatch, id]);

    if (status === "loading") {
        return <CircularProgress sx={{display: "block", margin: "20px auto"}}/>;
    }

    if (error) {
        return <Typography color="error" textAlign="center">{error}</Typography>;
    }

    if (!schedule) {
        return <Typography textAlign="center">Schedule not found</Typography>;
    }

    const handleActionConfirm = (action) => {
        setConfirmDialog({open: true, action});
    };

    const executeAction = () => {
        setConfirmDialog({open: false});

        let actionPromise;
        let actionText = "";

        if (confirmDialog.action === "activate") {
            actionPromise = dispatch(activateSchedule(schedule.id));
            actionText = "Schedule activated!";
        } else if (confirmDialog.action === "cancel") {
            actionPromise = dispatch(cancelSchedule(schedule.id));
            actionText = "Schedule canceled!";
        } else if (confirmDialog.action === "delete") {
            actionPromise = dispatch(deleteSchedule(schedule.id));
            actionText = "Schedule deleted!";
        }

        if (actionPromise) {
            actionPromise.then(() => {
                setSnackbar({open: true, message: actionText, severity: "success"});
            });
        }
    };

    const parsedRule = parseRRuleManually(schedule.recurringRule);
    const {border, text} = statusColors[schedule.status] || statusColors.draft;

    return (
        <Box sx={{padding: 3}}>
            {/* schedule Details Card */}
            <Card
                sx={{
                    padding: 3,
                    marginBottom: 3,
                    borderRadius: 2,
                    boxShadow: 3,
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    minHeight: 220,
                }}
            >
                {/* Status Chip */}
                <Chip
                    label={schedule.status}
                    variant="outlined"
                    sx={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        fontWeight: "bold",
                        borderRadius: 16,
                        borderColor: border,
                        color: text,
                        padding: "6px 12px",
                        fontSize: "1rem",
                    }}
                />

                <CardContent sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
                    {/* Title */}
                    <Typography variant="h6" color="primary" sx={{ mb: 2, textAlign: "center" }}>
                        Schedule Details
                    </Typography>
                    <Divider sx={{ mb: 2 }} />

                    {/* Two-column layout */}
                    <Box sx={{ display: "flex", gap: 2 }}>
                        {/* Left Column: Schedule Information */}
                        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 1 }}>
                            <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <CalendarMonthIcon sx={{ color: "#1976d2" }} /> <b>Days:</b> {parsedRule.days}
                            </Typography>
                            <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <DateRangeIcon sx={{ color: "#2e7d32" }} /> <b>From:</b> {parsedRule.startDate}
                            </Typography>
                            <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <DateRangeIcon sx={{ color: "#d32f2f" }} /> <b>To:</b> {parsedRule.endDate}
                            </Typography>
                            <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <AccessTimeIcon sx={{ color: "#f57c00" }} /> <b>Start Time:</b> {parsedRule.startTime}
                            </Typography>
                            <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <GroupIcon sx={{ color: "#6a1b9a" }} /> <b>Max Allowed:</b> {schedule.maxAllowed}
                            </Typography>
                        </Box>

                        {/* Right Column: Description Box & Action Buttons */}
                        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                            {/* Description Box */}
                            <Box sx={{ backgroundColor: "#e3f2fd", padding: 2, borderRadius: 2 }}>
                                <Typography variant="body2" sx={{ color: "#1565c0" }}>
                                    {schedule.status === "draft" && "This schedule is currently in draft mode. Mark it as 'Activate' to start generating sessions as per the defined schedule."}
                                    {schedule.status === "active" && "This schedule is active, and sessions are being generated automatically. Mark it as 'Cancel' to stop generating sessions."}
                                    {schedule.status === "cancelled" && "This schedule has been cancelled and will no longer generate new sessions. Create a new schedule to resume session generation."}
                                </Typography>
                            </Box>

                            {/* Action Buttons */}
                            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
                                {schedule.status === "draft" && (
                                    <>
                                        <Button
                                            startIcon={<CheckCircle/>}
                                            onClick={() => handleActionConfirm("activate")}
                                            sx={{
                                                backgroundColor: "rgba(67,160,71,0.75)",
                                                color: "#fff",
                                                borderRadius: 1,
                                                fontWeight: "bold",
                                                boxShadow: 1,
                                                "&:hover": {
                                                    backgroundColor: "#43a047",
                                                },
                                            }}
                                        >
                                            Attend
                                        </Button>
                                        <Button
                                            startIcon={<Delete/>}
                                            onClick={() => handleActionConfirm("delete")}
                                            sx={{
                                                backgroundColor: "rgba(211,47,47,0.72)",
                                                color: "#fff",
                                                borderRadius: 1,
                                                fontWeight: "bold",
                                                boxShadow: 1,
                                                "&:hover": {
                                                    backgroundColor: "#d32f2f",
                                                },
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                    </>
                                )}

                                {schedule.status === "active" && (
                                    <Button
                                        startIcon={<CancelIcon/>}
                                        onClick={() => handleActionConfirm("cancel")}
                                        sx={{
                                            backgroundColor: "rgba(211,47,47,0.72)",
                                            color: "#fff",
                                            borderRadius: 1,
                                            fontWeight: "bold",
                                            boxShadow: 1,
                                            "&:hover": {
                                                backgroundColor: "#d32f2f",
                                            },
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                )}
                            </Box>
                        </Box>
                    </Box>
                </CardContent>
            </Card>


            {/* Confirmation Dialog */}
            <Dialog open={confirmDialog.open} onClose={() => setConfirmDialog({open: false, action: null})}>
                <DialogTitle>Confirm Action</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to {confirmDialog.action} this schedule ?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDialog({open: false, action: null})}>Cancel</Button>
                    <Button variant="contained" onClick={executeAction} color="primary">
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
    );
};

export default ScheduleView;
