# Site — Retraite Sportive Bâge Val de Saône

Site web de l'association, aux couleurs de la FFRS. Site **statique** (Astro) :
rapide, sans maintenance de sécurité, et **hébergement gratuit**.

## Pour développer (technique)

```bash
npm install        # une seule fois
npm run dev        # lance le site sur http://localhost:4321
```

Pour tester l'interface d'édition en local, dans un 2ᵉ terminal :

```bash
npm run cms        # proxy d'édition locale (Decap)
```

puis ouvrir http://localhost:4321/admin

## Structure

- `src/content/activites/` — une fiche par activité (Markdown)
- `src/content/actus/` — les actualités « Flash Infos »
- `src/data/site.ts` — infos générales (contacts, menu)
- `src/styles/global.css` — couleurs FFRS (variables en haut du fichier)
- `public/admin/` — interface d'édition web (Decap CMS)
- `public/images/` — photos téléversées

## Couleurs FFRS

Définies en haut de `src/styles/global.css` (`--vert`, `--orange`...).
**À ajuster** sur les codes exacts du logo officiel de la FFRS.

## Mise en ligne (gratuite)

1. Mettre le code sur un dépôt **GitHub**.
2. Connecter le dépôt à **Netlify** ou **Cloudflare Pages** (build : `npm run build`, dossier publié : `dist`).
3. Pointer le domaine `retraitesportivebage.com` vers l'hébergeur.
4. Dans `public/admin/config.yml`, remplacer `repo: VOTRE-COMPTE/...` par le vrai dépôt
   et activer l'authentification GitHub pour l'admin.

---

## Guide express pour modifier le site (sans informatique)

1. Aller sur **`retraitesportivebage.com/admin`** et se connecter.
2. **Ajouter une actualité** : « Flash Infos » → « New » → écrire le titre, choisir
   la date, glisser une photo, taper le texte → **Publish**.
3. **Modifier une activité** : « Activités » → cliquer dessus → changer horaires /
   lieu / photo → **Publish**.
4. Le site se met à jour tout seul en quelques secondes.
