import React from "react";
import {
  Card as MaterialCard,
  CardContent,
  CardMedia,
  Typography,
  ButtonBase,
} from "@mui/material";
import "./CardHome.css";
import { useNavigate } from "react-router-dom";

interface CardProps {
  title: string;
  imageUrl: string;
  onClick: () => void; // Asegúrate de que esta línea esté presente
}

export const handleClick = (id: number, navigate: ReturnType<typeof useNavigate>) => {
  navigate(`/details/${id}`);
};


const CardHome: React.FC<CardProps> = ({ title, imageUrl, onClick }) => {
  
  return (
    <ButtonBase onClick={onClick} sx={{ width: "100%" }}>
      <MaterialCard
        sx={{
          width: 400,
          height: 340, // Aumenta la altura total de la tarjeta
          borderRadius: "8px",
          backgroundColor: "rgba(126, 124, 124, 0.37)",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          transition: "transform 0.2s",
          "&:hover": {
            transform: "scale(1.05)", // Efecto al pasar el mouse
          },
          display: "flex",
          flexDirection: "column",
        }}
        className="custom-card"
      >
        <CardMedia component="img"  width = "140 "height="150" image={imageUrl} alt={title} />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography component="div" className="card-title">
            {title}
          </Typography>
        </CardContent>
      </MaterialCard>
    </ButtonBase>
  );
};

export default CardHome;
