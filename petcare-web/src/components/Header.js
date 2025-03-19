import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';

const Header = () => {
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <header>
            <h1>Pet Care System</h1>
            <button onClick={handleLogout}>Logout</button>
        </header>
    );
};

export default Header;
