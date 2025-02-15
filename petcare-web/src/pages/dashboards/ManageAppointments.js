import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";

import {
    Alert,
    Avatar,
    Box,
    Button,
    CircularProgress,
    Fab,
    List,
    ListItem,
    Snackbar,
    Typography,
    useMediaQuery,
    useTheme,
    Divider
} from "@mui/material";
import {Add, AddCircleOutline, Event, LocationOn, Person} from "@mui/icons-material";
import {fetchMyAppointments} from "../../redux/appointmentSlice";
import {fetchPets} from "../../redux/petSlice";
import {fetchOrganizations} from "../../redux/organizationSlice";
import {fetchCities} from "../../redux/citySlice";
import {fetchProfessionals} from "../../redux/profileSlice";
import {searchSessions} from "../../redux/sessionSlice";
import SessionSearchDialog from "./SessionSearchDialog";
import AvailableSessionsDialog from "./AvailableSessionsDialog";
import AppointmentBookingDialog from "./AppointmentBookingDialog";
import AppointmentList from "./AppointmentList";

const ManageAppointments = () => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const {appointments, status} = useSelector((state) => state.appointment);

    // fetch dropdown data
    const {pets} = useSelector((state) => state.pet);
    const {professionals} = useSelector((state) => state.profile);
    const {organizations} = useSelector((state) => state.organization);
    const {cities} = useSelector((state) => state.city);

    const [upcomingAppointments, setUpcomingAppointments] = useState([]);
    const [pastAppointments, setPastAppointments] = useState([]);

    const [snackbar, setSnackbar] = useState({open: false, message: "", severity: "success"});

    useEffect(() => {
        dispatch(fetchMyAppointments());
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchPets());
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchProfessionals());
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchOrganizations());
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchCities());
    }, [dispatch]);

    useEffect(() => {
        if (appointments.length > 0) {
            const currentDate = new Date();

            const upcoming = appointments
                .filter((appointment) => new Date(appointment.session.start) >= currentDate)
                .sort((a, b) => new Date(a.session.start) - new Date(b.session.start));

            const past = appointments
                .filter((appointment) => new Date(appointment.session.start) < currentDate)
                .sort((a, b) => new Date(b.session.start) - new Date(a.session.start));

            setUpcomingAppointments(upcoming);
            setPastAppointments(past);
        }
    }, [appointments]);

    const [searchDialogOpen, setSearchDialogOpen] = useState(false);
    const [sessionsDialogOpen, setSessionsDialogOpen] = useState(false);
    const [bookingDialogOpen, setBookingDialogOpen] = useState(false);

    const [loading, setLoading] = useState(false);
    const [availableSessions, setAvailableSessions] = useState([]);
    const [bookingRequest, setBookingRequest] = useState(null);

    const [searchCriteria, setSearchCriteria] = useState({
        petId:"",
        from: new Date().getTime(),
        to: new Date().getTime(),
        speciality: "All",
        professionalId: "All",
        organizationId: "All",
        cityId: "All",
    });

    const specialities = ["Veterinary", "Training", "Grooming"];

    const handleOpenSearchDialog = () => {
        setSearchDialogOpen(true);
    };

    const handleCloseSearchDialog = () => {
        setSearchDialogOpen(false);
    };

    const handleOpenSessionsDialog = () => {
        setSessionsDialogOpen(true);
    };

    const handleCloseSessionsDialog = () => {
        setSessionsDialogOpen(false);
    };

    const handleSearch = async () => {
        setLoading(true);

        const filteredCriteria = Object.fromEntries(
            Object.entries(searchCriteria)
                .filter(([key, value]) => key !== "petId" && value !== "All" && value !== null && value !== "")
        );

        try {
            const response = await dispatch(searchSessions(filteredCriteria)).unwrap()

            setAvailableSessions(response);
            handleCloseSearchDialog();
            handleOpenSessionsDialog();
        } catch (error) {
            console.error("Error fetching sessions:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectSession = (session) => {
        handleCloseSessionsDialog();

        setBookingRequest({
            petId: searchCriteria.petId,
            sessionId: session.id,

            petName: pets.find(pet => pet.id === searchCriteria.petId)?.name || "Unknown",
            petType: pets.find(pet => pet.id === searchCriteria.petId)?.type || "",
            petBreed: pets.find(pet => pet.id === searchCriteria.petId)?.breed || "",
            petGender: pets.find(pet => pet.id === searchCriteria.petId)?.gender || "",
            petBirthDate: pets.find(pet => pet.id === searchCriteria.petId)?.birthDate || "",
            petImageUrl: pets.find(pet => pet.id === searchCriteria.petId)?.imageUrl || "",

            professional: session.professional.name,
            professionalImageUrl: session.professional.imageUrl,
            speciality: session.professional.speciality,
            dateTime: new Date(session.start).toLocaleString(),
            organization: session.organization.name,
            city: session.organization.city.name
        });

        setBookingDialogOpen(true);
    };
    return (
        <Box sx={{padding: {xs: 2, md: 4}, backgroundColor: "#f0f4f8", minHeight: "100vh"}}>
            {/* Page Header */}
            <Box
                sx={{
                    textAlign: "center",
                    mb: 4,
                    padding: {xs: 2, md: 3},
                    background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
                    borderRadius: 3,
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
                    color: "#fff",
                }}
            >
                <Typography
                    variant="subtitle1"
                    sx={{
                        mt: 1,
                        fontSize: {xs: "0.9rem", md: "1.1rem"},
                        color: "rgba(255, 255, 255, 0.9)",
                    }}
                >
                    Keep track of your pet's health and wellness 🐾
                </Typography>
            </Box>

            {/* Appointment List */}
            <AppointmentList
                status={status}
                upcomingAppointments={upcomingAppointments}
                pastAppointments={pastAppointments}
                handleOpenSearchDialog={handleOpenSearchDialog}
                isMobile={isMobile}
            />

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
                    onClick={() => setSearchDialogOpen(true)}
                >
                    <Add/>
                </Fab>

            )}

            <SessionSearchDialog
                open={searchDialogOpen}
                onClose={handleCloseSearchDialog}
                searchCriteria={searchCriteria}
                setSearchCriteria={setSearchCriteria}
                handleSearch={handleSearch}
                pets={pets}
                specialities={specialities}
                professionals={professionals}
                cities={cities}
                organizations={organizations}
                loading={loading}
            />

            <AvailableSessionsDialog
                open={sessionsDialogOpen}
                onClose={handleCloseSessionsDialog}
                sessions={availableSessions}
                onSelectSession={handleSelectSession}
            />

            <AppointmentBookingDialog
                open={bookingDialogOpen}
                onClose={() => setBookingDialogOpen(false)}
                bookingRequest={bookingRequest}
                setSnackbar={setSnackbar}
            />

            {/* Snackbar Alert */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({...snackbar, open: false})}
                anchorOrigin={{vertical: "top", horizontal: "center"}}
            >
                <Alert
                    onClose={() => setSnackbar({...snackbar, open: false})}
                    severity={snackbar.severity}
                    sx={{width: "100%"}}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ManageAppointments;