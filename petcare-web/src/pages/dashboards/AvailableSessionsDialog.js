import React from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button,
    List, ListItem, ListItemText, Avatar, Typography, Box, Divider, Chip
} from "@mui/material";
import EventNoteIcon from "@mui/icons-material/EventNote";
import {format} from "date-fns";
import {Event, LocationOn} from "@mui/icons-material";

const AvailableSessionsDialog = ({ open, onClose, sessions, onSelectSession}) => {
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ textAlign: "center", fontWeight: "bold",  bgcolor: "#1976d2", color: "#fff", mb: 2 }}>
                Available Sessions
            </DialogTitle>
            <DialogContent sx={{ maxHeight: "70vh", overflowY: "auto", p: 3 }}>
                {sessions.length > 0 ? (
                    <List>
                        {sessions.map((session) => {
                            const availableSlots = session.maxAllowed - session.booked;
                            const formattedStartTime = format(new Date(session.start), "PPP, p"); // Format date & time

                            return (
                                <ListItem
                                    key={session.id}
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "flex-start",
                                        mb: 2,
                                        borderRadius: 2,
                                        boxShadow: 3,
                                        padding: 2,
                                        backgroundColor: "#fff", // ✅ White background for clean UI
                                        position: "relative",
                                        width: "100%",
                                        border: "1px solid #e0e0e0",
                                        transition: "0.3s",
                                        "&:hover": { transform: "scale(1.02)", boxShadow: 6 },
                                    }}
                                >
                                    {/* Avatar (Top Right Corner) */}
                                    <Avatar
                                        src={session.professional.imageUrl || undefined}
                                        alt={session.professional.name}
                                        sx={{
                                            width: 56,
                                            height: 56,
                                            position: "absolute",
                                            top: 16,
                                            right: 16,
                                            border: "3px solid white",
                                            boxShadow: 2,
                                            backgroundColor: "#e3f2fd",
                                        }}
                                    />

                                    {/* Session Details (Left Aligned) */}
                                    <ListItemText
                                        primary={
                                            <Typography variant="h6" fontWeight="bold" sx={{ color: "#1976d2", mb: 1 }}>
                                                {session.professional.name} - {session.professional.speciality}
                                            </Typography>
                                        }
                                        secondary={
                                            <>
                                                <Typography variant="body2" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                    <Event sx={{ fontSize: 18, color: "#1976d2" }} />
                                                    {formattedStartTime}
                                                </Typography>
                                                <Typography variant="body2" sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
                                                    <LocationOn sx={{ fontSize: 18, color: "#e53935" }} />
                                                    {session.organization.name}, {session.organization.city.name}
                                                </Typography>
                                            </>
                                        }
                                        primaryTypographyProps={{ fontWeight: "bold" }}
                                        secondaryTypographyProps={{ color: "text.secondary" }}
                                    />

                                    <Divider sx={{ my: 2, width: "100%" }} />

                                    {/* Status Badge & Available Slots */}
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 1, width: "100%" }}>
                                        <Chip
                                            label={session.status}
                                            sx={{
                                                bgcolor:
                                                    session.status === "Scheduled"
                                                        ? "#ffeb3b"
                                                        : session.status === "Started"
                                                            ? "#4caf50"
                                                            : session.status === "Completed"
                                                                ? "#9e9e9e"
                                                                : "#e57373",
                                                color: "#000",
                                                fontWeight: "bold",
                                            }}
                                        />
                                        <Typography variant="caption" sx={{ fontWeight: "bold", color: "#424242" }}>
                                            Available: <b>{availableSlots}</b>
                                        </Typography>
                                    </Box>

                                    {/* Book Button (Bottom Right Corner) */}
                                    <Button
                                        variant="contained"
                                        onClick={() => onSelectSession(session)}
                                        disabled={availableSlots === 0} // Disable if no slots left
                                        sx={{
                                            bgcolor: availableSlots > 0 ? "#1976d2" : "#bdbdbd",
                                            "&:hover": { bgcolor: availableSlots > 0 ? "#115293" : "#bdbdbd" },
                                            position: "absolute",
                                            bottom: 16,
                                            right: 16,
                                            borderRadius: "8px",
                                            fontWeight: "bold",
                                            padding: "6px 16px",
                                            boxShadow: 2,
                                        }}
                                    >
                                        Book
                                    </Button>
                                </ListItem>
                            );
                        })}
                    </List>
                ) : (
                    <Typography variant="h6" sx={{ textAlign: "center", color: "text.secondary" }}>
                        No sessions available. Try different dates
                    </Typography>
                )}
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AvailableSessionsDialog;
