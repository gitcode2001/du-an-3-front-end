import axios from 'axios';

const API_BASE = 'http://localhost:8080/api/orders';

export const createLaundryOrder = async (order) => {
    const res = await axios.post(API_BASE, order);
    return res.data;
};

export const getAllOrders = async () => {
    const res = await axios.get(API_BASE);
    return res.data;
};

export const getOrderById = async (id) => {
    const res = await axios.get(`${API_BASE}/${id}`);
    return res.data;
};

export const getOrdersByUserId = async (userId) => {
    const res = await axios.get(`${API_BASE}/user/${userId}`);
    return res.data;
};

export const getOrdersByShipperId = async (shipperId) => {
    const res = await axios.get(`${API_BASE}/shipper/${shipperId}`);
    return res.data;
};

export const getOrdersByShipperIdAndStatus = async (shipperId, status) => {
    const res = await axios.get(`${API_BASE}/shipper/${shipperId}/status`, {
        params: { status }
    });
    return res.data;
};

export const updateOrderStatus = async (id, status) => {
    const res = await axios.put(`${API_BASE}/${id}/status`, { status });
    return res.data;
};

export const softDeleteOrder = async (orderId) => {
    const res = await axios.put(`${API_BASE}/${orderId}/soft-delete`);
    return res.data;
};

export const softDeleteOrderByAdmin = async (orderId) => {
    const res = await axios.put(`${API_BASE}/${orderId}/soft-delete-admin`);
    return res.data;
};

export const deleteOrder = async (id) => {
    const res = await axios.delete(`${API_BASE}/${id}`);
    return res.data;
};
