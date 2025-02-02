import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import PetOwnerDashboard from "./dashboards/PetOwnerDashboard";
import ProfessionalDashboard from "./dashboards/ProfessionalDashboard";
import CommunityDashboard from "./dashboards/CommunityDashboard";
import AdminDashboard from "./dashboards/AdminDashboard"; // New Admin Dashboard

const Dashboard = () => {
    const { user } = useSelector((state) => state.auth);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    switch (user.role) {
        case "pet_owner":
            return <PetOwnerDashboard />;
        case "professional":
            return <ProfessionalDashboard />;
        case "community":
            return <CommunityDashboard />;
        case "admin":
            return <AdminDashboard />;
        default:
            return <Navigate to="/login" replace />;
    }
};

export default Dashboard;
