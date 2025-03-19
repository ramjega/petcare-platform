import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:8000/api";


export const fetchOrganizations = createAsyncThunk("organizations/fetch", async (_, {rejectWithValue, getState}) => {
    try {
        const token = getState().auth.token;
        const response = await axios.get(`${BASE_URL}/organizations`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch cities");
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
            // Fetch organizations
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
            });
    },
});

export default organizationSlice.reducer;
