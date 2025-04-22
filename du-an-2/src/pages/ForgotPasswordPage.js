import React, { useState } from 'react';
import {
    Box, Button, Container, TextField, Typography, Paper,
    Snackbar, Alert, Stack, Link
} from '@mui/material';
import { forgotPassword, verifyOtp, resetPassword } from '../services/AccountService';

const ForgotPasswordPage = () => {
    const [step, setStep] = useState(1); // 1: nhập email/username, 2: OTP, 3: new password
    const [input, setInput] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

    const handleForgot = async () => {
        if (!input.trim()) {
            return setSnackbar({ open: true, message: 'Vui lòng nhập email hoặc tên đăng nhập!', severity: 'warning' });
        }
        try {
            const res = await forgotPassword(input);
            setSnackbar({ open: true, message: res.message, severity: res.success ? 'success' : 'error' });
            if (res.success) setStep(2);
        } catch {
            setSnackbar({ open: true, message: 'Có lỗi xảy ra khi gửi mã OTP!', severity: 'error' });
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp.trim()) {
            return setSnackbar({ open: true, message: 'Vui lòng nhập mã OTP!', severity: 'warning' });
        }
        try {
            const res = await verifyOtp(input, otp);
            setSnackbar({ open: true, message: res.message, severity: res.success ? 'success' : 'error' });
            if (res.success) setStep(3);
        } catch {
            setSnackbar({ open: true, message: 'Xác thực OTP thất bại!', severity: 'error' });
        }
    };

    const handleResetPassword = async () => {
        if (!newPassword || !confirmPassword) {
            return setSnackbar({ open: true, message: 'Vui lòng điền đầy đủ mật khẩu mới!', severity: 'warning' });
        }
        if (newPassword.length < 6) {
            return setSnackbar({ open: true, message: 'Mật khẩu mới phải có ít nhất 6 ký tự.', severity: 'warning' });
        }
        if (newPassword !== confirmPassword) {
            return setSnackbar({ open: true, message: 'Mật khẩu xác nhận không khớp.', severity: 'warning' });
        }
        try {
            const res = await resetPassword(input, newPassword);
            setSnackbar({ open: true, message: res.message, severity: res.success ? 'success' : 'error' });
            if (res.success) setTimeout(() => (window.location.href = '/login'), 2000);
        } catch {
            setSnackbar({ open: true, message: 'Đặt lại mật khẩu thất bại!', severity: 'error' });
        }
    };

    const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#eef6fa', display: 'flex', alignItems: 'center', justifyContent: 'center', py: 5 }}>
            <Container maxWidth="xs">
                <Paper elevation={6} sx={{ p: 4, borderRadius: 3 }}>
                    <Typography variant="h5" textAlign="center" fontWeight="bold" color="primary" gutterBottom>
                        FastLaundry
                    </Typography>
                    <Typography variant="subtitle1" textAlign="center" mb={2}>
                        {step === 1 ? 'Quên mật khẩu?' : step === 2 ? 'Nhập mã OTP' : 'Đặt lại mật khẩu'}
                    </Typography>

                    {step === 1 && (
                        <>
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Email hoặc tên đăng nhập"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            />
                            <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={handleForgot}>
                                Gửi mã khôi phục
                            </Button>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Mã OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                            />
                            <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={handleVerifyOtp}>
                                Xác nhận OTP
                            </Button>
                        </>
                    )}

                    {step === 3 && (
                        <>
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Mật khẩu mới"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Xác nhận mật khẩu mới"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={handleResetPassword}>
                                Đặt lại mật khẩu
                            </Button>
                        </>
                    )}

                    <Box textAlign="center" mt={2}>
                        <Typography variant="body2">
                            {step === 1 ? 'Nhớ mật khẩu?' : 'Đã có tài khoản?'}{' '}
                            <Link href="/login" underline="hover">Đăng nhập</Link>
                        </Typography>
                    </Box>
                </Paper>

                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={3000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Alert severity={snackbar.severity} variant="filled">
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Container>
        </Box>
    );
};

export default ForgotPasswordPage;
