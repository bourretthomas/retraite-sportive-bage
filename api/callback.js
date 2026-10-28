// Connexion admin en ligne (Decap CMS ↔ GitHub) — étape 2 : échange du code contre un jeton,
// puis renvoi du jeton à la fenêtre d'administration (handshake postMessage attendu par Decap).
export default async function handler(req, res) {
  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;
  const clientSecret = process.env.OAUTH_GITHUB_CLIENT_SECRET;

  const url = new URL(req.url, 'http://localhost');
  const code = url.searchParams.get('code');

  const provider = 'github';

  function page(status, contentJson) {
    return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Connexion…</title></head>
<body style="font-family: system-ui, sans-serif; text-align:center; padding:2rem;">
<script>
(function () {
  function receiveMessage(e) {
    window.opener.postMessage('authorization:${provider}:${status}:${contentJson}', e.origin);
    window.removeEventListener('message', receiveMessage, false);
  }
  window.addEventListener('message', receiveMessage, false);
  window.opener && window.opener.postMessage('authorizing:${provider}', '*');
})();
</script>
<p>${status === 'success' ? 'Connexion réussie ✓ Vous pouvez fermer cette fenêtre.' : 'Échec de la connexion. Fermez cette fenêtre et réessayez.'}</p>
</body></html>`;
  }

  if (!clientId || !clientSecret) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end('Configuration manquante : OAUTH_GITHUB_CLIENT_ID / OAUTH_GITHUB_CLIENT_SECRET non définis dans Vercel.');
    return;
  }

  try {
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
    });
    const data = await tokenRes.json();

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    if (data.access_token) {
      const content = JSON.stringify({ token: data.access_token, provider });
      res.end(page('success', content));
    } else {
      const content = JSON.stringify({ error: data.error_description || 'Jeton non obtenu' });
      res.end(page('error', content));
    }
  } catch (err) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end('Erreur OAuth : ' + err.message);
  }
}
