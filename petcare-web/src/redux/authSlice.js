import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Define API URL
const API_URL = "http://localhost:8000/api/auth/login";

// Async thunk for login
export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await axios.post(API_URL, credentials);
            return response.data; // Returns user profile + JWT token
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        token: null,
        status: "idle", // idle | loading | succeeded | failed
        error: null,
    },
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem("token"); // Remove token from storage
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.status = "loading";
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.user = action.payload;
                state.token = action.payload.token;
                localStorage.setItem("token", action.payload.token); // Store token
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload?.error || "Login failed";
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
