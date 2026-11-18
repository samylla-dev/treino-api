const express = require('express');
const Database = require('better-sqlite3');

const app = express();
app.use(express.json());
app.use(express.static('public'));

const db = new Database('mercado.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS produtos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo TEXT UNIQUE NOT NULL,
    nome TEXT NOT NULL,
    preco REAL NOT NULL,
    ativo INTEGER DEFAULT 1
  )
`);

const total = db.prepare('SELECT COUNT(*) AS total FROM produtos').get().total;
if (total === 0) {
  const inserir = db.prepare('INSERT INTO produtos (codigo, nome, preco) VALUES (?, ?, ?)');
  inserir.run('101', 'Maçã', 8.5);
  inserir.run('102', 'Pera', 10.5);
  inserir.run('103', 'Kiwi', 12);
}

app.get('/produtos', (req, res) => {
  const lista = db.prepare('SELECT * FROM produtos WHERE ativo = 1').all();
  res.json(lista);
});

app.post('/produtos', (req, res) => {
  const { codigo, nome, preco } = req.body;

  if (!codigo || !nome || !(preco > 0)) {
    return res.status(400).json({ erro: 'Preencha todos os campos e use preço maior que zero.' });
  }

  try {
    db.prepare('INSERT INTO produtos (codigo, nome, preco) VALUES (?, ?, ?)')
      .run(codigo, nome, preco);
    res.status(201).json({ ok: true });
  } catch (e) {
    res.status(400).json({ erro: 'Já existe um produto com esse código.' });
  }
});

app.listen(3000, () => {
  console.log('Rodando em http://localhost:3000');
});