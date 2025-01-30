import React from "react";
import {Box, Typography,} from "@mui/material";
import HeroSection from "../components/HeroSection";
import CallToAction from "../components/CallToAction";
import FeaturesSection from "../components/FeaturesSection";
import TestimonialSection from "../components/TestimonialSection";
import BlogSection from "../components/BlogSection";
import FAQSection from "../components/FAQSection";
import PetGallery from "../components/PetGallery";
import ContactInfo from "../components/ContactInfo";

const HomePage = () => {
    return (
        <Box>
            <HeroSection/>
            <CallToAction/>
            <FeaturesSection/>
            <TestimonialSection/>
            <BlogSection/>
            <FAQSection/>
            <PetGallery/>
            <ContactInfo/>

            <Box
                sx={{
                    backgroundColor: "#1976d2",
                    color: "white",
                    padding: 4,
                    textAlign: "center",
                }}
            >
                <Typography variant="body2">
                    © {new Date().getFullYear()} PetCare. All rights reserved.
                </Typography>
            </Box>
        </Box>
    );
};

export default HomePage;
