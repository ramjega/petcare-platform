// src/redux/activityLogSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:8000/api";

export const fetchActivityLogsByPet = createAsyncThunk(
    "activityLogs/fetchByPet",
    async (petId, { rejectWithValue, getState }) => {
        try {
            const token = getState().auth.token;
            const response = await axios.get(`${BASE_URL}/activity/pet/${petId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch activity logs");
        }
    }
);

export const createActivityLog = createAsyncThunk(
    "activityLogs/create",
    async (payload, { rejectWithValue, getState }) => {
        try {
            const token = getState().auth.token;
            const response = await axios.post(`${BASE_URL}/activity/create`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to create activity log");
        }
    }
);

const activityLogSlice = createSlice({
    name: "activityLogs",
    initialState: {
        activityLogs: [],
        status: "idle",
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchActivityLogsByPet.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchActivityLogsByPet.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.activityLogs = action.payload;
            })
            .addCase(fetchActivityLogsByPet.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            .addCase(createActivityLog.fulfilled, (state, action) => {
                state.activityLogs.push(action.payload);
            });
    },
});

export default activityLogSlice.reducer;
