import React, { useState } from 'react';
import {
    Box, Button, Container, TextField, Typography, Paper,
    Snackbar, Alert, Stack
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { changePassword } from '../services/AccountService';

const ChangePasswordPage = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

    const navigate = useNavigate();

    const handleChangePassword = async () => {
        if (!oldPassword || !newPassword || !confirmPassword) {
            return setSnackbar({ open: true, message: 'Vui lòng điền đầy đủ thông tin.', severity: 'warning' });
        }

        if (newPassword.length < 6) {
            return setSnackbar({ open: true, message: 'Mật khẩu mới phải có ít nhất 6 ký tự.', severity: 'warning' });
        }

        if (newPassword !== confirmPassword) {
            return setSnackbar({ open: true, message: 'Mật khẩu xác nhận không khớp.', severity: 'warning' });
        }

        try {
            const res = await changePassword(oldPassword, newPassword);
            if (res.success) {
                setSnackbar({ open: true, message: res.message, severity: 'success' });
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                setSnackbar({ open: true, message: res.message, severity: 'error' });
            }
        } catch (err) {
            setSnackbar({ open: true, message: 'Đã xảy ra lỗi khi đổi mật khẩu.', severity: 'error' });
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                bgcolor: '#f0f8ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                py: 5,
            }}
        >
            <Container maxWidth="sm">
                <Paper elevation={6} sx={{ p: 4, borderRadius: 3 }}>
                    <Typography variant="h5" fontWeight="bold" color="primary" textAlign="center" gutterBottom>
                        Đổi mật khẩu
                    </Typography>

                    <TextField
                        label="Mật khẩu hiện tại"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                    />

                    <TextField
                        label="Mật khẩu mới"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />

                    <TextField
                        label="Xác nhận mật khẩu mới"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                    <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={handleChangePassword}
                        >
                            Cập nhật mật khẩu
                        </Button>
                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={() => navigate('/')}
                        >
                            Quay về trang chủ
                        </Button>
                    </Stack>
                </Paper>
            </Container>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert severity={snackbar.severity} variant="filled">
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ChangePasswordPage;
