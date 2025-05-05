import React, { useEffect, useState, useRef } from 'react';
import {
    Paper, Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, CircularProgress, Snackbar, Alert, IconButton, Menu, MenuItem, Box, Tabs, Tab, Badge, Modal, Button
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ClearIcon from '@mui/icons-material/Clear';
import { useNavigate, useParams } from 'react-router-dom';
import {
    getOrdersByShipperIdAndStatus,
    getOrdersByShipperId,
    updateOrderStatus,
    softDeleteOrder
} from '../services/LaundryOrderService';
import {
    connectShipperWebSocket,
    disconnectShipperWebSocket
} from '../utils/shipperSocket';

const statusMap = {
    PENDING: 'Đang chờ xử lý',
    PICKED_UP: 'Đã lấy đồ',
    IN_PROCESS: 'Đang giặt',
    DELIVERED: 'Đã giao',
    CANCELLED: 'Đã huỷ',
    PAID: 'Đã thanh toán'
};

const statusList = Object.entries(statusMap).map(([value, label]) => ({ value, label }));

const ShipperOrderList = () => {
    const { status } = useParams();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [blink, setBlink] = useState(false);
    const [pendingCount, setPendingCount] = useState(0);
    const [newOfflineOrders, setNewOfflineOrders] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const shipperId = localStorage.getItem('userId');
    const hasCheckedOfflineOrdersRef = useRef(false);
    const lastSeenRef = useRef(null);
    const topOrderRef = useRef(null);

    useEffect(() => {
        if (!shipperId) {
            setSnackbar({ open: true, message: 'Không tìm thấy thông tin shipper!', severity: 'error' });
            setLoading(false);
            return;
        }

        const key = `shipper_last_seen_${shipperId}`;
        const now = new Date().toISOString();
        lastSeenRef.current = now;

        if (!hasCheckedOfflineOrdersRef.current) {
            checkNewOrdersAfterOffline(key, now);
            hasCheckedOfflineOrdersRef.current = true;
        }

        fetchOrders();
        fetchPendingCount();

        connectShipperWebSocket(shipperId, (message) => {
            setSnackbar({ open: true, message: message.message || '📢 Có đơn hàng mới!', severity: 'info' });
            setBlink(true);
            fetchOrders();
            fetchPendingCount();
        });

        return () => disconnectShipperWebSocket();
    }, [shipperId]);

    useEffect(() => {
        fetchOrders();
    }, [status]);

    useEffect(() => {
        if (blink && topOrderRef.current) {
            topOrderRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [orders]);

    const checkNewOrdersAfterOffline = async (key, now) => {
        const lastSeen = localStorage.getItem(key);
        try {
            const res = await getOrdersByShipperId(shipperId);
            const pendingOrders = res.filter(order => order.status === 'PENDING');
            if (lastSeen) {
                const newOrders = pendingOrders.filter(order => new Date(order.createdAt) > new Date(lastSeen));
                if (newOrders.length > 0) {
                    setSnackbar({ open: true, message: `📢 Bạn có ${newOrders.length} đơn hàng mới kể từ lần đăng nhập trước!`, severity: 'info' });
                    setNewOfflineOrders(newOrders);
                    setModalOpen(true);
                    setBlink(true);
                }
            }
            localStorage.setItem(key, now);
        } catch (err) {
            console.error('❌ Lỗi kiểm tra đơn mới khi đăng nhập lại:', err);
        }
    };

    const fetchOrders = async () => {
        try {
            const res = await getOrdersByShipperIdAndStatus(shipperId, status?.toUpperCase());
            const sorted = [...res].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setOrders(sorted);
        } catch (err) {
            console.error('❌ Lỗi khi lấy đơn hàng của shipper:', err);
            setSnackbar({ open: true, message: 'Lỗi khi tải danh sách đơn hàng', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const fetchPendingCount = async () => {
        try {
            const res = await getOrdersByShipperIdAndStatus(shipperId, 'PENDING');
            setPendingCount(res.length);
        } catch (err) {
            console.error('❌ Lỗi khi đếm số đơn chờ xử lý:', err);
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        setLoading(true);
        try {
            await updateOrderStatus(orderId, newStatus);
            setSnackbar({ open: true, message: '✅ Cập nhật trạng thái thành công!', severity: 'success' });
            fetchOrders();
            fetchPendingCount();
        } catch (err) {
            console.error('❌ Lỗi cập nhật trạng thái:', err);
            setSnackbar({ open: true, message: '❌ Cập nhật trạng thái thất bại', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (orderId, customerName) => {
        setLoading(true);
        try {
            await softDeleteOrder(orderId);
            setSnackbar({ open: true, message: `🗑 Đã xoá đơn hàng của ${customerName}!`, severity: 'info' });
            fetchOrders();
            fetchPendingCount();
        } catch (err) {
            console.error('Lỗi xoá mềm đơn hàng:', err);
            setSnackbar({ open: true, message: 'Không thể xoá đơn hàng', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleMenuClick = (event, orderId) => {
        setAnchorEl(event.currentTarget);
        setSelectedOrderId(orderId);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedOrderId(null);
    };

    const getStatusLabel = (status) => statusMap[status] || status;

    const handleTabChange = (_, newValue) => {
        navigate(`/shipper-orders/${newValue.toLowerCase()}`);
        setBlink(false);
    };

    const handleAcknowledge = () => {
        const key = `shipper_last_seen_${shipperId}`;
        const now = new Date().toISOString();
        localStorage.setItem(key, now);
        lastSeenRef.current = now;
        setModalOpen(false);
    };

    const handleClearNewOrders = () => {
        setNewOfflineOrders([]);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
                📦 Danh sách đơn hàng - {getStatusLabel(status?.toUpperCase())} ({orders.length} đơn)
                {newOfflineOrders.length > 0 && (
                    <Button
                        size="small"
                        color="warning"
                        startIcon={<ClearIcon />}
                        onClick={handleClearNewOrders}
                        sx={{ ml: 2 }}
                    >
                        Bỏ đánh dấu ({newOfflineOrders.length}) đơn
                    </Button>
                )}
            </Typography>

            <Tabs
                value={status?.toUpperCase() || 'PENDING'}
                onChange={handleTabChange}
                textColor="primary"
                indicatorColor="primary"
                sx={{ mb: 2 }}
            >
                {statusList.map(({ value, label }) => (
                    <Tab
                        key={value}
                        value={value}
                        label={
                            <Badge
                                color="error"
                                variant={blink && value === 'PENDING' ? 'standard' : undefined}
                                badgeContent={value === 'PENDING' && pendingCount > 0 ? `Đơn mới (${pendingCount})` : undefined}
                                sx={{ animation: blink && value === 'PENDING' ? 'blinker 1s linear infinite' : undefined }}
                            >
                                {label}
                            </Badge>
                        }
                    />
                ))}
            </Tabs>

            {loading ? (
                <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 4 }} />
            ) : (
                <TableContainer component={Paper}>
                    <Table size="small">
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
                            {orders.map((order, index) => {
                                const isNewOffline = newOfflineOrders.some(o => o.id === order.id);
                                return (
                                    <TableRow key={order.id} ref={index === 0 ? topOrderRef : null} className={isNewOffline ? 'highlight-offline-order' : ''}>
                                        <TableCell>{order.id}</TableCell>
                                        <TableCell>{order.user?.fullName}</TableCell>
                                        <TableCell>{order.address}</TableCell>
                                        <TableCell>{getStatusLabel(order.status)}</TableCell>
                                        <TableCell>{new Date(order.pickupTime).toLocaleString('vi-VN')}</TableCell>
                                        <TableCell>{new Date(order.deliveryTime).toLocaleString('vi-VN')}</TableCell>
                                        <TableCell>
                                            <IconButton color="primary" size="small" onClick={(e) => handleMenuClick(e, order.id)}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton color="error" size="small" onClick={() => handleDelete(order.id, order.user?.fullName)}>
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

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                MenuListProps={{ 'aria-labelledby': 'long-button' }}
            >
                <MenuItem onClick={() => handleStatusUpdate(selectedOrderId, 'PICKED_UP')}>Đã lấy đồ</MenuItem>
                <MenuItem onClick={() => handleStatusUpdate(selectedOrderId, 'IN_PROCESS')}>Đang giặt</MenuItem>
                <MenuItem onClick={() => handleStatusUpdate(selectedOrderId, 'DELIVERED')}>Đã giao</MenuItem>
            </Menu>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>

            <Modal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box sx={{ p: 3, maxWidth: 400, margin: 'auto', bgcolor: 'background.paper', borderRadius: 2 }}>
                    <Typography id="modal-title" variant="h6" component="h2">
                        📢 Bạn có đơn hàng mới khi đăng nhập lại!
                    </Typography>
                    <Button fullWidth variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleAcknowledge}>
                        Xác nhận
                    </Button>
                </Box>
            </Modal>
        </Box>
    );
};

export default ShipperOrderList;
