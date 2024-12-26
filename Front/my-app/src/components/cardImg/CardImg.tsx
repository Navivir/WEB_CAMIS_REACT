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
import "./CardImg.css";
import { CardPropsImg } from "../../scripts/Types";

const CardImg: React.FC<CardPropsImg> = ({
  id,
  title,
  imageUrl,
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

  const handleConfirmDeleteImg = (id: number) => {
    if (id !== null) {
      fetch(`http://localhost:8080/cami/${id}`, {
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
          handleCloseDeleteDialog();
        });
    }
  };

  const handlePublish = (id: number) => {
    if (id != null) {
      fetch(`http://localhost:8080/publish/${id}`, {
        method: "POST",
      })
        .then((response) => {
          if (response.ok) {
            handleClosePublishDialog();
          } else {
            alert("no se ha podido añadir el diseño a publicados");
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
      fetch(`http://localhost:8080/unpublish/${id}`, {
        method: "POST",
      })
        .then((response) => {
          if (response.ok) {
            handleCloseUnpublishDialog();
          } else {
            alert("no se ha podido elimnar el diseño de publicados");
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
      fetch(`http://localhost:8080/is-published/${id}`)
        .then(response => response.text())
        .then(text => {
          if (text === 'Img publicada') {
            console.log('La imagen está publicada');
            setIsPublished(true);
          } else {
            console.log('La imagen no está publicada');
            setIsPublished(false);
          }
        })
        .catch(error => {
          console.error("Ha habido un problema con la petición:", error);
          setIsPublished(false);
        });
    } else {
      console.log("ID inválido");
      setIsPublished(false);
    }
  };

  handleIsPublished(id);

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
          <img
            src={imageUrl}
            alt={title}
            style={{ width: "100%", height: "auto" }}
          />
        </DialogContent>
        <DialogActions>
          {/* Condicional para mostrar los botones solo si showActions es verdadero */}
          {showActions && (
            <>
              {isPublished ? (
                <Button
                  onClick={handleOpenUnpublishDialog}
                  color="info"
                  variant="contained"
                  style={{ padding: "10px" }}
                >
                  Retirar
                </Button>
              ) : (
                <Button
                  onClick={handleOpenPublishDialog}
                  color="info"
                  variant="contained"
                  style={{ padding: "10px" }}
                >
                  Publicar
                </Button>
              )}
              <Button
                onClick={handleOpenDeleteDialog}
                color="error"
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
                Aplicar
              </Button>
            </>
          )}
          <Button
            onClick={handleClose}
            style={{ padding: "10px", cursor: "pointer" }}
          >
            Cerrar
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
            onClick={() => handleConfirmDeleteImg(id)}
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

export default CardImg;
