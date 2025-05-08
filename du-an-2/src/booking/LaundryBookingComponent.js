import React, { useState, useEffect } from 'react';
import {
    Box, Typography, TextField, Button, Grid, Paper, Snackbar, Alert, MenuItem, Divider
} from '@mui/material';
import { createLaundryOrder } from '../services/LaundryOrderService';
import { getAllShippers } from '../services/AccountService';
import { getAllCategories } from '../services/CategoryService';
import { createPayment } from '../services/PaymentService';
import { connectWebSocket, disconnectWebSocket } from '../services/websocket';

const LaundryBookingComponent = () => {
    const [pickupTime, setPickupTime] = useState('');
    const [deliveryTime, setDeliveryTime] = useState('');
    const [address, setAddress] = useState('');
    const [note, setNote] = useState('');
    const [items, setItems] = useState([]);
    const [shipperId, setShipperId] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [shippers, setShippers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
    const [createdOrderId, setCreatedOrderId] = useState(null);
    const [showPaymentButton, setShowPaymentButton] = useState(false);
    const [showItemsSection, setShowItemsSection] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        getAllShippers().then(setShippers).catch(console.error);
        getAllCategories().then(setCategories).catch(console.error);

        return () => {
            if (createdOrderId) disconnectWebSocket(createdOrderId);
        };
    }, [createdOrderId]);

    const getMinPickupTime = () => {
        const date = new Date();
        date.setMinutes(date.getMinutes() + 5);
        return date.toISOString().slice(0, 16);
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = field === 'quantity' ? Number(value) : value;
        if (field === 'quantity') newItems[index].pricePerItem = 10000; // giả định đơn giá cố định
        setItems(newItems);
    };

    const addItem = () => {
        setShowItemsSection(true);
        setItems([...items, { categoryId: '', quantity: 1, pricePerItem: 10000, description: '' }]);
    };

    const removeItem = (index) => {
        const updatedItems = items.filter((_, i) => i !== index);
        setItems(updatedItems);
        if (updatedItems.length === 0) setShowItemsSection(false);
    };

    const calculateTotal = () => items.reduce((sum, item) => sum + item.quantity * item.pricePerItem, 0);

    const resetForm = () => {
        setPickupTime('');
        setDeliveryTime('');
        setAddress('');
        setNote('');
        setShipperId('');
        setPaymentMethod('COD');
        setItems([]);
        setCreatedOrderId(null);
        setShowPaymentButton(false);
        setShowItemsSection(false);
        setFormErrors({});
    };

    const validateForm = () => {
        const errors = {};

        // Kiểm tra địa chỉ
        if (!address || address.trim().length < 4) {
            errors.address = 'Vui lòng nhập địa chỉ cụ thể !';
        }

        // Kiểm tra thời gian lấy đồ
        if (!pickupTime) {
            errors.pickupTime = 'Vui lòng chọn thời gian lấy đồ!';
        }

        // Kiểm tra thời gian giao đồ
        if (!deliveryTime) {
            errors.deliveryTime = 'Vui lòng chọn thời gian giao đồ!';
        }

        // Kiểm tra shipper
        if (!shipperId) {
            errors.shipperId = 'Vui lòng chọn shipper!';
        }

        // Kiểm tra các mục giặt đồ
        if (items.length === 0) {
            errors.items = 'Vui lòng thêm ít nhất một mục giặt!';
        } else {
            items.forEach((item, index) => {
                if (!item.categoryId) {
                    errors[`itemCategory${index}`] = `Vui lòng chọn loại đồ cho mục ${index + 1}`;
                }
                if (item.quantity <= 0) {
                    errors[`itemQuantity${index}`] = `Số kg của mục ${index + 1} phải lớn hơn 0`;
                }
            });
        }

        const pickup = new Date(pickupTime);
        const delivery = new Date(deliveryTime);
        const diffHours = (delivery - pickup) / (1000 * 60 * 60);
        if (pickup <= new Date()) {
            errors.pickupTime = 'Thời gian lấy đồ phải là thời gian tương lai!';
        }

        if (diffHours < 12) {
            errors.deliveryTime = 'Thời gian giao đồ phải sau thời gian lấy đồ ít nhất 12 giờ!';
        }

        return errors;
    };

    const handleSubmit = async () => {
        const errors = validateForm();
        setFormErrors(errors);

        if (Object.keys(errors).length > 0) {
            setSnackbar({ open: true, message: 'Vui lòng sửa các lỗi trên!', severity: 'error' });
            return;
        }

        const userId = localStorage.getItem('userId');
        const order = {
            user: { id: parseInt(userId) },
            shipper: { id: parseInt(shipperId) },
            pickupTime,
            deliveryTime,
            note,
            address,
            totalPrice: calculateTotal(),
            status: 'Đang chờ xử lý',
            paymentMethod,
            items: items.map(item => ({
                type: categories.find(cat => cat.id === item.categoryId)?.name || '',
                quantity: item.quantity,
                pricePerItem: item.pricePerItem,
                description: item.description
            }))
        };

        try {
            const createdOrder = await createLaundryOrder(order);
            setCreatedOrderId(createdOrder.id);
            setSnackbar({ open: true, message: '✅ Đặt lịch thành công!', severity: 'success' });

            connectWebSocket(createdOrder.id, (message) => {
                setSnackbar({
                    open: true,
                    message: message.message || 'Thông báo từ hệ thống',
                    severity: 'info'
                });
            });

            if (paymentMethod === 'PAYPAL') {
                setShowPaymentButton(true);
            } else {
                resetForm();
            }

        } catch (error) {
            console.error('❌ Lỗi khi gửi đơn hàng:', error);
            setSnackbar({ open: true, message: '❌ Lỗi khi đặt lịch!', severity: 'error' });
        }
    };

    const handlePaymentClick = async () => {
        try {
            const response = await createPayment(calculateTotal(), createdOrderId);
            if (response.redirectUrl) {
                window.location.href = response.redirectUrl;
            } else {
                throw new Error("Không nhận được liên kết thanh toán.");
            }
        } catch (error) {
            console.error('❌ Lỗi khi tạo thanh toán:', error);
            setSnackbar({ open: true, message: '❌ Lỗi khi tạo thanh toán!', severity: 'error' });
        }
    };

    return (
        <Box p={3} maxWidth="md" mx="auto">
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                <Typography variant="h5" fontWeight="bold" mb={3}>🧺 Đặt lịch giặt đồ</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Địa chỉ lấy đồ"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            error={!!formErrors.address}
                            helperText={formErrors.address}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Thời gian lấy đồ"
                            type="datetime-local"
                            value={pickupTime}
                            onChange={(e) => setPickupTime(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            inputProps={{ min: getMinPickupTime(), step: 60 }}
                            error={!!formErrors.pickupTime}
                            helperText={formErrors.pickupTime}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Thời gian giao đồ"
                            type="datetime-local"
                            value={deliveryTime}
                            onChange={(e) => setDeliveryTime(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            inputProps={{ step: 60 }}
                            error={!!formErrors.deliveryTime}
                            helperText={formErrors.deliveryTime}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            select
                            label="Chọn shipper"
                            value={shipperId}
                            onChange={(e) => setShipperId(e.target.value)}
                            error={!!formErrors.shipperId}
                            helperText={formErrors.shipperId}
                        >
                            {shippers.map(shipper => (
                                <MenuItem key={shipper.id} value={shipper.id}>
                                    {shipper.username || shipper.user?.fullName}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            multiline
                            rows={2}
                            label="Ghi chú"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />
                    </Grid>
                </Grid>

                <Box mt={3}>
                    <Button variant="outlined" onClick={addItem}>+ THÊM ĐỒ GIẶT</Button>
                </Box>

                {showItemsSection && items.map((item, index) => (
                    <Box key={index} sx={{ border: '1px dashed #ccc', borderRadius: 2, p: 2, my: 2 }}>
                        <Typography fontWeight="bold" mb={2}>🧦 Mục {index + 1}</Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Loại đồ"
                                    value={item.categoryId}
                                    onChange={(e) => handleItemChange(index, 'categoryId', Number(e.target.value))}
                                    error={!!formErrors[`itemCategory${index}`]}
                                    helperText={formErrors[`itemCategory${index}`]}
                                >
                                    {categories.map(cat => (
                                        <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={6} md={4}>
                                <TextField
                                    fullWidth
                                    label="Số kg"
                                    type="number"
                                    value={item.quantity}
                                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                    error={!!formErrors[`itemQuantity${index}`]}
                                    helperText={formErrors[`itemQuantity${index}`]}
                                />
                            </Grid>
                            <Grid item xs={6} md={4}>
                                <TextField
                                    fullWidth
                                    label="Đơn giá"
                                    type="number"
                                    value={item.pricePerItem}
                                    InputProps={{ readOnly: true }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    label="Mô tả"
                                    value={item.description}
                                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Box display="flex" justifyContent="flex-end">
                                    <Button variant="text" color="error" onClick={() => removeItem(index)}>❌ XÓA</Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                ))}

                <Divider sx={{ my: 2 }} />

                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            select
                            label="Phương thức thanh toán"
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        >
                            <MenuItem value="COD">Thanh toán cho shipper</MenuItem>
                            <MenuItem value="PAYPAL">Thanh toán qua PayPal</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography fontWeight="bold" mt={2}>Tổng tiền: {calculateTotal()} VND</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Button fullWidth variant="contained" onClick={handleSubmit} sx={{ py: 1.2 }}>ĐẶT LỊCH GIẶT NGAY</Button>
                    </Grid>
                    {showPaymentButton && paymentMethod === 'PAYPAL' && (
                        <Grid item xs={12}>
                            <Button fullWidth variant="outlined" color="secondary" onClick={handlePaymentClick}>
                                Thanh toán qua PayPal
                            </Button>
                        </Grid>
                    )}
                </Grid>
            </Paper>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert severity={snackbar.severity} variant="filled">
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default LaundryBookingComponent;
