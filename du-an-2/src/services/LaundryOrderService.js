import axios from 'axios';

const API_BASE = 'http://localhost:8080/api/orders';

export const createLaundryOrder = async (order) => {
    const response = await axios.post(API_BASE, order);
    return response.data;
};

export const getAllOrders = async () => {
    const response = await axios.get(API_BASE);
    return response.data;
};

export const getOrderById = async (id) => {
    const response = await axios.get(`${API_BASE}/${id}`);
    return response.data;
};

export const getOrdersByUserId = async (userId) => {
    const response = await axios.get(`${API_BASE}/user/${userId}`);
    return response.data;
};
export const getOrdersByShipperId = async (shipperId) => {
    const response = await axios.get(`${API_BASE}/shipper/${shipperId}`);
    return response.data;
};

export const updateOrderStatus = async (id, status) => {
    const response = await axios.put(`${API_BASE}/${id}/status`, { status });
    return response.data;
};

export const deleteOrder = async (id) => {
    const response = await axios.delete(`${API_BASE}/${id}`);
    return response.data;
};
