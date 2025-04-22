import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Paper, Divider, Avatar, Grid, Button,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem
} from '@mui/material';
import { getUserById, updateUser } from '../services/UserService';
import { uploadImageToCloudinary } from '../services/CloudinaryService';
import PersonIcon from '@mui/icons-material/Person';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [editOpen, setEditOpen] = useState(false);
    const [form, setForm] = useState({});
    const [avatarFile, setAvatarFile] = useState(null);
    const [preview, setPreview] = useState('');

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (userId) {
            getUserById(userId)
                .then(res => {
                    setUser(res.data);
                    setForm({
                        ...res.data,
                        account: res.data.account || {}
                    });
                    setPreview(res.data.avatar || '');
                })
                .catch(console.error);
        }
    }, []);

    const getRoleInVietnamese = (role) => {
        switch (role) {
            case 'ADMIN': return 'Quản trị viên';
            case 'STAFF': return 'Nhân viên';
            case 'USER': return 'Khách hàng';
            default: return role;
        }
    };

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

            const updatedRole = user?.account?.role?.name === 'ADMIN'
                ? form.account.role
                : user?.account?.role;

            const updatedUser = {
                ...form,
                avatar: avatarUrl,
                gender: form.gender === 'true' || form.gender === true,
                account: {
                    ...form.account,
                    role: updatedRole
                }
            };

            await updateUser(user.id, updatedUser);
            setEditOpen(false);
            setUser(updatedUser);
        } catch (err) {
            console.error("❌ Lỗi cập nhật:", err);
        }
    };

    if (!user) return <Typography textAlign="center" mt={5}>Đang tải thông tin...</Typography>;

    return (
        <Box p={3}>
            <Paper elevation={4} sx={{ p: 4, maxWidth: 700, mx: 'auto', borderRadius: 3 }}>
                <Box display="flex" alignItems="center" flexDirection="column" mb={3}>
                    <Avatar
                        src={user.avatar || ''}
                        sx={{ bgcolor: '#1976d2', width: 100, height: 100 }}
                    >
                        {!user.avatar && <PersonIcon fontSize="large" />}
                    </Avatar>
                    <Typography variant="h5" fontWeight="bold" mt={1}>
                        {user.fullName}
                    </Typography>
                    <Typography color="text.secondary">
                        {getRoleInVietnamese(user.role)}
                    </Typography>
                    <Button variant="outlined" sx={{ mt: 1 }} onClick={() => setEditOpen(true)}>
                        Chỉnh sửa
                    </Button>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Typography><strong>Email:</strong> {user.email}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography><strong>Số điện thoại:</strong> {user.phoneNumber || '—'}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography><strong>Địa chỉ:</strong> {user.address || '—'}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography>
                            <strong>Giới tính:</strong>{' '}
                            {user.gender === true ? 'Nam' : user.gender === false ? 'Nữ' : 'Khác'}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography><strong>Tên đăng nhập:</strong> {user.username}</Typography>
                    </Grid>
                </Grid>
            </Paper>

            <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Chỉnh sửa thông tin cá nhân</DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={2}>
                        <Grid item xs={12} textAlign="center">
                            <Avatar src={preview} sx={{ width: 80, height: 80, mx: 'auto' }} />
                            <Button variant="outlined" component="label" sx={{ mt: 1 }}>
                                📷 Chọn ảnh
                                <input type="file" accept="image/*" hidden onChange={handleFileChange} />
                            </Button>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Email" name="email" value={form.email || ''} onChange={handleChange} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Số điện thoại" name="phoneNumber" value={form.phoneNumber || ''} onChange={handleChange} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Địa chỉ" name="address" value={form.address || ''} onChange={handleChange} />
                        </Grid>
                        {user?.account?.role?.name === 'ADMIN' && (
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Vai trò"
                                    name="account.role.id"
                                    select
                                    value={form.account?.role?.id || ''}
                                    onChange={(e) => setForm({
                                        ...form,
                                        account: {
                                            ...form.account,
                                            role: { id: parseInt(e.target.value) }
                                        }
                                    })}
                                >
                                    <MenuItem value={1}>Quản trị viên</MenuItem>
                                    <MenuItem value={2}>Shiper</MenuItem>
                                    <MenuItem value={3}>Nhân viên</MenuItem>
                                    <MenuItem value={4}>Khách hàng</MenuItem>
                                </TextField>
                            </Grid>
                        )}
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditOpen(false)}>Hủy</Button>
                    <Button onClick={handleSubmit} variant="contained">Lưu</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ProfilePage;
