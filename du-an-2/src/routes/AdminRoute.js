import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
    const { isAuthenticated, role } = useAuth();
    return (isAuthenticated && role === 'admin') ? children : <Navigate to="/unauthorized" />;
};

export default AdminRoute;
