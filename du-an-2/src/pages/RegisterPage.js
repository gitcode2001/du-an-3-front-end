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
    const [errors, setErrors] = useState({});
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setAvatarFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const validateForm = () => {
        const newErrors = {};
        const {
            fullName, email, username, password, confirmPassword,
            phoneNumber, address, birthDate, gender
        } = form;

        if (!fullName.trim()) newErrors.fullName = 'Vui lòng nhập họ và tên!';
        if (!email.trim()) {
            newErrors.email = 'Vui lòng nhập email!';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email không hợp lệ!';
        }

        if (!username.trim()) {
            newErrors.username = 'Vui lòng nhập tên đăng nhập!';
        } else if (username.length < 5) {
            newErrors.username = 'Tên đăng nhập phải có ít nhất 5 ký tự!';
        }

        if (!password) {
            newErrors.password = 'Vui lòng nhập mật khẩu!';
        } else if (password.length < 6) {
            newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự!';
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu!';
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp!';
        }

        if (!phoneNumber.trim()) {
            newErrors.phoneNumber = 'Vui lòng nhập số điện thoại!';
        } else if (!/^[0-9]{10}$/.test(phoneNumber)) {
            newErrors.phoneNumber = 'Số điện thoại phải gồm 10 chữ số!';
        }

        if (!address.trim()) newErrors.address = 'Vui lòng nhập địa chỉ!';

        if (!birthDate) {
            newErrors.birthDate = 'Vui lòng chọn ngày sinh!';
        } else {
            const birthDateObj = new Date(birthDate);
            const today = new Date();
            const age = today.getFullYear() - birthDateObj.getFullYear();
            if (age < 18) {
                newErrors.birthDate = 'Bạn phải từ 18 tuổi trở lên để đăng ký!';
            }
        }

        if (gender !== 'true' && gender !== 'false') {
            newErrors.gender = 'Giới tính không hợp lệ!';
        }

        return newErrors;
    };

    const handleRegister = async () => {
        const validationErrors = validateForm();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            setSnackbar({ open: true, message: '❗ Vui lòng kiểm tra lại thông tin!', severity: 'warning' });
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
                    role: { id: 4 }
                }
            };

            await createUser(userPayload);

            setSnackbar({ open: true, message: '🎉 Đăng ký thành công!', severity: 'success' });
            setTimeout(() => navigate('/login'), 1500);
        } catch (err) {
            console.error(err);
            let errorMessage = '❌ Đăng ký thất bại!';

            // Axios error
            if (err.response && err.response.data && err.response.data.message) {
                errorMessage = err.response.data.message;
            }
            // Fetch error fallback
            else if (err.message) {
                errorMessage = err.message;
            }

            setSnackbar({ open: true, message: errorMessage, severity: 'error' });
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

                    <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                        <Avatar src={previewUrl || ''} alt="avatar" sx={{ width: 64, height: 64 }} />
                        <Button variant="outlined" component="label">
                            Chọn ảnh
                            <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                        </Button>
                    </Stack>

                    <TextField fullWidth margin="dense" label="Họ và tên" name="fullName"
                               value={form.fullName} onChange={handleChange}
                               error={Boolean(errors.fullName)} helperText={errors.fullName} />

                    <TextField fullWidth margin="dense" label="Email" name="email"
                               value={form.email} onChange={handleChange}
                               error={Boolean(errors.email)} helperText={errors.email} />

                    <TextField fullWidth margin="dense" label="Số điện thoại" name="phoneNumber"
                               value={form.phoneNumber} onChange={handleChange}
                               error={Boolean(errors.phoneNumber)} helperText={errors.phoneNumber} />

                    <TextField fullWidth margin="dense" label="Địa chỉ" name="address"
                               value={form.address} onChange={handleChange}
                               error={Boolean(errors.address)} helperText={errors.address} />

                    <TextField fullWidth margin="dense" label="Ngày sinh" type="date" name="birthDate"
                               value={form.birthDate} onChange={handleChange}
                               InputLabelProps={{ shrink: true }}
                               error={Boolean(errors.birthDate)} helperText={errors.birthDate} />

                    <TextField fullWidth margin="dense" select label="Giới tính" name="gender"
                               value={form.gender} onChange={handleChange}
                               error={Boolean(errors.gender)} helperText={errors.gender}>
                        <MenuItem value="true">Nam</MenuItem>
                        <MenuItem value="false">Nữ</MenuItem>
                    </TextField>

                    <TextField fullWidth margin="dense" label="Tên đăng nhập" name="username"
                               value={form.username} onChange={handleChange}
                               error={Boolean(errors.username)} helperText={errors.username} />

                    <TextField fullWidth margin="dense" label="Mật khẩu" name="password" type="password"
                               value={form.password} onChange={handleChange}
                               error={Boolean(errors.password)} helperText={errors.password} />

                    <TextField fullWidth margin="dense" label="Xác nhận mật khẩu" name="confirmPassword" type="password"
                               value={form.confirmPassword} onChange={handleChange}
                               error={Boolean(errors.confirmPassword)} helperText={errors.confirmPassword} />

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
                autoHideDuration={4000}
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
