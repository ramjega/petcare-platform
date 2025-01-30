import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import petReducer from './petSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        pets: petReducer,
    },
});

export default store;
