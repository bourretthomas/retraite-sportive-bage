// Connexion admin en ligne (Decap CMS ↔ GitHub) — étape 1 : redirection vers GitHub.
// Variables d'environnement à définir dans Vercel :
//   OAUTH_GITHUB_CLIENT_ID      (Client ID de l'app OAuth GitHub)
//   OAUTH_GITHUB_CLIENT_SECRET  (Client secret)
export default function handler(req, res) {
  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;
  if (!clientId) {
    res.statusCode = 500;
    res.end("Configuration manquante : OAUTH_GITHUB_CLIENT_ID n'est pas défini dans Vercel.");
    return;
  }

  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const proto = (req.headers['x-forwarded-proto'] || 'https').split(',')[0];
  const redirectUri = `${proto}://${host}/api/callback`;
  const state = Math.random().toString(36).slice(2);

  const authorizeUrl =
    'https://github.com/login/oauth/authorize' +
    `?client_id=${encodeURIComponent(clientId)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    '&scope=repo' +
    `&state=${encodeURIComponent(state)}`;

  res.writeHead(302, { Location: authorizeUrl });
  res.end();
}
