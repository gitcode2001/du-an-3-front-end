import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, Grid
} from '@mui/material';
import { updateUser } from '../services/UserService';

const EditUserDialog = ({ open, onClose, user, onSave }) => {
    const [form, setForm] = useState({});

    useEffect(() => {
        if (user) setForm({ ...user });
    }, [user]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            await updateUser(form.id, form); // Cần API cập nhật
            onSave(); // load lại danh sách
            onClose();
        } catch (err) {
            console.error("❌ Lỗi cập nhật:", err);
        }
    };

    if (!form) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Chỉnh sửa thông tin</DialogTitle>
            <DialogContent dividers>
                <Grid container spacing={2} mt={1}>
                    <Grid item xs={12}>
                        <TextField label="Họ tên" name="fullName" value={form.fullName || ''} onChange={handleChange} fullWidth />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField label="Email" name="email" value={form.email || ''} onChange={handleChange} fullWidth />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField label="Số điện thoại" name="phoneNumber" value={form.phoneNumber || ''} onChange={handleChange} fullWidth />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField label="Địa chỉ" name="address" value={form.address || ''} onChange={handleChange} fullWidth />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Hủy</Button>
                <Button onClick={handleSubmit} variant="contained" color="primary">Lưu</Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditUserDialog;
