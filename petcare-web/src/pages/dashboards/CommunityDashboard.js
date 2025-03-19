import React from "react";
import { Typography, Box, Button } from "@mui/material";
import ForumIcon from "@mui/icons-material/Forum";

const CommunityDashboard = () => {
    return (
        <Box sx={{ textAlign: "center", padding: 3 }}>
            <ForumIcon sx={{ fontSize: 60, color: "#1976d2" }} />
            <Typography variant="h4" sx={{ fontWeight: "bold", mt: 2 }}>
                Welcome, Community Member! 🗣️
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
                Join discussions, share pet tips, and engage with the community.
            </Typography>
            <Button variant="contained" sx={{ mt: 3, backgroundColor: "#1976d2", "&:hover": { backgroundColor: "#115293" } }}>
                Join a Discussion
            </Button>
        </Box>
    );
};

export default CommunityDashboard;