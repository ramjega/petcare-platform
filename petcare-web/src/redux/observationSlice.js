// src/redux/observationSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:8000/api";

// Create Observation
export const createObservation = createAsyncThunk(
    "observation/create",
    async (data, { rejectWithValue, getState }) => {
        try {
            const token = getState().auth.token;
            const response = await axios.post(`${BASE_URL}/observation/create`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to create observation");
        }
    }
);

// Fetch observations by appointment
export const fetchObservationsByAppointment = createAsyncThunk(
    "observation/fetchByAppointment",
    async (appointmentId, { rejectWithValue, getState }) => {
        try {
            const token = getState().auth.token;
            const response = await axios.get(`${BASE_URL}/observation/appointment/${appointmentId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch observations");
        }
    }
);

// Fetch observations by pet
export const fetchObservationsByPet = createAsyncThunk(
    "observation/fetchByPet",
    async (petId, { rejectWithValue, getState }) => {
        try {
            const token = getState().auth.token;
            const response = await axios.get(`${BASE_URL}/observation/pet/${petId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch observations");
        }
    }
);


const observationSlice = createSlice({
    name: "observation",
    initialState: {
        status: "idle",
        observations: [],
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createObservation.pending, (state) => {
                state.status = "loading";
            })
            .addCase(createObservation.fulfilled, (state) => {
                state.status = "succeeded";
            })
            .addCase(createObservation.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })

            .addCase(fetchObservationsByAppointment.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchObservationsByAppointment.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.observations = action.payload;
            })
            .addCase(fetchObservationsByAppointment.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            .addCase(fetchObservationsByPet.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.observations = action.payload;
            });

    },
});

export default observationSlice.reducer;