import React from "react";
import { Box, Typography, Grid, Card, CardContent, Avatar } from "@mui/material";

// Individual Testimonial Card Component
const TestimonialCard = ({ avatarSrc, userName, testimonial }) => (
    <Card sx={{ textAlign: "center", padding: 2 }}>
        <Avatar
            src={avatarSrc}
            sx={{ width: 80, height: 80, margin: "0 auto 16px auto" }}
        />
        <CardContent>
            <Typography variant="h6" fontWeight="bold">
                {userName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                {testimonial}
            </Typography>
        </CardContent>
    </Card>
);

// Main Testimonial Section Component
const TestimonialSection = () => {
    const testimonials = [
        {
            avatarSrc: "https://i.pravatar.cc/150?img=1",
            userName: "User 1",
            testimonial: "PetCare made it so easy to keep track of my dog’s vaccinations!",
        },
        {
            avatarSrc: "https://i.pravatar.cc/150?img=2",
            userName: "User 2",
            testimonial: "I love the real-time notifications for my pet’s appointments!",
        },
        {
            avatarSrc: "https://i.pravatar.cc/150?img=3",
            userName: "User 3",
            testimonial: "The platform is so easy to use, and the premium services are amazing.",
        },
    ];

    return (
        <Box sx={{ padding: 4, backgroundColor: "#f7f9fc" }}>
            <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom>
                What Our Users Say
            </Typography>
            <Grid container spacing={4} justifyContent="center" sx={{ marginTop: 2 }}>
                {testimonials.map((testimonial, index) => (
                    <Grid item xs={12} md={4} key={index}>
                        <TestimonialCard
                            avatarSrc={testimonial.avatarSrc}
                            userName={testimonial.userName}
                            testimonial={testimonial.testimonial}
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default TestimonialSection;
