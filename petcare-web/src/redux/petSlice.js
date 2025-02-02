import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// API Base URL
const API_URL = "http://localhost:8000/api";

// **Async Thunk to Fetch Pets**
export const fetchPets = createAsyncThunk("pets/fetchPets", async (_, { rejectWithValue,getState }) => {
    try {
        const token = getState().auth.token;
        const response = await axios.get(`${API_URL}/pets`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data.data || []; // Extract pets array from response
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch pets");
    }
});

// **Async Thunk to Create Pet**
export const createPet = createAsyncThunk("pet/createPet", async (petData, { rejectWithValue, getState }) => {
    try {
        const token = getState().auth.token; // Get token from Redux state
        const response = await axios.post(`${API_URL}/pet/register`, petData, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to create pet");
    }
});

const petSlice = createSlice({
    name: "pet",
    initialState: {
        pets: [],
        status: "idle", // idle | loading | succeeded | failed
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPets.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchPets.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.pets = action.payload; // Store fetched pets
            })
            .addCase(fetchPets.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            .addCase(createPet.pending, (state) => {
                state.status = "loading";
            })
            .addCase(createPet.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.pets.push(action.payload); // Add new pet to list
            })
            .addCase(createPet.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            });
    },
});

export default petSlice.reducer;
