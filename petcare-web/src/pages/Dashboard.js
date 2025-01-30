import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPets } from '../redux/petSlice';
import { fetchPets } from '../services/petService';

const Dashboard = () => {
    const dispatch = useDispatch();
    const pets = useSelector((state) => state.pets.pets);
    const token = useSelector((state) => state.auth.token);

    useEffect(() => {
        const loadPets = async () => {
            const petData = await fetchPets(token);
            dispatch(setPets(petData));
        };
        loadPets();
    }, [dispatch, token]);

    return (
        <div>
            <h2>Dashboard</h2>
            <ul>
                {pets.map((pet) => (
                    <li key={pet.id}>{pet.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;
