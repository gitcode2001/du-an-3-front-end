import React, { useEffect, useState } from 'react';
import {
    getAllOrders, softDeleteOrderByAdmin, updateOrderStatus, getOrderById
} from '../services/LaundryOrderService';
import {
    Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    CircularProgress, IconButton, Snackbar, Alert, Dialog, DialogTitle, DialogContent,
    DialogActions, Button, TextField, MenuItem, Grid, Divider, CardContent, Card, Box
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import html2pdf from 'html2pdf.js';

const statusOptions = [
    { value: 'PENDING', label: 'Đang chờ xử lý' },
    { value: 'IN_PROCESS', label: 'Đang xử lý' },
    { value: 'CANCELLED', label: 'Đã huỷ' }
];

const AdminOrderList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
    const [deleteDialog, setDeleteDialog] = useState({ open: false, orderId: null });
    const [statusDialog, setStatusDialog] = useState({ open: false, orderId: null, currentStatus: '' });
    const [detailDialog, setDetailDialog] = useState({ open: false, order: null });

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const data = await getAllOrders();
            setOrders(data);
        } catch (error) {
            console.error(error);
            setSnackbar({ open: true, message: '❌ Lỗi khi tải danh sách đơn!', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };
    const handleDelete = async (id) => {
        try {
            await softDeleteOrderByAdmin(id);
            setSnackbar({ open: true, message: '✅ Đã ẩn đơn hàng thành công!', severity: 'success' });
            fetchOrders();
        } catch (error) {
            console.error(error);
            setSnackbar({ open: true, message: '❌ Ẩn đơn hàng thất bại!', severity: 'error' });
        } finally {
            setDeleteDialog({ open: false, orderId: null });
        }
    };



    const handleUpdateStatus = async () => {
        const { orderId, currentStatus } = statusDialog;
        try {
            await updateOrderStatus(orderId, currentStatus);
            setSnackbar({ open: true, message: '✅ Đã cập nhật trạng thái!', severity: 'success' });
            fetchOrders();
        } catch (err) {
            console.error(err);
            setSnackbar({ open: true, message: '❌ Lỗi cập nhật trạng thái!', severity: 'error' });
        } finally {
            setStatusDialog({ open: false, orderId: null, currentStatus: '' });
        }
    };

    const handleViewDetail = async (orderId) => {
        try {
            const order = await getOrderById(orderId);
            setDetailDialog({ open: true, order });
        } catch (error) {
            console.error(error);
            setSnackbar({ open: true, message: '❌ Lỗi tải chi tiết đơn!', severity: 'error' });
        }
    };

    const handlePrintInvoice = () => {
        const element = document.getElementById('invoice-content');
        if (!element) return;

        html2pdf().set({
            margin: 10,
            filename: `hoa-don-don-${detailDialog.order?.id || 'order'}.pdf`,
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        }).from(element).save();
    };

    const formatDate = (dateStr) => new Date(dateStr).toLocaleString('vi-VN');
    const formatMoney = (amount) => amount?.toLocaleString('vi-VN') + ' VND';

    if (loading) return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 4 }} />;

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
                            <TableCell>Thanh toán</TableCell>
                            <TableCell>Trạng thái</TableCell>
                            <TableCell>Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map(order => (
                            <TableRow key={order.id}>
                                <TableCell>{order.id}</TableCell>
                                <TableCell>{order.user?.fullName}</TableCell>
                                <TableCell>{order.shipper?.username}</TableCell>
                                <TableCell>{formatDate(order.pickupTime)}</TableCell>
                                <TableCell>{formatDate(order.deliveryTime)}</TableCell>
                                <TableCell>{formatMoney(order.totalPrice)}</TableCell>
                                <TableCell>{order.paymentMethod}</TableCell>
                                <TableCell>{order.status}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleViewDetail(order.id)}><VisibilityIcon /></IconButton>
                                    <IconButton onClick={() => setStatusDialog({ open: true, orderId: order.id, currentStatus: order.status })}><EditIcon /></IconButton>
                                    <IconButton onClick={() => setDeleteDialog({ open: true, orderId: order.id })}><DeleteIcon /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, orderId: null })}>
                <DialogTitle>Xác nhận ẩn đơn</DialogTitle>
                <DialogContent>Bạn có chắc muốn ẩn đơn hàng này không? Người dùng vẫn sẽ thấy đơn này.</DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialog({ open: false, orderId: null })}>Huỷ</Button>
                    <Button onClick={() => handleDelete(deleteDialog.orderId)} color="error">Xác nhận</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={statusDialog.open} onClose={() => setStatusDialog({ open: false, orderId: null, currentStatus: '' })}>
                <DialogTitle>Cập nhật trạng thái đơn</DialogTitle>
                <DialogContent>
                    <TextField
                        select
                        fullWidth
                        value={statusDialog.currentStatus}
                        onChange={(e) => setStatusDialog({ ...statusDialog, currentStatus: e.target.value })}
                        label="Trạng thái"
                        margin="normal"
                    >
                        {statusOptions.map(opt => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setStatusDialog({ open: false, orderId: null, currentStatus: '' })}>Huỷ</Button>
                    <Button onClick={handleUpdateStatus} variant="contained">Lưu</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={detailDialog.open} onClose={() => setDetailDialog({ open: false, order: null })} maxWidth="md" fullWidth>
                <DialogTitle>Chi tiết đơn #{detailDialog.order?.id}</DialogTitle>
                <DialogContent dividers>
                    {detailDialog.order && (
                        <Box id="invoice-content">
                            <Card variant="outlined" sx={{ mb: 2 }}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>Thông tin khách hàng</Typography>
                                    <Divider sx={{ mb: 1 }} />
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <Typography><strong>Khách:</strong> {detailDialog.order.user?.fullName}</Typography>
                                            <Typography><strong>Shipper:</strong> {detailDialog.order.shipper?.username}</Typography>
                                            <Typography><strong>Địa chỉ:</strong> {detailDialog.order.address}</Typography>
                                            <Typography><strong>Ghi chú:</strong> {detailDialog.order.note || 'Không có'}</Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Typography><strong>Thời gian lấy:</strong> {formatDate(detailDialog.order.pickupTime)}</Typography>
                                            <Typography><strong>Thời gian giao:</strong> {formatDate(detailDialog.order.deliveryTime)}</Typography>
                                            <Typography><strong>Phương thức thanh toán:</strong> {detailDialog.order.paymentMethod}</Typography>
                                            <Typography><strong>Trạng thái:</strong> {detailDialog.order.status}</Typography>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                            <Typography variant="h6" gutterBottom>Danh sách đồ giặt</Typography>
                            <Divider sx={{ mb: 1 }} />
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Loại đồ</TableCell>
                                        <TableCell>Số lượng</TableCell>
                                        <TableCell>Mô tả</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {detailDialog.order.items?.map((item, idx) => (
                                        <TableRow key={idx}>
                                            <TableCell>{item.type}</TableCell>
                                            <TableCell>{item.quantity}</TableCell>
                                            <TableCell>{item.description}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <Box display="flex" justifyContent="flex-end" mt={2}>
                                <Typography variant="h6" fontWeight="bold">Tổng: {formatMoney(detailDialog.order.totalPrice)}</Typography>
                            </Box>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDetailDialog({ open: false, order: null })}>Đóng</Button>
                    <Button variant="outlined" onClick={handlePrintInvoice}>In hoá đơn</Button>
                </DialogActions>
            </Dialog>

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

export default AdminOrderList;
