import React, { useEffect, useState } from "react";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, TextField, MenuItem, Button } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import axios from "axios";

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterRole, setFilterRole] = useState("");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:8000/api/admin/users");
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
        setLoading(false);
    };

    const handleDelete = async (userId) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await axios.delete(`http://localhost:8000/api/admin/users/${userId}`);
                setUsers(users.filter(user => user.id !== userId));
            } catch (error) {
                console.error("Error deleting user:", error);
            }
        }
    };

    const filteredUsers = users.filter(user =>
        (user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (filterRole ? user.role === filterRole : true)
    );

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
                User Management
            </Typography>

            {/* Search & Filter */}
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <TextField
                    label="Search Users"
                    variant="outlined"
                    fullWidth
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <TextField
                    select
                    label="Filter by Role"
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    variant="outlined"
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
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center">Loading...</TableCell>
                            </TableRow>
                        ) : (
                            filteredUsers.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.id}</TableCell>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email || "N/A"}</TableCell>
                                    <TableCell>{user.role}</TableCell>
                                    <TableCell>{user.status}</TableCell>
                                    <TableCell>
                                        <IconButton color="primary">
                                            <Edit />
                                        </IconButton>
                                        <IconButton color="error" onClick={() => handleDelete(user.id)}>
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default UserManagement;
