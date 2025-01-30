import React from "react";
import { Container, Typography, Grid, Card, CardMedia } from "@mui/material";

const PetGallery = () => {
    const galleryImages = [
        "/images/pet1.jpg",
        "/images/pet2.jpg",
        "/images/pet3.jpg",
        "/images/pet4.jpg",
    ];

    return (
        <Container sx={{ padding: 6, marginTop: 6, textAlign: "center" }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Pet Gallery
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
                See photos of adorable pets shared by our users.
            </Typography>
            <Grid container spacing={4} sx={{ marginTop: 2 }}>
                {galleryImages.map((src, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card>
                            <CardMedia component="img" height="200" image={src} alt={`Pet ${index + 1}`} />
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default PetGallery;
