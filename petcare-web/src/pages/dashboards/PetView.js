import React, { useEffect, useState, useRef } from "react";
import {
    Box,
    Typography,
    Card,
    Avatar,
    IconButton,
    CircularProgress,
    Grid,
    Divider,
    Chip,
    Tooltip
} from "@mui/material";
import { Edit, Delete, ArrowBack } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { fetchPetById, updatePet, deletePet } from "../../redux/petSlice";
import { useParams, useNavigate } from "react-router-dom";
import PetDialog from "./PetDialog";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../firebaseConfig";
import PetsIcon from "@mui/icons-material/Pets";
import ColorThief from "colorthief";

const PetView = () => {
    const { petId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { selectedPet, status } = useSelector((state) => state.pet);

    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const cardRef = useRef(null);

    useEffect(() => {
        dispatch(fetchPetById(petId));
    }, [dispatch, petId]);

    const handleUpdatePet = async (updatedPet, petImage) => {
        setLoading(true);
        try {
            let imageUrl = updatedPet.imageUrl;
            if (petImage) {
                const storageRef = ref(storage, `pets/${petImage.name}`);
                const uploadTask = uploadBytesResumable(storageRef, petImage);

                await new Promise((resolve, reject) => {
                    uploadTask.on(
                        "state_changed",
                        null,
                        reject,
                        async () => {
                            imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
                            resolve();
                        }
                    );
                });
            }

            dispatch(updatePet({ id: petId, ...updatedPet, imageUrl })).then((result) => {
                if (updatePet.fulfilled.match(result)) {
                    dispatch(fetchPetById(petId));
                    setEditDialogOpen(false);
                }
            });
        } catch (error) {
            console.error("Error uploading image or adding pet:", error);
        }
        setLoading(false);
    };

    const handleDeletePet = () => {
        if (window.confirm("Are you sure you want to delete this pet?")) {
            dispatch(deletePet(petId)).then((result) => {
                if (deletePet.fulfilled.match(result)) {
                    navigate("/dashboard/pets"); // Redirect after deletion
                }
            });
        }
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
        <Box sx={{ padding: { xs: 2, md: 4 }, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
            {/* Back Button */}
            <IconButton onClick={() => navigate("/dashboard/pets")} sx={{ mb: 2 }}>
                <ArrowBack sx={{ fontSize: 30, color: "#1976d2" }} />
            </IconButton>

            {status === "loading" ? (
                <CircularProgress sx={{ display: "block", margin: "20px auto" }} />
            ) : selectedPet ? (
                <>
                    {/* Pet Card */}
                    <Card
                        ref={cardRef}
                        sx={{
                            borderRadius: 4,
                            boxShadow: 3,
                            padding: 3,
                            color: "#fff",
                            marginBottom: 3,
                            background: selectedPet.imageUrl
                                ? "linear-gradient(135deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.8))"
                                : "linear-gradient(135deg, #a1c4fd 10%, #c2e9fb 100%)"
                        }}
                    >
                        <Grid container spacing={3} alignItems="center">
                            <Grid item xs={12} md={4} sx={{ textAlign: "center" }}>
                                <Avatar
                                    src={selectedPet.imageUrl || undefined}
                                    sx={{
                                        width: 150,
                                        height: 150,
                                        border: "4px solid white",
                                        boxShadow: 3,
                                        margin: "0 auto",
                                        backgroundColor: selectedPet.imageUrl ? "transparent" : "#e0e0e0",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                    onLoad={(e) => {
                                        if (selectedPet.imageUrl) {
                                            getDominantColor(selectedPet.imageUrl, (color) => {
                                                if (cardRef.current) {
                                                    cardRef.current.style.background = `linear-gradient(135deg, ${color}, rgba(0, 0, 0, 0.8))`;
                                                    cardRef.current.style.transition = "background 0.5s ease";
                                                }
                                            });
                                        }
                                    }}
                                >
                                    {!selectedPet.imageUrl && <PetsIcon sx={{ fontSize: 60, color: "gray" }} />} {/* Show PetsIcon in gray if no image */}
                                </Avatar>
                            </Grid>
                            <Grid item xs={12} md={8}>
                                <Typography variant="h4" fontWeight="bold" gutterBottom>
                                    {selectedPet.name}
                                </Typography>
                                <Chip
                                    label={selectedPet.type}
                                    sx={{ bgcolor: "#ffffff", color: "#000", mb: 2 }}
                                />
                                <Typography variant="body1" gutterBottom>
                                    📌 Breed: {selectedPet.breed}
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    ⚥ Gender: {selectedPet.gender}
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    🎨 Color: {selectedPet.color}
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    🎂 Birth Date:{" "}
                                    {selectedPet.birthDate
                                        ? new Date(selectedPet.birthDate).toLocaleDateString()
                                        : "Unknown"}
                                </Typography>
                            </Grid>
                        </Grid>

                        <Divider sx={{ my: 3, bgcolor: "#ffffff" }} />

                        {/* Action Buttons Below the Divider */}
                        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                            <Tooltip title="Edit Pet">
                                <IconButton
                                    onClick={() => setEditDialogOpen(true)}
                                    sx={{
                                        backgroundColor: "#ffffff88",
                                        "&:hover": { backgroundColor: "#ffffffaa" }
                                    }}
                                >
                                    <Edit sx={{ color: "#1976d2" }} />
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="Delete Pet">
                                <IconButton
                                    onClick={handleDeletePet}
                                    sx={{
                                        backgroundColor: "#ffffff88",
                                        "&:hover": { backgroundColor: "#ffffffaa" }
                                    }}
                                >
                                    <Delete sx={{ color: "red" }} />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Card>
                </>
            ) : (
                <Typography variant="h6" textAlign="center" sx={{ mt: 4 }}>
                    Pet not found. 🐾
                </Typography>
            )}

            {/* Edit Pet Dialog */}
            <PetDialog
                open={editDialogOpen}
                onClose={() => setEditDialogOpen(false)}
                onSubmit={handleUpdatePet}
                pet={selectedPet}
                mode={"edit"}
                loading={loading}
            />
        </Box>
    );
};

export default PetView;