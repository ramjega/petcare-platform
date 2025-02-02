import React, { useState } from "react";
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice"; // Import logout action

const Navbar = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth); // Get user from Redux state

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleNavigateToDashboard = () => {
        navigate("/dashboard");
        handleMenuClose();
    };

    const handleLogout = () => {
        dispatch(logout()); // Clears user state & token
        navigate("/"); // Redirect to login
    };

    const handleLogin = () => {
        navigate("/login"); // Redirect to login page
        handleMenuClose();
    };

    const handleSignup = () => {
        navigate("/signup"); // Redirect to login page
        handleMenuClose();
    };

    return (
        <AppBar position="sticky" color="primary">
            <Toolbar>
                <IconButton edge="start" color="inherit" aria-label="menu">
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    PetCare
                </Typography>

                {/* Notifications Icon */}
                <IconButton color="inherit" aria-label="notifications">
                    <NotificationsIcon />
                </IconButton>

                {/* Account Menu */}
                <IconButton color="inherit" aria-label="account" onClick={handleMenuClick}>
                    <AccountCircleIcon />
                </IconButton>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                    {user ? (
                        <>
                            <MenuItem disabled>{user.name}</MenuItem> {/* Show username */}
                            <MenuItem onClick={handleNavigateToDashboard}>Dashboard</MenuItem>
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </>
                    ) : (
                        <>
                            <MenuItem onClick={handleLogin}>Login</MenuItem>
                            <MenuItem onClick={handleSignup}>Signup</MenuItem>
                        </>

                    )}
                </Menu>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
