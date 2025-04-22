import React, { useState, useEffect } from 'react';
import {
    Box, Typography, TextField, Button, Grid, Paper, Snackbar, Alert, MenuItem
} from '@mui/material';
import { createLaundryOrder } from '../services/LaundryOrderService';
import { getAllShippers } from '../services/AccountService';
import { getAllCategories } from '../services/CategoryService';

const LaundryBookingComponent = () => {
    const [pickupTime, setPickupTime] = useState('');
    const [deliveryTime, setDeliveryTime] = useState('');
    const [address, setAddress] = useState('');
    const [note, setNote] = useState('');
    const [items, setItems] = useState([{ categoryId: '', quantity: 1, pricePerItem: 10000, description: '' }]);
    const [shipperId, setShipperId] = useState('');
    const [shippers, setShippers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

    useEffect(() => {
        getAllShippers().then(setShippers).catch(console.error);
        getAllCategories().then(setCategories).catch(console.error);
    }, []);

    const getMinPickupTime = () => {
        const date = new Date();
        date.setMinutes(date.getMinutes() + 5);
        return date.toISOString().slice(0, 16);
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = field === 'quantity' ? Number(value) : value;
        if (field === 'quantity') {
            newItems[index].pricePerItem = 10000;
        }
        setItems(newItems);
    };

    const addItem = () => {
        setItems([...items, { categoryId: '', quantity: 1, pricePerItem: 10000, description: '' }]);
    };

    const removeItem = (index) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
    };

    const calculateTotal = () => {
        return items.reduce((sum, item) => sum + (item.quantity * item.pricePerItem), 0);
    };

    const handleSubmit = async () => {
        const userId = localStorage.getItem('userId');
        const now = new Date();

        if (!userId || !pickupTime || !deliveryTime || !address || items.length === 0 || !shipperId) {
            setSnackbar({ open: true, message: 'Vui lòng nhập đầy đủ thông tin!', severity: 'error' });
            return;
        }

        if (items.some(item => !item.categoryId)) {
            setSnackbar({ open: true, message: 'Vui lòng chọn loại đồ cho tất cả mục!', severity: 'error' });
            return;
        }

        if (items.some(item => item.quantity <= 0)) {
            setSnackbar({ open: true, message: 'Số kg phải lớn hơn 0!', severity: 'error' });
            return;
        }

        if (new Date(pickupTime) <= now) {
            setSnackbar({ open: true, message: 'Thời gian lấy đồ phải là thời gian tương lai!', severity: 'error' });
            return;
        }

        try {
            const order = {
                user: { id: parseInt(userId) },
                shipper: { id: parseInt(shipperId) },
                pickupTime,
                deliveryTime,
                note,
                address,
                totalPrice: calculateTotal(),
                items: items.map(item => ({
                    type: categories.find(cat => cat.id === item.categoryId)?.name || '',
                    quantity: item.quantity,
                    pricePerItem: item.pricePerItem,
                    description: item.description
                }))
            };

            console.log("🧾 Dữ liệu gửi:", order);
            await createLaundryOrder(order);

            setSnackbar({ open: true, message: '✅ Đặt lịch thành công!', severity: 'success' });
            setPickupTime('');
            setDeliveryTime('');
            setAddress('');
            setNote('');
            setShipperId('');
            setItems([{ categoryId: '', quantity: 1, pricePerItem: 10000, description: '' }]);
        } catch (error) {
            console.error('❌ Lỗi khi gửi đơn hàng:', error);
            setSnackbar({ open: true, message: '❌ Lỗi khi đặt lịch!', severity: 'error' });
        }
    };

    return (
        <Box p={3} maxWidth="md" mx="auto">
            <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Đặt lịch giặt đồ
                </Typography>

                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Địa chỉ lấy đồ"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
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
                            inputProps={{ min: getMinPickupTime() }}
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
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            select
                            label="Chọn shipper"
                            value={shipperId}
                            onChange={(e) => setShipperId(e.target.value)}
                        >
                            <MenuItem value="" disabled>Chọn shipper</MenuItem>
                            {shippers.map((shipper) => (
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

                    <Grid item xs={12}>
                        <Typography variant="h6">Danh sách đồ giặt</Typography>
                    </Grid>

                    {items.map((item, index) => (
                        <Grid container spacing={1} key={index} sx={{ mb: 1 }}>
                            <Grid item xs={12} sm={3}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Loại đồ"
                                    value={item.categoryId}
                                    onChange={(e) => handleItemChange(index, 'categoryId', Number(e.target.value))}
                                >
                                    <MenuItem value="" disabled>Chọn loại</MenuItem>
                                    {categories.map((cat) => (
                                        <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid item xs={12} sm={2}>
                                <TextField
                                    fullWidth
                                    label="Số kg"
                                    type="number"
                                    value={item.quantity}
                                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                />
                            </Grid>

                            <Grid item xs={12} sm={2}>
                                <TextField
                                    fullWidth
                                    label="Đơn giá"
                                    type="number"
                                    value={item.pricePerItem}
                                    InputProps={{ readOnly: true }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <TextField
                                    fullWidth
                                    label="Mô tả"
                                    value={item.description}
                                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                                />
                            </Grid>

                            <Grid item xs={12} sm={1} display="flex" alignItems="center">
                                <Button variant="text" color="error" onClick={() => removeItem(index)}>Xóa</Button>
                            </Grid>
                        </Grid>
                    ))}

                    <Grid item xs={12}>
                        <Button variant="outlined" onClick={addItem}>➕ Thêm đồ giặt</Button>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography fontWeight="bold">Tổng tiền: {calculateTotal()} VND</Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Button fullWidth variant="contained" onClick={handleSubmit}>
                            Đặt lịch giặt ngay
                        </Button>
                    </Grid>
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
