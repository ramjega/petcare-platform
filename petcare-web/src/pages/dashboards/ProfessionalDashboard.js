import React from "react";
import { Typography, Box, Button } from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import { useNavigate } from "react-router-dom";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import rrulePlugin from "@fullcalendar/rrule"

const ProfessionalDashboard = () => {
    const navigate = useNavigate();

    const events = [
        {
            title: "Session",
            rrule: {
                freq: "weekly", // Repeat weekly
                interval: 1,    // Every 1 week
                byweekday: ["mo", "we", "fr"], // Mondays, Wednesdays, Fridays
                dtstart: "2025-02-01T10:00:00", // Start date and time
                until: "2025-05-31T23:59:00" // Recurrence end date
            }
        }
    ];


    return (
        <Box sx={{ textAlign: "center", padding: 3 }}>
            <EventIcon sx={{ fontSize: 60, color: "#1976d2" }} />
            <Typography variant="h4" sx={{ fontWeight: "bold", mt: 2 }}>
                Welcome, Pet Professional! 🏥
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
                Manage your schedules, services, and appointments.
            </Typography>

            {/* View Appointments Button */}
            <Button
                variant="contained"
                sx={{
                    mt: 3,
                    backgroundColor: "#1976d2",
                    "&:hover": { backgroundColor: "#115293" }
                }}
                onClick={() => navigate("/dashboard/appointments")}
            >
                View Appointments
            </Button>

            {/* Manage Schedules Button */}
            <Button
                variant="contained"
                sx={{
                    mt: 2,
                    ml: 2,
                    backgroundColor: "#4caf50",
                    "&:hover": { backgroundColor: "#388e3c" }
                }}
                onClick={() => navigate("/dashboard/schedules")}
            >
                Manage Schedules
            </Button>

            <FullCalendar
                plugins={[dayGridPlugin, rrulePlugin]}
                initialView="dayGridMonth"
                events={events}
            />

        </Box>
    );
};

export default ProfessionalDashboard;
