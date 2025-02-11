import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import PetDetail from './pages/dashboards/PetDetail';
import Layout from "./components/Layout";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import ForgotPassword from "./pages/ForgotPassword";
import ProfileView from "./pages/ProfileView";
import ScheduleManagement from "./pages/dashboards/ScheduleManagement";
import SessionView from "./pages/dashboards/SessionView";

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
                    <Route path="/dashboard/pet/:petId" element={<PetDetail />} />
                    <Route path="/dashboard/schedules" element={<ScheduleManagement />} />
                    <Route path="/dashboard/session/:id" element={<SessionView />} />
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
