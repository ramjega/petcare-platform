import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:8000/api";

// **Fetch User Profile**
export const fetchAllProfiles = createAsyncThunk("profile/fetchAllProfiles", async (_, { rejectWithValue, getState }) => {
    try {
        const token = getState().auth.token; // Get auth token from Redux state
        const response = await axios.get(`${API_URL}/profile/all`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data; // User profile data
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch profile");
    }
});

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

// Toggle User Status
export const toggleUserStatus = createAsyncThunk(
    "user/toggleStatus",
    async ({ id, status }, { rejectWithValue, getState }) => {
        try {
            const token = getState().auth.token;

            const endpoint =
                status === "active"
                    ? `http://localhost:8000/api/profile/activate/${id}`
                    : `http://localhost:8000/api/profile/suspend/${id}`;

            const response = await axios.put(endpoint, null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to update user status");
        }
    }
);


// Delete User
export const deleteUser = createAsyncThunk(
    "user/delete",
    async (id, { rejectWithValue, getState }) => {
        try {
            const token = getState().auth.token;
            await axios.delete(`http://localhost:8000/api/profile/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to delete user");
        }
    }
);


// **Profile Slice**
const profileSlice = createSlice({
    name: "profile",
    initialState: {
        user: null,
        status: "idle", // idle | loading | succeeded | failed
        professionals: [],
        users: [],
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllProfiles.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchAllProfiles.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.users = action.payload;
            })
            .addCase(fetchAllProfiles.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })

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
            })

            // Toggle Status
            .addCase(toggleUserStatus.fulfilled, (state, action) => {
                const updatedUser = action.payload;
                const index = state.users.findIndex(u => u.id === updatedUser.id);
                if (index !== -1) {
                    state.users[index] = updatedUser;
                }
            })
            .addCase(toggleUserStatus.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })

            // Delete User
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.users = state.users.filter(user => user.id !== action.payload);
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            });
    },
});

export default profileSlice.reducer;