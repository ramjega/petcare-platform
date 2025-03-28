import React, {useEffect, useRef, useState} from "react";
import {
    Avatar,
    Box,
    Button,
    Card,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    List,
    MenuItem,
    Select,
    TextField,
    Tooltip,
    Typography
} from "@mui/material";
import {ArrowBack, Delete, Edit} from "@mui/icons-material";
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import AddIcon from '@mui/icons-material/Add';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PushPinIcon from '@mui/icons-material/PushPin';
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BusinessIcon from '@mui/icons-material/Business';
import TodayIcon from '@mui/icons-material/Today';
import CategoryIcon from '@mui/icons-material/Category';
import RepeatIcon from '@mui/icons-material/Repeat';
import NumbersIcon from '@mui/icons-material/Numbers';
import NotesIcon from '@mui/icons-material/Notes';
import HealingIcon from '@mui/icons-material/Healing';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import MedicationLiquidIcon from '@mui/icons-material/MedicationLiquid';
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import PetsIcon from '@mui/icons-material/Pets';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import StraightenIcon from '@mui/icons-material/Straighten';
import ScaleIcon from '@mui/icons-material/Scale';
import InputAdornment from '@mui/material/InputAdornment';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import HotelIcon from '@mui/icons-material/Hotel';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import {useDispatch, useSelector} from "react-redux";
import {deletePet, fetchPetById} from "../../redux/petSlice";
import {useNavigate, useParams} from "react-router-dom";
import PetDialog from "./PetDialog";
import ColorThief from "colorthief";
import {Line} from "react-chartjs-2";

import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip as ChartTooltip
} from "chart.js";

import {DatePicker, DateTimePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";

import {Chart} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import FlagIcon from '@mui/icons-material/Flag';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import AddAlertIcon from '@mui/icons-material/AddAlert';

import {fetchAppointmentsByPet} from "../../redux/appointmentSlice";
import {fetchDispensesByPet} from "../../redux/dispenseSlice";
import {fetchObservationsByPet} from "../../redux/observationSlice";
import {createReminder, fetchRemindersByPet, deleteReminder} from "../../redux/reminderSlice";
import {createGrowthData, fetchGrowthDataByPet} from "../../redux/growthDataSlice";
import {createActivityLog, fetchActivityLogsByPet} from "../../redux/activityLogSlice";

// Register the annotation plugin
Chart.register(annotationPlugin);
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, ChartTooltip, Legend);

const PetView = () => {
    const {petId} = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {selectedPet, status} = useSelector((state) => state.pet);

    const [bookDialogOpen, setBookDialogOpen] = useState(false);
    const [appointmentType, setAppointmentType] = useState("");

    const {appointments} = useSelector((state) => state.appointment);
    const {dispenses} = useSelector((state) => state.dispense);
    const {observations} = useSelector((state) => state.observation);
    const {reminders} = useSelector((state) => state.reminder);

    const {growthData} = useSelector((state) => state.growthData);
    const [newWeight, setNewWeight] = useState("");
    const [selectedDate, setSelectedDate] = useState(null);

    const [targetWeight, setTargetWeight] = useState('');
    const [showGoalLine, setShowGoalLine] = useState(false);

    const {activityLogs} = useSelector((state) => state.activityLog);
    const [activityDialogOpen, setActivityDialogOpen] = useState(false);
    const [activityForm, setActivityForm] = useState({
        walkDistance: "",
        exerciseTime: "",
        sleepHours: ""
    });

    const handleBookAppointment = () => {
        setBookDialogOpen(false);
    };
    const [petDialogOpen, setPetDialogOpen] = useState(false);
    const [reminderDialogOpen, setReminderDialogOpen] = useState(false);
    const [newReminder, setNewReminder] = useState({
        date: null,
        message: ''
    });

    const cardRef = useRef(null);

    useEffect(() => {
        dispatch(fetchPetById(petId));
        dispatch(fetchAppointmentsByPet(petId));
        dispatch(fetchDispensesByPet(petId));
        dispatch(fetchObservationsByPet(petId));
        dispatch(fetchRemindersByPet(petId));
        dispatch(fetchGrowthDataByPet(petId));
        dispatch(fetchActivityLogsByPet(petId));
    }, [dispatch, petId]);

    const handleDeletePet = () => {
        if (window.confirm("Are you sure you want to delete this pet?")) {
            dispatch(deletePet(petId)).then((result) => {
                if (deletePet.fulfilled.match(result)) {
                    navigate("/dashboard/pets"); // Redirect after deletion
                }
            });
        }
    };

    // Function to extract dominant color from the avatar image
    const getDominantColor = (imageUrl, callback) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = imageUrl;
        img.onload = () => {
            const colorThief = new ColorThief();
            const dominantColor = colorThief.getColor(img);
            callback(`rgb(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]})`);
        };
        img.onerror = () => {
            console.log("Image failed to load, using default background");
            callback("#a1c4fd"); // Fallback to a default color
        };
    };

    // Helper component for professional icons
    const ProfessionalIcon = ({specialty}) => {
        const iconProps = {
            sx: {fontSize: '1rem', mr: 1, color: 'text.secondary'}
        };

        switch (specialty?.toLowerCase()) {
            case 'veterinary':
                return <MedicalServicesIcon {...iconProps} />;
            case 'training':
                return <PetsIcon {...iconProps} />;
            case 'grooming':
                return <ContentCutIcon {...iconProps} />;
            default:
                return <MedicalServicesIcon {...iconProps} />; // Default icon
        }
    };

    const handleAddWeight = () => {
        if (!selectedDate || !newWeight) return;

        const payload = {
            date: selectedDate.toISOString().split("T")[0],
            weight: parseFloat(newWeight),
            pet: {id: selectedPet.id}
        };

        dispatch(createGrowthData(payload)).then(() => {
            setNewWeight("");
            setSelectedDate(null);
            dispatch(fetchGrowthDataByPet(petId));
        });
    };

    const handleActivityInputChange = (e) => {
        setActivityForm({...activityForm, [e.target.name]: e.target.value});
    };

    const handleActivitySubmit = () => {
        if (!activityForm.walkDistance || !activityForm.exerciseTime || !activityForm.sleepHours) {
            alert("Please fill in all fields");
            return;
        }

        const payload = {
            pet: {id: selectedPet.id},
            walkDistance: parseFloat(activityForm.walkDistance),
            exerciseDuration: parseFloat(activityForm.exerciseDuration),
            sleepDuration: parseFloat(activityForm.sleepDuration),
        };

        dispatch(createActivityLog(payload)).then(() => {
            setActivityDialogOpen(false);
            setActivityForm({walkDistance: "", exerciseTime: "", sleepHours: ""});
            dispatch(fetchActivityLogsByPet(petId));
        });
    };

    const handleAddReminder = async () => {
        let payload = {
            reminderDate: newReminder.date.getTime(),
            message: newReminder.message,
            pet: {
                id: petId
            },
        };

        dispatch(createReminder(payload)).then(() => {
            setNewReminder({date: null, message: ''});
            setReminderDialogOpen(false);
            dispatch(fetchRemindersByPet(petId));
        });

    };

    return (
        <Box sx={{padding: {xs: 2, md: 4}, backgroundColor: "#f5f5f5", minHeight: "100vh"}}>
            {/* Back Button */}
            <IconButton onClick={() => navigate("/dashboard/pets")} sx={{mb: 2}}>
                <ArrowBack sx={{fontSize: 30, color: "#1976d2"}}/>
            </IconButton>

            {status === "loading" ? (
                <CircularProgress sx={{display: "block", margin: "20px auto"}}/>
            ) : selectedPet ? (
                <>
                    {/* Pet Detail Card */}
                    <Card
                        ref={cardRef}
                        sx={{
                            borderRadius: 4,
                            boxShadow: 3,
                            padding: 3,
                            color: "#fff",
                            marginBottom: 3,
                            background: "linear-gradient(135deg, #90caf9, #42a5f5, #1e88e5)"
                        }}
                    >
                        <Grid container spacing={3} alignItems="center">
                            <Grid item xs={12} md={4} sx={{textAlign: "center"}}>
                                <Avatar
                                    src={selectedPet.imageUrl || undefined}
                                    sx={{
                                        width: 150,
                                        height: 150,
                                        border: "4px solid white",
                                        boxShadow: 3,
                                        margin: "0 auto",
                                        backgroundColor: selectedPet.imageUrl ? "transparent" : "#e0e0e0"
                                    }}
                                    onLoad={(e) => {
                                        if (selectedPet.imageUrl) {
                                            getDominantColor(selectedPet.imageUrl, (color) => {
                                                if (cardRef.current) {
                                                    cardRef.current.style.background = `linear-gradient(135deg, ${color}, rgba(0, 0, 0, 0.8))`;
                                                    cardRef.current.style.transition = "background 0.5s ease";
                                                }
                                            });
                                        }
                                    }}
                                >
                                    {!selectedPet.imageUrl && <PetsIcon sx={{fontSize: 60, color: "gray"}}/>}
                                </Avatar>
                            </Grid>
                            <Grid item xs={12} md={8}>
                                <Typography variant="h4" fontWeight="bold" gutterBottom>
                                    {selectedPet.name}
                                </Typography>
                                <Chip label={selectedPet.type} sx={{bgcolor: "#ffffff", color: "#000", mb: 2}}/>
                                <Typography variant="body1">📌 Breed: {selectedPet.breed}</Typography>
                                <Typography variant="body1">⚥ Gender: {selectedPet.gender}</Typography>
                                <Typography variant="body1">🎨 Color: {selectedPet.color}</Typography>
                                <Typography variant="body1">🎂 Birth
                                    Date: {selectedPet.birthDate ? new Date(selectedPet.birthDate).toLocaleDateString() : "Unknown"}</Typography>
                            </Grid>
                        </Grid>

                        <Divider sx={{my: 3, bgcolor: "#ffffff"}}/>

                        {/* Action Buttons */}
                        <Box sx={{display: "flex", justifyContent: "flex-end", gap: 1}}>
                            <Tooltip title="Edit Pet">
                                <IconButton onClick={() => setPetDialogOpen(true)} sx={{
                                    backgroundColor: "#ffffff88",
                                    "&:hover": {backgroundColor: "#ffffffaa"}
                                }}>
                                    <Edit sx={{color: "#1976d2"}}/>
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="Delete Pet">
                                <IconButton onClick={handleDeletePet} sx={{
                                    backgroundColor: "#ffffff88",
                                    "&:hover": {backgroundColor: "#ffffffaa"}
                                }}>
                                    <Delete sx={{color: "red"}}/>
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Card>

                    {/* Growth & Weight Tracker */}
                    <Card sx={{
                        mt: 4,
                        p: 3,
                        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
                        borderRadius: '12px',
                        background: 'linear-gradient(to bottom, #ffffff, #f8fbff)'
                    }}>
                        <Box sx={{display: 'flex', alignItems: 'center', mb: 2}}>
                            <TrendingUpIcon color="primary" sx={{mr: 1.5}}/>
                            <Typography variant="h6" fontWeight="bold" color="primary">
                                Weight Tracker
                            </Typography>
                        </Box>
                        <Divider sx={{my: 2, borderColor: 'divider'}}/>

                        {/* Goal Weight Input */}
                        <Box sx={{
                            mb: 3,
                            p: 2,
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: '8px',
                            backgroundColor: 'background.paper'
                        }}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={12} sm={8}>
                                    <TextField
                                        label="Target Weight (kg)"
                                        value={targetWeight}
                                        type="number"
                                        fullWidth
                                        size="small"
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <FlagIcon fontSize="small" color="action"/>
                                                </InputAdornment>
                                            ),
                                            inputProps: {
                                                step: "0.1",
                                                min: "0"
                                            }
                                        }}
                                        onChange={(e) => setTargetWeight(e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        fullWidth
                                        onClick={() => setShowGoalLine(!showGoalLine)}
                                        sx={{height: '40px'}}
                                        startIcon={showGoalLine ? <VisibilityOffIcon/> : <VisibilityIcon/>}
                                    >
                                        {showGoalLine ? 'Hide Goal' : 'Show Goal'}
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>

                        {growthData.length > 0 ? (
                            <Box sx={{height: '300px'}}>
                                <Line
                                    data={{
                                        labels: growthData.map((g) => new Date(g.date).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric'
                                        })),
                                        datasets: [{
                                            label: "Current Weight (kg)",
                                            data: growthData.map((g) => g.weight),
                                            borderColor: "#1976d2",
                                            backgroundColor: "rgba(25, 118, 210, 0.1)",
                                            borderWidth: 2,
                                            pointBackgroundColor: "#1976d2",
                                            pointRadius: 4,
                                            pointHoverRadius: 6,
                                            tension: 0.3,
                                            fill: true
                                        }]
                                    }}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            annotation: {
                                                annotations: showGoalLine && targetWeight ? {
                                                    goalLine: {
                                                        type: 'line',
                                                        yMin: targetWeight,
                                                        yMax: targetWeight,
                                                        borderColor: '#ff5722',
                                                        borderWidth: 2,
                                                        borderDash: [6, 6],
                                                        label: {
                                                            content: `Target: ${targetWeight}kg`,
                                                            enabled: true,
                                                            position: 'right',
                                                            backgroundColor: 'rgba(255, 87, 34, 0.8)',
                                                            color: '#fff',
                                                            font: {
                                                                weight: 'bold'
                                                            }
                                                        }
                                                    }
                                                } : {},
                                            },
                                            tooltip: {
                                                callbacks: {
                                                    label: (context) => `${context.dataset.label}: ${context.raw} kg`
                                                }
                                            },
                                            legend: {
                                                position: 'top',
                                                labels: {
                                                    usePointStyle: true,
                                                    padding: 20
                                                }
                                            }
                                        },
                                        scales: {
                                            y: {
                                                beginAtZero: false,
                                                title: {
                                                    display: true,
                                                    text: 'Weight (kg)'
                                                },
                                                suggestedMin: Math.min(...growthData.map(g => g.weight)) - 2,
                                                suggestedMax: Math.max(
                                                    ...growthData.map(g => g.weight),
                                                    targetWeight || 0
                                                ) + 2
                                            },
                                            x: {
                                                title: {
                                                    display: true,
                                                    text: 'Date'
                                                }
                                            }
                                        }
                                    }}
                                />
                            </Box>
                        ) : (
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                py: 4,
                                color: 'text.secondary'
                            }}>
                                <StraightenIcon sx={{fontSize: '3rem', mb: 1, opacity: 0.5}}/>
                                <Typography>No weight data recorded yet</Typography>
                            </Box>
                        )}

                        <Box sx={{
                            mt: 3,
                            p: 2,
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: '8px',
                            backgroundColor: 'background.paper'
                        }}>
                            <Typography variant="subtitle2" fontWeight="500" sx={{mb: 1.5}}>
                                Add New Measurement
                            </Typography>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={12} sm={5}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DatePicker
                                            label="Measurement Date"
                                            value={selectedDate}
                                            onChange={(date) => setSelectedDate(date)}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    fullWidth
                                                    size="small"
                                                />
                                            )}
                                            inputFormat="MMM d, yyyy"
                                        />
                                    </LocalizationProvider>
                                </Grid>
                                <Grid item xs={12} sm={5}>
                                    <TextField
                                        label="Weight (kg)"
                                        value={newWeight}
                                        type="number"
                                        fullWidth
                                        size="small"
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <ScaleIcon fontSize="small" color="action"/>
                                                </InputAdornment>
                                            ),
                                            inputProps: {
                                                step: "0.1",
                                                min: "0"
                                            }
                                        }}
                                        onChange={(e) => setNewWeight(e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={2}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        startIcon={<AddIcon/>}
                                        onClick={handleAddWeight}
                                        sx={{
                                            height: '40px',
                                            borderRadius: '8px',
                                            textTransform: 'none'
                                        }}
                                        disabled={!selectedDate || !newWeight}
                                    >
                                        Record
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </Card>

                    {/* Activity Log */}
                    <Card sx={{
                        mt: 4,
                        p: 3,
                        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
                        borderRadius: '12px',
                        background: 'linear-gradient(to bottom, #ffffff, #f8fbff)'
                    }}>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 2
                        }}>
                            <Box sx={{display: 'flex', alignItems: 'center'}}>
                                <PetsIcon color="primary" sx={{mr: 1.5}}/>
                                <Typography variant="h6" fontWeight="600" color="text.primary">
                                    Daily Activity
                                </Typography>
                            </Box>
                            <Button
                                variant="contained"
                                size="small"
                                startIcon={<AddIcon/>}
                                onClick={() => setActivityDialogOpen(true)}
                                sx={{
                                    borderRadius: '8px',
                                    textTransform: 'none',
                                    padding: '4px 12px'
                                }}
                            >
                                Add Activity
                            </Button>
                        </Box>
                        <Divider sx={{my: 2, borderColor: 'divider'}}/>

                        {activityLogs.length > 0 ? (
                            <>
                                {activityLogs.slice(-2).reverse().map((log) => (
                                    <Card
                                        key={log.id}
                                        sx={{
                                            mb: 2,
                                            p: 2,
                                            borderLeft: '4px solid',
                                            borderLeftColor: 'primary.main',
                                            borderRadius: '8px',
                                            transition: 'transform 0.2s',
                                            '&:hover': {
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'
                                            }
                                        }}
                                    >
                                        <Box sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            mb: 1
                                        }}>
                                            <Typography variant="subtitle2" fontWeight="500">
                                                <CalendarTodayIcon sx={{
                                                    fontSize: '1rem',
                                                    mr: 1,
                                                    verticalAlign: 'middle',
                                                    color: 'text.secondary'
                                                }}/>
                                                {new Date(log.createdTime).toLocaleDateString('en-US', {
                                                    weekday: 'short',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </Typography>
                                            <Chip
                                                label="Today"
                                                size="small"
                                                color="primary"
                                                variant="outlined"
                                                sx={{height: '24px'}}
                                            />
                                        </Box>

                                        <Grid container spacing={1} sx={{mt: 0.5}}>
                                            <Grid item xs={12} sm={4}>
                                                <Typography variant="body2"
                                                            sx={{display: 'flex', alignItems: 'center'}}>
                                                    <PetsIcon sx={{
                                                        fontSize: '1rem',
                                                        mr: 1,
                                                        color: 'text.secondary'
                                                    }}/>
                                                    Walk: <Box component="span" fontWeight="500" sx={{ml: 0.5}}>
                                                    {log.walkDistance} km
                                                </Box>
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <Typography variant="body2"
                                                            sx={{display: 'flex', alignItems: 'center'}}>
                                                    <FitnessCenterIcon sx={{
                                                        fontSize: '1rem',
                                                        mr: 1,
                                                        color: 'text.secondary'
                                                    }}/>
                                                    Exercise: <Box component="span" fontWeight="500" sx={{ml: 0.5}}>
                                                    {log.exerciseDuration} min
                                                </Box>
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <Typography variant="body2"
                                                            sx={{display: 'flex', alignItems: 'center'}}>
                                                    <HotelIcon sx={{
                                                        fontSize: '1rem',
                                                        mr: 1,
                                                        color: 'text.secondary'
                                                    }}/>
                                                    Sleep: <Box component="span" fontWeight="500" sx={{ml: 0.5}}>
                                                    {log.sleepDuration} hrs
                                                </Box>
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Card>
                                ))}
                                <Button
                                    fullWidth
                                    sx={{mt: 1, textTransform: 'none'}}
                                    endIcon={<ChevronRightIcon/>}
                                >
                                    View All Activities
                                </Button>
                            </>
                        ) : (
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                py: 4,
                                color: 'text.secondary'
                            }}>
                                <PetsIcon sx={{fontSize: '3rem', mb: 1, opacity: 0.5}}/>
                                <Typography variant="body1" sx={{mb: 1}}>No activities recorded yet</Typography>
                                <Button
                                    variant="outlined"
                                    startIcon={<AddIcon/>}
                                    onClick={() => setActivityDialogOpen(true)}
                                    sx={{mt: 1}}
                                >
                                    Log First Activity
                                </Button>
                            </Box>
                        )}
                    </Card>

                    {/* Activity Log Dialog */}
                    <Dialog
                        open={activityDialogOpen}
                        onClose={() => setActivityDialogOpen(false)}
                        PaperProps={{
                            sx: {
                                borderRadius: '12px',
                                padding: '16px',
                                width: '100%',
                                maxWidth: '400px'
                            }
                        }}
                    >
                        <DialogTitle sx={{
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5
                        }}>
                            <NoteAddIcon color="primary"/>
                            Add Daily Activity
                        </DialogTitle>
                        <DialogContent sx={{pt: '16px !important'}}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Walk Distance (km)"
                                        name="walkDistance"
                                        type="number"
                                        value={activityForm.walkDistance}
                                        onChange={handleActivityInputChange}
                                        fullWidth
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <PetsIcon color="action"/>
                                                </InputAdornment>
                                            ),
                                            inputProps: {
                                                step: "0.1",
                                                min: "0"
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Exercise Time (minutes)"
                                        name="exerciseTime"
                                        type="number"
                                        value={activityForm.exerciseTime}
                                        onChange={handleActivityInputChange}
                                        fullWidth
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <FitnessCenterIcon color="action"/>
                                                </InputAdornment>
                                            ),
                                            inputProps: {
                                                step: "5",
                                                min: "0"
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Sleep Hours"
                                        name="sleepHours"
                                        type="number"
                                        value={activityForm.sleepHours}
                                        onChange={handleActivityInputChange}
                                        fullWidth
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <HotelIcon color="action"/>
                                                </InputAdornment>
                                            ),
                                            inputProps: {
                                                step: "0.5",
                                                min: "0",
                                                max: "24"
                                            }
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions sx={{
                            justifyContent: 'space-between',
                            px: '24px',
                            py: '16px'
                        }}>
                            <Button
                                onClick={() => setActivityDialogOpen(false)}
                                sx={{
                                    borderRadius: '8px',
                                    textTransform: 'none'
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleActivitySubmit}
                                sx={{
                                    borderRadius: '8px',
                                    textTransform: 'none'
                                }}
                                disabled={!activityForm.walkDistance && !activityForm.exerciseTime && !activityForm.sleepHours}
                            >
                                Save Activity
                            </Button>
                        </DialogActions>
                    </Dialog>

                    {/* Upcoming Reminders */}
                    <Card sx={{
                        mt: 4,
                        p: 3,
                        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
                        borderRadius: '12px',
                        background: 'linear-gradient(to bottom, #ffffff, #f8fbff)'
                    }}>
                        <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2}}>
                            <Box sx={{display: 'flex', alignItems: 'center'}}>
                                <NotificationsActiveIcon color="primary" sx={{mr: 1.5}}/>
                                <Typography variant="h6" fontWeight="600" color="text.primary">
                                    Reminders
                                </Typography>
                            </Box>
                            <Button
                                variant="contained"
                                size="small"
                                startIcon={<AddIcon/>}
                                onClick={() => setReminderDialogOpen(true)}
                                sx={{
                                    borderRadius: '8px',
                                    textTransform: 'none',
                                    padding: '4px 12px'
                                }}
                            >
                                New Reminder
                            </Button>
                        </Box>
                        <Divider sx={{my: 2, borderColor: 'divider'}}/>

                        {reminders.length > 0 ? (
                            <List sx={{display: "flex", flexDirection: "column", gap: 2}}>
                                {reminders
                                    .slice()
                                    .sort((a, b) => new Date(a.reminderDate) - new Date(b.reminderDate))
                                    .map((reminder) => (
                                        <Card
                                            key={reminder.id}
                                            sx={{
                                                borderLeft: '4px solid',
                                                borderLeftColor: reminder.createdBy === 'owner' ? '#4caf50' : '#1976d2',
                                                borderRadius: '8px',
                                                padding: 2,
                                                transition: 'transform 0.2s, box-shadow 0.2s',
                                                '&:hover': {
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'
                                                }
                                            }}
                                        >
                                            <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                                                <Typography variant="subtitle1" fontWeight="500">
                                                    <CalendarTodayIcon sx={{
                                                        fontSize: '1rem',
                                                        mr: 1,
                                                        verticalAlign: 'middle'
                                                    }}/>
                                                    {new Date(reminder.reminderDate).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </Typography>
                                                <Chip
                                                    label={reminder.createdBy === 'owner' ? 'Your reminder' : 'Professional'}
                                                    size="small"
                                                    color={reminder.createdBy === 'owner' ? 'success' : 'primary'}
                                                    variant="outlined"
                                                    sx={{height: '24px'}}
                                                />
                                            </Box>
                                            <Typography variant="body2" sx={{
                                                mt: 1.5,
                                                display: 'flex',
                                                alignItems: 'flex-start'
                                            }}>
                                                <PushPinIcon sx={{
                                                    fontSize: '1rem',
                                                    mr: 1,
                                                    color: 'text.secondary'
                                                }}/>
                                                {reminder.message}
                                            </Typography>
                                            <Box sx={{display: 'flex', justifyContent: 'flex-end', mt: 2}}>
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    color="secondary"
                                                    startIcon={<CheckCircleIcon/>}
                                                    onClick={() => dispatch(deleteReminder(reminder.id))}
                                                    sx={{
                                                        textTransform: 'none',
                                                        borderRadius: '8px',
                                                        fontSize: '0.75rem',
                                                        padding: '4px 12px'
                                                    }}
                                                >
                                                    Mark as Done
                                                </Button>
                                            </Box>
                                        </Card>
                                    ))}
                            </List>
                        ) : (
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                py: 4,
                                color: 'text.secondary'
                            }}>
                                <NotificationsOffIcon sx={{fontSize: '3rem', mb: 1, opacity: 0.5}}/>
                                <Typography variant="body1" sx={{mb: 1}}>No reminders scheduled</Typography>
                                <Button
                                    variant="outlined"
                                    startIcon={<AddIcon/>}
                                    onClick={() => setReminderDialogOpen(true)}
                                    sx={{mt: 1}}
                                >
                                    Add Your First Reminder
                                </Button>
                            </Box>
                        )}
                    </Card>

                    {/* Add Reminder Dialog */}
                    <Dialog
                        open={reminderDialogOpen}
                        onClose={() => setReminderDialogOpen(false)}
                        PaperProps={{
                            sx: {
                                borderRadius: '12px',
                                padding: '16px',
                                width: '100%',
                                maxWidth: '400px'
                            }
                        }}
                    >
                        <DialogTitle sx={{
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5
                        }}>
                            <AddAlertIcon color="primary"/>
                            Create New Reminder
                        </DialogTitle>
                        <DialogContent sx={{pt: '16px !important', display: 'flex', flexDirection: 'column', gap: 2}}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DateTimePicker
                                    label="Reminder Date & Time"
                                    value={newReminder.date}
                                    onChange={(date) => setNewReminder({...newReminder, date})}
                                    minDate={new Date()}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                        },
                                        actionBar: {
                                            actions: ['accept', 'cancel', 'today', 'clear'],
                                        },
                                    }}
                                    disablePast
                                    format="MMM d, yyyy h:mm a"
                                />
                            </LocalizationProvider>
                            <TextField
                                label="Reminder Message"
                                value={newReminder.message}
                                onChange={(e) => setNewReminder({...newReminder, message: e.target.value})}
                                fullWidth
                                multiline
                                rows={3}
                                placeholder="E.g., Give medication, Schedule vet visit, Buy pet food"
                            />
                        </DialogContent>
                        <DialogActions sx={{
                            justifyContent: 'space-between',
                            px: '24px',
                            py: '16px'
                        }}>
                            <Button
                                onClick={() => setReminderDialogOpen(false)}
                                sx={{
                                    borderRadius: '8px',
                                    textTransform: 'none'
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleAddReminder}
                                sx={{
                                    borderRadius: '8px',
                                    textTransform: 'none'
                                }}
                                disabled={!newReminder.date || !newReminder.message}
                            >
                                Save Reminder
                            </Button>
                        </DialogActions>
                    </Dialog>

                    {/* Appointments Section */}
                    <Card sx={{
                        mt: 4,
                        p: 3,
                        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
                        borderRadius: '12px',
                        background: 'linear-gradient(to bottom, #ffffff, #f8fbff)'
                    }}>
                        <Box sx={{display: 'flex', alignItems: 'center', mb: 2}}>
                            <CalendarMonthIcon color="primary" sx={{mr: 1.5}}/>
                            <Typography variant="h6" fontWeight="600" color="text.primary">
                                Appointments
                            </Typography>
                        </Box>
                        <Divider sx={{my: 2, borderColor: 'divider'}}/>

                        {appointments.length > 0 ? (
                            <List sx={{display: "flex", flexDirection: "column", gap: 2}}>
                                {appointments.map((appointment) => (
                                    <Card
                                        key={appointment.id}
                                        sx={{
                                            borderLeft: '4px solid',
                                            borderLeftColor: appointment.status === 'Completed' ? 'success.main' : 'warning.main',
                                            borderRadius: '8px',
                                            padding: 2,
                                            transition: 'transform 0.2s, box-shadow 0.2s',
                                            '&:hover': {
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'
                                            }
                                        }}
                                    >
                                        <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 1}}>
                                            <Typography variant="body2" sx={{display: 'flex', alignItems: 'center'}}>
                                                <ProfessionalIcon
                                                    specialty={appointment.session.professional.speciality}/>
                                                {appointment.session.professional.name} ({appointment.session.professional.speciality})
                                            </Typography>
                                            <Chip
                                                label={appointment.status}
                                                size="small"
                                                color={appointment.status === 'Completed' ? 'success' : 'warning'}
                                                sx={{height: '24px'}}
                                            />
                                        </Box>

                                        <Grid container spacing={1} sx={{mt: 0.5}}>
                                            <Grid item xs={12}>
                                                <Typography variant="body2"
                                                            sx={{display: 'flex', alignItems: 'center'}}>
                                                    <AccessTimeIcon
                                                        sx={{fontSize: '1rem', mr: 1, color: 'text.secondary'}}/>
                                                    {new Date(appointment.session.start).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Typography variant="body2"
                                                            sx={{display: 'flex', alignItems: 'center'}}>
                                                    <BusinessIcon
                                                        sx={{fontSize: '1rem', mr: 1, color: 'text.secondary'}}/>
                                                    {appointment.session.organization.name}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Card>
                                ))}
                            </List>
                        ) : (
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                py: 4,
                                color: 'text.secondary'
                            }}>
                                <EventBusyIcon sx={{fontSize: '3rem', mb: 1, opacity: 0.5}}/>
                                <Typography>No visits recorded yet</Typography>
                            </Box>
                        )}

                        <Button
                            variant="contained"
                            startIcon={<AddIcon/>}
                            sx={{
                                mt: 3,
                                borderRadius: '8px',
                                textTransform: 'none',
                                fontWeight: '500',
                                padding: '8px 16px',
                                boxShadow: 'none',
                                '&:hover': {
                                    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)'
                                }
                            }}
                            onClick={() => setBookDialogOpen(true)}
                        >
                            Book New Appointment
                        </Button>
                    </Card>

                    {/* Book Appointment Dialog */}
                    <Dialog
                        open={bookDialogOpen}
                        onClose={() => setBookDialogOpen(false)}
                        PaperProps={{
                            sx: {
                                borderRadius: '12px',
                                padding: '16px'
                            }
                        }}
                    >
                        <DialogTitle sx={{
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5
                        }}>
                            <CalendarMonthIcon color="primary"/>
                            Book New Appointment
                        </DialogTitle>
                        <DialogContent>
                            <FormControl fullWidth sx={{mt: 2}}>
                                <InputLabel>Appointment Type</InputLabel>
                                <Select
                                    value={appointmentType}
                                    onChange={(e) => setAppointmentType(e.target.value)}
                                    label="Appointment Type"
                                    sx={{borderRadius: '8px'}}
                                >
                                    <MenuItem value="Medical">
                                        <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                            <MedicalServicesIcon fontSize="small"/>
                                            Medical
                                        </Box>
                                    </MenuItem>
                                    <MenuItem value="Grooming">
                                        <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                            Grooming
                                        </Box>
                                    </MenuItem>
                                    <MenuItem value="Training">
                                        <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                            <PetsIcon fontSize="small"/>
                                            Training
                                        </Box>
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </DialogContent>
                        <DialogActions sx={{padding: '16px 24px'}}>
                            <Button
                                onClick={() => setBookDialogOpen(false)}
                                sx={{
                                    borderRadius: '8px',
                                    textTransform: 'none',
                                    fontWeight: '500'
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleBookAppointment}
                                sx={{
                                    borderRadius: '8px',
                                    textTransform: 'none',
                                    fontWeight: '500'
                                }}
                            >
                                Continue
                            </Button>
                        </DialogActions>
                    </Dialog>

                    {/* Vaccinations & Medications Section */}
                    <Card sx={{
                        mt: 4,
                        p: 3,
                        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
                        borderRadius: '12px',
                        background: 'linear-gradient(to bottom, #ffffff, #f8fbff)'
                    }}>
                        <Box sx={{display: 'flex', alignItems: 'center', mb: 2}}>
                            <VaccinesIcon color="primary" sx={{mr: 1.5}}/>
                            <Typography variant="h6" fontWeight="600" color="text.primary">
                                Vaccinations & Medications
                            </Typography>
                        </Box>
                        <Divider sx={{my: 2, borderColor: 'divider'}}/>

                        {dispenses.length > 0 ? (
                            <List sx={{display: "flex", flexDirection: "column", gap: 2}}>
                                {dispenses.map((vaccine) => (
                                    <Card
                                        key={vaccine.id}
                                        sx={{
                                            borderLeft: '4px solid',
                                            borderLeftColor: '#9c27b0',
                                            borderRadius: '8px',
                                            padding: 2,
                                            transition: 'transform 0.2s, box-shadow 0.2s',
                                            '&:hover': {
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'
                                            }
                                        }}
                                    >
                                        <Typography variant="subtitle1" fontWeight="500" sx={{mb: 1}}>
                                            <MedicalInformationIcon sx={{
                                                fontSize: '1rem',
                                                mr: 1,
                                                verticalAlign: 'middle',
                                                color: '#9c27b0'
                                            }}/>
                                            {vaccine.medicinalProduct.medicineName}
                                        </Typography>

                                        <Grid container spacing={1}>
                                            <Grid item xs={6}>
                                                <Typography variant="body2"
                                                            sx={{display: 'flex', alignItems: 'center'}}>
                                                    <TodayIcon sx={{fontSize: '1rem', mr: 1, color: 'text.secondary'}}/>
                                                    Prescribed: {new Date(vaccine.createdTime).toLocaleDateString()}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography variant="body2"
                                                            sx={{display: 'flex', alignItems: 'center'}}>
                                                    <CategoryIcon
                                                        sx={{fontSize: '1rem', mr: 1, color: 'text.secondary'}}/>
                                                    {vaccine.medicinalProduct.type}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography variant="body2"
                                                            sx={{display: 'flex', alignItems: 'center'}}>
                                                    <RepeatIcon
                                                        sx={{fontSize: '1rem', mr: 1, color: 'text.secondary'}}/>
                                                    {vaccine.frequency}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography variant="body2"
                                                            sx={{display: 'flex', alignItems: 'center'}}>
                                                    <NumbersIcon
                                                        sx={{fontSize: '1rem', mr: 1, color: 'text.secondary'}}/>
                                                    Quantity: {vaccine.quantity}
                                                </Typography>
                                            </Grid>
                                            {vaccine.notes && (
                                                <Grid item xs={12}>
                                                    <Typography variant="body2"
                                                                sx={{display: 'flex', alignItems: 'flex-start'}}>
                                                        <NotesIcon
                                                            sx={{fontSize: '1rem', mr: 1, color: 'text.secondary'}}/>
                                                        {vaccine.notes}
                                                    </Typography>
                                                </Grid>
                                            )}
                                        </Grid>
                                    </Card>
                                ))}
                            </List>
                        ) : (
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                py: 4,
                                color: 'text.secondary'
                            }}>
                                <MedicationLiquidIcon sx={{fontSize: '3rem', mb: 1, opacity: 0.5}}/>
                                <Typography>No medication records found</Typography>
                            </Box>
                        )}
                    </Card>

                    {/* Health History Section */}
                    <Card sx={{
                        mt: 4,
                        p: 3,
                        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
                        borderRadius: '12px',
                        background: 'linear-gradient(to bottom, #ffffff, #f8fbff)'
                    }}>
                        <Box sx={{display: 'flex', alignItems: 'center', mb: 2}}>
                            <MedicalInformationIcon color="primary" sx={{mr: 1.5}}/>
                            <Typography variant="h6" fontWeight="600" color="text.primary">
                                Health History
                            </Typography>
                        </Box>
                        <Divider sx={{my: 2, borderColor: 'divider'}}/>

                        {observations.length > 0 ? (
                            <List sx={{display: "flex", flexDirection: "column", gap: 2}}>
                                {observations.map((record) => (
                                    <Card
                                        key={record.id}
                                        sx={{
                                            borderLeft: '4px solid',
                                            borderLeftColor: '#4caf50',
                                            borderRadius: '8px',
                                            padding: 2,
                                            transition: 'transform 0.2s, box-shadow 0.2s',
                                            '&:hover': {
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'
                                            }
                                        }}
                                    >
                                        <Typography variant="subtitle1" fontWeight="500" sx={{mb: 1}}>
                                            <HealingIcon sx={{
                                                fontSize: '1rem',
                                                mr: 1,
                                                verticalAlign: 'middle',
                                                color: '#4caf50'
                                            }}/>
                                            {record.type}
                                        </Typography>

                                        <Grid container spacing={1}>
                                            <Grid item xs={6}>
                                                <Typography variant="body2"
                                                            sx={{display: 'flex', alignItems: 'center'}}>
                                                    <TodayIcon sx={{fontSize: '1rem', mr: 1, color: 'text.secondary'}}/>
                                                    {new Date(record.createdTime).toLocaleDateString()}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography variant="body2"
                                                            sx={{display: 'flex', alignItems: 'center'}}>
                                                    <ProfessionalIcon specialty={record.professional.speciality}/>
                                                    <PersonIcon
                                                        sx={{fontSize: '1rem', mr: 1, color: 'text.secondary'}}/>
                                                    {record.professional?.name || "Unknown"}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Typography variant="body2"
                                                            sx={{display: 'flex', alignItems: 'flex-start'}}>
                                                    <NotesIcon sx={{fontSize: '1rem', mr: 1, color: 'text.secondary'}}/>
                                                    {record.notes}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Card>
                                ))}
                            </List>
                        ) : (
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                py: 4,
                                color: 'text.secondary'
                            }}>
                                <AssignmentLateIcon sx={{fontSize: '3rem', mb: 1, opacity: 0.5}}/>
                                <Typography>No health history records found</Typography>
                            </Box>
                        )}
                    </Card>


                    {/* Edit Pet Dialog */}
                    <PetDialog
                        open={petDialogOpen}
                        onClose={() => setPetDialogOpen(false)}
                        pet={selectedPet}
                        mode={"edit"}/>
                </>
            ) : (
                <Typography variant="h6" textAlign="center" sx={{mt: 4}}>
                    Pet not found. 🐾
                </Typography>
            )}
        </Box>
    );
};

export default PetView;