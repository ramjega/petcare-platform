import { BottomNavigation, BottomNavigationAction, Menu, MenuItem } from "@mui/material";
import {Pets, Event, MedicalServices, MoreHoriz, Home} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

const BottomNav = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [anchorEl, setAnchorEl] = useState(null); // State for "More" menu

    const handleMoreClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMoreClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <BottomNavigation
                value={location.pathname} // Set active tab based on current URL
                onChange={(event, newValue) => navigate(newValue)} // Navigate to new page
                sx={{
                    display: { xs: "flex", md: "none" },
                    position: "fixed",
                    bottom: 0,
                    left: 0,  // Ensure it starts from the left edge
                    width: "100%", // Take full width
                    backgroundColor: "#ffffff",
                    boxShadow: "0px -2px 10px rgba(0, 0, 0, 0.1)",
                    padding: 0, // Ensure no extra padding
                    margin: 0, // Ensure no margin
                }}
            >
                <BottomNavigationAction
                    label="Home"
                    value="/dashboard"
                    icon={<Home sx={{ fontSize: 24 }} />}
                    sx={{ minWidth: 0, paddingX: 1 }}
                />
                <BottomNavigationAction
                    label="Pets"
                    value="/dashboard/pets"
                    icon={<Pets sx={{ fontSize: 24 }} />}
                    sx={{ minWidth: 0, paddingX: 1 }}
                />
                <BottomNavigationAction
                    label="Appointments"
                    value="/dashboard/appointments"
                    icon={<Event sx={{ fontSize: 24 }} />}
                    sx={{ minWidth: 0, paddingX: 1 }}
                />
                <BottomNavigationAction
                    label="More"
                    icon={<MoreHoriz sx={{ fontSize: 24 }} />}
                    onClick={handleMoreClick} // Opens More menu
                    sx={{ minWidth: 0, paddingX: 1 }}
                />
            </BottomNavigation>

            {/* More Menu */}
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMoreClose}>
                <MenuItem onClick={() => { navigate("/dashboard/records"); handleMoreClose(); }}>
                    <MedicalServices sx={{ marginRight: 1 }} /> Health Records
                </MenuItem>
            </Menu>
        </>
    );
};

export default BottomNav;
