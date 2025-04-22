import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Chip, CircularProgress, Button
} from '@mui/material';
import { getOrdersByUserId } from '../services/LaundryOrderService';

const LaundryOrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        const userId = localStorage.getItem('userId');
        if (!userId) return;
        try {
            const res = await getOrdersByUserId(userId);
            setOrders(res.data);
        } catch (error) {
            console.error('Lỗi khi tải lịch sử đơn hàng:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    if (loading) {
        return <Box textAlign="center" mt={4}><CircularProgress /></Box>;
    }

    return (
        <Box p={3}>
            <Typography variant="h5" fontWeight="bold" mb={2}>Lịch sử đơn hàng</Typography>
            <Paper elevation={3}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><b>Thời gian lấy</b></TableCell>
                                <TableCell><b>Thời gian giao</b></TableCell>
                                <TableCell><b>Địa chỉ</b></TableCell>
                                <TableCell><b>Ghi chú</b></TableCell>
                                <TableCell><b>Trạng thái</b></TableCell>
                                <TableCell><b>Tổng tiền</b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders.map(order => (
                                <TableRow key={order.id}>
                                    <TableCell>{new Date(order.pickupTime).toLocaleString()}</TableCell>
                                    <TableCell>{new Date(order.deliveryTime).toLocaleString()}</TableCell>
                                    <TableCell>{order.address}</TableCell>
                                    <TableCell>{order.note || '—'}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={order.status}
                                            color={order.status === 'COMPLETED' ? 'success' : order.status === 'CANCELLED' ? 'error' : 'info'}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>{order.totalPrice} VND</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
};

export default LaundryOrderHistory;
