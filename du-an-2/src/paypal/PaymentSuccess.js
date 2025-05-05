import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { executePayment } from "../services/PaymentService";
import { CircularProgress, Typography, Container, Box } from "@mui/material";

const PayPalSuccess = () => {
    const location = useLocation();
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const paymentId = query.get("paymentId");
        const payerId = query.get("PayerID");
        const orderId = query.get("orderId");

        if (paymentId && payerId) {
            executePayment(paymentId, payerId, orderId)
                .then((response) => {
                    if (response.status === "success") {
                        setMessage(response.message || "✅ Thanh toán thành công!");
                    } else {
                        setError(response.message || "⚠️ Xác nhận thanh toán thất bại.");
                    }
                })
                .catch(() => {
                    setError("❌ Đã xảy ra lỗi khi xác nhận thanh toán.");
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setError("❌ Thiếu thông tin xác nhận thanh toán.");
            setLoading(false);
        }
    }, [location]);

    return (
        <Container maxWidth="sm">
            <Box textAlign="center" mt={10}>
                {loading ? (
                    <CircularProgress />
                ) : error ? (
                    <Typography variant="h6" color="error">{error}</Typography>
                ) : (
                    <Typography variant="h6" color="primary">{message}</Typography>
                )}
            </Box>
        </Container>
    );
};

export default PayPalSuccess;
