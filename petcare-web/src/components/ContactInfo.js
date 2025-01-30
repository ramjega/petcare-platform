import React from "react";
import { Container, Typography, Grid } from "@mui/material";

const ContactInfo = () => {
    return (
        <Container sx={{ padding: 6, marginTop: 6, backgroundColor: "#f5f5f5" }}>
            <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom>
                Contact Us
            </Typography>
            <Typography variant="body1" color="text.secondary" textAlign="center" gutterBottom>
                Have questions? Reach out to us anytime!
            </Typography>
            <Grid container spacing={4} sx={{ marginTop: 2 }}>
                <Grid item xs={12} md={6}>
                    <Typography variant="h6" fontWeight="bold">
                        Email
                    </Typography>
                    <Typography variant="body1">support@petcare.com</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="h6" fontWeight="bold">
                        Phone
                    </Typography>
                    <Typography variant="body1">94775228995</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h6" fontWeight="bold">
                        Address
                    </Typography>
                    <Typography variant="body1">
                        Viyaparimoolai, Point Pedro, Jaffna
                    </Typography>
                </Grid>
            </Grid>
        </Container>
    );
};

export default ContactInfo;
