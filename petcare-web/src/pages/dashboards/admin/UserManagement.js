import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, TextField, MenuItem, Avatar, InputAdornment, Card, CardHeader, CardContent,
    Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, Divider,
    Snackbar, Alert
} from "@mui/material";
import { Search, FilterList, Person, Email, Work, ToggleOn, ToggleOff, Delete, Edit, Close } from "@mui/icons-material";
import { fetchAllProfiles, deleteUser, toggleUserStatus } from "../../../redux/profileSlice";

const roleLabels = {
    admin: "Admin",
    pet_owner: "Pet Owner",
    professional: "Professional",
    community: "Community",
};

const UserManagement = () => {
    const dispatch = useDispatch();
    const users = useSelector((state) => state.profile.users);
    const loading = useSelector((state) => state.profile.loading);

    const [searchQuery, setSearchQuery] = useState("");
    const [filterRole, setFilterRole] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);

    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
    const [showEditDisabledDialog, setShowEditDisabledDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [superPassword, setSuperPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");


    // Fetch users on component mount
    useEffect(() => {
        dispatch(fetchAllProfiles());
    }, [dispatch]);

    // Function to handle row click and set selected user
    const handleRowClick = (user) => {
        console.log("User clicked:", user);
        setSelectedUser(user);
    };

    // Function to close the popup
    const handleClose = () => {
        setSelectedUser(null);
    };

    // Function to toggle user status (Suspend/Activate)
    const handleToggleStatus = () => {
        const updatedStatus = selectedUser.status === "active" ? "suspended" : "active";

        dispatch(toggleUserStatus({ id: selectedUser.id, status: updatedStatus }))
            .then(() => {
                setSnackbar({
                    open: true,
                    message: `User ${updatedStatus === "active" ? "activated" : "suspended"} successfully!`,
                    severity: "success"
                });
                handleClose();
                dispatch(fetchAllProfiles());
            });
    };

    // Function to delete user
    const handleDelete = () => {
        setSuperPassword("");
        setPasswordError("");
        setShowDeleteDialog(true);
    };

    const filteredUsers = users?.filter(user =>
        (user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (filterRole ? user.role === filterRole : true)
    ) || [];

    return (
        <Box sx={{ padding: 3 }}>
            {/* User Management Header */}
            <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
                <CardHeader
                    title="User Management"
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
                    {/* Search & Filter Inputs */}
                    <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                        <TextField
                            label="Search Users"
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
                        <TextField
                            select
                            label="Filter by Role"
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                            variant="outlined"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <FilterList sx={{ color: "green" }} />
                                    </InputAdornment>
                                )
                            }}
                        >
                            <MenuItem value="">All</MenuItem>
                            <MenuItem value="admin">Admin</MenuItem>
                            <MenuItem value="pet_owner">Pet Owner</MenuItem>
                            <MenuItem value="professional">Professional</MenuItem>
                            <MenuItem value="community">Community</MenuItem>
                        </TextField>
                    </Box>

                    {/* User Table */}
                    <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Avatar</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Role</TableCell>
                                    <TableCell>Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center">Loading...</TableCell>
                                    </TableRow>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <TableRow
                                            key={user.id}
                                            hover
                                            sx={{ cursor: "pointer", "&:hover": { backgroundColor: "#f5f5f5" } }}
                                            onClick={() => handleRowClick(user)}
                                        >
                                            <TableCell>{user.id}</TableCell>
                                            <TableCell>
                                                <Avatar
                                                    src={user.imageUrl || "https://via.placeholder.com/50"}
                                                    sx={{ width: 40, height: 40 }}
                                                />
                                            </TableCell>
                                            <TableCell>{user.name}</TableCell>
                                            <TableCell>{user.email || "N/A"}</TableCell>
                                            <TableCell sx={{ fontWeight: "bold", color: "#333" }}>
                                                {roleLabels[user.role] || "Unknown"}
                                            </TableCell>
                                            <TableCell>{user.status}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>

            {/* User Details Popup with Actions */}
            <Dialog open={!!selectedUser} onClose={handleClose} fullWidth maxWidth="sm">
                {selectedUser && (
                    <>
                        <DialogTitle sx={{ backgroundColor: "#1976d2", color: "white", textAlign: "center", fontWeight: "bold" }}>
                            User Details
                        </DialogTitle>
                        <DialogContent>
                            <Box sx={{ textAlign: "center", padding: 2 }}>
                                <Avatar
                                    src={selectedUser.imageUrl || "https://via.placeholder.com/150"}
                                    sx={{ width: 100, height: 100, margin: "auto", boxShadow: 2, border: "3px solid #1976d2" }}
                                />
                                <Typography variant="h6" sx={{ fontWeight: "bold", mt: 1 }}>
                                    <Person sx={{ color: "#1976d2", verticalAlign: "middle" }} /> {selectedUser.name}
                                </Typography>
                                <Typography>
                                    <Email sx={{ color: "green", verticalAlign: "middle" }} /> {selectedUser.email || "N/A"}
                                </Typography>
                                <Typography>
                                    <Work sx={{ color: "purple", verticalAlign: "middle" }} /> {roleLabels[selectedUser.role] || "Unknown"}
                                </Typography>
                            </Box>
                            <Divider sx={{ my: 2 }} />
                        </DialogContent>
                        <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
                            <Button
                                variant="contained"
                                color={selectedUser.status === "active" ? "warning" : "success"}
                                onClick={handleToggleStatus}
                                startIcon={selectedUser.status === "active" ? <ToggleOff /> : <ToggleOn />}
                            >
                                {selectedUser.status === "active" ? "Suspend" : "Activate"}
                            </Button>
                            <Button variant="contained" color="error" onClick={handleDelete} startIcon={<Delete />}>
                                Delete
                            </Button>
                            <Button
                                variant="contained"
                                color="info"
                                startIcon={<Edit />}
                                onClick={() => setShowEditDisabledDialog(true)}
                            >
                                Edit
                            </Button>
                            <Button onClick={handleClose} variant="outlined" startIcon={<Close />}>
                                Close
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>

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

            <Dialog open={showEditDisabledDialog} onClose={() => setShowEditDisabledDialog(false)}>
                <DialogTitle>Feature Unavailable</DialogTitle>
                <DialogContent>
                    <Typography>
                        Editing user details is currently disabled. Please contact the administrator if changes are required.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowEditDisabledDialog(false)} variant="outlined">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
                <DialogTitle>Super Admin Verification</DialogTitle>
                <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <Typography>
                        Please enter the <b>Super Admin password</b> to delete <b>{selectedUser?.name}</b>.
                    </Typography>
                    <TextField
                        label="Super Admin Password"
                        type="password"
                        value={superPassword}
                        onChange={(e) => setSuperPassword(e.target.value)}
                        error={!!passwordError}
                        helperText={passwordError}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowDeleteDialog(false)} variant="outlined">
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            if (superPassword !== "112") {
                                setPasswordError("Incorrect password");
                                return;
                            }

                            dispatch(deleteUser(selectedUser.id)).then(() => {
                                setSnackbar({
                                    open: true,
                                    message: "User deleted successfully!",
                                    severity: "success",
                                });
                                setShowDeleteDialog(false);
                                handleClose();
                                dispatch(fetchAllProfiles());
                            });
                        }}
                        variant="contained"
                        color="error"
                    >
                        Confirm Delete
                    </Button>
                </DialogActions>
            </Dialog>


        </Box>
    );
};

export default UserManagement;