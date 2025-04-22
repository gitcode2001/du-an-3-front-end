import axios from 'axios';

const API_URL = 'http://localhost:8080/api/users';

// 📌 Lấy tất cả người dùng
export const getAllUsers = () => {
    return axios.get(API_URL);
};

// 📌 Lấy người dùng theo ID
export const getUserById = (id) => {
    return axios.get(`${API_URL}/${id}`);
};

// 📌 Tạo người dùng mới (dành cho admin)
export const createUser = (user) => {
    return axios.post(API_URL, user);
};

// 📌 Cập nhật người dùng
export const updateUser = (id, userUpdate) => {
    return axios.put(`${API_URL}/${id}`, userUpdate);
};

// 📌 Xoá người dùng
export const deleteUser = (id) => {
    return axios.delete(`${API_URL}/${id}`);
};

// 📌 Lọc theo vai trò
export const getUsersByRole = (roleName) => {
    return axios.get(`${API_URL}/role/${roleName}`);
};

export const registerUser = (form) => {
    return axios.post(API_URL, {
        fullName: form.fullName,
        email: form.email,
        account: {
            username: form.username,
            password: form.password,
            role: { id: 2 }
        }
    });
};
