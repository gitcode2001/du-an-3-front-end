import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomePage from './home/Home';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import PrivateRoute from './routes/PrivateRoute';
import AdminAccountManager from "./pages/AdminAccountManager";
import ProfilePage from "./pages/ProfilePage";
import LaundryBookingComponent from "./booking/LaundryBookingComponent";
import LaundryOrderHistory from "./booking/LaundryOrderHistory";
import CategoryManagerComponent from "./category/CategoryManagerComponent";
import AdminOrderList from "./booking/AdminOrderList";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
                <Route path="/account-manager" element={<AdminAccountManager />} />
                <Route path="/profile" element={<ProfilePage/>}/>
                <Route path="/booking" element={<LaundryBookingComponent/>}/>
                <Route path="/history-booking" element={<LaundryOrderHistory/>}/>
                <Route path="/categories" element={<CategoryManagerComponent/>}/>
                <Route path="/order-list" element={<AdminOrderList/>}/>
            </Routes>
        </Router>
    );
}

export default App;
