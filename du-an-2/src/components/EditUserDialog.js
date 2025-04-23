import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, Grid, MenuItem, Avatar, Typography
} from '@mui/material';
import { updateUser } from '../services/UserService';
import { uploadImageToCloudinary } from '../services/CloudinaryService';

const EditUserDialog = ({ open, onClose, user, onSave }) => {
    const [form, setForm] = useState({});
    const [avatarFile, setAvatarFile] = useState(null);
    const [preview, setPreview] = useState('');

    // ✅ Lấy vai trò hiện tại từ localStorage
    const currentUserRole = localStorage.getItem('role');

    useEffect(() => {
        if (user) {
            setForm({
                ...user,
                roleId: user.account?.role?.id || user.roleId,
            });
            setPreview(user.avatar || '');
        }
    }, [user]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setAvatarFile(file);
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async () => {
        try {
            let avatarUrl = form.avatar || '';
            if (avatarFile) {
                avatarUrl = await uploadImageToCloudinary(avatarFile);
            }

            const updatedUser = {
                ...form,
                avatar: avatarUrl,
                gender: form.gender === 'true' || form.gender === true,
                account: {
                    ...form.account,
                    role: { id: parseInt(form.roleId) }
                }
            };

            await updateUser(form.id, updatedUser);
            onSave();
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
                    <Grid item xs={12} display="flex" justifyContent="center" flexDirection="column" alignItems="center">
                        <Avatar
                            src={preview}
                            sx={{ width: 90, height: 90, border: '2px solid #1976d2', mb: 1 }}
                        />
                        <Typography variant="body2">Ảnh đại diện</Typography>
                        <Button variant="outlined" component="label" sx={{ mt: 1 }}>
                            📤 Chọn ảnh đại diện
                            <input type="file" accept="image/*" hidden onChange={handleFileChange} />
                        </Button>
                        <Typography variant="body2" mt={1} color="text.secondary">
                            {avatarFile ? avatarFile.name : 'Không có ảnh được chọn'}
                        </Typography>
                    </Grid>
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
                    <Grid item xs={6}>
                        <TextField label="Giới tính" name="gender" select value={String(form.gender)} onChange={handleChange} fullWidth>
                            <MenuItem value="true">Nam</MenuItem>
                            <MenuItem value="false">Nữ</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Vai trò"
                            name="roleId"
                            select
                            value={form.roleId || ''}
                            onChange={handleChange}
                            fullWidth
                            disabled={currentUserRole.toLowerCase() !== 'admin'}
                        >
                            <MenuItem value={1}>Quản trị viên</MenuItem>
                            <MenuItem value={2}>Shipper</MenuItem>
                            <MenuItem value={3}>Nhân viên</MenuItem>
                            <MenuItem value={4}>Khách hàng</MenuItem>
                        </TextField>
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
