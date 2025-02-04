import { configureStore } from '@reduxjs/toolkit';
import logger from "redux-logger";
import authReducer from './authSlice';
import petReducer from './petSlice';
import profileReducer from './profileSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        profile: profileReducer,
        pet: petReducer,

    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger)
});

export default store;
