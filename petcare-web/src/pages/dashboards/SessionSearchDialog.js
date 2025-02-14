import React, {useState} from "react";
import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Grid,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select,
    TextField
} from "@mui/material";
import {Business, Event, LocationCity, MedicalServices, Person, Pets} from "@mui/icons-material";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";

const SessionSearchDialog = ({
                                 open,
                                 onClose,
                                 searchCriteria,
                                 setSearchCriteria,
                                 handleSearch,
                                 pets,
                                 specialities,
                                 professionals,
                                 cities,
                                 organizations,
                                 loading
                             }) => {
    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setSearchCriteria({...searchCriteria, [name]: value});
    };

    const handleFromDateChange = (date) => {
        setSearchCriteria({...searchCriteria, from: date?.getTime()});
    };

    const handleToDateChange = (date) => {
        setSearchCriteria({...searchCriteria, to: date?.getTime()});
    };

    const handleSearchClick = () => {
        if (!searchCriteria.petId) {
            setErrors({petId: "Please select a pet."});
            return;
        }

        setErrors({});
        handleSearch();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm">
            <DialogTitle
                sx={{
                    textAlign: "center",
                    fontWeight: "bold",
                    bgcolor: "#1976d2",
                    color: "#fff",
                    mb: 2,
                    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)"
                }}
            >
                Search Available Slots
            </DialogTitle>
            <DialogContent sx={{maxHeight: "70vh", overflowY: "auto"}}>
                {/* Search Form */}
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Grid container spacing={2} sx={{mt: 2}}>

                        {/* Pet Dropdown */}
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel>Pet</InputLabel>
                                <Select
                                    name="petId"
                                    value={searchCriteria.petId}
                                    onChange={handleInputChange}
                                    label="Pet"
                                    error={!!errors.petId}
                                    helperText={errors.petId}
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <Pets color="action"/>
                                        </InputAdornment>
                                    }
                                >
                                    {pets.map((pet) => (
                                        <MenuItem key={pet.id} value={pet.id}>
                                            {pet.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Speciality Dropdown */}
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel>Appointment Type</InputLabel>
                                <Select
                                    name="speciality"
                                    value={searchCriteria.speciality}
                                    onChange={handleInputChange}
                                    label="Appointment Type"
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <MedicalServices color="action"/>
                                        </InputAdornment>
                                    }
                                >
                                    <MenuItem value="All">All</MenuItem>
                                    {specialities.map((type) => (
                                        <MenuItem key={type} value={type}>
                                            {type}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Professional Dropdown */}
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Professional Name</InputLabel>
                                <Select
                                    name="professionalId"
                                    value={searchCriteria.professionalId}
                                    onChange={handleInputChange}
                                    label="Professional Name"
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <Person color="action"/>
                                        </InputAdornment>
                                    }
                                >
                                    <MenuItem value="All">All</MenuItem>
                                    {professionals.map((professional) => (
                                        <MenuItem key={professional.id} value={professional.id}>
                                            {professional.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* From Date Picker */}
                        <Grid item xs={12} md={6}>
                            <DatePicker
                                label="From Date"
                                value={searchCriteria.from}
                                onChange={handleFromDateChange}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        fullWidth
                                        InputLabelProps={{shrink: true}}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Event color="action"/>
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                )}
                            />
                        </Grid>

                        {/* To Date Picker */}
                        <Grid item xs={12} md={6}>
                            <DatePicker
                                label="To Date"
                                value={searchCriteria.to}
                                onChange={handleToDateChange}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        fullWidth
                                        InputLabelProps={{shrink: true}}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Event color="action"/>
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                )}
                            />
                        </Grid>

                        {/* City Dropdown */}
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel>City</InputLabel>
                                <Select
                                    name="cityId"
                                    value={searchCriteria.cityId}
                                    onChange={handleInputChange}
                                    label="City"
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <LocationCity color="action"/>
                                        </InputAdornment>
                                    }
                                >
                                    <MenuItem value="All">All</MenuItem>
                                    {cities.map((city) => (
                                        <MenuItem key={city.id} value={city.id}>
                                            {city.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Organization Dropdown */}
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel>Organization</InputLabel>
                                <Select
                                    name="organizationId"
                                    value={searchCriteria.organizationId}
                                    onChange={handleInputChange}
                                    label="Organization"
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <Business color="action"/>
                                        </InputAdornment>
                                    }
                                >
                                    <MenuItem value="All">All</MenuItem>
                                    {organizations.map((organization) => (
                                        <MenuItem key={organization.id} value={organization.id}>
                                            {organization.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </LocalizationProvider>
            </DialogContent>
            <DialogActions sx={{px: 3, pb: 2}}>
                <Button onClick={onClose} sx={{color: "#555"}}>Cancel</Button>
                <Button variant="contained" onClick={handleSearchClick} disabled={loading}>
                    {loading ? <CircularProgress size={24} sx={{color: "white"}}/> : "Search"}
                </Button>
            </DialogActions>
        </Dialog>

    );
};

export default SessionSearchDialog;