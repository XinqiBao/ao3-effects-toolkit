import { createServer } from 'http';
import { readFileSync } from 'fs';
import { extname, join, resolve, sep } from 'path';

const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
};

export function contentTypeForPath(filePath) {
  return MIME[extname(filePath)] || 'application/octet-stream';
}

export function resolveRequestPath(root, requestUrl) {
  const pathname = decodeURIComponent(requestUrl.split('?')[0] || '/');
  const filePath = resolve(root, `.${pathname}`);
  const rootPrefix = root.endsWith(sep) ? root : `${root}${sep}`;

  return filePath === root || filePath.startsWith(rootPrefix) ? filePath : null;
}

export function startCaptureServer(root, port) {
  const server = createServer((req, res) => {
    try {
      const filePath = resolveRequestPath(root, req.url || '/');
      if (!filePath) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
      }
      const data = readFileSync(filePath);
      res.writeHead(200, { 'Content-Type': contentTypeForPath(filePath) });
      res.end(data);
    } catch (error) {
      if (error instanceof URIError) {
        res.writeHead(400);
        res.end('Bad Request');
        return;
      }
      res.writeHead(404);
      res.end('Not found');
    }
  });

  server.listen(port);
  return server;
}
