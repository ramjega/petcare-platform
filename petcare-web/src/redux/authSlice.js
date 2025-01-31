import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Define API URLs
const LOGIN_API = "http://localhost:8000/api/auth/login";
const SIGNUP_API = "http://localhost:8000/api/profile/register";

// Async thunk for login
export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await axios.post(LOGIN_API, credentials);
            return response.data; // Returns user profile + JWT token
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Async thunk for signup (auto-login after signup)
export const signupUser = createAsyncThunk(
    "auth/signupUser",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post(SIGNUP_API, userData);
            return response.data; // Returns user profile + JWT token
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: JSON.parse(localStorage.getItem("user")) || null,
        token: localStorage.getItem("token") || null,
        status: "idle", // idle | loading | succeeded | failed
        error: null,
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            state.token = action.payload.token;
            localStorage.setItem("token", action.payload.token);
            localStorage.setItem("user", JSON.stringify(action.payload));
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem("token");
            localStorage.removeItem("user"); // Remove user details
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
                localStorage.setItem("token", action.payload.token);
                localStorage.setItem("user", JSON.stringify(action.payload));
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload?.error || "Login failed";
            })
            // Handle Signup
            .addCase(signupUser.pending, (state) => {
                state.status = "loading";
            })
            .addCase(signupUser.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.user = action.payload;
                state.token = action.payload.token;
                localStorage.setItem("token", action.payload.token);
                localStorage.setItem("user", JSON.stringify(action.payload));
            })
            .addCase(signupUser.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload?.error || "Signup failed";
            });
    },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
