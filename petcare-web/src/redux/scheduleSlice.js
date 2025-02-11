import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:8000/api/schedule";

export const createSchedule = createAsyncThunk(
    "schedule/createSchedule",
    async (scheduleData, { rejectWithValue, getState }) => {
        try {
            const token = getState().auth.token;
            const response = await axios.post(`${API_URL}/create`, scheduleData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to create schedule");
        }
    }
);

export const fetchSchedules = createAsyncThunk(
    "schedule/fetchSchedules",
    async (_, { rejectWithValue, getState }) => {
        try {
            const token = getState().auth.token;
            const response = await axios.get(`${API_URL}/my`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch schedules");
        }
    }
);

export const activateSchedule = createAsyncThunk(
    "schedule/activateSchedule",
    async (scheduleId, { rejectWithValue, getState, dispatch }) => {
        try {
            const token = getState().auth.token;
            await axios.post(`${API_URL}/activate/${scheduleId}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Refresh schedules after activation
            dispatch(fetchSchedules());
            return scheduleId;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to activate schedule");
        }
    }
);

export const cancelSchedule = createAsyncThunk(
    "schedule/cancelSchedule",
    async (scheduleId, { rejectWithValue, getState, dispatch }) => {
        try {
            const token = getState().auth.token;
            await axios.post(`${API_URL}/cancel/${scheduleId}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Refresh schedules after cancellation
            dispatch(fetchSchedules());
            return scheduleId;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to cancel schedule");
        }
    }
);

export const deleteSchedule = createAsyncThunk(
    "schedule/deleteSchedule",
    async (scheduleId, { rejectWithValue, getState, dispatch }) => {
        try {
            const token = getState().auth.token;
            await axios.delete(`${API_URL}/delete/${scheduleId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Refresh schedules after deletion
            dispatch(fetchSchedules());
            return scheduleId;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to delete schedule");
        }
    }
);

const scheduleSlice = createSlice({
    name: "schedule",
    initialState: {
        schedules: [],
        status: "idle",
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Create Schedule
            .addCase(createSchedule.pending, (state) => {
                state.status = "loading";
            })
            .addCase(createSchedule.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.schedules.push(action.payload);
            })
            .addCase(createSchedule.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })

            // Fetch Schedules
            .addCase(fetchSchedules.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchSchedules.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.schedules = action.payload;
            })
            .addCase(fetchSchedules.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })

            // Activate Schedule
            .addCase(activateSchedule.pending, (state) => {
                state.status = "loading";
            })
            .addCase(activateSchedule.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.schedules = state.schedules.map((schedule) =>
                    schedule.id === action.payload ? { ...schedule, status: "active" } : schedule
                );
            })
            .addCase(activateSchedule.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })

            // Cancel Schedule
            .addCase(cancelSchedule.pending, (state) => {
                state.status = "loading";
            })
            .addCase(cancelSchedule.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.schedules = state.schedules.map((schedule) =>
                    schedule.id === action.payload ? { ...schedule, status: "cancelled" } : schedule
                );
            })
            .addCase(cancelSchedule.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })

            // Delete Schedule
            .addCase(deleteSchedule.pending, (state) => {
                state.status = "loading";
            })
            .addCase(deleteSchedule.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.schedules = state.schedules.filter((schedule) => schedule.id !== action.payload);
            })
            .addCase(deleteSchedule.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            });
    },
});

export default scheduleSlice.reducer;
