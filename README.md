# 🌿 PNDA-Cultura — Application Agricole Intelligente

> Application mobile-first de gestion agricole intégrée pour les fermiers d'Afrique centrale.  
> Développée dans le cadre du **Programme National de Développement Agricole (PNDA)**.

---

## 📱 Aperçu

PNDA-Cultura aide les agriculteurs à gérer l'ensemble de leurs activités depuis un smartphone :
cultures, élevage, pisciculture, stocks, finances, météo et accès au marché.

### Modules disponibles

| Module | Description |
|---|---|
| 🌾 **Parcelles** | Suivi des cultures par parcelle, stades, rendements estimés |
| 🐄 **Élevage** | Troupeau, santé animale, alimentation, reproduction |
| 🐟 **Pisciculture** | Bassins, qualité de l'eau, croissance des poissons |
| 📦 **Stocks & Intrants** | Engrais, produits phytosanitaires, matériel, récoltes stockées |
| 💰 **Finances** | Comptabilité agricole, ventes, dépenses, compte de résultat |
| 📈 **Marché** | Prix live, acheteurs, tendances, timing de vente |
| 🌤️ **Météo agricole** | Prévisions 7 jours avec impact sur les cultures |
| 📓 **Journal de terrain** | Historique des interventions et observations |
| ✅ **Tâches** | Planning journalier et hebdomadaire |
| 🪱 **Analyse de sol** | Résultats NPK, pH, recommandations de fertilisation |
| 🏦 **Crédit agricole** | Calculateur de prêt, institutions de microfinance |
| 👥 **Communauté** | Forum, vidéos conseils, challenges agricoles |

### Fonctionnalités transversales

- 🤖 **Conseils IA intégrés** — chaque module dispose d'un accès direct à Claude (Anthropic)
- 🔔 **Alertes intelligentes** — météo, santé animale, stocks critiques, échéances
- 📊 **Tableaux de bord** — revenus, dépenses, bénéfice net avec graphiques
- 📱 **Mobile-first** — conçu pour smartphones avec connectivité limitée

---

## 🗂️ Structure du projet

```
pnda-cultura/
├── index.html              ← Application principale (single-page)
├── README.md
├── .gitignore
├── assets/
│   ├── css/
│   │   └── app.css         ← Styles globaux (variables, reset, composants)
│   └── js/
│       └── app.js          ← Logique navigation, calculs, interactions
└── docs/
    ├── screens.md          ← Description détaillée de chaque écran
    ├── modules.md          ← Spécifications fonctionnelles des modules
    └── api-ia.md           ← Documentation intégration API Claude (Anthropic)
```

---

## 🚀 Démarrage rapide

### Lancer localement

```bash
# Cloner le dépôt
git clone https://github.com/KISUNGU/pnda-cultura.git
cd pnda-cultura

# Ouvrir directement dans le navigateur (aucune dépendance)
open index.html
# ou
python3 -m http.server 8080
# → http://localhost:8080
```

### Aucune dépendance requise

L'application fonctionne en HTML/CSS/JS pur — aucun build, aucun `npm install`.

---

## 🔌 Intégration API Claude (IA)

Les boutons "Conseils IA" utilisent l'API Anthropic directement depuis le navigateur.

```js
// Exemple d'appel dans app.js
const response = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    model: "claude-sonnet-4-6",
    max_tokens: 1000,
    messages: [{ role: "user", content: prompt }]
  })
});
```

> ⚠️ En production, ne jamais exposer la clé API côté client.  
> Utiliser un proxy backend (Node.js, Supabase Edge Function, etc.)

---

## 🗺️ Feuille de route

### v1.0 — HTML statique (actuel)
- [x] Interface mobile complète (12 modules)
- [x] Navigation fluide entre les écrans
- [x] Calculs financiers (crédit, P&L)
- [x] Intégration IA via boutons de conseil

### v1.1 — Données persistantes
- [ ] Stockage local (localStorage / IndexedDB)
- [ ] Synchronisation Supabase (PostgreSQL)
- [ ] Mode hors-ligne (PWA / Service Worker)

### v2.0 — Application native
- [ ] Migration React Native ou Flutter
- [ ] Géolocalisation des parcelles (carte)
- [ ] Photos terrain (identification maladies IA)
- [ ] SMS/USSD pour zones sans internet

---

## 👨‍💻 Développement

**Développeur principal :** Yves Kisungu Kutungumuka  
**Contexte :** Kinshasa, RDC — PNDA / Automatisation & IA  
**Contact :** GitHub [@KISUNGU](https://github.com/KISUNGU)

---

## 📄 Licence

MIT License — voir `LICENSE` pour les détails.
