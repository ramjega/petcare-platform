import React, { useState, useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import { motion } from "framer-motion";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const HeroSection = () => {
    const carouselImages = ["/images/pets1.jpg", "/images/pets2.jpg", "/images/pets3.jpg", "/images/pets4.jpg"];
    const autoplaySpeed = 3000; // 3 seconds

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Automatically rotate images
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
        }, autoplaySpeed);

        return () => clearInterval(interval); // Clean up interval on unmount
    }, [carouselImages.length, autoplaySpeed]);

    return (
        <Box sx={{ height: "60vh", position: "relative", overflow: "hidden" }}>
            {/* Background Images */}
            {carouselImages.map((image, index) => (
                <Box
                    key={index}
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundImage: `url(${image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        opacity: index === currentImageIndex ? 1 : 0, // Show only the current image
                        transition: "opacity 1s ease-in-out", // Smooth fade transition
                    }}
                />
            ))}

            {/* Semi-Transparent Overlay */}
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(149,153,156,0.23)",
                    zIndex: 2,
                }}
            />

            {/* Content */}
            <Box
                sx={{
                    position: "relative",
                    zIndex: 3,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                    color: "white",
                    padding: 2,
                }}
            >
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <Typography
                        variant="h2"
                        fontWeight="bold"
                        sx={{
                            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
                            fontSize: { xs: "1.8rem", sm: "3rem", md: "4rem" },
                        }}
                    >
                        Welcome to PetCare
                    </Typography>
                </motion.div>

                <Typography
                    variant="h5"
                    sx={{
                        marginTop: 2,
                        maxWidth: 600,
                        textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
                    }}
                >
                    The ultimate platform for managing your pet's needs and care.
                </Typography>
                <Button
                    variant="contained"
                    size="large"
                    sx={{
                        marginTop: 4,
                        backgroundColor: "#1976d2",
                        transition: "transform 0.2s ease",
                        "&:hover": {
                            backgroundColor: "#115293",
                            transform: "scale(1.05)", // Slight zoom effect
                        },
                    }}
                >
                    Get Started
                </Button>
            </Box>
        </Box>
    );
};

export default HeroSection;