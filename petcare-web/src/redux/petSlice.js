import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    pets: [],
};

const petSlice = createSlice({
    name: 'pets',
    initialState,
    reducers: {
        setPets(state, action) {
            state.pets = action.payload;
        },
        addPet(state, action) {
            state.pets.push(action.payload);
        },
        updatePet(state, action) {
            const index = state.pets.findIndex((pet) => pet.id === action.payload.id);
            if (index !== -1) state.pets[index] = action.payload;
        },
        deletePet(state, action) {
            state.pets = state.pets.filter((pet) => pet.id !== action.payload);
        },
    },
});

export const { setPets, addPet, updatePet, deletePet } = petSlice.actions;
export default petSlice.reducer;
