import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import PetView from './pages/dashboards/PetView';
import Layout from "./components/Layout";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import ForgotPassword from "./pages/ForgotPassword";
import ProfileView from "./pages/ProfileView";
import ScheduleManagement from "./pages/dashboards/ScheduleManagement";
import ScheduleView from "./pages/dashboards/ScheduleView";
import SessionView from "./pages/dashboards/SessionView";
import AppointmentView from "./pages/dashboards/AppointmentView";

function App() {
    return (
        <Router>
            <Navbar />
            <Layout>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage/>} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/signup" element={<SignupPage/>} />
                    <Route path="/profile" element={<ProfileView/>} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/dashboard/*" element={<Dashboard />} />
                    <Route path="/dashboard/pet/:petId" element={<PetView />} />
                    <Route path="/dashboard/schedules" element={<ScheduleManagement />} />
                    <Route path="/dashboard/session/:id" element={<SessionView />} />
                    <Route path="/dashboard/schedule/:id" element={<ScheduleView />} />
                    <Route path="/appointment/:id" element={<AppointmentView />} />
                </Routes>
            </Layout>
        </Router>
        // <Routes>
        //     <Route path="/" element={<Header />} />
        //     <Route path="/login" element={<Login />} />
        //     <Route path="/dashboard" element={<Dashboard />} />
        //     {/* Add more routes as needed */}
        // </Routes>
    );
}
export default App;
