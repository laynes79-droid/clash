// 1. Importar as dependências necessárias
const express = require('express');
const fetch = require('node-fetch'); // Usaremos node-fetch para fazer chamadas de API no backend
const cors = require('cors');
require('dotenv').config(); // Carrega as variáveis de ambiente do arquivo .env

// 2. Configurar o servidor Express
const app = express();
const port = 3000; // A porta em que nosso servidor local irá rodar

// 3. Middlewares
app.use(cors()); // Habilita o CORS para permitir chamadas do nosso frontend
app.use(express.static('public')); // Serve os arquivos estáticos (nosso dashboard)

// 4. Rota do Proxy para a API da Supercell
app.get('/api', async (req, res) => {
    // Pega o endpoint da Supercell que o frontend quer acessar (ex: /clans/...)
    const { endpoint } = req.query;

    if (!endpoint) {
        return res.status(400).json({ message: 'O parâmetro "endpoint" é obrigatório.' });
    }

    const apiKey = process.env.SUPERCELL_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ message: 'Erro de configuração: A SUPERCELL_API_KEY não foi encontrada no arquivo .env' });
    }

    const baseUrl = 'https://api.clashroyale.com/v1';
    const url = `${baseUrl}${endpoint}`;

    try {
        const apiResponse = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Accept': 'application/json',
            }
        });

        if (!apiResponse.ok) {
            const errorData = await apiResponse.json().catch(() => ({}));
            console.error('Erro da API da Supercell:', errorData);
            return res.status(apiResponse.status).json({ message: 'Erro ao contatar a API da Supercell', error: errorData });
        }

        const data = await apiResponse.json();
        res.status(200).json(data);

    } catch (error) {
        console.error('Erro no servidor proxy:', error);
        res.status(500).json({ message: 'Erro interno no servidor proxy.' });
    }
});

// 5. Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor do dashboard rodando em http://localhost:${port}`);
    console.log('Acesse as páginas do dashboard, por exemplo: http://localhost:3000/index.html');
});
