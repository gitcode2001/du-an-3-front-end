import axios from 'axios';

const API_BASE = 'http://localhost:8080/api/vnpay';

export const createPayment = async (amount) => {
    try {
        const response = await axios.post(`${API_BASE}/create-payment`, { amount });
        return response.data;
    } catch (error) {
        throw error.response
            ? error.response.data
            : 'Lỗi kết nối server, vui lòng thử lại sau.';
    }
};


export const handlePaymentReturn = async (responseCode) => {
    try {
        const response = await axios.get(`${API_BASE}/payment-return?vnp_ResponseCode=${responseCode}`);
        return response.data;
    } catch (error) {
        throw error.response
            ? error.response.data
            : 'Lỗi kết nối server, vui lòng thử lại sau.';
    }
};
