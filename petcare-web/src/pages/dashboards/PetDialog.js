import React, { useState, useRef, useEffect } from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    TextField,
    Grid,
    Avatar,
    IconButton,
    MenuItem,
    CircularProgress,
    Box,
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";

const petTypes = ["Dog", "Cat", "Cow", "Goat", "Rabbit", "Bird"];
const genders = ["Male", "Female"];

const PetDialog = ({ open, onClose, onSubmit, pet = null, mode,loading }) => {
    const isEditMode = mode === "edit"; // Check mode (edit or create)

    const [petData, setPetData] = useState({
        name: "",
        type: "",
        breed: "",
        gender: "",
        color: "",
        birthDate: "",
        imageUrl: ""
    });

    const [petImage, setPetImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [errors, setErrors] = useState({});
    const formRef = useRef(null); // Reference for scrolling

    useEffect(() => {
        if (isEditMode && pet) {
            setPetData({
                ...pet,
                birthDate: pet.birthDate ? new Date(pet.birthDate).toISOString().split("T")[0] : "",
            });
            setPreviewImage(pet.imageUrl || null);
        } else {
            setPetData({
                name: "",
                type: "",
                breed: "",
                gender: "",
                color: "",
                birthDate: "",
                imageUrl: ""
            });
            setPreviewImage(null);
        }
    }, [pet, isEditMode, open]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPetData({ ...petData, [name]: value });
        setErrors({ ...errors, [name]: "" });
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setPetImage(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const validateForm = () => {
        let newErrors = {};
        if (!petData.name) newErrors.name = "Pet Name is required";
        if (!petData.type) newErrors.type = "Pet Type is required";
        if (!petData.breed) newErrors.breed = "Breed is required";
        if (!petData.gender) newErrors.gender = "Gender is required";
        if (!petData.color) newErrors.color = "Color is required";
        if (!petData.birthDate) newErrors.birthDate = "Birth Date is required";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);

            // Scroll to the first error
            const firstErrorField = Object.keys(newErrors)[0];
            const fieldRef = formRef.current.querySelector(`[name="${firstErrorField}"]`);
            if (fieldRef) {
                fieldRef.scrollIntoView({ behavior: "smooth", block: "center" });
                fieldRef.focus();
            }
            return false;
        }
        return true;
    };

    const handleSubmit = () => {
        if (!validateForm()) return;
        onSubmit(petData, petImage);
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
                {isEditMode ? "Edit Pet Details" : "Add a New Pet"}
            </DialogTitle>
            <DialogContent ref={formRef} sx={{ maxHeight: "70vh", overflowY: "auto" }}>
                {/* Pet Image with Camera Icon */}
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
                                src={previewImage || "https://via.placeholder.com/150"}
                                sx={{
                                    width: 100,
                                    height: 100,
                                    borderRadius: "50%",
                                    boxShadow: 2,
                                    border: "3px solid #1976d2",
                                }}
                            />
                        </label>
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
                            value={petData.name}
                            onChange={handleInputChange}
                            error={!!errors.name}
                            helperText={errors.name}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            select
                            fullWidth
                            label="Type"
                            name="type"
                            value={petData.type}
                            onChange={handleInputChange}
                            error={!!errors.type}
                            helperText={errors.type}
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
                            value={petData.breed}
                            onChange={handleInputChange}
                            error={!!errors.breed}
                            helperText={errors.breed}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            select
                            label="Gender"
                            name="gender"
                            value={petData.gender}
                            onChange={handleInputChange}
                            error={!!errors.type}
                            helperText={errors.type}
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
                            value={petData.color}
                            onChange={handleInputChange}
                            error={!!errors.color}
                            helperText={errors.color}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Birth Date"
                            type="date"
                            name="birthDate"
                            value={petData.birthDate}
                            onChange={handleInputChange}
                            InputLabelProps={{ shrink: true }}
                            error={!!errors.birthDate}
                            helperText={errors.birthDate}
                        />
                    </Grid>
                </Grid>
            </DialogContent>

            {/* Actions */}
            <DialogActions>
                <Button onClick={onClose} sx={{ color: "#555" }}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained" disabled={loading}>
                    {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : (isEditMode ? "Save Changes" : "Add Pet")}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default PetDialog;