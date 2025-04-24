// src/pages/PayPalSuccess.jsx
import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { executePayment } from '../services/PaymentService';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';

const PayPalSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const paymentId = searchParams.get('paymentId');
    const payerId = searchParams.get('PayerID');

    useEffect(() => {
        const handleSuccess = async () => {
            try {
                const response = await executePayment(paymentId, payerId);
                if (response.status === 'success') {
                    alert('✅ Thanh toán thành công!');
                    // 👉 Bạn có thể gọi API lưu hóa đơn tại đây nếu muốn
                    navigate('/payment-success');
                } else {
                    alert('⚠️ Xác nhận thất bại.');
                }
            } catch (err) {
                console.error(err);
                alert('❌ Đã xảy ra lỗi khi xác nhận.');
                navigate('/');
            }
        };
        handleSuccess();
    }, []);

    return (
        <Box sx={{ p: 5, textAlign: 'center' }}>
            <CircularProgress />
            <Typography mt={2}>Đang xác nhận thanh toán...</Typography>
        </Box>
    );
};

export default PayPalSuccess;
