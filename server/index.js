import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';

const app = express();
const port = process.env.PORT || 4000;
const dist = path.join(path.dirname(fileURLToPath(import.meta.url)), '../dist');

app.use(express.static(dist, { maxAge: '7d' }));
app.get(/^(?!\/assets).*/, (_req, res) => {
    res.sendFile(path.join(dist, 'index.html'));
});

app.listen(port, () => {
    console.log(`Client running on http://localhost:${port}`);
});
