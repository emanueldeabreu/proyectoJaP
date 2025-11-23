const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 4000;

let emercado = require('./emercado-api-main/cats/cat.json');

// permitir que el frontend pueda hacer peticiones
app.use(cors());                         // Habilita CORS
app.use(express.json());

// endpoint de prueba
app.get('/', (req, res) => {
    res.send('Backend funcionando 🚀');
});

app.get("/productos", (req, res) => {
    res.json([
        { id: 1, name: "Producto libre A" },
        { id: 2, name: "Producto libre B" }
    ]);
});

app.get('/emercado', (req, res) => {
    res.json(emercado);
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT} prueba correcta de terminal`);
});
