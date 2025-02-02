import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Card,
    CardContent,
    CardActions,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Grid,
    Avatar,
    IconButton
} from "@mui/material";
import { Pets, Delete, AddCircleOutline, PhotoCamera } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { fetchPets, createPet } from "../../redux/petSlice";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebaseConfig"; // Import Firebase storage


const ManagePets = () => {
    const dispatch = useDispatch();
    const { pets, status, error } = useSelector((state) => state.pet);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [newPet, setNewPet] = useState({
        name: "",
        type: "",
        breed: "",
        gender: "",
        color: "",
        birthDate: "",
        imageUrl: "" // Store image URL
    });

    const [previewImage, setPreviewImage] = useState(null);
    const [petImage, setPetImage] = useState(null);
    const [imageUploadProgress, setImageUploadProgress] = useState(0)

    useEffect(() => {
        dispatch(fetchPets());
    }, [dispatch]);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setPetImage(event.target.files[0]);

            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewImage(e.target.result); // Preview the image
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadImage = async () => {
        if (!petImage) return null;

        return new Promise((resolve, reject) => {
            const storageRef = ref(storage, `pets/${petImage.name}`);
            const uploadTask = uploadBytesResumable(storageRef, petImage);

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setImageUploadProgress(progress);
                },
                (error) => {
                    console.error("Upload error:", error);
                    reject(error);
                },
                async () => {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    resolve(downloadURL);
                }
            );
        });
    };

    const handleAddPet = async () => {
        const imageUrl = await uploadImage();
        if (!imageUrl) return;

        const newPetData = { ...newPet, imageUrl };
        dispatch(createPet(newPetData)).then((result) => {
            if (createPet.fulfilled.match(result)) {
                setDialogOpen(false);
                dispatch(fetchPets());
            }
        });
    };

    return (
        <Box sx={{ padding: { xs: 2, md: 4 }, backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
            <Typography variant="h5" fontWeight="bold" sx={{ textAlign: "center", mb: 3 }}>
                Manage Your Pets 🐶🐱
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
                            <Card sx={{ borderRadius: 3, boxShadow: 3, p: 2 }}>
                                <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                    <Avatar
                                        src={pet.imageUrl || "https://via.placeholder.com/150"}
                                        sx={{ width: 70, height: 70, borderRadius: "50%", boxShadow: 2 }}
                                    />
                                    <Box>
                                        <Typography variant="h6" fontWeight="bold">{pet.name}</Typography>
                                        <Typography variant="body2">Type: {pet.type}</Typography>
                                        <Typography variant="body2">Breed: {pet.breed}</Typography>
                                        <Typography variant="body2">Gender: {pet.gender}</Typography>
                                        <Typography variant="body2">Color: {pet.color}</Typography>
                                        <Typography variant="body2">
                                            Birth Date: {pet.birthDate ? new Date(pet.birthDate).toLocaleDateString() : "Unknown"}
                                        </Typography>
                                    </Box>
                                </CardContent>
                                <CardActions>
                                    <Button size="small" color="error" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <Delete fontSize="small" />
                                        Delete
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {error && <Typography color="error">{error}</Typography>}

            {/* Add Pet Dialog */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>Add a New Pet</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Pet Name"
                                margin="dense"
                                onChange={(e) => setNewPet({ ...newPet, name: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Type (Dog, Cat, etc.)"
                                margin="dense"
                                onChange={(e) => setNewPet({ ...newPet, type: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Breed"
                                margin="dense"
                                onChange={(e) => setNewPet({ ...newPet, breed: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Gender"
                                margin="dense"
                                onChange={(e) => setNewPet({ ...newPet, gender: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Color"
                                margin="dense"
                                onChange={(e) => setNewPet({ ...newPet, color: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Birth Date"
                                type="date"
                                margin="dense"
                                InputLabelProps={{ shrink: true }}
                                onChange={(e) => setNewPet({ ...newPet, birthDate: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} textAlign="center">
                            <input
                                accept="image/*"
                                type="file"
                                id="upload-photo"
                                style={{ display: "none" }}
                                onChange={handleImageUpload}
                            />
                            {imageUploadProgress > 0 && (
                                <Typography variant="body2">Upload Progress: {imageUploadProgress.toFixed(2)}%</Typography>
                            )}
                            <label htmlFor="upload-photo">
                                <IconButton color="primary" component="span">
                                    <PhotoCamera fontSize="large" />
                                </IconButton>
                            </label>
                            {previewImage && (
                                <Avatar
                                    src={previewImage}
                                    sx={{
                                        width: 80,
                                        height: 80,
                                        borderRadius: "50%",
                                        mt: 2,
                                        boxShadow: 2
                                    }}
                                />
                            )}
                        </Grid>
                    </Grid>
                    {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)} sx={{ color: "#555" }}>Cancel</Button>
                    <Button
                        onClick={handleAddPet}
                        variant="contained"
                        sx={{
                            bgcolor: "#1976d2",
                            "&:hover": { bgcolor: "#115293" }
                        }}
                        disabled={status === "loading"}
                    >
                        {status === "loading" ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Add Pet"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ManagePets;
