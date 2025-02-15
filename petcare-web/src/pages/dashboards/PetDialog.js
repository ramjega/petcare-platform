import React, {useEffect, useRef, useState} from "react";
import {useDispatch} from "react-redux";
import {
    Avatar,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    InputAdornment,
    MenuItem,
    TextField
} from "@mui/material";
import {CalendarToday, Female, Male, Palette, Pets, PhotoCamera} from "@mui/icons-material";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {format} from "date-fns"
import {getDownloadURL, ref, uploadBytesResumable} from "firebase/storage";
import {storage} from "../../firebaseConfig";
import {createPet, updatePet} from "../../redux/petSlice";

const petTypes = ["Dog", "Cat", "Cow", "Goat", "Rabbit", "Bird"];
const genders = ["Male", "Female"];

const PetDialog = ({open, onClose, pet = null, mode}) => {
    const dispatch = useDispatch();
    const isEditMode = mode === "edit"; // Check mode (edit or create)
    const [birthDate, setBirthDate] = useState(null)
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
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isEditMode && pet) {
            const date = new Date(pet.birthDate);

            setBirthDate(date)
            setPetData({
                ...pet,
                birthDate: format(date, "yyyy-MM-dd"),
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

    const handleDateChange = (date) => {
        console.log("date", date)
        setBirthDate(date);
        const formattedDate = format(date, "yyyy-MM-dd");
        handleInputChange({target: {name: "birthDate", value: formattedDate}});
    };

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setPetData({...petData, [name]: value});
        setErrors({...errors, [name]: ""});
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
                fieldRef.scrollIntoView({behavior: "smooth", block: "center"});
                fieldRef.focus();
            }
            return false;
        }
        return true;
    };

    const handleUpdatePost = async (petData, petImage) => {
        setLoading(true);
        try {
            let imageUrl = petData.imageUrl;
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

            if (isEditMode) {
                dispatch(updatePet({id: petData.id, ...petData, imageUrl})).then((result) => {
                    if (updatePet.fulfilled.match(result)) {
                        setLoading(false);
                        onClose()
                    }
                });
            } else {
                dispatch(createPet({...petData, imageUrl})).then((result) => {
                    if (createPet.fulfilled.match(result)) {
                        setLoading(false);
                        onClose()
                    }
                })
            }

        } catch (error) {
            console.error("Error uploading image or adding pet:", error);
            setLoading(false);
        }
    };

    const handleSubmit = () => {
        if (!validateForm()) return;
        handleUpdatePost(petData, petImage);
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{textAlign: "center", fontWeight: "bold", bgcolor: "#1976d2", color: "#fff", mb: 2}}>
                {isEditMode ? "Edit Pet Details" : "Add a New Pet"}
            </DialogTitle>
            <DialogContent ref={formRef} sx={{maxHeight: "70vh", overflowY: "auto"}}>
                {/* Pet Image with Camera Icon */}
                <Grid container justifyContent="center" sx={{mb: 2}}>
                    <Box sx={{position: "relative", display: "inline-block"}}>
                        <input
                            accept="image/*"
                            type="file"
                            id="upload-photo"
                            style={{display: "none"}}
                            onChange={handleImageUpload}
                        />
                        <label htmlFor="upload-photo" style={{cursor: "pointer"}}>
                            <Avatar
                                src={previewImage || undefined}
                                sx={{
                                    width: 100,
                                    height: 100,
                                    borderRadius: "50%",
                                    boxShadow: 2,
                                    border: "3px solid #1976d2",
                                    backgroundColor: previewImage ? "transparent" : "#e0e0e0",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                {!previewImage && <Pets sx={{fontSize: 50, color: "#1976d2"}}/>}
                            </Avatar>
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
                            <PhotoCamera fontSize="small" sx={{color: "#1976d2"}}/>
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
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Pets color="action"/>
                                    </InputAdornment>
                                )
                            }}
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
                            error={!!errors.gender}
                            helperText={errors.gender}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        {petData.gender === "Male" ? (
                                            <Male color="action"/>
                                        ) : (
                                            <Female color="action"/>
                                        )}
                                    </InputAdornment>
                                )
                            }}
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
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Palette color="action"/>
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                label="Birth Date"
                                value={birthDate}
                                onChange={handleDateChange}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        fullWidth
                                        error={!!errors.birthDate}
                                        helperText={errors.birthDate}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <CalendarToday color="action"/>
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                )}
                            />
                        </LocalizationProvider>
                    </Grid>
                </Grid>
            </DialogContent>

            {/* Actions */}
            <DialogActions>
                <Button onClick={onClose} sx={{color: "#555"}}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained" disabled={loading}>
                    {loading ?
                        <CircularProgress size={24} sx={{color: "white"}}/> : (isEditMode ? "Save Changes" : "Create")}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default PetDialog;