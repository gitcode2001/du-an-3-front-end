import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import {
    Stepper, Step, StepLabel, Typography, Box, Paper, CircularProgress, Alert
} from '@mui/material';
import { getOrderById } from '../services/LaundryOrderService';

const steps = ['Đặt đơn', 'Đã lấy đồ', 'Đang giặt', 'Đã giao'];

const statusStepMap = {
    PENDING: 0,
    PICKED_UP: 1,
    IN_PROCESS: 2,
    DELIVERED: 3
};

// Mapping từ displayName (Tiếng Việt) sang enum
const statusNameToEnum = {
    'Đang chờ xử lý': 'PENDING',
    'Đã lấy đồ': 'PICKED_UP',
    'Đang giặt': 'IN_PROCESS',
    'Đã giao': 'DELIVERED'
};

const OrderTracking = () => {
    const { orderId } = useParams();
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const client = useRef(null);

    useEffect(() => {
        const fetchInitialStatus = async () => {
            try {
                const order = await getOrderById(orderId);
                const statusEnum = statusNameToEnum[order?.status] || order?.status; // fallback nếu enum
                const stepIndex = statusStepMap[statusEnum] ?? 0;
                setCurrentStep(stepIndex);
            } catch (err) {
                console.error('❌ Lỗi khi lấy đơn hàng:', err);
                setMessage('Không thể tải trạng thái đơn hàng.');
            } finally {
                setLoading(false);
            }
        };

        if (orderId) fetchInitialStatus();
    }, [orderId]);

    useEffect(() => {
        if (!orderId) return;

        client.current = new Client({
            webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
            onConnect: () => {
                client.current.subscribe(`/topic/delivery/${orderId}`, (msg) => {
                    try {
                        const payload = JSON.parse(msg.body);
                        console.log('📦 WebSocket Payload:', payload);

                        const step = statusStepMap[payload.status];
                        if (step !== undefined) {
                            setCurrentStep(step);
                            setMessage(`🚚 Đơn hàng #${payload.orderId} đã chuyển sang: ${payload.displayName}`);
                        }
                    } catch (err) {
                        console.error('❌ Parse lỗi WebSocket:', err);
                    }
                });
            },
            onStompError: (frame) => {
                console.error('❌ STOMP Error:', frame.headers['message']);
            },
            debug: () => {}
        });

        client.current.activate();

        return () => {
            if (client.current?.active) {
                client.current.deactivate();
            }
        };
    }, [orderId]);

    return (
        <Paper sx={{ p: 3, maxWidth: 600, margin: 'auto' }}>
            <Typography variant="h6" gutterBottom>Tiến trình đơn hàng</Typography>

            {loading ? (
                <Box display="flex" justifyContent="center" mt={3}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <Stepper activeStep={currentStep} alternativeLabel>
                        {steps.map((label, index) => (
                            <Step key={index}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>

                    {message && (
                        <Box mt={2}>
                            <Alert severity="info">{message}</Alert>
                        </Box>
                    )}
                </>
            )}
        </Paper>
    );
};

export default OrderTracking;
