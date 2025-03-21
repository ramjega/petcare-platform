import React, {useRef, useState} from "react";
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
    TextField,
    InputAdornment
} from "@mui/material";
import {PhotoCamera, AccountCircle, Email, Phone, Home} from "@mui/icons-material";
import {useDispatch} from "react-redux";
import {updateUserProfile} from "../redux/profileSlice";
import {getDownloadURL, ref, uploadBytesResumable} from "firebase/storage";
import {storage} from "../firebaseConfig";

const EditProfileDialog = ({open, onClose, user}) => {
    const dispatch = useDispatch();

    const [profileData, setProfileData] = useState({
        id: user?.id || "",
        name: user?.name || "",
        email: user?.email || "",
        mobile: user?.mobile || "",
        address: user?.address || "",
        imageUrl: user?.imageUrl || "",
    });

    const [profileImage, setProfileImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(user?.imageUrl || "");
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null); // For opening file picker

    // Handle input field changes
    const handleInputChange = (e) => {
        setProfileData({...profileData, [e.target.name]: e.target.value});
    };

    // Handle Image Selection
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setProfileImage(file);
            const reader = new FileReader();
            reader.onload = (e) => setPreviewImage(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    // Handle Profile Update
    const handleUpdateProfile = async () => {
        setLoading(true);

        let updatedImageUrl = profileData.imageUrl;
        if (profileImage) {
            const storageRef = ref(storage, `profiles/${profileImage.name}`);
            const uploadTask = uploadBytesResumable(storageRef, profileImage);
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

        dispatch(updateUserProfile({...profileData, imageUrl: updatedImageUrl})).then(() => {
            onClose();
        });

        setLoading(false);
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle
                sx={{
                    textAlign: "center",
                    fontWeight: "bold",
                    bgcolor: "#1976d2",
                    color: "#fff",
                    mb: 2,
                }}
            >
                Edit Profile ✨
            </DialogTitle>
            <DialogContent sx={{ maxHeight: "70vh", overflowY: "auto", padding: "20px" }}>
                <Grid container justifyContent="center">
                    <Box position="relative">
                        <input
                            ref={fileInputRef}
                            accept="image/*"
                            type="file"
                            id="upload-photo"
                            style={{ display: "none" }}
                            onChange={handleImageUpload}
                        />

                        <label htmlFor="upload-photo" style={{ cursor: "pointer" }}>
                            <Avatar
                                src={previewImage || ""}
                                sx={{
                                    width: 100,
                                    height: 100,
                                    borderRadius: "50%",
                                    boxShadow: 2,
                                    border: "3px solid #1976d2",
                                    marginBottom: 1,
                                    cursor: "pointer",
                                }}
                            />
                        </label>
                        <IconButton
                            component="label"
                            htmlFor="upload-photo"
                            sx={{
                                position: "absolute",
                                bottom: 5,
                                right: 5,
                                backgroundColor: "#1976d2",
                                color: "white",
                                "&:hover": { backgroundColor: "#115293" },
                            }}
                        >
                            <PhotoCamera fontSize="small" />
                        </IconButton>
                    </Box>
                </Grid>

                <Grid container spacing={2} sx={{ mt: 1 }}>
                    {/* Full Name Input */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Full Name"
                            name="name"
                            value={profileData.name}
                            onChange={handleInputChange}
                            sx={{ borderRadius: "8px" }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AccountCircle sx={{ color: "#1976d2" }} />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>

                    {/* Email Input */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            value={profileData.email}
                            onChange={handleInputChange}
                            sx={{ borderRadius: "8px"}}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Email sx={{ color: "#1976d2" }} />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>

                    {/* Mobile Number Input */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Mobile Number"
                            name="mobile"
                            value={profileData.mobile}
                            onChange={handleInputChange}
                            sx={{ borderRadius: "8px" }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Phone sx={{ color: "#1976d2" }} />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>

                    {/* Address Input */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Address"
                            name="address"
                            value={profileData.address}
                            onChange={handleInputChange}
                            sx={{ borderRadius: "8px" }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Home sx={{ color: "#1976d2" }} />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions sx={{ padding: "16px" }}>
                <Button onClick={onClose} sx={{ color: "#555" }}>
                    Cancel
                </Button>
                <Button
                    onClick={handleUpdateProfile}
                    variant="contained"
                    sx={{ bgcolor: "#1976d2", "&:hover": { bgcolor: "#115293" } }}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Save Changes"}
                </Button>
            </DialogActions>
        </Dialog>

    );
};

export default EditProfileDialog;