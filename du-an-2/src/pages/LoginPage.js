import React, { useState, useEffect } from 'react';
import {
    Box, Button, Container, TextField, Typography, Paper, Snackbar, Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/AccountService';
import { useAuth } from '../context/AuthContext';

import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const LoginPage = () => {
    const [form, setForm] = useState({ username: '', password: '' });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

    const navigate = useNavigate();
    const { setAuth } = useAuth();

    const [stompClient, setStompClient] = useState(null);

    const connectWebSocket = () => {
        const socket = new SockJS('http://localhost:8080/ws');
        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            onConnect: () => {
                console.log('✅ Kết nối WebSocket thành công');
                client.subscribe('/topic/login', (message) => {
                    setSnackbar({
                        open: true,
                        message: `📢 ${message.body}`,
                        severity: 'info'
                    });
                });
            },
            onStompError: (frame) => {
                console.error('STOMP error:', frame);
            }
        });

        client.activate();
        setStompClient(client);
    };

    useEffect(() => {
        connectWebSocket();
        return () => {
            if (stompClient) stompClient.deactivate();
        };
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleLogin = async () => {
        const { username, password } = form;

        if (!username || !password) {
            setSnackbar({ open: true, message: 'Vui lòng nhập đầy đủ thông tin!', severity: 'error' });
            return;
        }

        try {
            const res = await login(username, password);

            if (res.success) {
                const { token, role, userId } = res;

                localStorage.setItem("token", token);
                localStorage.setItem("username", username);
                localStorage.setItem("role", role);
                localStorage.setItem("userId", userId);

                setAuth({
                    token, username, role, userId,
                    isAuthenticated: true
                });

                setSnackbar({ open: true, message: '🎉 Đăng nhập thành công!', severity: 'success' });
                setTimeout(() => {
                    navigate('/');
                }, 1500);
            } else {
                setSnackbar({ open: true, message: res.message || 'Đăng nhập thất bại', severity: 'error' });
            }

        } catch (err) {
            console.error(err);
            setSnackbar({ open: true, message: '⚠️ Không thể kết nối đến máy chủ', severity: 'error' });
        }
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            bgcolor: '#f5faff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            py: 5,
        }}>
            <Container maxWidth="xs">
                <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
                    <Typography variant="h4" fontWeight="bold" textAlign="center" color="primary" gutterBottom>
                        FastLaundry
                    </Typography>
                    <Typography variant="h6" textAlign="center" mb={3}>
                        Đăng nhập tài khoản
                    </Typography>

                    <TextField
                        fullWidth margin="normal" label="Tên đăng nhập"
                        name="username" value={form.username} onChange={handleChange}
                        autoFocus
                    />
                    <TextField
                        fullWidth margin="normal" label="Mật khẩu"
                        type="password" name="password" value={form.password} onChange={handleChange}
                    />

                    <Box textAlign="right" mt={1}>
                        <a href="/forgot-password" style={{ fontSize: 13, color: '#1976d2', textDecoration: 'none' }}>
                            Quên mật khẩu?
                        </a>
                    </Box>

                    <Button
                        variant="contained"
                        fullWidth
                        size="large"
                        sx={{ mt: 3, py: 1.2, fontWeight: 'bold' }}
                        onClick={handleLogin}
                    >
                        Đăng nhập
                    </Button>

                    <Box textAlign="center" mt={2}>
                        <Typography variant="body2">
                            Chưa có tài khoản?{' '}
                            <a href="/register" style={{ color: '#1976d2', textDecoration: 'none' }}>
                                Đăng ký ngay
                            </a>
                        </Typography>
                    </Box>
                </Paper>
            </Container>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
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

export default LoginPage;
