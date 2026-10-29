import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Une fiche par activité (éditable dans l'admin)
const activites = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/activites' }),
  schema: z.object({
    titre: z.string(),
    icone: z.string().default('ti-activity'),
    resume: z.string(),
    jours: z.string().optional(),
    horaires: z.string().optional(),
    lieu: z.string().optional(),
    responsables: z.array(z.object({ nom: z.string(), tel: z.string().optional() })).optional(),
    animateurs: z.array(z.object({ nom: z.string(), tel: z.string().optional() })).optional(),
    calendriers: z.array(z.object({ titre: z.string(), fichier: z.string().optional() })).optional(),
    // Danse : chorégraphies par cours, affichées sur une sous-page /activites/<slug>/choregraphies
    choregraphies: z
      .array(
        z.object({
          cours: z.string(),
          danses: z.array(z.object({ titre: z.string(), video: z.string().optional() })).optional(),
        })
      )
      .optional(),
    photos: z.array(z.object({ image: z.string(), legende: z.string().optional() })).optional(),
  }),
});

// Une actualité « Flash Infos »
const actus = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/actus' }),
  schema: z.object({
    titre: z.string(),
    date: z.coerce.date(),
    photos: z
      .array(
        z.object({
          image: z.string(),
          legende: z.string().optional(),
          position: z.string().optional(),
          couverture: z.boolean().optional(),
        })
      )
      .optional(),
    resume: z.string().optional(),
  }),
});

export const collections = { activites, actus };
