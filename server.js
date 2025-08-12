const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 4000;
const DATA_FILE = path.join(__dirname, 'livros.json');

// Função para ler os livros do arquivo
function lerLivros() {
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, JSON.stringify([]));
    }
    return JSON.parse(fs.readFileSync(DATA_FILE));
}

// Função para salvar livros no arquivo
function salvarLivros(livros) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(livros, null, 2));
}

// Rota para listar livros
app.get('/livros', (req, res) => {
    res.json(lerLivros());
});

// Rota para cadastrar livro
app.post('/livros', (req, res) => {
    const livros = lerLivros();
    const novoLivro = {
        id: Date.now(),
        titulo: req.body.titulo,
        autor: req.body.autor,
        ano: req.body.ano,
        lido: false
    };
    livros.push(novoLivro);
    salvarLivros(livros);
    res.status(201).json(novoLivro);
});

// Rota para marcar como lido
app.put('/livros/:id/lido', (req, res) => {
    const livros = lerLivros();
    const livro = livros.find(l => l.id == req.params.id);
    if (!livro) return res.status(404).json({ error: 'Livro não encontrado' });

    livro.lido = true;
    salvarLivros(livros);
    res.json(livro);
});

// Rota para remover livro
app.delete('/livros/:id', (req, res) => {
    let livros = lerLivros();
    livros = livros.filter(l => l.id != req.params.id);
    salvarLivros(livros);
    res.status(204).send();
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
