import { configureStore } from '@reduxjs/toolkit';
import logger from "redux-logger";
import authReducer from './authSlice';
import petReducer from './petSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        pets: petReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger)
});

export default store;
