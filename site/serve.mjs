// Tiny static server for local preview: `node serve.mjs` then open http://localhost:4321
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), process.argv[2] || 'dist');
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.mp4': 'video/mp4' };
const port = Number(process.env.PORT || 4321);
createServer(async (req, res) => {
  let p = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^(\.\.[/\\])+/, '');
  let f = join(ROOT, p);
  try { if ((await stat(f)).isDirectory()) f = join(f, 'index.html'); } catch { res.writeHead(404); return res.end('not found'); }
  try { const b = await readFile(f); res.writeHead(200, { 'Content-Type': TYPES[extname(f)] || 'application/octet-stream' }); res.end(b); }
  catch { res.writeHead(404); res.end('not found'); }
}).listen(port, () => console.log(`Jostoju site on http://localhost:${port}`));
