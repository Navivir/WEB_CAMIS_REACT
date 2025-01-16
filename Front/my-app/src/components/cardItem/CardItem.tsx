import React, { useState, useEffect } from "react";
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
import { InputChangeName } from "../inputChangeName/InputChangeName";

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
  const MAX_TITLE_LENGTH = 25;
  const truncatedTitle =
    title.length > MAX_TITLE_LENGTH ? title.slice(0, MAX_TITLE_LENGTH) : title;
  const [open, setOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false);
  const [isUnpublishDialogOpen, setIsUnpublishDialogOpen] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [newName, setNewName] = useState<string>("");
  const [isNameInputOpen, setIsNameInputOpen] = useState(false);
  const [titleName, setTitleName] = useState<string>(truncatedTitle);

  useEffect(() => {
      if (id) {
        handleIsPublished(id);
      }
    }, [id]); 

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

  const handleOpenInput = () => {
    setIsNameInputOpen(true);
  };

  const handleCloseInput = () => {
    setIsNameInputOpen(false);
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

  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", options);
  };

  const changeName = (name: string) => {
    if (name.trim() !== "") {
      const formData = new FormData();
      formData.append("name", name);
      fetch(`http://localhost:8080/cartItem/update/${id}`, {
        method: "PUT",
        body: formData,
      })
        .then((response) => {
          if (response.ok) {
            handleCloseInput();
            console.log("Nombre modificado existosamente");
          } else {
            console.log("No se ha podido modificar el nombre");
          }
        })
        .catch((error) => {
          console.error("Error en la solicitud", error);
        });
    } else {
      alert("El nombre no puede estar vacio");
    }
  };

  const handleChangeName = (name: string) => {
    const truncatedName = name.slice(0, MAX_TITLE_LENGTH);
    setNewName(name);
    changeName(name);
    setTitleName(truncatedName);
  };

  return (
    <div>
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
          <CardContent>
            <Typography variant="h6" component="div" className="card-title">
              {titleName}
            </Typography>
          </CardContent>
        </MaterialCard>
      </ButtonBase>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="lg"
        fullWidth
        className="custom-modal"
      >
        <DialogTitle className="title-dialog-cartitem">
          <div className="container-cartitem-cabecera">
            <div className="title-cabecera-cartitem">{titleName}</div>
            <Button onClick={handleClose} className="button-cerrar">
              X
            </Button>
          </div>
        </DialogTitle>
        <DialogContent>
          <div style={{ marginBottom: "20px" }}>
            <Typography
              variant="body1"
              color="textSecondary"
              className="typografy-creat-at"
            >
              <span className="text-create-at">Creado el: </span>
              <span className="content-create-at">{formatDate(created)}</span>
            </Typography>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Typography
                variant="body1"
                color="textSecondary"
                className="typografy-author"
              >
                <span className="text-author">Autor: </span>
                <span className="content-author"> {user_name}</span>
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

          <div style={{ display: "flex", overflowX: "auto", gap: "10px" }}>
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`${title} - ${index + 1}`}
                className="images-cart-item"
              />
            ))}
          </div>
        </DialogContent>
        <DialogActions>
          {showActions && (
            <>
              <Button
                onClick={handleOpenInput}
                variant="contained"
                className="button-change-name"
              >
                Cambiar Nombre
              </Button>
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
        </DialogActions>
      </Dialog>
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
      <Dialog open={isNameInputOpen} onClose={handleCloseInput}>
        <DialogContent>
          <InputChangeName
            label={"Cambiar Nombre"}
            onSubmit={handleChangeName}
            onCancel={handleCloseInput}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CardItem;
