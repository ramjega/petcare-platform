import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:8000/api";

// **Fetch User Profile**
export const fetchUserProfile = createAsyncThunk("profile/fetchUserProfile", async (_, { rejectWithValue, getState }) => {
    try {
        const token = getState().auth.token; // Get auth token from Redux state
        const response = await axios.get(`${API_URL}/profile/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data; // User profile data
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch profile");
    }
});

// **Update User Profile**
export const updateUserProfile = createAsyncThunk("profile/updateUserProfile", async (profileData, { rejectWithValue, getState }) => {
    try {
        const token = getState().auth.token;
        const response = await axios.post(`${API_URL}/profile/update`, profileData, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data; // Updated profile data
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to update profile");
    }
});

// fetch professionals
export const fetchProfessionals = createAsyncThunk("profile/fetchProfessionals", async (_, { rejectWithValue, getState }) => {
    try {
        const token = getState().auth.token; // Get auth token from Redux state
        const response = await axios.get(`${API_URL}/profile/professionals`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch profile");
    }
});

// **Profile Slice**
const profileSlice = createSlice({
    name: "profile",
    initialState: {
        user: null,
        status: "idle", // idle | loading | succeeded | failed
        professionals: [],
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch User Profile
            .addCase(fetchUserProfile.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.user = action.payload;
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })

            .addCase(fetchProfessionals.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchProfessionals.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.professionals = action.payload;
            })
            .addCase(fetchProfessionals.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })

            // Update User Profile
            .addCase(updateUserProfile.pending, (state) => {
                state.status = "loading";
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.user = action.payload; // Update user state with new profile
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            });
    },
});

export default profileSlice.reducer;