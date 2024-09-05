const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Ruta adicional para servir directamente el archivo detalle.html
app.get('/details.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'detalle.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});