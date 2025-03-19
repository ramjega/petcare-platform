import React, { useEffect, useState } from "react";
import { Box, Typography, Button, CircularProgress, List, ListItem, ListItemText, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import axios from "axios";

const HealthRecords = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [newRecord, setNewRecord] = useState({ petId: "", description: "", file: null });

    useEffect(() => {
        fetchRecords();
    }, []);

    const fetchRecords = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:8000/api/health-records");
            setRecords(response.data);
        } catch (error) {
            console.error("Error fetching records:", error);
        }
        setLoading(false);
    };

    return (
        <Box>
            <Typography variant="h5" fontWeight="bold">
                Pet Health Records 📜
            </Typography>

            {loading ? (
                <CircularProgress sx={{ display: "block", margin: "20px auto" }} />
            ) : (
                <List>
                    {records.map((record) => (
                        <ListItem key={record.id}>
                            <ListItemText primary={record.petName} secondary={record.description} />
                        </ListItem>
                    ))}
                </List>
            )}
        </Box>
    );
};

export default HealthRecords;
