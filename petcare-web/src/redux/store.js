import { configureStore } from '@reduxjs/toolkit';
import logger from "redux-logger";
import authReducer from './authSlice';
import petReducer from './petSlice';
import profileReducer from './profileSlice';
import scheduleReducer from "./scheduleSlice";
import sessionReducer from "./sessionSlice";
import appointmentReducer from "./appointmentSlice";
import organizationReducer from "./organizationSlice";
import cityReducer from "./citySlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        profile: profileReducer,
        pet: petReducer,
        schedule: scheduleReducer,
        session: sessionReducer,
        appointment: appointmentReducer,
        organization: organizationReducer,
        city: cityReducer,

    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger)
});

export default store;
