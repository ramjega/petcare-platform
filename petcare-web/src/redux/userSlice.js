import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:8000/api/admin/users";

// ✅ Fetch all users
export const fetchUsers = createAsyncThunk("users/fetchUsers", async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(API_URL);
        return response.data; // Return users array
    } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to fetch users");
    }
});

// ✅ Delete a user
export const deleteUser = createAsyncThunk("users/deleteUser", async (userId, { rejectWithValue, dispatch }) => {
    try {
        await axios.delete(`${API_URL}/${userId}`);
        dispatch(removeUser(userId)); // Remove user from state after successful API call
    } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to delete user");
    }
});

const userSlice = createSlice({
    name: "users",
    initialState: {
        users: [],
        status: "idle", // idle | loading | succeeded | failed
        error: null,
    },
    reducers: {
        removeUser: (state, action) => {
            state.users = state.users.filter(user => user.id !== action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.error = action.payload;
            });
    },
});

export const { removeUser } = userSlice.actions;
export default userSlice.reducer;
