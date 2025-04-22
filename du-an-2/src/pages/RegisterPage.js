import React, { useState } from 'react';
import {
    Box, Button, Container, TextField, Typography, Paper, Snackbar, Alert, MenuItem, Avatar, Stack
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createUser } from '../services/UserService';
import { uploadImageToCloudinary } from '../services/CloudinaryService';

const RegisterPage = () => {
    const [form, setForm] = useState({
        fullName: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
        address: '',
        birthDate: '',
        gender: 'true',
    });

    const [avatarFile, setAvatarFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setAvatarFile(file);
        setPreviewUrl(URL.createObjectURL(file)); // Xem trước
    };

    const validateForm = () => {
        const {
            fullName, email, username, password, confirmPassword,
            phoneNumber, address, birthDate
        } = form;
        if (!fullName || !email || !username || !password || !confirmPassword || !phoneNumber || !address || !birthDate) {
            return 'Vui lòng điền đầy đủ thông tin!';
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            return 'Email không hợp lệ!';
        }
        if (password.length < 6) {
            return 'Mật khẩu phải có ít nhất 6 ký tự!';
        }
        if (password !== confirmPassword) {
            return 'Mật khẩu xác nhận không khớp!';
        }
        return null;
    };

    const handleRegister = async () => {
        const error = validateForm();
        if (error) {
            setSnackbar({ open: true, message: error, severity: 'error' });
            return;
        }

        try {
            let avatarUrl = '';
            if (avatarFile) {
                avatarUrl = await uploadImageToCloudinary(avatarFile);
            }

            const userPayload = {
                fullName: form.fullName,
                email: form.email,
                phoneNumber: form.phoneNumber,
                address: form.address,
                birthDate: form.birthDate,
                gender: form.gender === 'true',
                avatar: avatarUrl,
                account: {
                    username: form.username,
                    password: form.password,
                    role: { id: 3 }
                }
            };

            await createUser(userPayload);
            setSnackbar({ open: true, message: '🎉 Đăng ký thành công!', severity: 'success' });

            setTimeout(() => navigate('/login'), 1500);
        } catch (err) {
            console.error(err);
            setSnackbar({ open: true, message: '❌ Đăng ký thất bại!', severity: 'error' });
        }
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            bgcolor: '#eef6fa',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            py: 5
        }}>
            <Container maxWidth="sm">
                <Paper elevation={6} sx={{ p: 4, borderRadius: 3 }}>
                    <Typography variant="h4" textAlign="center" color="primary" fontWeight="bold" gutterBottom>
                        FastLaundry
                    </Typography>
                    <Typography variant="subtitle1" textAlign="center" mb={3}>
                        Đăng ký tài khoản mới
                    </Typography>

                    {/* Avatar upload */}
                    <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                        <Avatar
                            src={previewUrl || ''}
                            alt="avatar"
                            sx={{ width: 64, height: 64 }}
                        />
                        <Button variant="outlined" component="label">
                            Chọn ảnh
                            <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                        </Button>
                    </Stack>

                    <TextField fullWidth margin="dense" label="Họ và tên" name="fullName" value={form.fullName} onChange={handleChange} />
                    <TextField fullWidth margin="dense" label="Email" name="email" value={form.email} onChange={handleChange} />
                    <TextField fullWidth margin="dense" label="Số điện thoại" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} />
                    <TextField fullWidth margin="dense" label="Địa chỉ" name="address" value={form.address} onChange={handleChange} />
                    <TextField fullWidth margin="dense" label="Ngày sinh" type="date" name="birthDate" value={form.birthDate} onChange={handleChange} InputLabelProps={{ shrink: true }} />
                    <TextField
                        fullWidth margin="dense" select label="Giới tính"
                        name="gender" value={form.gender} onChange={handleChange}
                    >
                        <MenuItem value="true">Nam</MenuItem>
                        <MenuItem value="false">Nữ</MenuItem>
                    </TextField>

                    <TextField fullWidth margin="dense" label="Tên đăng nhập" name="username" value={form.username} onChange={handleChange} />
                    <TextField fullWidth margin="dense" label="Mật khẩu" name="password" type="password" value={form.password} onChange={handleChange} />
                    <TextField fullWidth margin="dense" label="Xác nhận mật khẩu" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} />

                    <Button variant="contained" fullWidth sx={{ mt: 3, py: 1.3 }} onClick={handleRegister}>
                        Đăng ký
                    </Button>

                    <Box textAlign="center" mt={2}>
                        <Typography variant="body2">
                            Đã có tài khoản?{' '}
                            <a href="/login" style={{ color: '#1976d2', textDecoration: 'none' }}>Đăng nhập</a>
                        </Typography>
                    </Box>
                </Paper>
            </Container>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default RegisterPage;
