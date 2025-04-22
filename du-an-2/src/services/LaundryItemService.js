// src/services/laundryItemService.js
import axios from 'axios';

const API_BASE = 'http://localhost:8080/api/laundry-items';

export const getAllLaundryItems = async () => {
    const response = await axios.get(API_BASE);
    return response.data;
};

export const getLaundryItemById = async (id) => {
    const response = await axios.get(`${API_BASE}/${id}`);
    return response.data;
};

export const getLaundryItemsByOrderId = async (orderId) => {
    const response = await axios.get(`${API_BASE}/order/${orderId}`);
    return response.data;
};

export const createLaundryItem = async (item) => {
    const response = await axios.post(API_BASE, item);
    return response.data;
};

export const updateLaundryItem = async (id, item) => {
    const response = await axios.put(`${API_BASE}/${id}`, item);
    return response.data;
};

export const deleteLaundryItem = async (id) => {
    return await axios.delete(`${API_BASE}/${id}`);
};
