import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:8000/api";

// Create Dispense
export const createDispense = createAsyncThunk(
    "dispense/create",
    async (data, { rejectWithValue, getState }) => {
        try {
            const token = getState().auth.token;
            const response = await axios.post(`${BASE_URL}/dispense/create`, data, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to create dispense record");
        }
    }
);

// Fetch dispenses by appointmentId
export const fetchDispensesByAppointment = createAsyncThunk(
    "dispense/fetchByAppointment",
    async (appointmentId, { rejectWithValue, getState }) => {
        try {
            const token = getState().auth.token;
            const response = await axios.get(
                `${BASE_URL}/dispense/appointment/${appointmentId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch dispenses");
        }
    }
);

// Fetch dispenses by petId
export const fetchDispensesByPet = createAsyncThunk(
    "dispense/fetchByPet",
    async (petId, { rejectWithValue, getState }) => {
        try {
            const token = getState().auth.token;
            const response = await axios.get(
                `${BASE_URL}/dispense/pet/${petId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch dispenses");
        }
    }
);

const dispenseSlice = createSlice({
    name: "dispense",
    initialState: {
        status: "idle",
        dispenses: [],
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createDispense.pending, (state) => {
                state.status = "loading";
            })
            .addCase(createDispense.fulfilled, (state) => {
                state.status = "succeeded";
            })
            .addCase(createDispense.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            .addCase(fetchDispensesByAppointment.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchDispensesByAppointment.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.dispenses = action.payload;
            })
            .addCase(fetchDispensesByAppointment.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            .addCase(fetchDispensesByPet.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.dispenses = action.payload;
            });
    },
});

export default dispenseSlice.reducer;
