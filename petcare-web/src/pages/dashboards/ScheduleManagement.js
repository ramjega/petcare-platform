import React, { useState, useEffect } from "react";
import { Box, Typography, Tabs, Tab, CircularProgress, Grid } from "@mui/material";
import ScheduleManagementComponent from "./ScheduleManagementComponent";
import SessionManagementComponent from "./SessionManagementComponent";

const ScheduleManagement = () => {
    const [activeTab, setActiveTab] = useState(0);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    return (
        <Box sx={{ padding: 3, backgroundColor: "#f4f6f9", minHeight: "100vh" }}>
            <Typography variant="h4" fontWeight="bold" textAlign="center" mb={3} sx={{ color: "#1976d2" }}>
                📅 {activeTab === 0 ? "Session" : "Schedule"} Management
            </Typography>

            <Tabs value={activeTab} onChange={handleTabChange} centered sx={{ mb: 3 }}>
                <Tab label="Sessions" />
                <Tab label="Schedules" />
            </Tabs>

            <Grid container spacing={2} justifyContent="center">
                {activeTab === 0 ? (
                    <SessionManagementComponent/>
                ) : (
                    <ScheduleManagementComponent/>
                )}
            </Grid>
        </Box>
    );
};

export default ScheduleManagement;
