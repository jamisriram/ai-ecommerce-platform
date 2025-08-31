import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    // If logged in and is an admin, show the page.
    // Otherwise, navigate to the login page.
    return userInfo && userInfo.is_admin ? <Outlet /> : <Navigate to="/login" />;
};

export default AdminRoute;