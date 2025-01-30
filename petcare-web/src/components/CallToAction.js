import React from "react";
import { Container, Typography, Button } from "@mui/material";

const CallToAction = () => {
    return (
        <Container sx={{ textAlign: "center", padding: 6, backgroundColor: "#f5f5f5", marginTop: 6 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Ready to Care for Your Pet?
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
                Discover our services or book a session today.
            </Typography>
            <Button variant="contained" color="primary" size="large" sx={{ margin: 2 }} href="/services">
                Explore Services
            </Button>
            <Button variant="outlined" color="primary" size="large" href="/booking">
                Book Now
            </Button>
        </Container>
    );
};

export default CallToAction;
