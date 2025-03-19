import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, TextField, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Button, InputAdornment
} from "@mui/material";
import { Search, FilterList, Person, Email, Work, ToggleOn, ToggleOff } from "@mui/icons-material";
import { fetchAllProfiles } from "../../../redux/profileSlice";

const UserManagement = () => {
    const dispatch = useDispatch();
    const users = useSelector((state) => state.profile.users);
    const loading = useSelector((state) => state.profile.loading);

    const [searchQuery, setSearchQuery] = useState("");
    const [filterRole, setFilterRole] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        dispatch(fetchAllProfiles());
    }, [dispatch]);

    const handleRowClick = (user) => setSelectedUser(user);
    const handleClose = () => setSelectedUser(null);

    const toggleUserStatus = () => console.log("Toggling status for:", selectedUser.id);
    const handleDelete = () => {
        if (window.confirm(`Are you sure you want to delete ${selectedUser.name}?`)) {
            console.log("Deleting user:", selectedUser.id);
            handleClose();
        }
    };

    const filteredUsers = users?.filter(user =>
        (user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (filterRole ? user.role === filterRole : true)
    ) || [];

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
                User Management
            </Typography>

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
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center">Loading...</TableCell>
                            </TableRow>
                        ) : (
                            filteredUsers.map((user) => (
                                <TableRow key={user.id} hover sx={{ cursor: "pointer" }} onClick={() => handleRowClick(user)}>
                                    <TableCell>{user.id}</TableCell>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email || "N/A"}</TableCell>
                                    <TableCell>{user.role}</TableCell>
                                    <TableCell>{user.status}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* User Details Popup */}
            <Dialog open={!!selectedUser} onClose={handleClose} fullWidth maxWidth="sm">
                {selectedUser && (
                    <>
                        <DialogTitle>User Details</DialogTitle>
                        <DialogContent>
                            <Typography>
                                <Person sx={{ color: "#1976d2", verticalAlign: "middle" }} /> <strong>ID:</strong> {selectedUser.id}
                            </Typography>
                            <Typography>
                                <Person sx={{ color: "#1976d2", verticalAlign: "middle" }} /> <strong>Name:</strong> {selectedUser.name}
                            </Typography>
                            <Typography>
                                <Email sx={{ color: "green", verticalAlign: "middle" }} /> <strong>Email:</strong> {selectedUser.email || "N/A"}
                            </Typography>
                            <Typography>
                                <Work sx={{ color: "purple", verticalAlign: "middle" }} /> <strong>Role:</strong> {selectedUser.role}
                            </Typography>
                            <Typography>
                                {selectedUser.status === "active" ?
                                    <ToggleOn sx={{ color: "green", verticalAlign: "middle" }} /> :
                                    <ToggleOff sx={{ color: "red", verticalAlign: "middle" }} />}
                                <strong>Status:</strong> {selectedUser.status}
                            </Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                variant="contained"
                                color={selectedUser.status === "active" ? "warning" : "success"}
                                onClick={toggleUserStatus}
                            >
                                {selectedUser.status === "active" ? "Suspend" : "Activate"}
                            </Button>
                            <Button variant="contained" color="error" onClick={handleDelete}>
                                Delete
                            </Button>
                            <Button variant="contained" color="primary" onClick={() => console.log("Edit User", selectedUser.id)}>
                                Edit
                            </Button>
                            <Button onClick={handleClose}>Close</Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </Box>
    );
};

export default UserManagement;
