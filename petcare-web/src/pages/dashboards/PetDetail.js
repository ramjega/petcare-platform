import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Card,
    Avatar,
    Button,
    CircularProgress
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {fetchPetById, updatePet, deletePet, createPet, fetchPets} from "../../redux/petSlice";
import { useParams, useNavigate } from "react-router-dom";
import PetDialog from "./PetDialog";
import {getDownloadURL, ref, uploadBytesResumable} from "firebase/storage";
import {storage} from "../../firebaseConfig";

const PetDetail = () => {
    const { petId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { selectedPet, status } = useSelector((state) => state.pet);

    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);

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

            dispatch(updatePet({ id: petId, ...updatedPet, imageUrl})).then((result) => {
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

    return (
        <Box sx={{ padding: { xs: 2, md: 4 }, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
            {status === "loading" ? (
                <CircularProgress sx={{ display: "block", margin: "20px auto" }} />
            ) : selectedPet ? (
                <>
                    {/* Pet Card */}
                    <Card
                        sx={{
                            borderRadius: 4,
                            boxShadow: 3,
                            textAlign: "center",
                            padding: 3,
                            background: "linear-gradient(135deg, #ff9a9e 10%, #fad0c4 100%)",
                            color: "#fff",
                            marginBottom: 3
                        }}
                    >
                        <Avatar
                            src={selectedPet.imageUrl || "https://via.placeholder.com/150"}
                            sx={{
                                width: 120,
                                height: 120,
                                margin: "0 auto",
                                border: "4px solid white",
                                boxShadow: 3
                            }}
                        />
                        <Typography variant="h4" fontWeight="bold" mt={2}>
                            {selectedPet.name}
                        </Typography>
                        <Typography variant="h6">🐕 {selectedPet.type}</Typography>
                        <Typography variant="body1">📌 Breed: {selectedPet.breed}</Typography>
                        <Typography variant="body1">⚥ Gender: {selectedPet.gender}</Typography>
                        <Typography variant="body1">🎨 Color: {selectedPet.color}</Typography>
                        <Typography variant="body1">
                            🎂 Birth Date:{" "}
                            {selectedPet.birthDate
                                ? new Date(selectedPet.birthDate).toLocaleDateString()
                                : "Unknown"}
                        </Typography>

                        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                            <Button
                                variant="contained"
                                sx={{ bgcolor: "#1976d2", "&:hover": { bgcolor: "#115293" } }}
                                onClick={() => setEditDialogOpen(true)}
                            >
                                <Edit sx={{ mr: 1 }} /> Edit Pet
                            </Button>

                            <Button
                                variant="contained"
                                color="error"
                                sx={{ ml: 2 }}
                                onClick={handleDeletePet}
                            >
                                <Delete sx={{ mr: 1 }} /> Delete Pet
                            </Button>
                        </Box>
                    </Card>

                    {/* Edit Pet Dialog */}
                    <PetDialog
                        open={editDialogOpen}
                        onClose={() => setEditDialogOpen(false)}
                        onSubmit={handleUpdatePet}
                        pet={selectedPet}
                        mode={"edit"}
                        loading={loading}
                    />
                </>
            ) : (
                <Typography textAlign="center">Pet not found</Typography>
            )}
        </Box>
    );
};

export default PetDetail;