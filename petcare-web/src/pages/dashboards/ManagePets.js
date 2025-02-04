import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    CircularProgress,
    Grid,
    Avatar,
} from "@mui/material";
import { Pets, Delete, AddCircleOutline } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { fetchPets, createPet } from "../../redux/petSlice";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebaseConfig";
import { useNavigate } from "react-router-dom";
import PetDialog from "./PetDialog";

// Dynamic color backgrounds based on pet type
const petTypeColors = {
    Dog: "linear-gradient(135deg, #ff9a9e 10%, #fad0c4 100%)",
    Cat: "linear-gradient(135deg, #a18cd1 10%, #fbc2eb 100%)",
    Bird: "linear-gradient(135deg, #84fab0 10%, #8fd3f4 100%)",
    Rabbit: "linear-gradient(135deg, #f6d365 10%, #fda085 100%)",
    Cow: "linear-gradient(135deg, #fbc2eb 10%, #a6c1ee 100%)",
    Goat: "linear-gradient(135deg, #8fd3f4 10%, #84fab0 100%)",
    default: "linear-gradient(135deg, #a1c4fd 10%, #c2e9fb 100%)"
};

const ManagePets = () => {
    const dispatch = useDispatch();
    const { pets, status, error } = useSelector((state) => state.pet);
    const navigate = useNavigate();

    const [dialogOpen, setDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        dispatch(fetchPets());
    }, [dispatch]);

    const handleCardClick = (petId) => {
        navigate(`/dashboard/pet/${petId}`); // Navigate to Pet Detail View
    };

    const handleAddPet = async (newPet, petImage) => {
        setLoading(true);
        try {
            let imageUrl = "";
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

            dispatch(createPet({ ...newPet, imageUrl })).then((result) => {
                if (createPet.fulfilled.match(result)) {
                    dispatch(fetchPets());
                    setDialogOpen(false);
                }
            });
        } catch (error) {
            console.error("Error uploading image or adding pet:", error);
        }
        setLoading(false);
    };

    return (
        <Box sx={{ padding: { xs: 2, md: 4 }, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
            <Typography variant="h4" fontWeight="bold" sx={{ textAlign: "center", mb: 3, color: "#1976d2" }}>
                🐾 Your Lovely Pets
            </Typography>

            <Button
                variant="contained"
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 3,
                    bgcolor: "#1976d2",
                    "&:hover": { bgcolor: "#115293" }
                }}
                onClick={() => setDialogOpen(true)}
            >
                <AddCircleOutline />
                Add New Pet
            </Button>

            {status === "loading" ? (
                <CircularProgress sx={{ display: "block", margin: "20px auto" }} />
            ) : (
                <Grid container spacing={3}>
                    {pets?.map((pet) => (
                        <Grid item xs={12} sm={6} md={4} key={pet.id}>
                            <Card
                                sx={{
                                    borderRadius: 4,
                                    boxShadow: 3,
                                    p: 2,
                                    background: petTypeColors[pet.type] || petTypeColors.default,
                                    color: "#fff",
                                    transition: "0.3s",
                                    "&:hover": { transform: "scale(1.05)", boxShadow: 6 }
                                }}
                                onClick={() => handleCardClick(pet.id)}
                            >
                                <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                    <Avatar
                                        src={pet.imageUrl || "https://via.placeholder.com/150"}
                                        sx={{
                                            width: 80,
                                            height: 80,
                                            borderRadius: "50%",
                                            boxShadow: 3,
                                            border: "3px solid white"
                                        }}
                                    />
                                    <Box>
                                        <Typography variant="h6" fontWeight="bold">
                                            {pet.name}
                                        </Typography>
                                        <Typography variant="body2">🐕 Type: {pet.type}</Typography>
                                        <Typography variant="body2">📌 Breed: {pet.breed}</Typography>
                                        <Typography variant="body2">⚥ Gender: {pet.gender}</Typography>
                                        <Typography variant="body2">🎨 Color: {pet.color}</Typography>
                                        <Typography variant="body2">
                                            🎂 Birth Date:{" "}
                                            {pet.birthDate
                                                ? new Date(pet.birthDate).toLocaleDateString()
                                                : "Unknown"}
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {error && <Typography color="error">{error}</Typography>}

            {/* Add Pet Dialog */}
            <PetDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onSubmit={handleAddPet}
                mode={"create"}
                loading={loading} />
        </Box>
    );
};

export default ManagePets;
