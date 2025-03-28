import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:8000/api";

// Fetch growth data for a pet
export const fetchGrowthDataByPet = createAsyncThunk(
    "growthData/fetchByPet",
    async (petId, { rejectWithValue, getState }) => {
        try {
            const token = getState().auth.token;
            const response = await axios.get(`${BASE_URL}/growthData/pet/${petId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch growth data");
        }
    }
);

// Create new growth record
export const createGrowthData = createAsyncThunk(
    "growthData/create",
    async (data, { rejectWithValue, getState }) => {
        try {
            const token = getState().auth.token;
            const response = await axios.post(`${BASE_URL}/growthData/create`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to create growth data");
        }
    }
);

const growthDataSlice = createSlice({
    name: "growthData",
    initialState: {
        growthData: [],
        status: "idle",
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchGrowthDataByPet.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchGrowthDataByPet.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.growthData = action.payload;
            })
            .addCase(fetchGrowthDataByPet.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })

            .addCase(createGrowthData.pending, (state) => {
                state.status = "loading";
            })
            .addCase(createGrowthData.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.growthData.push(action.payload);
            })
            .addCase(createGrowthData.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            });
    },
});

export default growthDataSlice.reducer;