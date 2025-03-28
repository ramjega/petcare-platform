import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:8000/api";

// Schedule reminder
export const createReminder = createAsyncThunk(
    "reminder/create",
    async (data, { rejectWithValue, getState }) => {
        try {
            const token = getState().auth.token;
            const response = await axios.post(`${BASE_URL}/reminder/create`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to schedule reminder");
        }
    }
);

// Fetch reminders by appointment
export const fetchRemindersByAppointment = createAsyncThunk(
    "reminder/fetchByAppointment",
    async (appointmentId, { rejectWithValue, getState }) => {
        try {
            const token = getState().auth.token;
            const response = await axios.get(`${BASE_URL}/reminder/appointment/${appointmentId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch reminders");
        }
    }
);

// Fetch reminders by pet
export const fetchRemindersByPet = createAsyncThunk(
    "reminder/fetchByPet",
    async (petId, { rejectWithValue, getState }) => {
        try {
            const token = getState().auth.token;
            const response = await axios.get(`${BASE_URL}/reminder/pet/${petId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch reminders");
        }
    }
);

export const deleteReminder = createAsyncThunk("reminders/delete", async (id, { rejectWithValue, getState }) => {
    try {
        const token = getState().auth.token;
        await axios.delete(`${BASE_URL}/reminder/delete/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return id;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to delete reminder");
    }
});

const reminderSlice = createSlice({
    name: "reminder",
    initialState: {
        status: "idle",
        reminders: [],
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createReminder.pending, (state) => {
                state.status = "loading";
            })
            .addCase(createReminder.fulfilled, (state) => {
                state.status = "succeeded";
            })
            .addCase(createReminder.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            .addCase(fetchRemindersByAppointment.fulfilled, (state, action) => {
                state.reminders = action.payload;
                state.status = "succeeded";
            })
            .addCase(fetchRemindersByPet.fulfilled, (state, action) => {
                state.reminders = action.payload;
                state.status = "succeeded";
            })
            .addCase(deleteReminder.fulfilled, (state, action) => {
                state.reminders = state.reminders.filter(r => r.id !== action.payload);
            });
    },
});

export default reminderSlice.reducer;
