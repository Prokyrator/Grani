// ==========================================
// server.js - ВЕБ-СЕРВЕР ДЛЯ РАЗДАЧИ ИГРЫ
// ==========================================

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const server = http.createServer((req, res) => {
    let filePath = req.url.split('?')[0];
    if (filePath === '/') {
        filePath = '/index.html';
    }

    const fullPath = path.join(__dirname, filePath);

    fs.readFile(fullPath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404: Файл не найден');
            return;
        }

        let contentType = 'text/html';
        if (filePath.endsWith('.js')) contentType = 'application/javascript';
        else if (filePath.endsWith('.css')) contentType = 'text/css';
        else if (filePath.endsWith('.png')) contentType = 'image/png';
        else if (filePath.endsWith('.jpg')) contentType = 'image/jpeg';

        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });
});

server.listen(PORT, () => {
    console.log('========================================');
    console.log('🚀 СЕРВЕР ЗАПУЩЕН!');
    console.log('📡 Адрес: http://localhost:' + PORT);
    console.log('========================================');
});