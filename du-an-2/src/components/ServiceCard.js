import React from 'react';
import { Card, CardMedia, CardContent, Typography } from '@mui/material';

const ServiceCard = ({ title, desc, image }) => {
    return (
        <Card
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                boxShadow: 3,
                transition: 'transform 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 6,
                }
            }}
        >
            <CardMedia
                component="img"
                height="200"
                image={image}
                alt={title}
                sx={{ objectFit: 'cover' }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {desc}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default ServiceCard;
