import React, { useState } from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Menu,
    MenuItem,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Badge,
    Divider,
    Box
} from "@mui/material";
import {
    Menu as MenuIcon,
    Notifications as NotificationsIcon,
    AccountCircle as AccountCircleIcon,
    Pets,
    Event,
    MedicalServices,
    Settings,
    Dashboard,
    AdminPanelSettings,
    Logout,
    Person,
    Home
} from "@mui/icons-material";
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
            { text: "Home", icon: <Home />, route: "/dashboard" },
            { text: "Manage Pets", icon: <Pets />, route: "/dashboard/pets" },
            { text: "Appointments", icon: <Event />, route: "/dashboard/appointments" },
            { text: "Health Records", icon: <MedicalServices />, route: "/dashboard/records" },
            { text: "Settings", icon: <Settings />, route: "/dashboard/settings" },
        ],
        professional: [
            { text: "Home", icon: <Home />, route: "/dashboard" },
            { text: "Manage Appointments", icon: <Event />, route: "/dashboard/appointments" },
            { text: "Client Requests", icon: <Pets />, route: "/dashboard/clients" },
            { text: "Settings", icon: <Settings />, route: "/dashboard/settings" },
        ],
        admin: [
            { text: "Admin Dashboard", icon: <AdminPanelSettings />, route: "/dashboard/admin" },
            { text: "User Management", icon: <Person />, route: "/dashboard/users" },
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
            <AppBar position="sticky" sx={{ bgcolor: "#1976d2" }}>
                <Toolbar>
                    {user && (
                        <IconButton edge="start" color="inherit" onClick={toggleSidebar(true)}>
                            <MenuIcon />
                        </IconButton>
                    )}
                    <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center" }}>
                        {currentTitle}
                    </Typography>

                    {/* Notifications Icon */}
                    {user && (
                        <IconButton color="inherit">
                            <Badge badgeContent={3} color="error">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                    )}

                    {/* Account Menu */}
                    <IconButton color="inherit" onClick={handleMenuClick}>
                        <AccountCircleIcon />
                    </IconButton>
                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                        {user ? (
                            <>
                                <MenuItem disabled>
                                    <Person sx={{ mr: 1, color: "#1976d2" }} />
                                    {user.name}
                                </MenuItem>
                                <MenuItem onClick={() => { navigate("/profile"); handleMenuClose(); }}>
                                    <Person sx={{ mr: 1, color: "#1976d2" }} />
                                    Profile
                                </MenuItem>
                                <MenuItem onClick={() => { navigate("/dashboard"); handleMenuClose(); }}>
                                    <Dashboard sx={{ mr: 1, color: "#1976d2" }} />
                                    Dashboard
                                </MenuItem>
                                <MenuItem onClick={handleLogout}>
                                    <Logout sx={{ mr: 1, color: "red" }} />
                                    Logout
                                </MenuItem>
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
                    <Box sx={{
                        width: 250,
                        backgroundColor: "#f4f4f4",
                        height: "100vh",
                        display: "flex",
                        flexDirection: "column"
                    }}>
                        <Box sx={{
                            p: 3,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: "#1976d2",
                            color: "#fff",
                            fontWeight: "bold",
                            fontSize: "1.2rem",
                            textAlign: "center"
                        }}>
                            {user.name}'s Menu
                        </Box>

                        <Divider />

                        <List>
                            {(sidebarOptions[user.role] || []).map((option) => (
                                <ListItem
                                    button
                                    key={option.text}
                                    onClick={() => { navigate(option.route); toggleSidebar(false)(); }}
                                    sx={{
                                        "&:hover": { bgcolor: "#e3f2fd" },
                                        borderRadius: "10px",
                                        mx: 1,
                                        mt: 1
                                    }}
                                >
                                    <ListItemIcon sx={{ color: "#1976d2" }}>{option.icon}</ListItemIcon>
                                    <ListItemText primary={option.text} />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                </Drawer>
            )}
        </>
    );
};

export default Navbar;
