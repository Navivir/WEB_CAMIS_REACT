const resizeImage = (file: File, width: number): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();
      reader.onload = () => {
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) return reject('Error en el contexto del canvas');
          
          // Mantener la relación de aspecto
          const scaleFactor = width / img.width;
          canvas.width = width;
          canvas.height = img.height * scaleFactor;
  
          // Asegúrate de que el fondo del canvas sea transparente
          ctx.clearRect(0, 0, canvas.width, canvas.height);  // Limpia el canvas para asegurarse de que esté vacío
  
          // Dibujar la imagen redimensionada
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  
          // Obtener el resultado como base64 (sin fondo negro)
          const resizedBase64 = canvas.toDataURL('image/png'); // Usa 'image/png' para conservar la transparencia
          resolve(resizedBase64);
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

export {resizeImage}