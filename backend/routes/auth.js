const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db'); // Importar a conexão com o banco de dados
const router = express.Router();

// Função para gerar tokens JWT
const generateToken = (user) => {
    return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Rota de registro
router.post('/register', async (req, res) => {
    const { nome, sobrenome, email, senha, cargo, cidade } = req.body;

    if (!nome || !sobrenome || !email || !senha || !cargo || !cidade) {
        return res.status(400).json({ message: 'Preencha todos os campos' });
    }

    db.query('SELECT * FROM usuarios WHERE email = ?', [email], async (err, results) => {
        if (err) {
            console.error('Erro no SELECT:', err);
            return res.status(500).json({ message: 'Erro no servidor' });
        }

        if (results.length > 0) {
            return res.status(400).json({ message: 'E-mail já cadastrado' });
        }

        try {
            const hashedPassword = await bcrypt.hash(senha, 10);
            const now = new Date();

            const query = 'INSERT INTO usuarios (nome, sobrenome, email, senha, cargo, cidade, status, data_criacao) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
            db.query(query, [nome, sobrenome, email, hashedPassword, cargo, cidade, 'ativo', now], (err, result) => {
                if (err) {
                    console.error('Erro no INSERT:', err);
                    return res.status(500).json({ message: 'Erro ao criar a conta' });
                }

                // Gerar o token JWT após criar o usuário
                const newUser = { id: result.insertId, email };
                const token = generateToken(newUser); // Gerar token JWT
                res.status(201).json({ message: 'Conta criada com sucesso!', token }); // Retorna o token
            });
        } catch (error) {
            console.error('Erro ao criptografar a senha:', error);
            res.status(500).json({ message: 'Erro ao processar os dados' });
        }
    });
});

// Rota de login
router.post('/login', (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ message: 'Preencha todos os campos' });
    }

    // Verificar se o usuário existe
    db.query('SELECT * FROM usuarios WHERE email = ?', [email], async (err, results) => {
        if (err) return res.status(500).json({ message: 'Erro no servidor' });

        if (results.length === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        const user = results[0];

        // Verificar a senha
        const match = await bcrypt.compare(senha, user.senha);
        if (!match) {
            return res.status(401).json({ message: 'Senha incorreta' });
        }

        // Gerar token JWT
        const token = generateToken(user);
        res.status(200).json({ message: 'Login bem-sucedido', token });
    });
});

// Rota para obter informações do usuário autenticado
router.get('/me', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]; // Obter o token do cabeçalho

    if (!token) {
        return res.status(401).json({ message: 'Token não fornecido' }); // Erro se o token não estiver presente
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Token inválido' }); // Erro se o token for inválido
        }

        // Buscar o usuário no banco de dados usando o ID do token
        db.query('SELECT id, nome, sobrenome, email, cargo, cidade FROM usuarios WHERE id = ?', [decoded.id], (err, results) => {
            if (err) return res.status(500).json({ message: 'Erro no servidor' });

            if (results.length === 0) {
                return res.status(404).json({ message: 'Usuário não encontrado' });
            }

            const usuario = results[0];
            res.status(200).json(usuario); // Retornar as informações do usuário
        });
    });
});





module.exports = router;
