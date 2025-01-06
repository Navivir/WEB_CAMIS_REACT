import React, { useState } from "react";
import {
  Card as MaterialCard,
  CardContent,
  CardMedia,
  Typography,
  ButtonBase,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";
import "./CardItem.css";
import { CardProps } from "../../scripts/Types";

const CardItem: React.FC<CardProps> = ({
  id,
  title,
  images,
  created,
  user_name,
  user_image,
  onClick,
  onDelete,
  onMakeItReal,
  showActions,
}) => {
  const [open, setOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false);
  const [isUnpublishDialogOpen, setIsUnpublishDialogOpen] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenDeleteDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDialogOpen(false);
  };

  const handleOpenPublishDialog = () => {
    setIsPublishDialogOpen(true);
  };

  const handleClosePublishDialog = () => {
    setIsPublishDialogOpen(false);
    setIsPublished(true);
  };

  const handleOpenUnpublishDialog = () => {
    setIsUnpublishDialogOpen(true);
  };

  const handleCloseUnpublishDialog = () => {
    setIsUnpublishDialogOpen(false);
    setIsPublished(false);
  };

  const handleConfirmDelete = (id: number) => {
    if (id !== null) {
      fetch(`http://localhost:8080/cartItem/${id}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            onDelete(id);
          } else {
            alert("Hubo un problema al eliminar el diseño.");
          }
        })
        .catch((error) => {
          console.error("Error al eliminar el diseño:", error);
          alert("Hubo un error al intentar eliminar el diseño.");
        })
        .finally(() => {
          handleClose();
        });
    }
  };

  const handlePublish = (id: number) => {
    if (id != null) {
      fetch(`http://localhost:8080/cartItem/add-to-published/${id}`, {
        method: "POST",
      })
        .then((response) => {
          if (response.ok) {
            handleClosePublishDialog();
          } else {
            alert("no se ha podido añadir el producto a publicados");
          }
        })
        .catch((error) => {})
        .finally(() => {
          handleClose();
        });
    }
  };

  const handleUnpublish = (id: number) => {
    if (id != null) {
      fetch(`http://localhost:8080/cartItem/remove-from-published/${id}`, {
        method: "POST",
      })
        .then((response) => {
          if (response.ok) {
            handleCloseUnpublishDialog();
          } else {
            alert("no se ha podido elimnar el producto de publicados");
          }
        })
        .catch((error) => {})
        .finally(() => {
          handleClose();
        });
    }
  };

  const handleIsPublished = (id: number) => {
    if (id != null) {
      fetch(`http://localhost:8080/cartItem/is-published/${id}`)
        .then((response) => response.text())
        .then((text) => {
          if (text === "Item publicado") {
            setIsPublished(true);
          } else {
            setIsPublished(false);
          }
        })
        .catch((error) => {
          console.error("Ha habido un problema con la petición:", error);
          setIsPublished(false);
        });
    } else {
      console.log("ID inválido");
      setIsPublished(false);
    }
  };

  handleIsPublished(id);

  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", options); // Formato día mes año en español
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
          className="custom-card-cart"
        >
          {images && images.length > 0 && (
            <CardMedia
              component="img"
              height="200"
              image={images[0]}
              alt={title}
              onClick={handleClickOpen}
              sx={{ cursor: "pointer" }}
            />
          )}
          {/* Contenido del card */}
          <CardContent>
            <Typography variant="h6" component="div" className="card-title">
              {title}
            </Typography>
          </CardContent>
        </MaterialCard>
      </ButtonBase>

      {/* Modal para ampliar la imagen */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="lg"
        fullWidth
        className="custom-modal"
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          {/* Información adicional */}
          <div style={{ marginBottom: "20px" }}>
            <Typography variant="body1" color="textSecondary">
              <span>Creado el: </span>
              <span style={{ fontWeight: "bold" }}>{formatDate(created)}</span>
            </Typography>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Typography
                variant="body1"
                color="textSecondary"
              >
                <span>Autor:  </span>
                <span style={{ fontWeight: "bold" }}> {user_name}</span>
              </Typography>
              {user_image && (
                <img
                  src={`data:image/png;base64,${user_image}`}
                  alt={user_name}
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              )}
            </div>
          </div>

          {/* Imágenes del producto */}
          <div style={{ display: "flex", overflowX: "auto", gap: "10px" }}>
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`${title} - ${index + 1}`}
                style={{ width: "100%", height: "auto", maxWidth: "500px" }}
              />
            ))}
          </div>
        </DialogContent>
        <DialogActions>
          {/* Botones de acción */}
          {showActions && (
            <>
              {isPublished ? (
                <Button
                  onClick={handleOpenUnpublishDialog}
                  variant="contained"
                  className="button-retirar"
                >
                  Retirar
                </Button>
              ) : (
                <Button
                  onClick={handleOpenPublishDialog}
                  variant="contained"
                  className="button-publicar"
                >
                  Publicar
                </Button>
              )}
              <Button
                onClick={handleOpenDeleteDialog}
                variant="contained"
                className="button-eliminar"
              >
                Eliminar
              </Button>
              <Button
                onClick={() => onMakeItReal(id)}
                variant="contained"
                className="button-siguiente"
              >
                Siguiente
              </Button>
            </>
          )}
          <Button
            onClick={handleClose}
            className="button-cerrar"
          >
            X
          </Button>
        </DialogActions>
      </Dialog>
      {/* Dialog de confirmación de eliminación */}
      <Dialog
        open={isDialogOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          ¿Estás seguro de eliminar este diseño?
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Conservar
          </Button>
          <Button
            onClick={() => handleConfirmDelete(id)}
            color="secondary"
            autoFocus
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={isPublishDialogOpen}
        onClose={handleClosePublishDialog}
        aria-labelledby="publish-dialog-title"
        aria-describedby="publish-dialog-description"
      >
        <DialogTitle id="publish-dialog-title">
          ¿Estás seguro de que deseas publicar este producto?
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleClosePublishDialog} color="primary">
            Cancelar
          </Button>
          <Button onClick={() => handlePublish(id)} color="success" autoFocus>
            Publicar
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={isUnpublishDialogOpen}
        onClose={handleCloseUnpublishDialog}
        aria-labelledby="unpublish-dialog-title"
        aria-describedby="unpublish-dialog-description"
      >
        <DialogTitle id="unpublish-dialog-title">
          ¿Estás seguro de que deseas retirar este producto?
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleCloseUnpublishDialog} color="primary">
            Cancelar
          </Button>
          <Button onClick={() => handleUnpublish(id)} color="success" autoFocus>
            Retirar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CardItem;
