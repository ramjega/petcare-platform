import React from "react";
import { Box } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import DashboardHome from "./DashboardHome";
import ManagePets from "./ManagePets";
import Appointments from "./Appointments";
import HealthRecords from "./HealthRecords";
import BottomNav from "./BottomNav"; // Import Bottom Navigation

const PetOwnerDashboard = () => {
    return (
        <Box sx={{ flexGrow: 1, padding: 3 }}>
            <Routes>
                <Route path="/" element={<DashboardHome />} />
                <Route path="/pets" element={<ManagePets />} />
                <Route path="/appointments" element={<Appointments />} />
                <Route path="/records" element={<HealthRecords />} />
            </Routes>

            {/* Bottom Navigation for Mobile */}
            <BottomNav />
        </Box>
    );
};

export default PetOwnerDashboard;
