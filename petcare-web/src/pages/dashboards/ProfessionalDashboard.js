import React, { useCallback, useEffect, useState } from "react";
import {
    Box,
    Button,
    CircularProgress,
    Divider,
    Typography,
    Card,
    Avatar,
    Chip,
    useTheme
} from "@mui/material";
import { Event, CalendarToday, Pets, MedicalServices, Schedule } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import rrulePlugin from "@fullcalendar/rrule";
import { useDispatch, useSelector } from "react-redux";
import { fetchSessions } from "../../redux/sessionSlice";
import { convertSessionsToEvents } from "../../utils/utilFunctions";

const ProfessionalDashboard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const theme = useTheme();
    const [userName, setUserName] = useState("");

    const { sessions, status, error } = useSelector((state) => state.session);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user?.name) {
            setUserName(user.name);
        }
    }, []);

    const fetchSessionsByDate = useCallback(() => {
        dispatch(fetchSessions({}));
    }, [dispatch]);

    useEffect(() => {
        fetchSessionsByDate();
    }, [fetchSessionsByDate]);

    const events = convertSessionsToEvents(sessions);

    const today = new Date();
    const todayStart = new Date(today.setHours(0, 0, 0, 0)).getTime();
    const todayEnd = new Date(today.setHours(23, 59, 59, 999)).getTime();

    const todaysSessions = sessions.filter(session => {
        const sessionTime = session.start;
        return sessionTime >= todayStart && sessionTime <= todayEnd;
    }).length;

    return (
        <Box sx={{ p: 3 }}>
            {/* Header Section */}
            <Card sx={{
                p: 3,
                mb: 3,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                color: 'white',
                borderRadius: '12px',
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{
                        width: 60,
                        height: 60,
                        bgcolor: 'white',
                        color: theme.palette.primary.main
                    }}>
                        <MedicalServices fontSize="large" />
                    </Avatar>
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 700 }}>
                            Welcome back, {userName || 'Professional'}!
                        </Typography>
                        <Typography variant="body1" sx={{ opacity: 0.9 }}>
                            Here's what's happening with your pet care services
                        </Typography>
                    </Box>
                </Box>
            </Card>

            {/* Stats Cards */}
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
                gap: 3,
                mb: 3
            }}>
                <StatCard
                    icon={<Event fontSize="large" />}
                    value={sessions.length}
                    label="Total Sessions"
                    color={theme.palette.primary.main}
                />
                <StatCard
                    icon={<CalendarToday fontSize="large" />}
                    value={todaysSessions}
                    label="Today's Sessions"
                    color={theme.palette.secondary.main}
                />
                <StatCard
                    icon={<Pets fontSize="large" />}
                    value="12"
                    label="Active Clients"
                    color={theme.palette.success.main}
                />
                <StatCard
                    icon={<Schedule fontSize="large" />}
                    value="4.9"
                    label="Average Rating"
                    color={theme.palette.warning.main}
                />
            </Box>

            {/* Action Buttons */}
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: 2,
                flexWrap: 'wrap',
                mb: 3
            }}>
                <DashboardButton
                    icon={<Event />}
                    text="View Appointments"
                    onClick={() => navigate("/dashboard/appointments")}
                    color={theme.palette.primary.main}
                />
                <DashboardButton
                    icon={<Schedule />}
                    text="Manage Schedules"
                    onClick={() => navigate("/dashboard/schedules")}
                    color={theme.palette.secondary.main}
                />
                <DashboardButton
                    icon={<Pets />}
                    text="Client Management"
                    onClick={() => navigate("/dashboard/clients")}
                    color={theme.palette.success.main}
                />
            </Box>

            {/* Calendar Section */}
            <Card sx={{
                p: 3,
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                minHeight: '600px'
            }}>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2
                }}>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        <CalendarToday sx={{ verticalAlign: 'middle', mr: 1 }} />
                        Schedule Calendar
                    </Typography>
                    <Chip
                        label="Live View"
                        color="success"
                        variant="outlined"
                        icon={<Box sx={{
                            width: 8,
                            height: 8,
                            bgcolor: 'success.main',
                            borderRadius: '50%'
                        }} />}
                    />
                </Box>
                <Divider sx={{ mb: 3 }} />

                {status === "loading" ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', pt: 10 }}>
                        <CircularProgress size={60} />
                    </Box>
                ) : error ? (
                    <Typography color="error" textAlign="center">{error}</Typography>
                ) : (
                    <FullCalendar
                        plugins={[dayGridPlugin, rrulePlugin]}
                        initialView="dayGridMonth"
                        events={events}
                        selectable={true}
                        height="auto"
                        headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: 'dayGridMonth,dayGridWeek'
                        }}
                        eventColor={theme.palette.primary.main}
                    />
                )}
            </Card>
        </Box>
    );
};

// Reusable Stat Card Component
const StatCard = ({ icon, value, label, color }) => (
    <Card sx={{
        p: 2,
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        boxShadow: '0 4px 8px rgba(0,0,0,0.05)'
    }}>
        <Avatar sx={{
            bgcolor: `${color}20`,
            color: color,
            width: 56,
            height: 56
        }}>
            {icon}
        </Avatar>
        <Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>{value}</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>{label}</Typography>
        </Box>
    </Card>
);

// Reusable Dashboard Button Component
const DashboardButton = ({ icon, text, onClick, color }) => (
    <Button
        variant="contained"
        startIcon={icon}
        onClick={onClick}
        sx={{
            minWidth: 200,
            py: 1.5,
            borderRadius: '12px',
            textTransform: 'none',
            fontWeight: 500,
            background: color,
            '&:hover': {
                background: color,
                boxShadow: `0 4px 12px ${color}40`
            }
        }}
    >
        {text}
    </Button>
);

export default ProfessionalDashboard;