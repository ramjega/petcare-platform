import React from "react";
import { Container, Typography, Grid, Card, CardContent } from "@mui/material";
import {
    EmojiPeople,
    FitnessCenter,
    Star,
    NotificationsActive,
    Schedule,
    ShoppingCart
} from "@mui/icons-material";

// Individual Feature Card Component
const FeatureCard = ({ icon: Icon, title, description }) => (
    <Card
        sx={{
            textAlign: "center",
            padding: 2,
            "&:hover": { boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)" },
        }}
    >
        <Icon fontSize="large" sx={{ color: "#1976d2" }} />
        <CardContent>
            <Typography variant="h6" fontWeight="bold">
                {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                {description}
            </Typography>
        </CardContent>
    </Card>
);

// Main Features Section Component
const FeaturesSection = () => {
    const features = [
        {
            icon: EmojiPeople,
            title: "User-Friendly Interface",
            description: "Easy-to-use platform for managing pet services and bookings.",
        },
        {
            icon: FitnessCenter,
            title: "Pet Health Tracking",
            description: "Track your pet’s health, vaccinations, and medical records.",
        },
        {
            icon: Star,
            title: "Premium Services",
            description: "Access exclusive premium services for your pets.",
        },
        {
            icon: NotificationsActive,
            title: "Real-Time Notifications",
            description: "Stay updated with timely alerts and reminders for your pets.",
        },
        {
            icon: Schedule,
            title: "Online Appointments",
            description: "Book and manage vet appointments with ease.",
        },
        {
            icon: ShoppingCart,
            title: "Pet Store Integration",
            description: "Shop for your pet’s needs directly from our platform.",
        },
    ];

    return (
        <Container sx={{ padding: 4 }}>
            <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom>
                Our Features
            </Typography>
            <Grid container spacing={4} sx={{ marginTop: 2 }}>
                {features.map((feature, index) => (
                    <Grid item xs={12} md={4} key={index}>
                        <FeatureCard
                            icon={feature.icon}
                            title={feature.title}
                            description={feature.description}
                        />
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default FeaturesSection;
