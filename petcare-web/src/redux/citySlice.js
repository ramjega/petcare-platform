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

export const createCity = createAsyncThunk("city/create", async (petData, { rejectWithValue, getState }) => {
    try {
        const token = getState().auth.token;
        const response = await axios.post(`${BASE_URL}/city/create`, petData, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to create city");
    }
});

export const updateCity = createAsyncThunk("city/update", async ({ id, name }, { rejectWithValue, getState }) => {
    try {
        const token = getState().auth.token;
        const response = await axios.put(`${BASE_URL}/city/update`, {id, name }, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to update city");
    }
});

export const deleteCity = createAsyncThunk("city/delete", async (id, { rejectWithValue, getState }) => {
    try {
        const token = getState().auth.token;
        await axios.delete(`${BASE_URL}/city/delete/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return id;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to delete city");
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
            })

            // Create City
            .addCase(createCity.pending, (state) => {
                state.status = "loading";
            })
            .addCase(createCity.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.cities.push(action.payload);
            })
            .addCase(createCity.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })

            // Update City
            .addCase(updateCity.fulfilled, (state, action) => {
                const updated = action.payload;
                const index = state.cities.findIndex(city => city.id === updated.id);
                if (index !== -1) {
                    state.cities[index] = updated;
                }
            })
            .addCase(updateCity.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })

            // Delete City
            .addCase(deleteCity.fulfilled, (state, action) => {
                const deletedId = action.payload;
                state.cities = state.cities.filter(city => city.id !== deletedId);
            })

            .addCase(deleteCity.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            });
    },
});

export default citySlice.reducer;
