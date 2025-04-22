    import axios from 'axios';

    const API_URL = 'http://localhost:8080/api/account';

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` })
        };
    };

    // Xử lý lỗi chung
    const handleError = (error, defaultMsg) => {
        console.error("❌ Axios Error:", error);
        const msg = error?.response?.data?.message || error?.response?.data || defaultMsg;
        return { success: false, message: msg };
    };

    // Đăng nhập
    export const login = async (username, password) => {
        try {
            const response = await axios.post(`${API_URL}/login`, { username, password }, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            return handleError(error, "Đăng nhập thất bại");
        }
    };

    // Đổi mật khẩu
    export const changePassword = async (oldPassword, newPassword) => {
        try {
            const response = await axios.put(`${API_URL}/change-password`, {
                oldPassword, newPassword
            }, {
                headers: getAuthHeaders(),
                withCredentials: true
            });
            return { success: true, message: response.data };
        } catch (error) {
            return handleError(error, "Đổi mật khẩu thất bại");
        }
    };

    // Gửi yêu cầu quên mật khẩu
    export const forgotPassword = async (emailOrUsername) => {
        try {
            const response = await axios.post(`${API_URL}/forgot-password`, {
                emailOrUsername
            }, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            return handleError(error, "Yêu cầu OTP thất bại");
        }
    };

    export const verifyOtp = async (emailOrUsername, otp) => {
        try {
            const response = await axios.post(`${API_URL}/verify-otp`, {
                emailOrUsername, otp
            }, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            return handleError(error, "Xác thực OTP thất bại");
        }
    };

    export const resetPassword = async (emailOrUsername, newPassword) => {
        try {
            const response = await axios.put(`${API_URL}/reset-password`, {
                emailOrUsername, newPassword
            }, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            return handleError(error, "Đặt lại mật khẩu thất bại");
        }
    };

    export const lockAccount = async (userId) => {
        try {
            const response = await axios.put(`${API_URL}/lock/${userId}`, {}, {
                headers: getAuthHeaders(),
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            return handleError(error, "Khoá tài khoản thất bại");
        }
    };

    export const getRole = async (username) => {
        try {
            const response = await axios.get(`${API_URL}/role`, {
                headers: getAuthHeaders(),
                params: { username },
                withCredentials: true
            });
            return { success: true, role: response.data };
        } catch (error) {
            return handleError(error, "Lấy vai trò thất bại");
        }
    };
    export const resendOtp = async (emailOrUsername) => {
        return await forgotPassword(emailOrUsername);
    };
    export const getAllShippers = async () => {
        const response = await axios.get(`${API_URL}/shippers`);
        return response.data;
    };