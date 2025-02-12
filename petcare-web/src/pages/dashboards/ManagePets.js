import React, {useEffect, useState} from "react";
import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Fab,
    Grid,
    Typography,
    useMediaQuery,
    useTheme
} from "@mui/material";
import {Add} from "@mui/icons-material";
import {useDispatch, useSelector} from "react-redux";
import {fetchPets} from "../../redux/petSlice";
import {useNavigate} from "react-router-dom";
import PetDialog from "./PetDialog";
import PetsIcon from "@mui/icons-material/Pets";

const ManagePets = () => {
    const dispatch = useDispatch();
    const {pets, status, error} = useSelector((state) => state.pet);
    const navigate = useNavigate();

    const [dialogOpen, setDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    useEffect(() => {
        dispatch(fetchPets());
    }, [dispatch]);

    const handleCardClick = (petId) => {
        navigate(`/dashboard/pet/${petId}`);
    };

    const calculateAge = (birthDate) => {
        if (!birthDate) return "Unknown";
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return `${age} years`;
    };

    return (
        <Box
            sx={{
                padding: {xs: 2, md: 4},
                minHeight: "100vh",
                pb: {xs: 10, md: 4}, // Extra padding for FAB in mobile view
                position: "relative"
            }}
        >
            <Typography
                variant="h4"
                fontWeight="bold"
                sx={{textAlign: "center", mb: 3, color: "#1976d2"}}
            >
                🐾 My Pets
            </Typography>

            {!isMobile && (
                <Box sx={{display: "flex", justifyContent: "flex-end", mb: 3}}>
                    <Button
                        variant="contained"
                        startIcon={<Add/>}
                        onClick={() => setDialogOpen(true)}
                        sx={{
                            backgroundColor: "#1976d2",
                            "&:hover": {backgroundColor: "#1565c0"},
                            width: "auto",
                        }}
                    >
                        New Pet
                    </Button>
                </Box>

            )}
            {status === "loading" ? (
                <CircularProgress sx={{display: "block", margin: "20px auto"}}/>
            ) : (
                <Grid container spacing={3}>
                    {pets?.map((pet) => (
                        <Grid item xs={12} sm={6} md={4} key={pet.id}>
                            <Card
                                sx={{
                                    borderRadius: 4,
                                    boxShadow: 3,
                                    p: 2,
                                    color: "#fff",
                                    textAlign: "center",
                                    transition: "0.3s",
                                    "&:hover": {transform: "scale(1.05)", boxShadow: 6},
                                    position: "relative",
                                }}
                                onClick={() => handleCardClick(pet.id)}
                            >
                                {/* Avatar Positioned at Top Center */}
                                <Avatar
                                    src={pet.imageUrl || undefined}
                                    sx={{
                                        width: 90,
                                        height: 90,
                                        borderRadius: "50%",
                                        boxShadow: 3,
                                        border: "2px solid white",
                                        position: "absolute",
                                        left: "50%",
                                        transform: "translateX(-50%)",
                                        backgroundColor: pet.imageUrl ? "transparent" : "#e0e0e0",
                                    }}
                                >
                                    {!pet.imageUrl && <PetsIcon sx={{fontSize: 40, color: "#757575"}}/>}
                                </Avatar>

                                <CardContent sx={{mt: 10}}>
                                    <Typography variant="h6" fontWeight="bold" color="primary">
                                        {pet.name}
                                    </Typography>
                                    <Chip
                                        label={pet.type}
                                        sx={{bgcolor: "#f0f0f0", color: "#333", mb: 1}}
                                    />
                                    <Box sx={{display: "flex", justifyContent: "center", gap: 2, mt: 1}}>
                                        <Typography variant="body2" sx={{color: "#555"}}>
                                            {pet.gender === "Male" ? "♂" : "♀"} {pet.gender}
                                        </Typography>
                                        <Typography variant="body2" sx={{color: "#555"}}>
                                            🎂 {calculateAge(pet.birthDate)}
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {error && <Typography color="error">{error}</Typography>}

            {/* Floating Action Button (FAB) */}
            {isMobile && (
                <Fab
                    color="primary"
                    aria-label="add"
                    sx={{
                        position: "fixed",
                        bottom: {xs: 80, md: 24},
                        right: {xs: 16, md: 40},
                        backgroundColor: "#1976d2",
                        "&:hover": {backgroundColor: "#115293"},
                        zIndex: 1000
                    }}
                    onClick={() => setDialogOpen(true)}
                >
                    <Add/>
                </Fab>

            )}
            {/* Add Pet Dialog */}
            <PetDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onSubmit={() => {
                }}
                mode={"create"}
                loading={loading}
            />
        </Box>
    );
};

export default ManagePets;