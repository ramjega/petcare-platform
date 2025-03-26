import React, { useEffect, useState } from "react";
import {
    Box, Typography, IconButton, Card, CardContent, CardHeader,
    TextField, InputAdornment, Paper, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow,
    CircularProgress, Button, Dialog, DialogTitle,
    DialogContent, DialogActions, MenuItem, Snackbar, Alert
} from "@mui/material";
import { Search, Edit, Delete, Save } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrganizations, createOrganization, updateOrganization, deleteOrganization } from "../../../redux/organizationSlice";
import { fetchCities } from "../../../redux/citySlice";

const OrganizationManagement = () => {
    const dispatch = useDispatch();
    const { organizations, loading } = useSelector(state => state.organization);
    const { cities } = useSelector(state => state.city);

    const [searchQuery, setSearchQuery] = useState("");
    const [openDialog, setOpenDialog] = useState(false);
    const [form, setForm] = useState({ name: "", email: "", address: "", cityId: "" });
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

    const [editRowId, setEditRowId] = useState(null);
    const [editForm, setEditForm] = useState({ name: "", email: "", address: "", cityId: "" });
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);


    useEffect(() => {
        dispatch(fetchOrganizations());
        dispatch(fetchCities());
    }, [dispatch]);

    const handleCreate = () => {
        const payload = {
            name: form.name,
            email: form.email || null,
            address: form.address || null,
            city: { id: form.cityId }
        };

        dispatch(createOrganization(payload)).then(() => {
            setSnackbar({ open: true, message: "Organization created successfully!", severity: "success" });
            setOpenDialog(false);
            setForm({ name: "", email: "", address: "", cityId: "" });
        });
    };

    const filteredOrganizations = organizations?.filter(org =>
        org.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        org.city?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    return (
        <Box sx={{ padding: 3 }}>
            <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
                <CardHeader
                    title="Organization Management"
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
                    {/* Search and Create */}
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                        <TextField
                            label="Search Organizations"
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
                            sx={{ mr: 2 }}
                        />
                    </Box>

                    <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => setOpenDialog(true)}
                            sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}
                        >
                            + Add Organization
                        </Button>
                    </Box>

                    {/* Table */}
                    <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Address</TableCell>
                                    <TableCell>City</TableCell>
                                    <TableCell align="center">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center">
                                            <CircularProgress size={24} />
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredOrganizations.map((org) => (
                                        <TableRow key={org.id}>
                                            <TableCell>{org.id}</TableCell>
                                            <TableCell>
                                                {editRowId === org.id ? (
                                                    <TextField
                                                        value={editForm.name}
                                                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                                        size="small"
                                                    />
                                                ) : (
                                                    org.name
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {editRowId === org.id ? (
                                                    <TextField
                                                        value={editForm.email}
                                                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                                        size="small"
                                                    />
                                                ) : (
                                                    org.email || "N/A"
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {editRowId === org.id ? (
                                                    <TextField
                                                        value={editForm.address}
                                                        onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                                                        size="small"
                                                    />
                                                ) : (
                                                    org.address || "N/A"
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {editRowId === org.id ? (
                                                    <TextField
                                                        select
                                                        value={editForm.cityId}
                                                        onChange={(e) => setEditForm({ ...editForm, cityId: e.target.value })}
                                                        size="small"
                                                    >
                                                        {cities.map((city) => (
                                                            <MenuItem key={city.id} value={city.id}>{city.name}</MenuItem>
                                                        ))}
                                                    </TextField>
                                                ) : (
                                                    org.city?.name || "N/A"
                                                )}
                                            </TableCell>
                                            <TableCell align="center">
                                                {editRowId === org.id ? (
                                                    <IconButton
                                                        color="success"
                                                        onClick={() => {
                                                            const payload = {
                                                                id: org.id,
                                                                name: editForm.name,
                                                                email: editForm.email || null,
                                                                address: editForm.address || null,
                                                                city: { id: editForm.cityId }
                                                            };
                                                            dispatch(updateOrganization(payload)).then(() => {
                                                                setSnackbar({
                                                                    open: true,
                                                                    message: "Organization updated successfully!",
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
                                                            setEditRowId(org.id);
                                                            setEditForm({
                                                                name: org.name,
                                                                email: org.email || "",
                                                                address: org.address || "",
                                                                cityId: org.city?.id || ""
                                                            });
                                                        }}
                                                    >
                                                        <Edit />
                                                    </IconButton>
                                                )}
                                                <IconButton color="error" onClick={() => setConfirmDeleteId(org.id)}>
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
                <DialogTitle sx={{ fontWeight: "bold", textAlign: "center" }}>Add New Organization</DialogTitle>
                <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
                    <TextField
                        label="Name"
                        fullWidth
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                    <TextField
                        label="Email"
                        fullWidth
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                    <TextField
                        label="Address"
                        fullWidth
                        value={form.address}
                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                    />
                    <TextField
                        select
                        label="City"
                        fullWidth
                        value={form.cityId}
                        onChange={(e) => setForm({ ...form, cityId: e.target.value })}
                    >
                        {cities.map(city => (
                            <MenuItem key={city.id} value={city.id}>{city.name}</MenuItem>
                        ))}
                    </TextField>
                </DialogContent>
                <DialogActions sx={{ justifyContent: "center", mb: 2 }}>
                    <Button onClick={() => setOpenDialog(false)} variant="outlined">Cancel</Button>
                    <Button onClick={handleCreate} variant="contained">Create</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={!!confirmDeleteId} onClose={() => setConfirmDeleteId(null)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this organization?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDeleteId(null)}>Cancel</Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                            dispatch(deleteOrganization(confirmDeleteId)).then(() => {
                                setSnackbar({
                                    open: true,
                                    message: "Organization deleted successfully!",
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

export default OrganizationManagement;
