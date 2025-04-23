import React, { useEffect, useState } from 'react';
import {
    Paper, Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, CircularProgress, Snackbar, Alert, Button, IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { getOrdersByShipperId, updateOrderStatus, deleteOrder } from '../services/LaundryOrderService';

const statusMap = {
    PENDING: 'Đang chờ xử lý',
    PICKED_UP: 'Đã lấy đồ',
    IN_PROCESS: 'Đang giặt',
    DELIVERED: 'Đã giao',
    CANCELLED: 'Đã huỷ'
};

const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
        case 'PENDING':
            return { next: 'PICKED_UP', label: '✅ Xác nhận lấy', color: 'warning' };
        case 'PICKED_UP':
            return { next: 'IN_PROCESS', label: '🧺 Đang giặt', color: 'info' };
        case 'IN_PROCESS':
            return { next: 'DELIVERED', label: '🚚 Đã giao hàng', color: 'success' };
        default:
            return null;
    }
};

const ShipperOrderList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

    const shipperId = localStorage.getItem('userId');

    useEffect(() => {
        if (!shipperId) {
            setSnackbar({ open: true, message: 'Không tìm thấy thông tin shipper!', severity: 'error' });
            setLoading(false);
            return;
        }
        fetchOrders();
    }, [shipperId]);

    const fetchOrders = async () => {
        try {
            const res = await getOrdersByShipperId(shipperId);
            setOrders(res);
        } catch (err) {
            console.error('❌ Lỗi khi lấy đơn hàng của shipper:', err);
            setSnackbar({ open: true, message: 'Lỗi khi tải danh sách đơn hàng', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        setLoading(true);
        try {
            await updateOrderStatus(orderId, newStatus);
            setSnackbar({ open: true, message: '✅ Cập nhật trạng thái thành công!', severity: 'success' });
            fetchOrders();
        } catch (err) {
            console.error('❌ Lỗi cập nhật trạng thái:', err);
            setSnackbar({ open: true, message: '❌ Cập nhật trạng thái thất bại', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (orderId) => {
        setLoading(true);
        try {
            await deleteOrder(orderId);
            setSnackbar({ open: true, message: '🗑️ Đã xoá đơn hàng!', severity: 'info' });
            fetchOrders();
        } catch (err) {
            console.error('❌ Lỗi xoá đơn hàng:', err);
            setSnackbar({ open: true, message: '❌ Không thể xoá đơn hàng', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const getStatusLabel = (status) => statusMap[status] || status;

    return (
        <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Đơn hàng cần giao</Typography>

            {loading ? (
                <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 4 }} />
            ) : (
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Mã đơn</TableCell>
                                <TableCell>Khách hàng</TableCell>
                                <TableCell>Địa chỉ</TableCell>
                                <TableCell>Trạng thái</TableCell>
                                <TableCell>Thời gian lấy</TableCell>
                                <TableCell>Thời gian giao</TableCell>
                                <TableCell>Thao tác</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders.map((order) => {
                                const next = getNextStatus(order.status);
                                return (
                                    <TableRow key={order.id}>
                                        <TableCell>{order.id}</TableCell>
                                        <TableCell>{order.user?.fullName}</TableCell>
                                        <TableCell>{order.address}</TableCell>
                                        <TableCell>{getStatusLabel(order.status)}</TableCell>
                                        <TableCell>{new Date(order.pickupTime).toLocaleString('vi-VN')}</TableCell>
                                        <TableCell>{new Date(order.deliveryTime).toLocaleString('vi-VN')}</TableCell>
                                        <TableCell>
                                            {next ? (
                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    color={next.color}
                                                    onClick={() => handleStatusUpdate(order.id, next.next)}
                                                    sx={{ mr: 1 }}
                                                >
                                                    {next.label}
                                                </Button>
                                            ) : null}
                                            <IconButton color="primary" size="small">
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton color="error" size="small" onClick={() => handleDelete(order.id)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
            </Snackbar>
        </Paper>
    );
};

export default ShipperOrderList;