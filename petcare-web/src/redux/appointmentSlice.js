import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Base API URL
const BASE_URL = "http://localhost:8000/api/appointment";

export const fetchMyAppointments = createAsyncThunk(
    "appointments/fetchMy",
    async (sessionId, { rejectWithValue, getState }) => {
        try {
            const token = getState().auth.token;
            const response = await axios.get(`${BASE_URL}/my`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || "Failed to fetch appointments");
        }
    }
);

// Fetch Appointments by Session ID
export const fetchAppointmentsBySession = createAsyncThunk(
    "appointments/fetchBySession",
    async (sessionId, { rejectWithValue, getState }) => {
        try {
            const token = getState().auth.token;
            const response = await axios.get(`${BASE_URL}/session/${sessionId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || "Failed to fetch appointments");
        }
    }
);

export const fetchAppointmentById = createAsyncThunk(
    "sessions/fetchAppointmentById",
    async (appointmentId, { rejectWithValue, getState }) => {
        try {
            const token = getState().auth.token;
            const response = await axios.get(`${BASE_URL}/${appointmentId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch appointment");
        }
    }
);

// Book Appointment
export const bookAppointment = createAsyncThunk("appointments/book", async (appointmentData, { rejectWithValue, getState }) => {
        try {
            const token = getState().auth.token;
            const response = await axios.post(`${BASE_URL}/book`, appointmentData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || "Failed to book appointment");
        }
    }
);

// Attend Appointment
export const attendAppointment = createAsyncThunk(
    "appointments/attend",
    async (appointmentId, { rejectWithValue, getState }) => {
        try {
            const token = getState().auth.token;
            const response = await axios.post(`${BASE_URL}/attend/${appointmentId}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || "Failed to attend appointment");
        }
    }
);

// Complete Appointment
export const completeAppointment = createAsyncThunk(
    "appointments/complete",
    async (appointmentId, { rejectWithValue, getState }) => {
        try {
            const token = getState().auth.token;
            const response = await axios.post(`${BASE_URL}/complete/${appointmentId}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || "Failed to complete appointment");
        }
    }
);

// Cancel Appointment
export const cancelAppointment = createAsyncThunk(
    "appointments/cancel",
    async (appointmentId, { rejectWithValue, getState }) => {
        try {
            const token = getState().auth.token;
            const response = await axios.post(`${BASE_URL}/cancel/${appointmentId}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || "Failed to cancel appointment");
        }
    }
);

// Appointment Slice
const appointmentSlice = createSlice({
    name: "appointments",
    initialState: {
        appointments: [],
        appointment:null,
        status: "idle", // idle | loading | succeeded | failed
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch Appointments
            .addCase(fetchAppointmentsBySession.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchAppointmentsBySession.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.appointments = action.payload;
            })
            .addCase(fetchAppointmentsBySession.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })

            // Fetch my Appointments
            .addCase(fetchMyAppointments.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchMyAppointments.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.appointments = action.payload;
            })
            .addCase(fetchMyAppointments.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })

             // Fetch appointment by id
            .addCase(fetchAppointmentById.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchAppointmentById.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.appointment = action.payload;
            })
            .addCase(fetchAppointmentById.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })

            // Book Appointment
            .addCase(bookAppointment.pending, (state) => {
                state.status = "loading";
            })
            .addCase(bookAppointment.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.appointments[state.appointments.length] = action.payload
            })

            // Attend Appointment
            .addCase(attendAppointment.fulfilled, (state, action) => {
                const index = state.appointments.findIndex((appt) => appt.id === action.payload.id);
                if (index !== -1) state.appointments[index] = action.payload;
            })

            // Complete Appointment
            .addCase(completeAppointment.fulfilled, (state, action) => {
                const index = state.appointments.findIndex((appt) => appt.id === action.payload.id);
                if (index !== -1) state.appointments[index] = action.payload;
            })

            // Cancel Appointment
            .addCase(cancelAppointment.fulfilled, (state, action) => {
                const index = state.appointments.findIndex((appt) => appt.id === action.payload.id);
                if (index !== -1) state.appointments[index] = action.payload;
            });
    }
});

export default appointmentSlice.reducer;