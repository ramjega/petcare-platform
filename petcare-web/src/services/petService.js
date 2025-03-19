import axios from 'axios';

const BASE_URL = 'http://localhost:8000';

export const fetchPets = async (token) => {
    const response = await axios.get(`${BASE_URL}/pets`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const createPet = async (pet, token) => {
    const response = await axios.post(`${BASE_URL}/pets`, pet, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};
