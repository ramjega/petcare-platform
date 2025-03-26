import React, { useEffect, useState } from "react";
import {
    Box, Typography, Card, CardHeader, CardContent,
    TextField, InputAdornment, Paper, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow,
    CircularProgress, Button, Dialog, DialogTitle,
    DialogContent, DialogActions, Snackbar, Alert, MenuItem,
    IconButton
} from "@mui/material";
import { Search, Edit, Save, Delete } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchMedicinalProducts,
    createMedicinalProduct,
    updateMedicinalProduct,
    deleteMedicinalProduct
} from "../../../redux/medicinalProductSlice";

const MEDICINE_TYPES = ["tablet", "syrup", "injection", "topical", "vaccine", "saline"];

const MedicineManagement = () => {
    const dispatch = useDispatch();
    const { medicinalProducts, loading } = useSelector(state => state.medicinalProduct);

    const [searchQuery, setSearchQuery] = useState("");
    const [openDialog, setOpenDialog] = useState(false);
    const [form, setForm] = useState({ brandName: "", medicineName: "", type: "" });
    const [editRowId, setEditRowId] = useState(null);
    const [editForm, setEditForm] = useState({ brandName: "", medicineName: "", type: "" });
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

    useEffect(() => {
        dispatch(fetchMedicinalProducts());
    }, [dispatch]);

    const handleCreate = () => {
        dispatch(createMedicinalProduct(form)).then(() => {
            setSnackbar({ open: true, message: "Medicine added successfully!", severity: "success" });
            setForm({ brandName: "", medicineName: "", type: "" });
            setOpenDialog(false);
        });
    };

    const filteredProducts = medicinalProducts?.filter(product =>
        product.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.medicineName.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    return (
        <Box sx={{ padding: 3 }}>
            <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
                <CardHeader
                    title="Medicine Management"
                    sx={{
                        backgroundColor: "#1976d2",
                        color: "white",
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: "1.5rem",
                        padding: "16px",
                    }}
                />
                <CardContent sx={{ padding: 3 }}>
                    {/* Search */}
                    <TextField
                        label="Search Medicines"
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
                        sx={{ mb: 2 }}
                    />

                    {/* Add New Button */}
                    <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => setOpenDialog(true)}
                            sx={{ fontWeight: "bold" }}
                        >
                            + Add Medicine
                        </Button>
                    </Box>

                    {/* Table */}
                    <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Brand Name</TableCell>
                                    <TableCell>Medicine Name</TableCell>
                                    <TableCell>Type</TableCell>
                                    <TableCell align="center">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">
                                            <CircularProgress size={24} />
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredProducts.map((product) => (
                                        <TableRow key={product.id}>
                                            <TableCell>{product.id}</TableCell>
                                            <TableCell>
                                                {editRowId === product.id ? (
                                                    <TextField
                                                        value={editForm.brandName}
                                                        onChange={(e) => setEditForm({ ...editForm, brandName: e.target.value })}
                                                        size="small"
                                                    />
                                                ) : product.brandName}
                                            </TableCell>
                                            <TableCell>
                                                {editRowId === product.id ? (
                                                    <TextField
                                                        value={editForm.medicineName}
                                                        onChange={(e) => setEditForm({ ...editForm, medicineName: e.target.value })}
                                                        size="small"
                                                    />
                                                ) : product.medicineName}
                                            </TableCell>
                                            <TableCell>
                                                {editRowId === product.id ? (
                                                    <TextField
                                                        select
                                                        value={editForm.type}
                                                        onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                                                        size="small"
                                                    >
                                                        {MEDICINE_TYPES.map((type) => (
                                                            <MenuItem key={type} value={type}>{type}</MenuItem>
                                                        ))}
                                                    </TextField>
                                                ) : (
                                                    <Typography sx={{ textTransform: "capitalize" }}>{product.type}</Typography>
                                                )}
                                            </TableCell>
                                            <TableCell align="center">
                                                {editRowId === product.id ? (
                                                    <IconButton
                                                        color="success"
                                                        onClick={() => {
                                                            dispatch(updateMedicinalProduct({ id: product.id, ...editForm })).then(() => {
                                                                setSnackbar({
                                                                    open: true,
                                                                    message: "Medicine updated successfully!",
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
                                                            setEditRowId(product.id);
                                                            setEditForm({
                                                                brandName: product.brandName,
                                                                medicineName: product.medicineName,
                                                                type: product.type
                                                            });
                                                        }}
                                                    >
                                                        <Edit />
                                                    </IconButton>
                                                )}
                                                <IconButton
                                                    color="error"
                                                    onClick={() => setConfirmDeleteId(product.id)}
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
                </CardContent>
            </Card>

            {/* Create Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Add New Medicine</DialogTitle>
                <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
                    <TextField
                        label="Brand Name"
                        value={form.brandName}
                        onChange={(e) => setForm({ ...form, brandName: e.target.value })}
                        fullWidth
                    />
                    <TextField
                        label="Medicine Name"
                        value={form.medicineName}
                        onChange={(e) => setForm({ ...form, medicineName: e.target.value })}
                        fullWidth
                    />
                    <TextField
                        select
                        label="Type"
                        value={form.type}
                        onChange={(e) => setForm({ ...form, type: e.target.value })}
                        fullWidth
                    >
                        {MEDICINE_TYPES.map((type) => (
                            <MenuItem key={type} value={type}>{type}</MenuItem>
                        ))}
                    </TextField>
                </DialogContent>
                <DialogActions sx={{ justifyContent: "center", mb: 2 }}>
                    <Button onClick={() => setOpenDialog(false)} variant="outlined">Cancel</Button>
                    <Button onClick={handleCreate} variant="contained">Create</Button>
                </DialogActions>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={!!confirmDeleteId} onClose={() => setConfirmDeleteId(null)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this medicine?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDeleteId(null)}>Cancel</Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                            dispatch(deleteMedicinalProduct(confirmDeleteId)).then(() => {
                                setSnackbar({
                                    open: true,
                                    message: "Medicine deleted successfully!",
                                    severity: "success"
                                });
                                setConfirmDeleteId(null);
                            });
                        }}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: "100%" }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default MedicineManagement;