import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Avatar,
    Button,
    CircularProgress,
    Card,
    CardContent,
    Grid,
    Divider,
    Chip,
    IconButton
} from "@mui/material";
import { Edit, Email, Phone, Home } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserProfile } from "../redux/profileSlice";
import EditProfileDialog from "./EditProfileDialog"; // Import the edit popup

const ProfileView = () => {
    const dispatch = useDispatch();
    const { user, status } = useSelector((state) => state.profile);
    const [editDialogOpen, setEditDialogOpen] = useState(false);

    useEffect(() => {
        dispatch(fetchUserProfile());
    }, [dispatch]);

    const roleMap = {
        pet_owner: "Pet Owner",
        professional: "Pet Professional",
        admin: "Admin",
        community: "Community"
    };

    const role = user ? (roleMap[user.role] || "Unknown") : "Unknown";
    return (
        <Box
            sx={{
                padding: 4,
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}
        >
            {status === "loading" ? (
                <CircularProgress sx={{ display: "block", margin: "20px auto" }} />
            ) : (
                <Card
                    sx={{
                        maxWidth: 600,
                        width: "100%",
                        margin: "auto",
                        padding: 4,
                        textAlign: "center",
                        boxShadow: 3,
                        borderRadius: 4,
                        backgroundColor: "#fff", // White background for the card
                        color: "#333" // Dark text for better readability
                    }}
                >
                    {/* Profile Header */}
                    <Box sx={{ position: "relative" }}>
                        <Avatar
                            src={user?.imageUrl || ""}
                            sx={{
                                width: 120,
                                height: 120,
                                margin: "0 auto",
                                border: "4px solid #ddd",
                                boxShadow: 2
                            }}
                        />
                        <IconButton
                            sx={{
                                position: "absolute",
                                top: 0,
                                right: 0,
                                bgcolor: "#1976d2",
                                "&:hover": { bgcolor: "#115293" }
                            }}
                            onClick={() => setEditDialogOpen(true)}
                        >
                            <Edit sx={{ color: "#fff" }} />
                        </IconButton>
                    </Box>

                    {/* User Details */}
                    <CardContent>
                        <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
                            {user?.name}
                        </Typography>
                        <Chip
                            label={role}
                            sx={{ bgcolor: "#1976d2", color: "#fff", mb: 2 }}
                        />

                        <Grid container spacing={2} sx={{ mt: 2, textAlign: "left" }}>
                            <Grid item xs={12}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                    <Email sx={{ fontSize: 30, color: "#1976d2" }} />
                                    <Typography variant="body1">{user?.email}</Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                    <Phone sx={{ fontSize: 30, color: "#1976d2" }} />
                                    <Typography variant="body1">📱 {user?.mobile}</Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                    <Home sx={{ fontSize: 30, color: "#1976d2" }} />
                                    <Typography variant="body1">🏠 {user?.address}</Typography>
                                </Box>
                            </Grid>
                        </Grid>

                        <Divider sx={{ my: 3, bgcolor: "#ddd" }} />

                        {/* Edit Button */}
                        <Button
                            variant="contained"
                            startIcon={<Edit />}
                            sx={{
                                bgcolor: "#1976d2",
                                "&:hover": { bgcolor: "#115293" },
                                mt: 2
                            }}
                            onClick={() => setEditDialogOpen(true)}
                        >
                            Edit Profile
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Edit Profile Dialog */}
            <EditProfileDialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} />
        </Box>
    );
};

export default ProfileView;