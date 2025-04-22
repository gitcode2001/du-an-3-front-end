import React from 'react';
import { Card, CardMedia, CardContent, Typography } from '@mui/material';

const ServiceCard = ({ title, desc, image }) => {
    return (
        <Card>
            <CardMedia component="img" height="180" image={image} alt={title} />
            <CardContent>
                <Typography variant="h6" fontWeight="bold">{title}</Typography>
                <Typography variant="body2">{desc}</Typography>
            </CardContent>
        </Card>
    );
};

export default ServiceCard;
