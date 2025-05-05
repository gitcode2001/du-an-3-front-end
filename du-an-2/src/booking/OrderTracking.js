import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import {
    Stepper, Step, StepLabel, Typography, Box, Paper, CircularProgress, Alert
} from '@mui/material';
import { getOrderById } from '../services/LaundryOrderService';

const steps = ['\u0110\u1eb7t \u0111\u01a1n', '\u0110\u00e3 l\u1ea5y \u0111\u1ed3', '\u0110ang gi\u1eb7t', '\u0110\u00e3 giao'];

const statusStepMap = {
    PENDING: 0,
    PICKED_UP: 1,
    IN_PROCESS: 2,
    DELIVERED: 3
};

const enumToDisplayName = {
    PENDING: '\u0110ang ch\u1edd x\u1eed l\u00fd',
    PICKED_UP: '\u0110\u00e3 l\u1ea5y \u0111\u1ed3',
    IN_PROCESS: '\u0110ang gi\u1eb7t',
    DELIVERED: '\u0110\u00e3 giao'
};

const displayNameToEnum = Object.fromEntries(
    Object.entries(enumToDisplayName).map(([k, v]) => [v, k])
);

const OrderTracking = () => {
    const { orderId } = useParams();
    const [currentStep, setCurrentStep] = useState(0);
    const [currentStatus, setCurrentStatus] = useState('');
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const client = useRef(null);

    useEffect(() => {
        const fetchInitialStatus = async () => {
            try {
                const order = await getOrderById(orderId);
                const statusEnum = displayNameToEnum[order.status] || order.status;
                const stepIndex = statusStepMap[statusEnum] ?? 0;
                setCurrentStep(stepIndex);
                setCurrentStatus(enumToDisplayName[statusEnum] || statusEnum);
            } catch (err) {
                console.error('❌ L\u1ed7i khi l\u1ea5y \u0111\u01a1n h\u00e0ng:', err);
                setMessage('Kh\u00f4ng th\u1ec3 t\u1ea3i tr\u1ea1ng th\u00e1i \u0111\u01a1n h\u00e0ng.');
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
                        const step = statusStepMap[payload.status];
                        if (step !== undefined) {
                            setCurrentStep(step);
                            setCurrentStatus(payload.displayName);
                            setMessage(`\u2705 \u0110\u01a1n h\u00e0ng #${payload.orderId} \u0111\u00e3 chuy\u1ec3n sang: ${payload.displayName}`);
                        }
                    } catch (err) {
                        console.error('❌ Parse l\u1ed7i WebSocket:', err);
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
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
            <Paper sx={{ p: 4, maxWidth: 700, width: '100%' }} elevation={3}>
                <Typography variant="h5" fontWeight="bold" mb={2}>
                    🚚 Tiến trình đơn hàng #{orderId}
                </Typography>

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

                        <Box mt={3} textAlign="center">
                            <Typography variant="subtitle1">
                                Trạng thái hiện tại: <strong>{currentStatus}</strong>
                            </Typography>
                        </Box>

                        {message && (
                            <Box mt={2}>
                                <Alert severity="info">{message}</Alert>
                            </Box>
                        )}
                    </>
                )}
            </Paper>
        </Box>
    );
};

export default OrderTracking;
