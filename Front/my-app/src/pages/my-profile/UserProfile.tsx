import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./UserProfile.css";
import { User } from "../../scripts/Types";

interface UserProfileProps {
  user: User | null; // 'User' es el tipo de datos que esperas
  onUserUpdate: (updatedUser: User) => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ onUserUpdate }) => {
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [name, setName] = useState<string>("");
  const [surname, setSurname] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null); // Image URL or base64
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const userId = localStorage.getItem("UserId");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/users/${userId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();

        // Populate fields with the fetched data
        setName(data.name || "");
        setSurname(data.surname || "");
        setUsername(data.username || "");
        setEmail(data.email || "");
        setBirthDate(data.birthDate ? new Date(data.birthDate) : null);

        if (data.imagenPerfil) {
          setPreviewImage(`data:image/jpeg;base64,${data.imagenPerfil}`);
        } else {
          setPreviewImage(null); // In case there is no image
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file)); // Show preview of selected file
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("surname", surname);
    formData.append("username", username);
    formData.append("email", email);
    formData.append(
      "birthDate",
      birthDate ? birthDate.toISOString().split("T")[0] : ""
    );
    if (profileImage) {
      formData.append("imagenPerfil", profileImage);
    }

    try {
      const response = await fetch(`http://localhost:8080/users/${userId}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to update user data");
      }
      const data = await response.json();
      onUserUpdate(data);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  return (
    <div className="profile-container">
      <form className="profile-form" onSubmit={handleSave}>
        <h2 className="profile-title">Perfil de Usuario</h2>

        <div className="profile-form-group">
          <div className="profile-input-wrapper">
            <div className="profile-image-upload-wrapper">
              <div className="profile-image-preview">
                {previewImage ? (
                  <img
                    src={previewImage} // Use the preview image URL or base64
                    alt="Profile Preview"
                    className="profile-image-thumbnail"
                  />
                ) : (
                  <span className="profile-image-placeholder">
                    No hay Imagen
                  </span>
                )}
              </div>
              {isEditing && (
                <div className="profile-file-input-wrapper">
                  <input
                    id="profileImage"
                    type="file"
                    accept="image/*"
                    className="profile-file-input"
                    onChange={handleImageChange}
                  />
                  <label
                    htmlFor="profileImage"
                    className="profile-browse-button"
                  >
                    Buscar
                  </label>
                </div>
              )}
            </div>
          </div>

          <div className="profile-input-wrapper">
            <input
              id="name"
              type="text"
              className="profile-form-input"
              placeholder="Introduce tu nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={!isEditing}
            />
          </div>

          <div className="profile-input-wrapper">
            <input
              id="surname"
              type="text"
              className="profile-form-input"
              placeholder="Introduce tu apellido"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              required
              disabled={!isEditing}
            />
          </div>

          <div className="profile-input-wrapper">
            <input
              id="username"
              type="text"
              className="profile-form-input"
              placeholder="Elige tu nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={!isEditing}
            />
          </div>

          <div className="profile-input-wrapper">
            <input
              id="email"
              type="email"
              className="profile-form-input"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={!isEditing}
            />
          </div>

          <div className="profile-input-wrapper">
            <DatePicker
              selected={birthDate}
              onChange={(date: Date | null) => setBirthDate(date)}
              dateFormat="dd/MM/yyyy"
              className="profile-form-input"
              placeholderText="Select your birth date"
              maxDate={new Date()}
              showYearDropdown
              yearDropdownItemNumber={100}
              scrollableYearDropdown
              showMonthDropdown
              disabled={!isEditing}
            />
          </div>
          <div className="bottom-button-container">
            {!isEditing && (
              <button
                type="button"
                className="profile-edit-button"
                onClick={() => setIsEditing(true)}
              >
                Editar
              </button>
            )}

            {isEditing && (
              <button type="submit" className="save-button">
                Guardar
              </button>
            )}

            <button
              type="button"
              className="profile-reset-password-button"
              onClick={() => console.log("Reset Password functionality")}
            >
              Cambiar contraseña
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
