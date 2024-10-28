import React from 'react';
import { Card as MaterialCard, CardContent, CardMedia, Typography, ButtonBase } from '@mui/material';
import './Card.css';

interface CardProps {
  title: string;
  imageUrl: string;
  onClick: () => void; // Asegúrate de que esta línea esté presente
}

const Card: React.FC<CardProps> = ({ title, imageUrl, onClick }) => {
  return (
    <ButtonBase onClick={onClick} sx={{ width: '100%' }}>
      <MaterialCard 
        sx={{ 
          width: 250,
          height: 215, 
          borderRadius: '8px', 
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          transition: 'transform 0.2s', 
          '&:hover': {
            transform: 'scale(1.05)', // Efecto al pasar el mouse
          },
        }} 
        className="custom-card"
      >
        <CardMedia
          component="img"
          height="140"
          image={imageUrl}
          alt={title}
        />
        <CardContent>
          <Typography component="div" className="card-title">
            {title}
          </Typography>
        </CardContent>
      </MaterialCard>
    </ButtonBase>
  );
};

export default Card;
