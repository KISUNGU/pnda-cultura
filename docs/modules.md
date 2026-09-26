# PNDA-Cultura — Spécifications fonctionnelles des modules

## Architecture fonctionnelle

```
PNDA-Cultura
├── Gestion des cultures
│   ├── Parcelles (suivi, stades, rendements)
│   ├── Calendrier semis & récoltes
│   ├── Historique interventions
│   └── Analyse de sol
├── Gestion de l'élevage
│   ├── Troupeau (bovins, caprins, volailles)
│   ├── Registre sanitaire
│   ├── Alimentation & reproduction
│   └── Pisciculture (bassins)
├── Gestion des ressources
│   ├── Stocks & intrants (engrais, pesticides, vaccins)
│   ├── Matériel agricole
│   └── Récoltes stockées
├── Gestion économique
│   ├── Comptabilité (P&L mensuel)
│   ├── Carnet de ventes
│   ├── Prix du marché live
│   ├── Acheteurs & contacts
│   └── Calculateur de crédit
├── Planification & suivi terrain
│   ├── Journal de terrain
│   ├── Tâches & planning
│   ├── Météo agricole (prévisions + impact)
│   └── Alertes intelligentes
└── Communauté
    ├── Forum agriculteurs
    ├── Vidéos conseils
    └── Challenges agricoles
```

## Données par module

### Parcelle
```json
{
  "id": "A1",
  "nom": "Champ Nord",
  "surface_ha": 2.0,
  "culture": "Maïs",
  "date_plantation": "2026-03-15",
  "stade": "Floraison",
  "cycle_pct": 72,
  "humidite_sol": 68,
  "ph_sol": 6.2,
  "rendement_estime_t_ha": 3.2,
  "interventions": []
}
```

### Animal
```json
{
  "id": "BOV-001",
  "espece": "Bovin",
  "race": "Locale",
  "naissance": "2023-04-10",
  "poids_kg": 285,
  "vaccinations": [],
  "sante": "normale"
}
```

### Vente
```json
{
  "id": 1746441600000,
  "produit": "Maïs",
  "quantite": 50,
  "unite": "kg",
  "prix_unitaire": 350,
  "montant_total": 17500,
  "acheteur": "Mutombo Trading",
  "date": "2026-05-05",
  "paiement": "Espèces"
}
```

## Futures intégrations

- **Supabase** : stockage cloud, authentification, temps réel
- **API météo** : Open-Meteo (gratuit, couverture Afrique)
- **Prix marché** : scraping hebdomadaire des bulletins SENASEM/MINAGRI
- **SMS** : Twilio ou Africa's Talking pour alertes sans internet
- **Maps** : Leaflet.js + OpenStreetMap pour géolocalisation des parcelles
- **OCR** : Analyse photos pour détection de maladies des cultures
