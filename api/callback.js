// Connexion admin en ligne (Decap CMS ↔ GitHub) — étape 2 : échange du code contre un jeton,
// puis renvoi du jeton à la fenêtre d'administration (handshake postMessage attendu par Decap).
export default async function handler(req, res) {
  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;
  const clientSecret = process.env.OAUTH_GITHUB_CLIENT_SECRET;

  const url = new URL(req.url, 'http://localhost');
  const code = url.searchParams.get('code');

  const provider = 'github';

  // Le jeton n'est remis qu'à l'admin du site lui-même : sans cette liste, n'importe quel site
  // ouvert dans le navigateur d'une bénévole connectée à GitHub pourrait récupérer son jeton.
  const originesAutorisees = [
    'https://retraitesportivebage.vercel.app',
    'https://retraite-sportive-bage.vercel.app',
    'https://retraitesportivebage.com',
    'https://www.retraitesportivebage.com',
  ];

  function page(status, contentJson) {
    return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Connexion…</title></head>
<body style="font-family: system-ui, sans-serif; text-align:center; padding:2rem;">
<script>
(function () {
  var autorisees = ${JSON.stringify(originesAutorisees)};
  function receiveMessage(e) {
    if (autorisees.indexOf(e.origin) === -1) return;
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
