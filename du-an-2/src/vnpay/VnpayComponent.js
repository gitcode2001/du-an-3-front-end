import React, { useState } from 'react';
import { createPayment } from '../services/VnpayService';

const VnpayComponent = () => {
    const [amount, setAmount] = useState(''); // Trạng thái cho số tiền
    const [paymentUrl, setPaymentUrl] = useState(''); // Trạng thái cho URL thanh toán
    const [message, setMessage] = useState(''); // Trạng thái cho thông báo
    const [loading, setLoading] = useState(false); // Trạng thái loading

    // Hàm tạo thanh toán
    const handleCreatePayment = async () => {
        // Kiểm tra tính hợp lệ của số tiền
        if (!amount || isNaN(amount) || amount <= 0) {
            setMessage('Vui lòng nhập số tiền hợp lệ!');
            return;
        }

        setLoading(true);  // Bắt đầu tải
        setMessage('');  // Reset thông báo trước khi gửi yêu cầu

        try {
            // Gọi hàm tạo thanh toán với số tiền
            const url = await createPayment(amount);  // Truyền trực tiếp amount
            setPaymentUrl(url);
            setMessage('Link thanh toán đã tạo thành công!');
        } catch (error) {
            console.error('Lỗi khi tạo thanh toán:', error);
            setMessage(`Lỗi: ${error.message || 'Đã có lỗi xảy ra'}`);
        } finally {
            setLoading(false);  // Dừng trạng thái loading
        }
    };

    return (
        <div style={{ maxWidth: '500px', margin: 'auto', padding: '20px' }}>
            <h2>Tạo thanh toán VNPAY</h2>

            {/* Input số tiền */}
            <input
                type="number"
                placeholder="Nhập số tiền"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                style={{
                    width: '100%',
                    padding: '8px',
                    marginBottom: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '4px'
                }}
            />

            {/* Nút tạo thanh toán */}
            <button
                onClick={handleCreatePayment}
                disabled={loading}  // Disable khi đang loading
                style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    marginBottom: '20px',
                }}
            >
                {loading ? 'Đang tạo thanh toán...' : 'Tạo thanh toán'}
            </button>

            {/* Hiển thị thông báo */}
            {message && (
                <p style={{ color: message.includes('Lỗi') ? 'red' : 'green' }}>{message}</p>
            )}

            {paymentUrl && (
                <div>
                    <p>Click vào link dưới để thanh toán:</p>
                    <a
                        href={paymentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: 'block',
                            color: '#007BFF',
                            wordWrap: 'break-word',
                            fontWeight: 'bold',
                        }}
                    >
                        {paymentUrl}
                    </a>
                </div>
            )}
        </div>
    );
};

export default VnpayComponent;
