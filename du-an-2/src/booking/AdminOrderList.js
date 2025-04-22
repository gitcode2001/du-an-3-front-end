import React, { useEffect, useState } from 'react';
import { getAllOrders } from '../services/LaundryOrderService';
import {
    Typography, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, CircularProgress, IconButton
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const AdminOrderList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const statusMap = {
        PENDING: 'Đang chờ xử lý',
        PICKED_UP: 'Đã lấy đồ',
        IN_PROCESS: 'Đang xử lý',
        DELIVERED: 'Đã giao',
        CANCELLED: 'Đã huỷ'
    };

    useEffect(() => {
        getAllOrders()
            .then(data => setOrders(data))
            .catch(error => console.error(error))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <CircularProgress />;

    return (
        <Paper sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom>Danh sách đơn giặt</Typography>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Khách hàng</TableCell>
                            <TableCell>Shipper</TableCell>
                            <TableCell>Ngày lấy</TableCell>
                            <TableCell>Ngày giao</TableCell>
                            <TableCell>Tổng tiền</TableCell>
                            <TableCell>Trạng thái</TableCell>
                            <TableCell>Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map(order => (
                            <TableRow key={order.id}>
                                <TableCell>{order.id}</TableCell>
                                <TableCell>{order.user?.fullName || 'Không có'}</TableCell>
                                <TableCell>{order.shipper?.username || 'Không có'}</TableCell>
                                <TableCell>{new Date(order.pickupTime).toLocaleString()}</TableCell>
                                <TableCell>{new Date(order.deliveryTime).toLocaleString()}</TableCell>
                                <TableCell>{order.totalPrice?.toLocaleString()} VND</TableCell>
                                <TableCell>{statusMap[order.status] || order.status}</TableCell>
                                <TableCell>
                                    <IconButton color="primary" title="Xem chi tiết">
                                        <VisibilityIcon />
                                    </IconButton>
                                    <IconButton color="success" title="Cập nhật trạng thái">
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton color="error" title="Xoá đơn">
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};

export default AdminOrderList;
