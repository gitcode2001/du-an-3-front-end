import axios from 'axios';

const API_URL = 'http://localhost:8080/api/payment';

export const createPayment = async (amount, orderId) => {
    try {
        const response = await axios.post(`${API_URL}/create`, null, {
            params: { amount, orderId }
        });
        return response.data;
    } catch (error) {
        console.error('❌ Lỗi khi tạo thanh toán:', error);
        throw error;
    }
};

export const executePayment = async (paymentId, payerId, orderId) => {
    try {
        const response = await axios.get(`${API_URL}/success`, {
            params: { paymentId, PayerID: payerId, orderId }
        });
        return response.data;
    } catch (error) {
        if (
            error.response &&
            error.response.status === 400 &&
            typeof error.response.data === "string" &&
            error.response.data.includes("PAYMENT_ALREADY_DONE")
        ) {
            return "PAYMENT_ALREADY_DONE";
        }
        console.error("❌ Lỗi khi xác nhận thanh toán:", error);
        throw error;
    }
};

export const cancelPayment = async (orderId) => {
    try {
        const response = await axios.get(`${API_URL}/cancel`, {
            params: { orderId }
        });
        return response.data;
    } catch (error) {
        console.error('❌ Lỗi khi huỷ thanh toán:', error);
        throw error;
    }
};
