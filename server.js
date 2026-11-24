const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const MIME = { html: 'text/html; charset=utf-8', css: 'text/css; charset=utf-8', js: 'application/javascript; charset=utf-8', json: 'application/json', svg: 'image/svg+xml', ico: 'image/x-icon', png: 'image/png', jpg: 'image/jpeg', mp4: 'video/mp4' };

http.createServer((req, res) => {
  const file = path.join(__dirname, path.normalize(req.url.split('?')[0] === '/' ? '/index.html' : req.url.split('?')[0]).replace(/^(\.\.[\/\\])+/, ''));
  fs.readFile(file, (err, data) => {
    if (err) {
      res.writeHead(err.code === 'ENOENT' ? 404 : 500, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end(err.code === 'ENOENT' ? '404 Not Found' : `Server Error: ${err.code}`);
    }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file).slice(1).toLowerCase()] || 'application/octet-stream' });
    res.end(data);
  });
}).listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
