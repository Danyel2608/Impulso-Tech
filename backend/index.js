const express = require('express');
const app = express();
const port = 3001;  // Puerto en el que escuchará el servidor

app.get('/', (req, res) => {
  res.send('Hola desde el backend!');
});

app.listen(port, () => {
  console.log(`Servidor backend escuchando en http://localhost:${port}`);
});
