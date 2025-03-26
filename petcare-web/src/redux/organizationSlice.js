import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:8000/api";

// Fetch All
export const fetchOrganizations = createAsyncThunk("organizations/fetch", async (_, { rejectWithValue, getState }) => {
    try {
        const token = getState().auth.token;
        const response = await axios.get(`${BASE_URL}/organizations`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch organizations");
    }
});

// Create
export const createOrganization = createAsyncThunk("organization/create", async (orgData, { rejectWithValue, getState }) => {
    try {
        const token = getState().auth.token;
        const response = await axios.post(`${BASE_URL}/organization/create`, orgData, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to create organization");
    }
});

// Update
export const updateOrganization = createAsyncThunk("organization/update", async ({ id, ...updates }, { rejectWithValue, getState }) => {
    try {
        const token = getState().auth.token;
        const response = await axios.put(`${BASE_URL}/organization/update`, { id, ...updates }, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to update organization");
    }
});

// Delete
export const deleteOrganization = createAsyncThunk("organization/delete", async (id, { rejectWithValue, getState }) => {
    try {
        const token = getState().auth.token;
        await axios.delete(`${BASE_URL}/organization/delete/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return id;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to delete organization");
    }
});

const organizationSlice = createSlice({
    name: "organization",
    initialState: {
        organizations: [],
        status: "idle",
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchOrganizations.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchOrganizations.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.organizations = action.payload;
            })
            .addCase(fetchOrganizations.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })

            // Create
            .addCase(createOrganization.fulfilled, (state, action) => {
                state.organizations.push(action.payload);
            })
            .addCase(createOrganization.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })

            // Update
            .addCase(updateOrganization.fulfilled, (state, action) => {
                const index = state.organizations.findIndex(org => org.id === action.payload.id);
                if (index !== -1) {
                    state.organizations[index] = action.payload;
                }
            })
            .addCase(updateOrganization.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })

            // Delete
            .addCase(deleteOrganization.fulfilled, (state, action) => {
                state.organizations = state.organizations.filter(org => org.id !== action.payload);
            })
            .addCase(deleteOrganization.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            });
    },
});

export default organizationSlice.reducer;
