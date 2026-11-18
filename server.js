const express = require('express');
const Database = require('better-sqlite3');

const app = express();
const db = new Database('mercado.db');

// 1) Cria a tabela, se ainda não existir
db.exec(`
  CREATE TABLE IF NOT EXISTS produtos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo TEXT UNIQUE NOT NULL,
    nome TEXT NOT NULL,
    preco REAL NOT NULL,
    ativo INTEGER DEFAULT 1
  )
`);

// 2) Se a tabela estiver vazia, coloca 3 produtos de exemplo
const total = db.prepare('SELECT COUNT(*) AS total FROM produtos').get().total;
if (total === 0) {
  const inserir = db.prepare('INSERT INTO produtos (codigo, nome, preco) VALUES (?, ?, ?)');
  inserir.run('101', 'Maçã', 8.5);
  inserir.run('102', 'Pera', 10.5);
  inserir.run('103', 'Kiwi', 12);
}

// 3) Rota que devolve os produtos
app.get('/produtos', (req, res) => {
  const lista = db.prepare('SELECT * FROM produtos WHERE ativo = 1').all();
  res.json(lista);
});

app.listen(3000, () => {
  console.log('Rodando em http://localhost:3000');
});