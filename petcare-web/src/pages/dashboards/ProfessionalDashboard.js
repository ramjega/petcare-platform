import React, {useCallback, useEffect, useState} from "react";
import {Box, Button, CircularProgress, Divider, Typography} from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import {useNavigate} from "react-router-dom";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import rrulePlugin from "@fullcalendar/rrule"

import {useDispatch, useSelector} from "react-redux";
import {fetchSessions} from "../../redux/sessionSlice";
import {convertSessionsToEvents} from "../../utils/utilFunctions";

const ProfessionalDashboard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {sessions, status, error} = useSelector((state) => state.session);

    const fetchSessionsByDate = useCallback(() => {
        dispatch(fetchSessions({}));
    }, [dispatch]);

    useEffect(() => {
        fetchSessionsByDate();
    }, [fetchSessionsByDate]);

    const events = convertSessionsToEvents(sessions);

    return (
        <Box sx={{textAlign: "center", padding: 3}}>
            {/* Header Section */}
            <EventIcon sx={{fontSize: 60, color: "#1976d2"}}/>
            <Typography variant="h4" sx={{fontWeight: "bold", mt: 2}}>
                Welcome, Pet Professional! 🏥
            </Typography>
            <Typography variant="body1" sx={{mt: 2}}>
                Manage your schedules, services, and appointments.
            </Typography>

            {/* Action Buttons */}
            <Box sx={{mt: 3, display: "flex", justifyContent: "center", gap: 2, flexWrap: "wrap"}}>
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: "#1976d2",
                        "&:hover": {backgroundColor: "#115293"},
                    }}
                    onClick={() => navigate("/dashboard/appointments")}
                >
                    View Appointments
                </Button>

                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: "#4caf50",
                        "&:hover": {backgroundColor: "#388e3c"},
                    }}
                    onClick={() => navigate("/dashboard/schedules")}
                >
                    Manage Schedules
                </Button>
            </Box>

            {/* FullCalendar Section */}
            <Box
                sx={{
                    mt: 4,
                    padding: 3,
                    borderRadius: 2,
                    boxShadow: 1,
                    backgroundColor: "#fff",
                    minHeight: "600px",
                    width: "100%",
                }}
            >
                {status === "loading" ? (
                    <CircularProgress sx={{display: "block", margin: "20px auto"}}/>
                ) : error ? (
                    <Typography color="error" textAlign="center">{error}</Typography>
                ) : (
                    <>
                        <Typography variant="h6" color="primary" sx={{mb: 2, textAlign: "left"}}>
                            📅 Schedule Calendar
                        </Typography>
                        <Divider sx={{mb: 2}}/>

                        <FullCalendar
                            plugins={[dayGridPlugin, rrulePlugin]}
                            initialView="dayGridMonth"
                            events={events}
                            selectable={true}
                            height="auto"
                        />
                    </>
                )
                }

            < /Box>
        </Box>

    );
};

export default ProfessionalDashboard;
