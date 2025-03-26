import React, { useEffect, useState } from "react";
import {
    Box, Typography, Card, CardContent, CardHeader,
    TextField, InputAdornment, Paper, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow,
    CircularProgress, IconButton,
    Dialog, DialogTitle, DialogContent, DialogActions, Button, Snackbar, Alert
} from "@mui/material";
import { Search, Edit, Delete, Save} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { fetchCities, createCity, updateCity, deleteCity } from "../../../redux/citySlice";

const CityManagement = () => {
    const dispatch = useDispatch();
    const { cities, loading } = useSelector(state => state.city);
    const [searchQuery, setSearchQuery] = useState("");
    const [openDialog, setOpenDialog] = useState(false);

    const [newCityName, setNewCityName] = useState("");
    const [editRowId, setEditRowId] = useState(null);
    const [editCityName, setEditCityName] = useState("");
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);


    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success"
    });

    useEffect(() => {
        dispatch(fetchCities());
    }, [dispatch]);

    const filteredCities = cities?.filter(city =>
        city.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    return (
        <Box sx={{ padding: 3 }}>
            <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
                <CardHeader
                    title="City Management"
                    sx={{
                        backgroundColor: "#1976d2",
                        color: "white",
                        textAlign: "center",
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                        padding: "16px",
                    }}
                />
                <CardContent sx={{ padding: 3 }}>
                    {/* Search Field */}
                    <Box sx={{ mb: 2 }}>
                        <TextField
                            label="Search Cities"
                            variant="outlined"
                            fullWidth
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search sx={{ color: "#1976d2" }} />
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Box>

                    <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => setOpenDialog(true)}
                            sx={{ fontWeight: "bold", textTransform: "none" }}
                        >
                            + Add City
                        </Button>
                    </Box>

                    {/* Table */}
                    <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell align="center">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={3} align="center">
                                            <CircularProgress size={24} />
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredCities.map(city => (
                                        <TableRow key={city.id}>
                                            <TableCell>{city.id}</TableCell>
                                            <TableCell>
                                                {editRowId === city.id ? (
                                                    <TextField
                                                        value={editCityName}
                                                        onChange={(e) => setEditCityName(e.target.value)}
                                                        size="small"
                                                    />
                                                ) : (
                                                    city.name
                                                )}
                                            </TableCell>
                                            <TableCell align="center">
                                                {editRowId === city.id ? (
                                                    <IconButton
                                                        color="success"
                                                        onClick={() => {
                                                            dispatch(updateCity({ id: city.id, name: editCityName }))
                                                                .then(() => {
                                                                    setSnackbar({
                                                                        open: true,
                                                                        message: "City updated successfully!",
                                                                        severity: "success"
                                                                    });
                                                                    setEditRowId(null);
                                                                });
                                                        }}
                                                    >
                                                        <Save />
                                                    </IconButton>
                                                ) : (
                                                    <IconButton
                                                        color="primary"
                                                        onClick={() => {
                                                            setEditRowId(city.id);
                                                            setEditCityName(city.name);
                                                        }}
                                                    >
                                                        <Edit />
                                                    </IconButton>
                                                )}

                                                <IconButton
                                                    color="error"
                                                    onClick={() => setConfirmDeleteId(city.id)}
                                                >
                                                    <Delete />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="xs" fullWidth>
                        <DialogTitle sx={{ fontWeight: "bold", textAlign: "center" }}>
                            Add New City
                        </DialogTitle>
                        <DialogContent>
                            <TextField
                                label="City Name"
                                value={newCityName}
                                onChange={(e) => setNewCityName(e.target.value)}
                                fullWidth
                                variant="outlined"
                                sx={{ mt: 1 }}
                            />
                        </DialogContent>
                        <DialogActions sx={{ justifyContent: "center", mb: 2 }}>
                            <Button
                                onClick={() => setOpenDialog(false)}
                                variant="outlined"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={() => {
                                    if (newCityName.trim()) {
                                        dispatch(createCity({ name: newCityName.trim() }))
                                            .then(() => {
                                                setSnackbar({
                                                    open: true,
                                                    message: "City added successfully!",
                                                    severity: "success"
                                                });
                                                setNewCityName("");
                                                setOpenDialog(false);
                                            });
                                    }
                                }}
                                variant="contained"
                            >
                                Create
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog
                        open={!!confirmDeleteId}
                        onClose={() => setConfirmDeleteId(null)}
                    >
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogContent>
                            <Typography>Are you sure you want to delete this city?</Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setConfirmDeleteId(null)}>Cancel</Button>
                            <Button
                                onClick={() => {
                                    dispatch(deleteCity(confirmDeleteId)).then(() => {
                                        setSnackbar({
                                            open: true,
                                            message: "City deleted successfully!",
                                            severity: "success"
                                        });
                                        setConfirmDeleteId(null);
                                    });
                                }}
                                color="error"
                                variant="contained"
                            >
                                Delete
                            </Button>
                        </DialogActions>
                    </Dialog>
                </CardContent>
            </Card>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{ width: "100%" }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default CityManagement;