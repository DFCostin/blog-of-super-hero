const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de CORS para permitir todas las solicitudes desde cualquier origen
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Rutas de tu aplicación
app.get('/api/heroes', (req, res) => {
  // Aquí puedes escribir la lógica para obtener los datos de los héroes
  res.json({ message: 'Obteniendo datos de los héroes...' });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});
