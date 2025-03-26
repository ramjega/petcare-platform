import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:8000/api";

// Fetch All
export const fetchMedicinalProducts = createAsyncThunk(
    "medicinalProducts/fetch",
    async (_, { rejectWithValue, getState }) => {
        try {
            const token = getState().auth.token;
            const response = await axios.get(`${BASE_URL}/medicinalProducts`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch medicines");
        }
    }
);

// Create
export const createMedicinalProduct = createAsyncThunk(
    "medicinalProduct/create",
    async (data, { rejectWithValue, getState }) => {
        try {
            const token = getState().auth.token;
            const response = await axios.post(`${BASE_URL}/medicinalProduct/create`, data, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to create medicine");
        }
    }
);

// Update
export const updateMedicinalProduct = createAsyncThunk(
    "medicinalProduct/update",
    async ({ id, ...updates }, { rejectWithValue, getState }) => {
        try {
            const token = getState().auth.token;
            const response = await axios.put(`${BASE_URL}/medicinalProduct/update`, { id, ...updates }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to update medicine");
        }
    }
);

// Delete
export const deleteMedicinalProduct = createAsyncThunk(
    "medicinalProduct/delete",
    async (id, { rejectWithValue, getState }) => {
        try {
            const token = getState().auth.token;
            await axios.delete(`${BASE_URL}/medicinalProduct/delete/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to delete medicine");
        }
    }
);

const medicinalProductSlice = createSlice({
    name: "medicinalProduct",
    initialState: {
        medicinalProducts: [],
        status: "idle",
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchMedicinalProducts.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchMedicinalProducts.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.medicinalProducts = action.payload;
            })
            .addCase(fetchMedicinalProducts.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })

            // Create
            .addCase(createMedicinalProduct.fulfilled, (state, action) => {
                state.medicinalProducts.push(action.payload);
            })
            .addCase(createMedicinalProduct.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })

            // Update
            .addCase(updateMedicinalProduct.fulfilled, (state, action) => {
                const index = state.medicinalProducts.findIndex(p => p.id === action.payload.id);
                if (index !== -1) {
                    state.medicinalProducts[index] = action.payload;
                }
            })
            .addCase(updateMedicinalProduct.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })

            // Delete
            .addCase(deleteMedicinalProduct.fulfilled, (state, action) => {
                state.medicinalProducts = state.medicinalProducts.filter(p => p.id !== action.payload);
            })
            .addCase(deleteMedicinalProduct.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            });
    },
});


export default medicinalProductSlice.reducer;
