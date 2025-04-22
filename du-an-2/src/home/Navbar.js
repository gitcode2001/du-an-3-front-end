import React, { useState } from 'react';
import {
    AppBar, Toolbar, Typography, InputBase, Box, Button, alpha, styled,
    IconButton, Menu, MenuItem, useMediaQuery, useTheme
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import LocalLaundryServiceIcon from '@mui/icons-material/LocalLaundryService';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SearchWrapper = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha('#fff', 0.15),
    '&:hover': {
        backgroundColor: alpha('#fff', 0.25),
    },
    marginLeft: theme.spacing(2),
    width: '100%',
    maxWidth: 300,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: '#fff',
    width: '100%',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 2, 1, 2),
    },
}));

const Navbar = ({ onSearch }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [menuAnchor, setMenuAnchor] = useState(null);

    const { isAuthenticated, username, logout, role } = useAuth(); // 🔥 lấy thêm role
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();

    const handleSearch = () => {
        if (searchQuery.trim()) onSearch?.(searchQuery);
    };

    const handleClear = () => setSearchQuery('');
    const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);
    const handleMainMenuOpen = (e) => setMenuAnchor(e.currentTarget);
    const handleMainMenuClose = () => setMenuAnchor(null);

    return (
        <AppBar position="static" sx={{ backgroundColor: '#2196f3' }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                {/* Logo + Tìm kiếm */}
                <Box display="flex" alignItems="center" flex={1}>
                    <LocalLaundryServiceIcon sx={{ mr: 1 }} />
                    <Typography variant="h6" noWrap>FastLaundry</Typography>

                    {!isMobile && (
                        <SearchWrapper>
                            <StyledInputBase
                                placeholder="Tìm kiếm dịch vụ…"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            />
                            {searchQuery && (
                                <IconButton onClick={handleClear} sx={{ color: 'white' }} size="small">
                                    <ClearIcon fontSize="small" />
                                </IconButton>
                            )}
                            <IconButton onClick={handleSearch} sx={{ color: 'white' }}>
                                <SearchIcon />
                            </IconButton>
                        </SearchWrapper>
                    )}
                </Box>

                {/* Menu phải */}
                <Box display="flex" alignItems="center" justifyContent="flex-end" gap={1}>
                    {!isMobile && (
                        <>
                            <Button color="inherit" onClick={() => navigate('/')}>Trang chủ</Button>
                            <Button color="inherit" onClick={() => navigate('/booking')}>Đặt lịch</Button>
                            <Button color="inherit" onClick={() => navigate('/about')}>Giới thiệu</Button>
                            <Button color="inherit" onClick={() => navigate('/contact')}>Liên hệ</Button>
                        </>
                    )}

                    <IconButton size="large" edge="end" color="inherit" onClick={handleMenuOpen}>
                        <AccountCircle />
                    </IconButton>

                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                        {isAuthenticated ? (
                            <>
                                <MenuItem disabled>👋 Xin chào, {username}</MenuItem>
                                <MenuItem onClick={() => { navigate('/profile'); handleMenuClose(); }}>
                                    Thông tin cá nhân
                                </MenuItem>
                                <MenuItem onClick={() => { navigate('/reset-password'); handleMenuClose(); }}>
                                    Đổi mật khẩu
                                </MenuItem>
                                <MenuItem onClick={() => { navigate('/forgot-password'); handleMenuClose(); }}>
                                    Quên mật khẩu
                                </MenuItem>
                                {role === 'admin' && (
                                    <MenuItem onClick={() => { navigate('/account-manager'); handleMenuClose(); }}>
                                        👥 Quản lý tài khoản
                                    </MenuItem>
                                )}
                                <MenuItem onClick={() => { logout(); navigate('/login'); }}>
                                    Đăng xuất
                                </MenuItem>
                            </>
                        ) : (
                            <>
                                <MenuItem onClick={() => navigate('/login')}>Đăng nhập</MenuItem>
                                <MenuItem onClick={() => navigate('/register')}>Đăng ký</MenuItem>
                            </>
                        )}
                    </Menu>

                    {isMobile && (
                        <>
                            <IconButton color="inherit" onClick={handleMainMenuOpen}>
                                <MenuIcon />
                            </IconButton>
                            <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMainMenuClose}>
                                <MenuItem onClick={() => navigate('/')}>Trang chủ</MenuItem>
                                <MenuItem onClick={() => navigate('/booking')}>Đặt lịch</MenuItem>
                                <MenuItem onClick={() => navigate('/about')}>Giới thiệu</MenuItem>
                                <MenuItem onClick={() => navigate('/contact')}>Liên hệ</MenuItem>
                            </Menu>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
