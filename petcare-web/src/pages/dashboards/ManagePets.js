import React, { useEffect, useState, useRef } from "react";
import {
    Box,
    Typography,
    Card,
    CardContent,
    CircularProgress,
    Grid,
    Avatar,
    Fab,
    Chip
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { fetchPets, createPet } from "../../redux/petSlice";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebaseConfig";
import { useNavigate } from "react-router-dom";
import PetDialog from "./PetDialog";
import PetsIcon from "@mui/icons-material/Pets";
import ColorThief from "colorthief"; // For extracting dominant color from the avatar image

const ManagePets = () => {
    const dispatch = useDispatch();
    const { pets, status, error } = useSelector((state) => state.pet);
    const navigate = useNavigate();

    const [dialogOpen, setDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Create a Map to store loading states for each pet card
    const [imageLoadingStates, setImageLoadingStates] = useState({});
    const cardRefs = useRef(new Map());

    useEffect(() => {
        dispatch(fetchPets());
    }, [dispatch]);

    const handleCardClick = (petId) => {
        navigate(`/dashboard/pet/${petId}`);
    };

    // Function to calculate age from birth date
    const calculateAge = (birthDate) => {
        if (!birthDate) return "Unknown";
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return `${age} years`;
    };

    // Function to extract dominant color from the avatar image
    const getDominantColor = (imageUrl, callback) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = imageUrl;
        img.onload = () => {
            const colorThief = new ColorThief();
            const dominantColor = colorThief.getColor(img);
            callback(`rgb(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]})`);
        };
        img.onerror = () => {
            console.log("Image failed to load, using default background");
            callback("#a1c4fd"); // Fallback to a default color
        };
    };

    return (
        <Box
            sx={{
                padding: { xs: 2, md: 4 },
                backgroundColor: "#f5f5f5",
                minHeight: "100vh",
                pb: { xs: 10, md: 4 }, // Extra padding for FAB in mobile view
                position: "relative"
            }}
        >
            <Typography variant="h4" fontWeight="bold" sx={{ textAlign: "center", mb: 3, color: "#1976d2" }}>
                🐾 My Pets
            </Typography>

            {status === "loading" ? (
                <CircularProgress sx={{ display: "block", margin: "20px auto" }} />
            ) : (
                <Grid container spacing={3}>
                    {pets?.map((pet) => {

                        return (
                            <Grid item xs={12} sm={6} md={4} key={pet.id}>
                                <Card
                                    ref={(node) => {
                                        // Store the card ref in the Map
                                        if (node) {
                                            cardRefs.current.set(pet.id, node);
                                        } else {
                                            cardRefs.current.delete(pet.id);
                                        }
                                    }}
                                    sx={{
                                        borderRadius: 4,
                                        boxShadow: 3,
                                        p: 2,
                                        color: "#fff",
                                        textAlign: "center",
                                        transition: "0.3s",
                                        "&:hover": { transform: "scale(1.05)", boxShadow: 6 },
                                        position: "relative",
                                        background: pet.imageUrl
                                            ? "linear-gradient(135deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.8))"
                                            : "linear-gradient(135deg, #a1c4fd 10%, #c2e9fb 100%)",
                                    }}
                                    onClick={() => handleCardClick(pet.id)}
                                >
                                    {/* Avatar Positioned at Top Center */}
                                    <Avatar
                                        src={pet.imageUrl || undefined}
                                        sx={{
                                            width: 90,
                                            height: 90,
                                            borderRadius: "50%",
                                            boxShadow: 3,
                                            border: "3px solid white",
                                            position: "absolute",
                                            left: "50%",
                                            transform: "translateX(-50%)",
                                            backgroundColor: pet.imageUrl ? "transparent" : "#e0e0e0",
                                        }}
                                        onLoad={(e) => {
                                            if (pet.imageUrl) {
                                                getDominantColor(pet.imageUrl, (color) => {
                                                    const card = cardRefs.current.get(pet.id);
                                                    if (card) {
                                                        card.style.background = `linear-gradient(135deg, ${color}, rgba(0, 0, 0, 0.8))`;
                                                        card.style.transition = "background 0.5s ease";
                                                        setImageLoadingStates((prev) => ({ ...prev, [pet.id]: false }));
                                                    }
                                                });
                                            }
                                        }}
                                        onError={() => setImageLoadingStates((prev) => ({ ...prev, [pet.id]: false }))} // Handle image loading errors
                                    >
                                        {!pet.imageUrl && <PetsIcon sx={{ fontSize: 40, color: "gray" }} />}
                                    </Avatar>

                                    {/* Loading Spinner */}
                                    {imageLoadingStates[pet.id] !== false && (
                                        <Box
                                            sx={{
                                                position: "absolute",
                                                top: "50%",
                                                left: "50%",
                                                transform: "translate(-50%, -50%)",
                                            }}
                                        >
                                            <CircularProgress sx={{ color: "#fff" }} />
                                        </Box>
                                    )}

                                    <CardContent sx={{ mt: 12 }}>
                                        <Typography variant="h6" fontWeight="bold">
                                            {pet.name}
                                        </Typography>
                                        <Chip
                                            label={pet.type}
                                            sx={{ bgcolor: "#ffffff", color: "#000", mb: 1 }}
                                        />
                                        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 1 }}>
                                            <Typography variant="body2">
                                                {pet.gender === "Male" ? "♂" : "♀"} {pet.gender}
                                            </Typography>
                                            <Typography variant="body2">
                                                🎂 {calculateAge(pet.birthDate)}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            )}

            {error && <Typography color="error">{error}</Typography>}

            {/* Floating Action Button (FAB) */}
            <Fab
                color="primary"
                aria-label="add"
                sx={{
                    position: "fixed",
                    bottom: { xs: 80, md: 24 },
                    right: { xs: 16, md: 40 },
                    backgroundColor: "#1976d2",
                    "&:hover": { backgroundColor: "#115293" },
                    zIndex: 1000
                }}
                onClick={() => setDialogOpen(true)}
            >
                <Add />
            </Fab>

            {/* Add Pet Dialog */}
            <PetDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onSubmit={() => {}}
                mode={"create"}
                loading={loading}
            />
        </Box>
    );
};

export default ManagePets;