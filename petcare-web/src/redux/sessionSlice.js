import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:8000/api/session";

export const fetchSessions = createAsyncThunk("sessions/fetchSessions", async (query = {}, { rejectWithValue, getState }) => {
        try {
            const token = getState().auth.token;
            const response = await axios.get(`${BASE_URL}/my`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: query,
            });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch sessions");
        }
    }
);

export const searchSessions = createAsyncThunk("sessions/searchSessions", async (searchReq = {}, { rejectWithValue, getState }) => {
        try {
            const token = getState().auth.token;
            const response = await axios.post(`${BASE_URL}/search`, searchReq, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch sessions");
        }
    }
);


export const fetchUpcomingSessions = createAsyncThunk("sessions/fetchUpcoming", async (_, { rejectWithValue, getState }) => {
    try {
        const token = getState().auth.token;
        const response = await axios.get(`${BASE_URL}/my/upcoming`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch sessions");
    }
});

export const createSession = createAsyncThunk("sessions/createSession", async (sessionData, { rejectWithValue, getState }) => {
    try {
        const token = getState().auth.token;
        const response = await axios.post(`${BASE_URL}/create`, sessionData, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to create session");
    }
});

export const fetchSessionById = createAsyncThunk(
    "sessions/fetchSessionById",
    async (sessionId, { rejectWithValue, getState }) => {
        try {
            const token = getState().auth.token;
            const response = await axios.get(`${BASE_URL}/${sessionId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch session");
        }
    }
);

// 🔹 Start Session
export const startSession = createAsyncThunk(
    "sessions/startSession",
    async (sessionId, { rejectWithValue, getState }) => {
        try {
            const token = getState().auth.token;
            const response = await axios.post(`${BASE_URL}/start/${sessionId}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to start session");
        }
    }
);

// 🔹 Complete Session
export const completeSession = createAsyncThunk(
    "sessions/completeSession",
    async (sessionId, { rejectWithValue, getState }) => {
        try {
            const token = getState().auth.token;
            const response = await axios.post(`${BASE_URL}/complete/${sessionId}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to complete session");
        }
    }
);

// 🔹 Cancel Session
export const cancelSession = createAsyncThunk(
    "sessions/cancelSession",
    async (sessionId, { rejectWithValue, getState }) => {
        try {
            const token = getState().auth.token;
            const response = await axios.post(`${BASE_URL}/cancel/${sessionId}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to cancel session");
        }
    }
);

const sessionSlice = createSlice({
    name: "session",
    initialState: {
        sessions: [],
        session: null,
        status: "idle",
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch upcoming Sessions
            .addCase(fetchUpcomingSessions.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchUpcomingSessions.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.sessions = action.payload;
            })
            .addCase(fetchUpcomingSessions.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })

            // Fetch Sessions
            .addCase(fetchSessions.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchSessions.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.sessions = action.payload;
            })
            .addCase(fetchSessions.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })

            // Search Sessions
            .addCase(searchSessions.pending, (state) => {
                state.status = "loading";
            })
            .addCase(searchSessions.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.sessions = action.payload;
            })
            .addCase(searchSessions.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })

            // Fetch Session by id
            .addCase(fetchSessionById.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchSessionById.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.session = action.payload;
            })
            .addCase(fetchSessionById.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })

            // Start Session
            .addCase(startSession.fulfilled, (state, action) => {
                if (state.session?.id === action.payload.id) {
                    state.session.status = "Started";
                }
            })

            // Complete Session
            .addCase(completeSession.fulfilled, (state, action) => {
                if (state.session?.id === action.payload.id) {
                    state.session.status = "Completed";
                }
            })

            // Cancel Session
            .addCase(cancelSession.fulfilled, (state, action) => {
                if (state.session?.id === action.payload.id) {
                    state.session.status = "Cancelled";
                }
            });
    },
});

export default sessionSlice.reducer;
