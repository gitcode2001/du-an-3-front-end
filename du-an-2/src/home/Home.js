import React, { useEffect } from 'react';
import {
    Container, Typography, Grid, Box, Button
} from '@mui/material';
import Navbar from '../home/Navbar';
import ServiceCard from '../components/ServiceCard';
import Footer from '../home/Footer';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const services = [
    { title: 'Giặt Thường', desc: 'Nhanh chóng, sạch sẽ, thơm mát', image: '/img/giat-thuong.jpg' },
    { title: 'Sấy Khô', desc: 'Sấy riêng từng khách, an toàn cho đồ', image: '/img/say-kho.jpg' },
    { title: 'Giặt Hấp', desc: 'Công nghệ hấp hơi bảo vệ vải cao cấp', image: '/img/giat-hap.jpg' }
];

const HomePage = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <Navbar />

            <Box
                sx={{
                    backgroundImage: 'url(/img/banner.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: { xs: '40vh', md: '60vh' },
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    px: 2,
                }}
            >
                <Typography variant="h3" fontWeight="bold">
                    Dịch Vụ Giặt Sấy Tận Nơi - FastLaundry
                </Typography>
            </Box>

            {/* Giới thiệu */}
            <Container sx={{ mt: 10 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Giới thiệu về FastLaundry
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    FastLaundry là dịch vụ giặt sấy chuyên nghiệp, mang đến trải nghiệm giặt ủi tiện lợi ngay tại nhà bạn.
                    Với đội ngũ tận tâm, máy móc hiện đại và hệ thống giao nhận linh hoạt, chúng tôi cam kết giúp quần áo
                    của bạn luôn sạch sẽ, thơm mát và đúng hẹn.
                </Typography>
            </Container>

            {/* Dịch vụ nổi bật */}
            <Container sx={{ mt: 10 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Dịch vụ nổi bật
                </Typography>
                <Grid container spacing={4}>
                    {services.map((s, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <ServiceCard title={s.title} desc={s.desc} image={s.image} />
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* Quy trình giặt sấy */}
            <Box sx={{ mt: 10, py: 6, bgcolor: '#e3f2fd' }}>
                <Container>
                    <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom>
                        Quy trình giặt sấy tại FastLaundry
                    </Typography>
                    <Grid container spacing={4} justifyContent="center">
                        {[
                            { step: '1️⃣ Đặt lịch', desc: 'Đặt lịch online hoặc gọi hotline.' },
                            { step: '2️⃣ Giao nhận tận nơi', desc: 'Nhân viên lấy đồ đúng giờ.' },
                            { step: '3️⃣ Giặt & sấy', desc: 'Sử dụng máy giặt chuyên dụng.' },
                            { step: '4️⃣ Giao lại', desc: 'Giao đồ sạch sẽ thơm mát đến tận nhà.' },
                        ].map((item, i) => (
                            <Grid item xs={12} sm={6} md={3} key={i}>
                                <Typography variant="h6" fontWeight="bold">{item.step}</Typography>
                                <Typography>{item.desc}</Typography>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Vì sao chọn FastLaundry */}
            <Box sx={{ mt: 10, bgcolor: '#f9fafb', py: 6 }}>
                <Container>
                    <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom>
                        Vì sao chọn FastLaundry?
                    </Typography>
                    <Grid container spacing={4} justifyContent="center">
                        {[
                            { icon: '🚀', title: 'Nhanh chóng', desc: 'Giao nhận chỉ trong 60 phút.' },
                            { icon: '🧼', title: 'Sạch sẽ', desc: 'Bột giặt cao cấp, diệt khuẩn.' },
                            { icon: '💰', title: 'Giá hợp lý', desc: 'Không phát sinh chi phí.' },
                        ].map((item, i) => (
                            <Grid item xs={12} sm={4} key={i}>
                                <Typography variant="h6" fontWeight="bold">{item.icon} {item.title}</Typography>
                                <Typography>{item.desc}</Typography>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Cam kết */}
            <Container sx={{ mt: 10 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Cam kết của chúng tôi
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    ✅ Quần áo giặt riêng từng khách <br />
                    ✅ Cam kết đúng hẹn hoặc hoàn tiền <br />
                    ✅ Đền bù nếu có hư hỏng/mất mát
                </Typography>
            </Container>

            {/* CTA */}
            <Box sx={{ mt: 10, py: 6, bgcolor: '#2196f3', color: '#fff', textAlign: 'center' }}>
                <Typography variant="h5" fontWeight="bold">
                    Sẵn sàng để quần áo luôn thơm mát & sạch sẽ?
                </Typography>
                <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    sx={{ mt: 3 }}
                    onClick={() => navigate(isAuthenticated ? '/booking' : '/login')}
                >
                    Đặt lịch ngay
                </Button>
            </Box>

            <Footer />
        </>
    );
};

export default HomePage;
