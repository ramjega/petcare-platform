import React, { useState } from "react";
import {
    Box,
    Typography,
    Tabs,
    Tab,
    Card,
    Paper,
    useTheme,
    styled
} from "@mui/material";
import ScheduleManagementComponent from "./ScheduleManagementComponent";
import SessionManagementComponent from "./SessionManagementComponent";
import { CalendarMonth, EventRepeat } from "@mui/icons-material";

const StyledTab = styled(Tab)(({ theme }) => ({
    textTransform: 'none',
    fontWeight: 500,
    fontSize: '0.875rem',
    minHeight: 48,
    color: theme.palette.text.secondary,
    '&.Mui-selected': {
        color: theme.palette.primary.main,
    },
}));

const ScheduleManagement = () => {
    const [activeTab, setActiveTab] = useState(0);
    const theme = useTheme();

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    return (
        <Box sx={{
            p: 3,
            minHeight: '100vh',
            background: theme.palette.mode === 'light'
                ? 'linear-gradient(180deg, #f5f7fa 0%, #eef2f5 100%)'
                : theme.palette.background.default
        }}>
            <Card sx={{
                mb: 3,
                p: 3,
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                background: theme.palette.mode === 'light'
                    ? 'white'
                    : theme.palette.background.paper
            }}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 2,
                    gap: 2
                }}>
                    {activeTab === 0 ? (
                        <CalendarMonth sx={{
                            fontSize: 40,
                            color: theme.palette.primary.main
                        }} />
                    ) : (
                        <EventRepeat sx={{
                            fontSize: 40,
                            color: theme.palette.primary.main
                        }} />
                    )}
                    <Typography
                        variant="h4"
                        fontWeight="600"
                        sx={{
                            color: theme.palette.text.primary,
                            background: theme.palette.mode === 'light'
                                ? 'linear-gradient(90deg, #1976d2 0%, #2196f3 100%)'
                                : 'none',
                            backgroundClip: theme.palette.mode === 'light' ? 'text' : 'none',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: theme.palette.mode === 'light' ? 'transparent' : 'inherit'
                        }}
                    >
                        {activeTab === 0 ? "Session Management" : "Schedule Management"}
                    </Typography>
                </Box>

                <Paper sx={{
                    mb: 3,
                    borderRadius: '8px',
                    background: theme.palette.mode === 'light'
                        ? '#f8fafc'
                        : theme.palette.background.paper
                }}>
                    <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        variant="fullWidth"
                        sx={{
                            '& .MuiTabs-indicator': {
                                height: 3,
                                backgroundColor: theme.palette.primary.main,
                            }
                        }}
                    >
                        <StyledTab
                            label={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <CalendarMonth fontSize="small" />
                                    Sessions
                                </Box>
                            }
                        />
                        <StyledTab
                            label={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <EventRepeat fontSize="small" />
                                    Schedules
                                </Box>
                            }
                        />
                    </Tabs>
                </Paper>

                <Box sx={{
                    mt: 3,
                    borderRadius: '12px',
                    overflow: 'hidden'
                }}>
                    {activeTab === 0 ? (
                        <SessionManagementComponent />
                    ) : (
                        <ScheduleManagementComponent />
                    )}
                </Box>
            </Card>
        </Box>
    );
};

export default ScheduleManagement;