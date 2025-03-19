import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:8000/api";


export const fetchCities = createAsyncThunk("cities/fetch", async (_, {rejectWithValue, getState}) => {
    try {
        const token = getState().auth.token;
        const response = await axios.get(`${BASE_URL}/cities`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch cities");
    }
});

const citySlice = createSlice({
    name: "city",
    initialState: {
        cities: [],
        status: "idle",
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch cities
            .addCase(fetchCities.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchCities.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.cities = action.payload;
            })
            .addCase(fetchCities.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            });
    },
});

export default citySlice.reducer;
