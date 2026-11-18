const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Olá! O servidor está funcionando.');
});

app.listen(3000, () => {
  console.log('Rodando em http://localhost:3000');
});