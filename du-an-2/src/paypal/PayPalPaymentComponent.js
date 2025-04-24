import React, { useState } from 'react';
import {
    Box,
    Button,
    CircularProgress,
    Paper,
    TextField,
    Typography,
    Divider,
    Snackbar,
    Alert
} from '@mui/material';
import { createPayment } from '../services/PaymentService.js';

const PayPalPaymentComponent = () => {
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const handlePayment = async () => {
        if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
            setError('Vui lòng nhập số tiền hợp lệ.');
            return;
        }

        setError('');
        setLoading(true);
        try {
            const res = await createPayment(parseFloat(amount)); // Thêm orderId nếu có
            if (res.redirectUrl) {
                window.location.href = res.redirectUrl;
            } else {
                setSnackbar({ open: true, message: 'Không thể tạo thanh toán.', severity: 'error' });
            }
        } catch (err) {
            setSnackbar({ open: true, message: 'Đã xảy ra lỗi khi tạo thanh toán.', severity: 'error' });
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: '#f0f4f8'
            }}
        >
            <Paper elevation={4} sx={{ p: 5, borderRadius: 3, width: 400 }}>
                <Typography variant="h5" fontWeight="bold" align="center" gutterBottom>
                    💳 Thanh toán PayPal
                </Typography>

                <Divider sx={{ mb: 3 }} />

                <TextField
                    label="Số tiền (USD)"
                    fullWidth
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    sx={{ mb: 2 }}
                />

                {error && (
                    <Typography color="error" sx={{ mb: 2 }}>
                        {error}
                    </Typography>
                )}

                <Button
                    fullWidth
                    variant="contained"
                    color="success"
                    size="large"
                    onClick={handlePayment}
                    disabled={loading}
                    sx={{ py: 1.5, fontWeight: 'bold' }}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Thanh toán ngay'}
                </Button>
            </Paper>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
            </Snackbar>
        </Box>
    );
};

export default PayPalPaymentComponent;
