import React from "react";
import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useState } from "react";

const Navbar = () => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
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

                {/* Navigation Buttons */}
                {/*<Button color="inherit">Home</Button>*/}
                {/*<Button color="inherit">Services</Button>*/}
                {/*<Button color="inherit">Bookings</Button>*/}
                {/*<Button color="inherit">Store</Button>*/}

                {/* Notifications Icon */}
                <IconButton color="inherit" aria-label="notifications">
                    <NotificationsIcon />
                </IconButton>

                {/* Account Menu */}
                <IconButton
                    color="inherit"
                    aria-label="account"
                    onClick={handleMenuClick}
                >
                    <AccountCircleIcon />
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                >
                    <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
                    <MenuItem onClick={handleMenuClose}>Dashboard</MenuItem>
                    <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
