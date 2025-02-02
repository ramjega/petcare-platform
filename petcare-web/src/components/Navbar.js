import React, { useState } from "react";
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Drawer, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { Menu as MenuIcon, Notifications as NotificationsIcon, AccountCircle as AccountCircleIcon, Pets, Event, MedicalServices, Settings, Dashboard } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice"; // Import logout action

const Navbar = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth); // Get user from Redux state

    // Sidebar options based on user role
    const sidebarOptions = {
        pet_owner: [
            { text: "Dashboard", icon: <Dashboard />, route: "/dashboard" },
            { text: "Manage Pets", icon: <Pets />, route: "/dashboard/pets" },
            { text: "Appointments", icon: <Event />, route: "/dashboard/appointments" },
            { text: "Health Records", icon: <MedicalServices />, route: "/dashboard/records" },
            { text: "Settings", icon: <Settings />, route: "/dashboard/settings" },
        ],
        professional: [
            { text: "Dashboard", icon: <Dashboard />, route: "/dashboard" },
            { text: "Manage Appointments", icon: <Event />, route: "/dashboard/appointments" },
            { text: "Client Requests", icon: <Pets />, route: "/dashboard/clients" },
            { text: "Settings", icon: <Settings />, route: "/dashboard/settings" },
        ],
        admin: [
            { text: "Admin Dashboard", icon: <Dashboard />, route: "/dashboard/admin" },
            { text: "User Management", icon: <Pets />, route: "/dashboard/users" },
            { text: "System Settings", icon: <Settings />, route: "/dashboard/settings" },
        ],
    };

    // Determine Navbar Title based on Page
    const pageTitles = {
        "/dashboard": "Dashboard",
        "/dashboard/pets": "Manage Pets",
        "/dashboard/appointments": "Appointments",
        "/dashboard/records": "Health Records",
        "/dashboard/settings": "Settings",
        "/dashboard/clients": "Client Requests",
        "/dashboard/admin": "Admin Dashboard",
        "/dashboard/users": "User Management",
    };

    const currentTitle = pageTitles[location.pathname] || "PetCare";

    // Handle Sidebar Toggle
    const toggleSidebar = (open) => () => {
        setSidebarOpen(open);
    };

    // Handle Account Menu
    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        dispatch(logout()); // Clears user state & token
        navigate("/"); // Redirect to login
    };

    return (
        <>
            {/* Navbar */}
            <AppBar position="sticky" color="primary">
                <Toolbar>
                    {user && (
                        <IconButton edge="start" color="inherit" onClick={toggleSidebar(true)}>
                            <MenuIcon />
                        </IconButton>
                    )}
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        {currentTitle}
                    </Typography>

                    {/* Notifications Icon */}
                    {user && (
                        <IconButton color="inherit">
                            <NotificationsIcon />
                        </IconButton>
                    )}

                    {/* Account Menu */}
                    <IconButton color="inherit" onClick={handleMenuClick}>
                        <AccountCircleIcon />
                    </IconButton>
                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                        {user ? (
                            <>
                                <MenuItem disabled>{user.name}</MenuItem> {/* Show username */}
                                <MenuItem onClick={() => navigate("/dashboard")}>Dashboard</MenuItem>
                                <MenuItem onClick={handleLogout}>Logout</MenuItem>
                            </>
                        ) : (
                            <>
                                <MenuItem onClick={() => navigate("/login")}>Login</MenuItem>
                                <MenuItem onClick={() => navigate("/signup")}>Signup</MenuItem>
                            </>
                        )}
                    </Menu>
                </Toolbar>
            </AppBar>

            {/* Sidebar Drawer */}
            {user && (
                <Drawer anchor="left" open={sidebarOpen} onClose={toggleSidebar(false)}>
                    <List sx={{ width: 250 }}>
                        {(sidebarOptions[user.role] || []).map((option) => (
                            <ListItem button key={option.text} onClick={() => navigate(option.route)}>
                                <ListItemIcon>{option.icon}</ListItemIcon>
                                <ListItemText primary={option.text} />
                            </ListItem>
                        ))}
                    </List>
                </Drawer>
            )}
        </>
    );
};

export default Navbar;
