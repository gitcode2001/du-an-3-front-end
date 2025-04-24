// src/pages/PayPalCancel.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cancelPayment } from '../services/PaymentService.js';

const PayPalCancel = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleCancel = async () => {
            try {
                const res = await cancelPayment();
                alert(res.message || 'Bạn đã huỷ thanh toán.');
                navigate('/');
            } catch (err) {
                alert('❌ Có lỗi khi huỷ.');
                navigate('/');
            }
        };
        handleCancel();
    }, []);

    return <div>Đang huỷ thanh toán...</div>;
};

export default PayPalCancel;
