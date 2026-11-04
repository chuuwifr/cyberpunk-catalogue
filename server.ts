process.env.DISABLE_HMR = 'true';
process.env.VITE_CONFIG_NATIVE_IGNORE_WARNING = 'true';
import 'dotenv/config';
import express, { Request, Response } from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { isProxyableImageUrl, escapeHtml, jsonForInlineScript } from './src/utils/imageHosts.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json());

// Proxy for Cyberpunk Fandom wiki image assets
app.get('/api/proxy-image', async (req: Request, res: Response) => {
  const targetUrl = req.query.url as string;
  if (!targetUrl) {
    return res.status(400).send('Paramètre url manquant');
  }
  // Uniquement les images du wiki Cyberpunk / Fandom : le proxy n'est pas un relais ouvert
  if (!isProxyableImageUrl(targetUrl)) {
    return res.status(400).type('text/plain').send('URL non autorisée');
  }

  try {
    const upstream = await fetch(targetUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://cyberpunk.fandom.com/',
      },
    });

    if (!upstream.ok) {
      return res.status(upstream.status).send(`Upstream status: ${upstream.status}`);
    }

    const contentType = upstream.headers.get('content-type') || 'image/webp';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=2592000, immutable');
    res.setHeader('Access-Control-Allow-Origin', '*');

    const arrayBuffer = await upstream.arrayBuffer();
    return res.end(Buffer.from(arrayBuffer));
  } catch (err: any) {
    return res.status(500).type('text/plain').send(err?.message || 'Erreur proxy image');
  }
});

// OAuth URL generation endpoint
app.get('/api/auth/github/url', (req: Request, res: Response) => {
  const clientId = process.env.GITHUB_CLIENT_ID || process.env.CLIENT_ID;
  const configured = Boolean(clientId);

  // Dynamic redirect URI according to client origin or APP_URL env
  const origin = process.env.APP_URL || (req.headers.origin as string) || `http://localhost:${PORT}`;
  const redirectUri = `${origin.replace(/\/+$/, '')}/auth/github/callback`;

  const state = Math.random().toString(36).substring(2, 15);

  const params = new URLSearchParams({
    client_id: clientId || '',
    redirect_uri: redirectUri,
    scope: 'gist,read:user',
    state,
  });

  const authUrl = `https://github.com/login/oauth/authorize?${params.toString()}`;

  res.json({
    url: authUrl,
    configured,
    redirectUri,
  });
});

// OAuth Callback handler with postMessage
const oauthCallbackHandler = async (req: Request, res: Response) => {
  const code = req.query.code as string;
  const error = req.query.error as string;

  if (error || !code) {
    const errorMsg = (req.query.error_description as string) || error || 'Autorisation refusée ou code manquant';
    return res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>GitHub Uplink Failed</title>
          <style>
            body { background: #0a0c10; color: #ff0055; font-family: monospace; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
            .box { border: 1px solid #ff0055; padding: 24px; border-radius: 8px; text-align: center; max-width: 450px; background: rgba(255,0,85,0.05); }
          </style>
        </head>
        <body>
          <div class="box">
            <h2 style="margin-top:0;">[CONNEXION ÉCHOUÉE]</h2>
            <p style="color:#d1d5db;">${escapeHtml(errorMsg)}</p>
            <button onclick="window.close()" style="background:#ff0055;color:#fff;border:none;padding:8px 16px;cursor:pointer;font-family:monospace;margin-top:12px;font-weight:bold;">FERMER</button>
          </div>
        </body>
      </html>
    `);
  }

  const clientId = process.env.GITHUB_CLIENT_ID || process.env.CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET || process.env.CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return res.status(500).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Configuration Required</title>
          <style>
            body { background: #0a0c10; color: #ffcc00; font-family: monospace; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
            .box { border: 1px solid #ffcc00; padding: 24px; border-radius: 8px; text-align: center; max-width: 480px; }
          </style>
        </head>
        <body>
          <div class="box">
            <h2>[GITHUB_CLIENT_SECRET MANQUANT]</h2>
            <p>Veuillez configurer GITHUB_CLIENT_ID et GITHUB_CLIENT_SECRET dans votre environnement ou utiliser la connexion par Token Personnel (PAT).</p>
            <button onclick="window.close()" style="background:#ffcc00;color:#000;border:none;padding:8px 16px;cursor:pointer;font-family:monospace;margin-top:12px;font-weight:bold;">FERMER</button>
          </div>
        </body>
      </html>
    `);
  }

  try {
    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });

    const tokenData = (await tokenResponse.json()) as any;
    if (tokenData.error || !tokenData.access_token) {
      throw new Error(tokenData.error_description || tokenData.error || 'Impossible d\'obtenir le token');
    }

    const token = tokenData.access_token;

    // Fetch user profile
    const userRes = await fetch('https://api.github.com/user', {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `Bearer ${token}`,
        'User-Agent': 'Cyberpunk-Tech-Compendium',
      },
    });

    const user = userRes.ok ? await userRes.json() : null;

    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>GitHub Uplink Established</title>
          <style>
            body {
              background: #090a0f;
              color: #00ff9d;
              font-family: 'Courier New', Courier, monospace;
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
            }
            .panel {
              border: 1px solid #00ff9d;
              box-shadow: 0 0 20px rgba(0, 255, 157, 0.2);
              padding: 30px;
              text-align: center;
              background: #0d1117;
              border-radius: 6px;
              max-width: 440px;
            }
            .badge {
              display: inline-block;
              background: rgba(0, 255, 157, 0.15);
              padding: 4px 10px;
              border-radius: 4px;
              font-size: 11px;
              letter-spacing: 1px;
              margin-bottom: 12px;
            }
          </style>
        </head>
        <body>
          <div class="panel">
            <div class="badge">UPLINK CONFIRMÉ</div>
            <h2 style="margin: 0 0 10px 0; color: #00ff9d;">[GITHUB_AUTH_SUCCESS]</h2>
            <p style="color: #8b949e; font-size: 13px; line-height: 1.5;">
              Connexion sécurisée établie avec succès.<br/>
              Transfert des clés au terminal Night City...
            </p>
          </div>
          <script>
            try {
              const payload = {
                type: 'OAUTH_AUTH_SUCCESS',
                provider: 'github',
                token: ${jsonForInlineScript(token)},
                user: ${jsonForInlineScript(user)}
              };
              if (window.opener) {
                window.opener.postMessage(payload, '*');
                setTimeout(() => window.close(), 600);
              } else {
                window.location.href = '/';
              }
            } catch (err) {
              console.error(err);
            }
          </script>
        </body>
      </html>
    `);
  } catch (err: any) {
    res.status(500).send(`
      <!DOCTYPE html>
      <html>
        <body style="background:#0a0c10;color:#ff0055;font-family:monospace;padding:30px;">
          <h2>ERREUR OAUTH GITHUB</h2>
          <pre>${escapeHtml(err?.message || 'Erreur inconnue')}</pre>
          <button onclick="window.close()" style="margin-top:20px;padding:8px 16px;background:#ff0055;color:#fff;border:none;cursor:pointer;">Fermer</button>
        </body>
      </html>
    `);
  }
};

app.get(['/auth/github/callback', '/auth/github/callback/', '/auth/callback', '/auth/callback/'], oauthCallbackHandler);

// GitHub API Proxy (for requests that might encounter CORS or special headers)
app.all('/api/github/proxy', async (req: Request, res: Response) => {
  const targetUrl = req.query.url as string;
  if (!targetUrl || !targetUrl.startsWith('https://api.github.com')) {
    return res.status(400).json({ error: 'Invalid or missing target URL' });
  }

  try {
    const headers = new Headers();
    for (const [key, val] of Object.entries(req.headers)) {
      if (['authorization', 'accept', 'content-type', 'user-agent'].includes(key.toLowerCase()) && typeof val === 'string') {
        headers.set(key, val);
      }
    }
    if (!headers.has('user-agent')) {
      headers.set('user-agent', 'Cyberpunk-Tech-Compendium');
    }

    const fetchOptions: RequestInit = {
      method: req.method,
      headers,
    };

    if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body) {
      fetchOptions.body = JSON.stringify(req.body);
    }

    const upstream = await fetch(targetUrl, fetchOptions);
    const contentType = upstream.headers.get('content-type') || 'application/json';
    res.status(upstream.status);
    res.setHeader('Content-Type', contentType);

    const data = await upstream.text();
    return res.send(data);
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || 'Proxy request failed' });
  }
});

// App health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'online',
    system: 'Tech Compendium // Cyberpunk RED & Savage Worlds Interface Zéro 2.0',
    timestamp: new Date().toISOString(),
  });
});

async function startServer() {
  const server = http.createServer(app);

  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: {
        middlewareMode: true,
        hmr: {
          server,
        },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve production static assets
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`[CYBERPUNK ENGINE] Server running on http://0.0.0.0:${PORT} (mode: ${isProd ? 'production' : 'development'})`);
  });
}

startServer();
