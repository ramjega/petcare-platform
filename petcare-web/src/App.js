import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import Header from './components/Header';
import Layout from "./components/Layout";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import ForgotPassword from "./pages/ForgotPassword";

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
