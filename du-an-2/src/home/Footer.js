import React from "react";
import { Box, Typography, IconButton, Container, Grid } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import YouTubeIcon from "@mui/icons-material/YouTube";
import InstagramIcon from "@mui/icons-material/Instagram";

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                bgcolor: "#0f172a", // màu tối hiện đại
                color: "white",
                pt: 6,
                pb: 3,
                mt: "auto",
                fontFamily: "Arial, sans-serif",
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    {/* Cột 1: Thông tin dịch vụ */}
                    <Grid item xs={12} md={4}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            FastLaundry
                        </Typography>
                        <Typography variant="body2" mb={1}>Dịch vụ giặt sấy tận nơi, nhanh chóng – sạch sẽ – chuyên nghiệp.</Typography>
                        <Typography variant="body2">Địa chỉ: 295 Nguyễn Tất Thành, Hải Châu, Đà Nẵng</Typography>
                        <Typography variant="body2">Hotline: 0935.558.143</Typography>
                        <Typography variant="body2">Email: fastlaundry@gmail.com</Typography>
                    </Grid>

                    {/* Cột 2: Chính sách & liên kết */}
                    <Grid item xs={12} md={4}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Chính sách & Hướng dẫn
                        </Typography>
                        {[
                            "Hướng dẫn đặt lịch",
                            "Chính sách vận chuyển",
                            "Chính sách đổi trả",
                            "Chính sách bảo mật",
                            "Liên hệ hỗ trợ",
                        ].map((item, index) => (
                            <Typography
                                key={index}
                                variant="body2"
                                sx={{
                                    cursor: "pointer",
                                    mb: 1,
                                    "&:hover": {
                                        color: "#38bdf8",
                                        textDecoration: "underline",
                                    },
                                }}
                            >
                                {item}
                            </Typography>
                        ))}
                    </Grid>

                    {/* Cột 3: Google Map */}
                    <Grid item xs={12} md={4}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Tìm chúng tôi tại đây
                        </Typography>
                        <Box
                            sx={{
                                width: "100%",
                                height: 200,
                                borderRadius: 2,
                                overflow: "hidden",
                                boxShadow: 2,
                            }}
                        >
                            <iframe
                                title="Google Map"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3833.983152783551!2d108.21502507461045!3d16.066408684630378!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314219c9b1ebefb3%3A0xa81e8b7f0b15d254!2s295%20Nguy%E1%BB%85n%20T%E1%BA%ADt%20Th%C3%A0nh%2C%20Thanh%20B%C3%ACnh%2C%20H%E1%BA%A3i%20Ch%C3%A2u%2C%20%C4%90%C3%A0%20N%E1%BA%B5ng!5e0!3m2!1sen!2s!4v1710791234567!5m2!1sen!2s"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                            ></iframe>
                        </Box>
                    </Grid>
                </Grid>

                {/* Social + Bản quyền */}
                <Box sx={{ textAlign: "center", mt: 4 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Kết nối với chúng tôi
                    </Typography>
                    <Box>
                        <IconButton color="inherit" href="https://facebook.com" target="_blank">
                            <FacebookIcon />
                        </IconButton>
                        <IconButton color="inherit" href="https://instagram.com" target="_blank">
                            <InstagramIcon />
                        </IconButton>
                        <IconButton color="inherit" href="https://youtube.com" target="_blank">
                            <YouTubeIcon />
                        </IconButton>
                    </Box>

                    <Typography variant="body2" sx={{ mt: 2 }}>
                        © 2025 FastLaundry. All rights reserved.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;
