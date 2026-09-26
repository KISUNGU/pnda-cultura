# PNDA-Cultura — Intégration API Claude (IA)

## Architecture recommandée

```
Navigateur (app.js)
      │
      ▼
Proxy backend (Supabase Edge Function / Cloudflare Worker)
      │
      ▼
API Anthropic (claude-sonnet-4-6)
```

> ⚠️ Ne jamais exposer la clé API dans le code frontend en production.

---

## Mode développement (direct)

Pour tester rapidement, `app.js` permet un appel direct avec la clé stockée dans `localStorage`.

```js
localStorage.setItem('pnda_api_key', 'sk-ant-...');
```

Activer via : **Paramètres → Clé API** dans l'application.

---

## Proxy Supabase Edge Function (recommandé)

### 1. Créer la fonction Edge

```typescript
// supabase/functions/ask-ai/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

serve(async (req) => {
  const { prompt, context } = await req.json();

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': Deno.env.get('ANTHROPIC_API_KEY')!,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 800,
      system: `Tu es un conseiller agricole expert pour l'Afrique centrale.
Réponds en français, de façon concise et pratique.`,
      messages: [{ role: 'user', content: `${context}\n\n${prompt}` }]
    })
  });

  const data = await res.json();
  return new Response(JSON.stringify({
    answer: data.content?.[0]?.text || ''
  }), {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
  });
});
```

### 2. Déployer

```bash
supabase functions deploy ask-ai
supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
```

### 3. Appel depuis app.js

```js
const res = await fetch('https://<projet>.supabase.co/functions/v1/ask-ai', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ prompt, context: 'Ferme Kalonji, Kasaï, RDC' })
});
const { answer } = await res.json();
```

---

## Prompts système par module

| Module | Contexte injecté |
|---|---|
| Parcelles | Stade de culture, surface, sol, météo locale |
| Élevage | Espèces, effectif, alertes santé en cours |
| Finances | Revenus, dépenses, bénéfice du mois |
| Marché | Prix actuels, stock disponible, acheteurs |
| Météo | Prévisions 7 jours, cultures concernées |
| Sol | Résultats analyse (pH, NPK, MO) |
| Crédit | Montant, taux, revenus, objet |
| Pisciculture | Espèces, qualité eau, stade cycle |

---

## Limites et bonnes pratiques

- **max_tokens: 800** — réponses courtes et actionnables
- **Langue** : toujours `fr` dans le system prompt
- **Contexte ferme** : injecter les données réelles de la ferme dans chaque prompt
- **Rate limiting** : 1 appel IA max par 10 secondes côté client
- **Cache** : mettre en cache les réponses génériques (prix marché, météo) 1h
