import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Button, Chip, Snackbar, Alert, Grid,
    useMediaQuery, Stack
} from '@mui/material';
import { getAllUsers } from '../services/UserService';
import { lockAccount } from '../services/AccountService';
import { connectWebSocket, disconnectWebSocket } from '../utils/socket';
import useAccountLockSocket from '../utils/useAccountLockSocket';
import EditUserDialog from '../components/EditUserDialog';
import { useTheme } from '@mui/material/styles';

const AdminAccountManager = () => {
    useAccountLockSocket();
    const [users, setUsers] = useState([]);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
    const [selectedUser, setSelectedUser] = useState(null);
    const [openEdit, setOpenEdit] = useState(false);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const fetchUsers = async () => {
        try {
            const res = await getAllUsers();
            setUsers(res.data);
        } catch (err) {
            console.error("❌ Lỗi khi tải danh sách người dùng:", err);
        }
    };

    const handleLock = async (id) => {
        try {
            await lockAccount(id);
            fetchUsers();
        } catch (err) {
            setSnackbar({ open: true, message: 'Không thể khoá/mở tài khoản!', severity: 'error' });
        }
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
        setOpenEdit(true);
    };

    const handleMessage = (payload) => {
        setSnackbar({ open: true, message: payload.message, severity: payload.locked ? 'warning' : 'success' });
        fetchUsers();
    };

    useEffect(() => {
        fetchUsers();
        connectWebSocket(handleMessage);
        return () => disconnectWebSocket();
    }, []);

    const parseLocked = (locked) => locked === true || locked === 1 || locked === '1';

    return (
        <Box p={isMobile ? 1 : 3}>
            <Typography variant={isMobile ? "h6" : "h4"} fontWeight="bold" mb={2} textAlign="center" color="primary">
                Quản lý tài khoản
            </Typography>
            {isMobile ? (
                <Stack spacing={2}>
                    {users.map(user => (
                        <Paper key={user.id} sx={{ p: 2 }}>
                            <Typography fontWeight="bold">{user.fullName}</Typography>
                            <Typography variant="body2">Email: {user.email}</Typography>
                            <Typography variant="body2">Giới tính: {user.gender === true ? 'Nam' : user.gender === false ? 'Nữ' : 'Khác'}</Typography>
                            <Typography variant="body2">Vai trò: {user.role}</Typography>
                            <Typography variant="body2" mb={1}>Trạng thái: <Chip size="small" label={parseLocked(user.locked) ? 'Bị khóa' : 'Hoạt động'} color={parseLocked(user.locked) ? 'default' : 'success'} /></Typography>
                            <Stack direction="row" spacing={1}>
                                <Button size="small" variant="contained" color={parseLocked(user.locked) ? 'success' : 'error'} onClick={() => handleLock(user.id)}>
                                    {parseLocked(user.locked) ? 'Mở khóa' : 'Khoá'}
                                </Button>
                                <Button size="small" variant="outlined" onClick={() => handleEdit(user)}>Sửa</Button>
                            </Stack>
                        </Paper>
                    ))}
                </Stack>
            ) : (
                <Paper elevation={3}>
                    <TableContainer>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell><b>Họ tên</b></TableCell>
                                    <TableCell><b>Email</b></TableCell>
                                    <TableCell><b>SĐT</b></TableCell>
                                    <TableCell><b>Địa chỉ</b></TableCell>
                                    <TableCell><b>Giới tính</b></TableCell>
                                    <TableCell><b>Tên đăng nhập</b></TableCell>
                                    <TableCell><b>Vai trò</b></TableCell>
                                    <TableCell><b>Trạng thái</b></TableCell>
                                    <TableCell align="center"><b>Hành động</b></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.map(user => (
                                    <TableRow key={user.id} hover>
                                        <TableCell>{user.fullName}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.phoneNumber || '—'}</TableCell>
                                        <TableCell>{user.address || '—'}</TableCell>
                                        <TableCell>{user.gender === true ? 'Nam' : user.gender === false ? 'Nữ' : 'Khác'}</TableCell>
                                        <TableCell>{user.username}</TableCell>
                                        <TableCell>
                                            <Chip label={user.role} color={user.role === 'ADMIN' ? 'error' : 'info'} size="small" />
                                        </TableCell>
                                        <TableCell>
                                            <Chip label={parseLocked(user.locked) ? 'Bị khóa' : 'Hoạt động'} color={parseLocked(user.locked) ? 'default' : 'success'} size="small" />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Button
                                                onClick={() => handleLock(user.id)}
                                                variant="contained"
                                                size="small"
                                                color={parseLocked(user.locked) ? 'success' : 'error'}
                                            >
                                                {parseLocked(user.locked) ? 'Mở khóa' : 'Khoá'}
                                            </Button>
                                            <Button
                                                onClick={() => handleEdit(user)}
                                                variant="outlined"
                                                size="small"
                                                sx={{ ml: 1 }}
                                            >
                                                Sửa
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            )}

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

            <EditUserDialog
                open={openEdit}
                onClose={() => setOpenEdit(false)}
                user={selectedUser}
                onSave={fetchUsers}
            />
        </Box>
    );
};

export default AdminAccountManager;
