import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Paper, Divider, Avatar, Grid
} from '@mui/material';
import { getUserById } from '../services/UserService';
import PersonIcon from '@mui/icons-material/Person';

const ProfilePage = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (userId) {
            getUserById(userId)
                .then(res => setUser(res.data))
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
        </Box>
    );
};

export default ProfilePage;
