import React, {useEffect, useState} from "react";
import {Avatar, Box, Button, Chip, CircularProgress, Divider, Grid, Paper, Typography} from "@mui/material";
import {Edit, Email, Home, Phone} from "@mui/icons-material";
import {useDispatch, useSelector} from "react-redux";
import {fetchUserProfile} from "../redux/profileSlice";
import EditProfileDialog from "./EditProfileDialog"; // Import the edit popup

const ProfileView = () => {
    const dispatch = useDispatch();
    const {user, status} = useSelector((state) => state.profile);
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
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
                backgroundColor: "#f0f4f8",
                padding: { xs: 2, md: 4 },
                minHeight: "100vh",
                flexGrow: 1,
            }}
        >

            {status === "loading" ? (
                <CircularProgress sx={{display: "block", margin: "20px auto"}}/>
            ) : (
                <Paper
                    elevation={6}
                    sx={{
                        padding: { xs: 3, md: 5 },
                        marginTop: { xs: "60px", md: "80px" },
                        borderRadius: 4,
                        maxWidth: { xs: "90%", sm: 420 },
                        width: "100%",
                        textAlign: "center",
                        backgroundColor: "#ffffff",
                        boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    <Box sx={{position: "relative", textAlign: "center"}}>
                        <Avatar
                            src={user?.imageUrl || ""}
                            sx={{
                                width: 120,
                                height: 120,
                                margin: "0 auto",
                                border: "3px solid #1976d2",
                                boxShadow: 2,
                            }}
                        />
                    </Box>

                    {/* User Info */}
                    <Typography variant="h5" fontWeight="bold" color="primary" sx={{mt: 2}}>
                        {user?.name}
                    </Typography>
                    <Chip label={role} sx={{bgcolor: "#1976d2", color: "#fff", mt: 1, mb: 2}}/>

                    {/* Contact Details */}
                    <Grid container spacing={2} sx={{mt: 2, textAlign: "left"}}>
                        <Grid item xs={12}>
                            <Box sx={{display: "flex", alignItems: "center", gap: 2}}>
                                <Email sx={{fontSize: 24, color: "#1976d2"}}/>
                                <Typography variant="body1">{user?.email || "Not Available"}</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Box sx={{display: "flex", alignItems: "center", gap: 2}}>
                                <Phone sx={{fontSize: 24, color: "#1976d2"}}/>
                                <Typography variant="body1">{user?.mobile || "Not Available"}</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Box sx={{display: "flex", alignItems: "center", gap: 2}}>
                                <Home sx={{fontSize: 24, color: "#1976d2"}}/>
                                <Typography variant="body1">{user?.address || "Not Available"}</Typography>
                            </Box>
                        </Grid>
                    </Grid>

                    <Divider sx={{my: 3, bgcolor: "#ddd"}}/>

                    {/* Edit Button */}
                    <Button
                        variant="contained"
                        startIcon={<Edit/>}
                        sx={{
                            bgcolor: "#1976d2",
                            "&:hover": {bgcolor: "#115293"},
                            mt: 2,
                            padding: 1.2,
                            fontWeight: "bold",
                        }}
                        onClick={() => setEditDialogOpen(true)}
                    >
                        Edit Profile
                    </Button>
                </Paper>
            )}

            {/* Edit Profile Dialog */}
            <EditProfileDialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} user={user}/>
        </Box>

    );
};

export default ProfileView;