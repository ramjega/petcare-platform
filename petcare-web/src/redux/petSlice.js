import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// API Base URL
const API_URL = "http://localhost:8000/api";

// **Async Thunk to Fetch All Pets**
export const fetchPets = createAsyncThunk("pets/fetchPets", async (_, { rejectWithValue, getState }) => {
    try {
        const token = getState().auth.token;
        const response = await axios.get(`${API_URL}/pets`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch pets");
    }
});

// **Async Thunk to Fetch Pet By ID**
export const fetchPetById = createAsyncThunk("pet/fetchPetById", async (petId, { rejectWithValue, getState }) => {
    try {
        const token = getState().auth.token;
        const response = await axios.get(`${API_URL}/pet/${petId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data; // Return the fetched pet
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch pet details");
    }
});

// **Async Thunk to Create a Pet**
export const createPet = createAsyncThunk("pet/createPet", async (petData, { rejectWithValue, getState }) => {
    try {
        const token = getState().auth.token;
        const response = await axios.post(`${API_URL}/pet/register`, petData, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to create pet");
    }
});

// **Async Thunk to Update Pet**
export const updatePet = createAsyncThunk("pet/updatePet", async (petData, { rejectWithValue, getState }) => {
    try {
        const token = getState().auth.token;
        const response = await axios.post(`${API_URL}/pet/update`, petData, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data; // Return updated pet
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to update pet");
    }
});

// **Async Thunk to Delete Pet**
export const deletePet = createAsyncThunk("pet/deletePet", async (petId, { rejectWithValue, getState }) => {
    try {
        const token = getState().auth.token;
        const response = await axios.delete(`${API_URL}/pet/delete/${petId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data; // Return deleted pet
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to delete pet");
    }
});

// **Pet Slice**
const petSlice = createSlice({
    name: "pet",
    initialState: {
        pets: [],
        selectedPet: null,
        status: "idle",
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch Pets
            .addCase(fetchPets.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchPets.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.pets = action.payload;
            })
            .addCase(fetchPets.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })

            // Fetch Pet by ID
            .addCase(fetchPetById.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchPetById.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.selectedPet = action.payload; // Store fetched pet in state
            })
            .addCase(fetchPetById.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })

            // Create Pet
            .addCase(createPet.pending, (state) => {
                state.status = "loading";
            })
            .addCase(createPet.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.pets.push(action.payload);
            })
            .addCase(createPet.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })

            // Update Pet
            .addCase(updatePet.pending, (state) => {
                state.status = "loading";
            })
            .addCase(updatePet.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.pets = state.pets.map((pet) => (pet.id === action.payload.id ? action.payload : pet));
                state.selectedPet = action.payload;
            })
            .addCase(updatePet.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })

            // Delete Pet
            .addCase(deletePet.pending, (state) => {
                state.status = "loading";
            })
            .addCase(deletePet.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.pets = state.pets.filter((pet) => pet.id !== action.payload.id);
            })
            .addCase(deletePet.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            });
    },
});

export default petSlice.reducer;
