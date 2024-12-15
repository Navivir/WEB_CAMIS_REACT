import React, { useState } from "react";
import { Card as MaterialCard, CardContent, CardMedia, Typography, ButtonBase, Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";
import "./CardItem.css"; // Asegúrate de tener tu CSS para el card

interface CardProps {
  id: number;  // Usamos `id` como número
  title: string;
  imageUrl: string;
  type: string;
  onClick: () => void;
  onDelete: (id: number) => void;  // Nueva propiedad para eliminar el producto
  onMakeItReal: (id: number) => void;  // Nueva propiedad para añadir al carrito
}

const CardItem: React.FC<CardProps> = ({ id, title, imageUrl, type, onClick, onDelete, onMakeItReal }) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      {/* Card de Material UI */}
      <ButtonBase onClick={onClick} sx={{ width: "100%" }}>
        <MaterialCard
          sx={{
            width: 300,
            height: 350,
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            transition: "transform 0.2s",
            "&:hover": {
              transform: "scale(1.05)",
            },
            display: "flex",
            flexDirection: "column",
          }}
          className="custom-card"
        >
          {/* Imagen clickeable */}
          <CardMedia
            component="img"
            height="200"
            image={imageUrl}
            alt={title}
            onClick={handleClickOpen}
            sx={{ cursor: "pointer" }} // Cambiar el cursor para indicar que es clickeable
          />
          {/* Contenido del card */}
          <CardContent>
            <Typography variant="h6" component="div" className="card-title">
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {type}
            </Typography>
          </CardContent>
        </MaterialCard>
      </ButtonBase>

      {/* Modal para ampliar la imagen */}
      <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <img src={imageUrl} alt={title} style={{ width: "100%", height: "auto" }} />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => onDelete(id)}
            color="error" // Establecemos color rojo para el botón de eliminar
            variant="contained"
            style={{ padding: "10px" }}
          >
            Eliminar
          </Button>
          <Button
            onClick={() => onMakeItReal(id)}
            color="success" // Establecemos color verde para el botón de añadir al carrito
            variant="contained"
            style={{ padding: "10px" }}
          >
            Hacerlo Realidad
          </Button>
          <Button
            onClick={handleClose}
            style={{ padding: "10px", cursor: "pointer" }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CardItem;
