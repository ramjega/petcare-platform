import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    Avatar,
    MenuItem,
    CircularProgress,
    IconButton,
    Box
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import { storage } from "../../firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const petTypes = ["Dog", "Cat", "Cow", "Goat", "Rabbit", "Bird"];
const genders = ["Male", "Female"];

const EditPetDialog = ({ open, onClose, petData, onUpdate }) => {
    const [formData, setFormData] = useState({
        name: "",
        type: "",
        breed: "",
        gender: "",
        color: "",
        birthDate: "",
        imageUrl: "",
    });

    const [petImage, setPetImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (petData) {
            setFormData({
                ...petData,
                birthDate: petData.birthDate
                    ? new Date(petData.birthDate).toISOString().split("T")[0]
                    : "",
            });
            setImagePreview(petData.imageUrl || null);
        }
    }, [petData]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setPetImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleUpdatePet = async () => {
        setLoading(true);

        let updatedImageUrl = formData.imageUrl;
        if (petImage) {
            const storageRef = ref(storage, `pets/${petImage.name}`);
            const uploadTask = uploadBytesResumable(storageRef, petImage);
            await new Promise((resolve, reject) => {
                uploadTask.on(
                    "state_changed",
                    null,
                    reject,
                    async () => {
                        updatedImageUrl = await getDownloadURL(uploadTask.snapshot.ref);
                        resolve();
                    }
                );
            });
        }

        onUpdate({ ...formData, imageUrl: updatedImageUrl });

        setLoading(false);
        onClose(); // Close the dialog after saving
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
                Edit Pet Details
            </DialogTitle>
            <DialogContent>
                {/* Avatar with Camera Icon */}
                <Grid container justifyContent="center" sx={{ mb: 2 }}>
                    <Box sx={{ position: "relative", display: "inline-block" }}>
                        <input
                            accept="image/*"
                            type="file"
                            id="upload-photo"
                            style={{ display: "none" }}
                            onChange={handleImageUpload}
                        />
                        <label htmlFor="upload-photo" style={{ cursor: "pointer" }}>
                            <Avatar
                                src={imagePreview || "https://via.placeholder.com/150"}
                                sx={{
                                    width: 100,
                                    height: 100,
                                    borderRadius: "50%",
                                    boxShadow: 2,
                                    border: "3px solid #1976d2",
                                }}
                            />
                        </label>
                        {/* Small Camera Icon */}
                        <IconButton
                            component="label"
                            htmlFor="upload-photo"
                            sx={{
                                position: "absolute",
                                bottom: 0,
                                right: 0,
                                bgcolor: "white",
                                border: "2px solid #1976d2",
                                width: 28,
                                height: 28,
                                boxShadow: 1,
                            }}
                        >
                            <PhotoCamera fontSize="small" sx={{ color: "#1976d2" }} />
                        </IconButton>
                    </Box>
                </Grid>

                {/* Form Inputs */}
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Pet Name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            select
                            label="Type"
                            name="type"
                            value={formData.type}
                            onChange={handleInputChange}
                        >
                            {petTypes.map((type) => (
                                <MenuItem key={type} value={type}>
                                    {type}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Breed"
                            name="breed"
                            value={formData.breed}
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            select
                            label="Gender"
                            name="gender"
                            value={formData.gender}
                            onChange={handleInputChange}
                        >
                            {genders.map((gender) => (
                                <MenuItem key={gender} value={gender}>
                                    {gender}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Color"
                            name="color"
                            value={formData.color}
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Birth Date"
                            type="date"
                            name="birthDate"
                            value={formData.birthDate}
                            onChange={handleInputChange}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                </Grid>
            </DialogContent>

            {/* Actions */}
            <DialogActions>
                <Button onClick={onClose} sx={{ color: "#555" }}>
                    Cancel
                </Button>
                <Button
                    onClick={handleUpdatePet}
                    variant="contained"
                    sx={{
                        bgcolor: "#1976d2",
                        "&:hover": { bgcolor: "#115293" },
                    }}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Save Changes"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditPetDialog;