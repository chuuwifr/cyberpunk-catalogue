import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, Plugin} from 'vite';

function imageProxyPlugin(): Plugin {
  return {
    name: 'cyberpunk-image-proxy',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url && req.url.startsWith('/api/proxy-image')) {
          try {
            const urlObj = new URL(req.url, 'http://localhost:3000');
            const targetUrl = urlObj.searchParams.get('url');
            if (!targetUrl) {
              res.statusCode = 400;
              return res.end('Missing url parameter');
            }
            const upstream = await fetch(targetUrl, {
              headers: {
                'User-Agent':
                  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Referer': 'https://cyberpunk.fandom.com/',
              },
            });
            if (!upstream.ok) {
              res.statusCode = upstream.status;
              return res.end(`Upstream error: ${upstream.status}`);
            }
            const contentType = upstream.headers.get('content-type') || 'image/webp';
            res.setHeader('Content-Type', contentType);
            res.setHeader('Cache-Control', 'public, max-age=2592000, immutable');
            res.setHeader('Access-Control-Allow-Origin', '*');
            const arrayBuffer = await upstream.arrayBuffer();
            return res.end(Buffer.from(arrayBuffer));
          } catch (err: any) {
            res.statusCode = 500;
            return res.end(err?.message || 'Proxy error');
          }
        }
        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), imageProxyPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
