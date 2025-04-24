import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Paper, Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, CircularProgress, Button, Dialog, DialogTitle,
    DialogContent, DialogActions, Box, TablePagination, TextField, MenuItem
} from '@mui/material';
import { getOrdersByUserId, getOrderById, deleteOrder } from '../services/LaundryOrderService';

const statusOptions = [
    { value: '', label: 'Tất cả' },
    { value: 'Đang chờ xử lý', label: 'Đang chờ xử lý' },
    { value: 'Đã lấy đồ', label: 'Đã lấy đồ' },
    { value: 'Đang giặt', label: 'Đang giặt' },
    { value: 'Đã giao', label: 'Đã giao' },
    { value: 'Đã huỷ', label: 'Đã huỷ' }
];

const UserOrderList = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [confirmCancel, setConfirmCancel] = useState({ open: false, orderId: null });
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [statusFilter, setStatusFilter] = useState('');
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        if (userId) fetchOrders();
    }, [userId]);

    const fetchOrders = () => {
        setLoading(true);
        getOrdersByUserId(userId)
            .then((res) => {
                setOrders(res);
                setFilteredOrders(res);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    const handleViewDetail = async (orderId) => {
        try {
            const order = await getOrderById(orderId);
            setSelectedOrder(order);
        } catch (err) {
            console.error('❌ Lỗi lấy chi tiết đơn:', err);
        }
    };

    const handleCancelOrder = async () => {
        try {
            await deleteOrder(confirmCancel.orderId);
            setConfirmCancel({ open: false, orderId: null });
            fetchOrders();
        } catch (err) {
            console.error('❌ Lỗi huỷ đơn:', err);
        }
    };

    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleStatusFilterChange = (event) => {
        const value = event.target.value;
        setStatusFilter(value);
        const filtered = value
            ? orders.filter(order => order.status === value)
            : orders;
        setFilteredOrders(filtered);
        setPage(0);
    };

    if (loading) {
        return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 4 }} />;
    }

    return (
        <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Đơn hàng của bạn</Typography>

            <TextField
                select
                fullWidth
                label="Lọc theo trạng thái"
                value={statusFilter}
                onChange={handleStatusFilterChange}
                sx={{ mb: 2 }}
            >
                {statusOptions.map(opt => (
                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                ))}
            </TextField>

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Mã đơn</TableCell>
                            <TableCell>Thời gian lấy</TableCell>
                            <TableCell>Trạng thái</TableCell>
                            <TableCell>Tổng tiền</TableCell>
                            <TableCell>Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((order) => (
                            <TableRow key={order.id}>
                                <TableCell>{order.id}</TableCell>
                                <TableCell>{new Date(order.pickupTime).toLocaleString('vi-VN')}</TableCell>
                                <TableCell>{order.status}</TableCell>
                                <TableCell>{order.totalPrice?.toLocaleString('vi-VN')} VND</TableCell>
                                <TableCell>
                                    <Button size="small" onClick={() => handleViewDetail(order.id)}>Chi tiết</Button>
                                    <Button size="small" component={Link} to={`/order-tracking/${order.id}`}>Theo dõi</Button>
                                    {order.status === 'Đang chờ xử lý' && (
                                        <Button size="small" color="error" onClick={() => setConfirmCancel({ open: true, orderId: order.id })}>Huỷ</Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                component="div"
                count={filteredOrders.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
            />

            <Dialog open={!!selectedOrder} onClose={() => setSelectedOrder(null)} maxWidth="sm" fullWidth>
                <DialogTitle>Chi tiết đơn hàng #{selectedOrder?.id}</DialogTitle>
                <DialogContent dividers>
                    {selectedOrder && (
                        <Box>
                            <Typography><strong>Địa chỉ:</strong> {selectedOrder.address}</Typography>
                            <Typography><strong>Ghi chú:</strong> {selectedOrder.note || 'Không có'}</Typography>
                            <Typography><strong>Shipper:</strong> {selectedOrder.shipper?.username}</Typography>
                            <Typography><strong>Trạng thái:</strong> {selectedOrder.status}</Typography>
                            <Typography><strong>Thời gian lấy:</strong> {new Date(selectedOrder.pickupTime).toLocaleString('vi-VN')}</Typography>
                            <Typography><strong>Thời gian giao:</strong> {new Date(selectedOrder.deliveryTime).toLocaleString('vi-VN')}</Typography>

                            <Typography mt={2} mb={1}><strong>Danh sách đồ giặt:</strong></Typography>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Loại đồ</TableCell>
                                        <TableCell>Số lượng</TableCell>
                                        <TableCell>Đơn giá</TableCell>
                                        <TableCell>Mô tả</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {selectedOrder.items?.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{item.type}</TableCell>
                                            <TableCell>{item.quantity} kg</TableCell>
                                            <TableCell>{item.pricePerItem?.toLocaleString('vi-VN')} VND</TableCell>
                                            <TableCell>{item.description || 'Không có'}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSelectedOrder(null)}>Đóng</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={confirmCancel.open} onClose={() => setConfirmCancel({ open: false, orderId: null })}>
                <DialogTitle>Xác nhận huỷ đơn</DialogTitle>
                <DialogContent>Bạn chắc chắn muốn huỷ đơn hàng #{confirmCancel.orderId}?</DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmCancel({ open: false, orderId: null })}>Không</Button>
                    <Button color="error" onClick={handleCancelOrder}>Huỷ đơn</Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
};

export default UserOrderList;
