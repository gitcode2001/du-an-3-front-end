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
    { title: 'Nhân viên giặt ủi 247 giàu kinh nghiệm', desc: 'Quần áo và trang phục của bạn sẽ được Giặt ủi bởi những nhân viên giàu kinh nghiệm đã gắn bó lâu năm với 247, tỉ mỉ tận tâm và có trách nhiệm cao trong từng nghiệp vụ giặt ủi chăm sóc quần áo của khách hàng.', image: 'https://giatui247.vn/web/image/2932-94339f4f/Screen%20Shot%202023-07-02%20at%2017.34.45.png' },
    { title: 'Máy móc thiết bị giặt ủi hiện đại', desc: 'Giặt ủi 247 luôn chú trọng đầu tư những trang Trang thiết bị giặt ủi cùng máy móc hiện đại trong nghành như máy giặt, máy sấy, bàn ủi.. đảo đảm việc sử lý giặt ủi, chăm sóc quần áo của khách hàng được nhanh chóng cũng như độ bền tuổi thọ của quần áo. Đồng thời giảm tiêu hao năng lượng tác động thấp nhất tới môi trường.', image: 'https://giatui247.vn/web/image/2936-0b088fde/tiem-giat-ui-247.png' },
    { title: 'Giặt ủi với bột giặt nước xả thân thiện', desc: 'Giặt ủi tại 247 sử dụng nguyên liệu nhập khẩu cấp có tính tẩy rửa mạnh mẽ và được lựa chọn kỹ càng đặc biệt không ảnh hưởng tới sức khỏe và thân thiện với môi trường là tiêu chí hàng đầu, có xuất xứ CO, CQ... rõ ràng và đầy đủ các giấy chứng nhận có liên quan tạo nên sự yên tâm tuyệt đối cho khách hàng.', image: 'https://giatui247.vn/web/image/2937-8db394c7/su-dung-nuoc-xa-dung-cach.png' },
    { title: 'Quy trình giặt ủi chặt chẽ - tinh gọn', desc: 'Quy trình giặt ủi chặt chẽ với mỗi phương thức giặt, làm sạch. Dựa trên cơ sở các đặc tính lý hóa cùng kỹ thuật nghiệp vụ cho từng chất liệu của quần áo và đồ vải mang tới chất lượng tốt nhất.\n' +
            'Mỗi khâu trong quá trình cung cấp dịch vụ đều có biểu mẫu theo dõi, ghi nhận tình trạng và được số hóa theo dõi...nhằm hạn chế thấp nhất sai sót khi cung cấp dịch vụ.', image: 'https://giatui247.vn/web/image/2940-e9ac95b5/quy-trinh-xu-ly-giat-ui-247.png' },
    { title: 'Trải nghiệm dịch vụ vượt trội', desc: 'Khi giặt ủi tại 247, khách hàng được tư vấn dịch vụ 24/7 và nhiều kênh tương tác hỗ trợ sẵn sàng giải đáp mọi thắc mắc.\n' +
            'Giặt ủi 247 luôn tối đa trải nghiệm khách hàng từ khâu tiếp nhận thới khâu trao trả đồ lại cho bạn bằng các chương trình khuyến mãi và hậu mãi vượt trội.\n' +
            'Ghi nhận đánh giá dịch vụ một cách khách quan nhằm cung cấp dịch vụ ngày một tốt hơn', image: 'https://giatui247.vn/web/image/2942-5fdec6ea/dich-vu-giat-ui-cao-cao.jpeg' },
    { title: 'Tiện lợi và nhanh chóng hơn', desc: 'Dịch vụ giặt ủi được cung cấp trên nền tảng trực tuyến Web + App và tại Tiệm giặt ủi gần nhất của Chúng tôi gần các khu dân cư, mang tới sự tiện lợi nhất cho khách hàng khi có nhu cầu giặt ủi.\n' +
            'Giao nhận tận nơi - tận cửa nhà vô cùng nhanh chóng cho khách hàng.', image: 'https://giatui247.vn/web/image/3023-e9da73a1/giat-ui-247-giao-nha.jpg' },
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

            <Container sx={{ mt: 10, textAlign: 'center' }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Dịch vụ giặt ủi cao cấp và chuyên nghiệp nhất
                </Typography>
                <Typography variant="h6" paragraph sx={{ marginBottom: 4 }}>
                    Giặt ủi tại FastLaundry giúp bạn tiết kiệm thời gian, tự tin và chỉnh chu hơn với những bộ quần áo phẳng phiu gọn gàng và thơm dịu.
                    Vì vậy dịch vụ giặt ủi là tiện ích được khách hàng yêu thích sử dụng và là giải pháp tin cậy hiệu quả của doanh nghiệp.
                </Typography>
                <Grid container spacing={4} justifyContent="center">
                    {services.map((s, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <ServiceCard title={s.title} desc={s.desc} image={s.image} />
                        </Grid>
                    ))}
                </Grid>
            </Container>

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

            <Box sx={{ mt: 10, bgcolor: '#f9fafb', py: 6 }}>
                <Container>
                    <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom>
                        Vì sao chọn FastLaundry?
                    </Typography>
                    <Typography variant="h6" textAlign="center" paragraph sx={{ marginBottom: 6 }}>
                        FastLaundry là tiệm giặt ủi gần đây được nhiều khách hàng yêu thích và lựa chọn.
                        Cùng khám phá lý do vì sao mọi người thường mang đồ tới giặt tại tiệm của chúng tôi.
                    </Typography>
                    <Grid container spacing={4} justifyContent="center">
                        {[
                            {
                                image: 'https://cdn-icons-png.flaticon.com/512/2942/2942821.png', // icon thời gian
                                title: '1. Tiết kiệm thời gian - Giảm việc nhà',
                                desc: 'Dịch vụ giặt ủi của FastLaundry giúp bạn tiết kiệm thời gian và công sức, giặt sạch quần áo, chăn mền, giảm tải việc nhà.',
                            },
                            {
                                image: 'https://cdn-icons-png.flaticon.com/512/869/869636.png', // icon sạch sẽ
                                title: '2. Tiết kiệm không gian sống cho bạn',
                                desc: 'Bạn sẽ tiết kiệm không gian nội thất trong nhà vì không cần bố trí máy giặt, máy sấy, hay khu vực phơi đồ.',
                            },
                            {
                                image: 'https://cdn-icons-png.flaticon.com/512/1046/1046857.png', // icon mới đẹp
                                title: '3. Tiết kiệm chi phí sinh hoạt của bạn',
                                desc: 'Sử dụng dịch vụ giặt ủi chất lượng cao với giá cả hợp lý, giúp bạn tiết kiệm chi phí mua sắm, bảo trì máy móc giặt ủi. Đặc biệt, FastLaundry còn cung cấp gói giặt trọn tháng với mức giá ưu đãi dành cho khách hàng sử dụng thường xuyên.',
                            },
                        ].map((item, i) => (
                            <Grid item xs={12} sm={6} md={4} key={i}>
                                <Box
                                    sx={{
                                        textAlign: 'center',
                                        px: 3,
                                        py: 4,
                                        bgcolor: 'white',
                                        borderRadius: 3,
                                        boxShadow: 3,
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'start',
                                    }}
                                >
                                    <Box
                                        component="img"
                                        src={item.image}
                                        alt={item.title}
                                        sx={{
                                            width: 80,
                                            height: 80,
                                            objectFit: 'contain',
                                            mb: 3,
                                        }}
                                    />
                                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                                        {item.title}
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        {item.desc}
                                    </Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

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
            <Box sx={{ mt: 10, py: 4, bgcolor: '#e3f2fd', textAlign: 'center' }}>
                <Typography variant="h5" fontWeight="bold">
                    Cần giặt đồ lấy liền hãy đặt dịch vụ tại Giặt ủi 247
                </Typography>
                <Typography variant="body1" sx={{ fontStyle: 'italic', fontSize: '0.875rem' }}>
                    Đặt giặt ủi dễ dàng đồng bộ tức thời tới Tiệm giặt gần nhất, Chúng tôi sẽ giao nhận quần áo tận nơi cho bạn!
                </Typography>
            </Box>

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
