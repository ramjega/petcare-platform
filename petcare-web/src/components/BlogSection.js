import React from "react";
import { Container, Typography, Grid, Card, CardMedia, CardContent } from "@mui/material";

const BlogSection = () => {
    const blogs = [
        {
            title: "Top 10 Foods for Your Dog",
            summary: "Learn what foods keep your dog healthy and active.",
            image: "/images/dog-food.jpg",
        },
        {
            title: "How to Groom Your Cat",
            summary: "A step-by-step guide to grooming your cat at home.",
            image: "/images/cat-grooming.jpg",
        },
        {
            title: "Vaccination Schedule for Pets",
            summary: "Stay on top of your pet's vaccinations with our guide.",
            image: "/images/vaccine.jpg",
        },
    ];

    return (
        <Container sx={{ padding: 6, marginTop: 6 }}>
            <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom>
                Pet Care Tips & Blogs
            </Typography>
            <Grid container spacing={4} sx={{ marginTop: 2 }}>
                {blogs.map((blog, index) => (
                    <Grid item xs={12} md={4} key={index}>
                        <Card>
                            <CardMedia component="img" height="140" image={blog.image} alt={blog.title} />
                            <CardContent>
                                <Typography variant="h6" fontWeight="bold">
                                    {blog.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {blog.summary}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default BlogSection;
