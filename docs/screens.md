# PNDA-Cultura — Description des écrans

## Navigation principale

La navigation est assurée par une barre inférieure (bottom nav) présente sur tous les écrans :
- 🏠 **Accueil** — Tableau de bord
- 🌾 **Cultures** — Parcelles et élevage
- 💰 **Finances** — Ventes et comptabilité
- 📈 **Marché** — Prix et acheteurs
- 👥 **Forum** — Communauté

---

## Écrans — Liste complète

### `s-home` — Tableau de bord
- Salutation personnalisée + date
- Statistiques : surface totale, revenu du mois, alertes
- Alertes urgentes (vaccination, météo, stocks)
- Grille de 12 modules accessibles
- Graphique revenus sur 6 mois
- Conseil IA du jour

### `s-parcelles` — Mes Parcelles
- Vue récapitulative (surface totale, récolte estimée)
- Carte par parcelle : culture, localisation, stade, humidité, progression
- Accès : calendrier des semis, historique traitements
- Bouton IA : analyse globale des parcelles

### `s-parcelle-detail` — Détail d'une parcelle
- Métriques temps réel : humidité sol, pH, température sol
- Historique des interventions (engrais, irrigation, traitements)
- Prévision de rendement + valeur estimée à la récolte
- Formulaire : enregistrer une nouvelle intervention
- Bouton IA : diagnostic complet

### `s-elevage` — Élevage
- Vue troupeau : bovins, chèvres, volailles
- Alertes santé (vaccination, gestation, déparasitage)
- Indicateurs : poids moyen, production lait, production œufs
- Liens : registre sanitaire, alimentation, reproduction, courbe de croissance
- Bouton IA : plan vétérinaire

### `s-meteo` — Météo Agricole
- Conditions actuelles (temp, humidité, vent)
- Prévisions 7 jours avec précipitations
- Impact agricole personnalisé (érosion, irrigation, semis)
- Bouton IA : plan d'action avant événement météo

### `s-stocks` — Stocks & Intrants
**Onglet Intrants :** engrais, pesticides, vaccins avec niveaux de stock et alertes
**Onglet Récoltes stockées :** inventaire avec dates de péremption
**Onglet Matériel :** équipements et état de maintenance
- Bouton IA : calcul des besoins en intrants

### `s-finances` — Finances
- Résumé : revenus, dépenses, bénéfice net du mois
- Compte de résultat détaillé (P&L)
- Graphique revenus 6 mois
- Actions : enregistrer vente / dépense, simuler crédit
- Bouton IA : analyse de rentabilité

### `s-nouvelle-vente` — Enregistrer une vente
- Produit, quantité, prix unitaire, acheteur, date, mode de paiement
- Calcul automatique du montant total
- Notes libres

### `s-marche` — Prix du Marché
**Onglet Prix live :** grille de prix par produit avec tendances
**Onglet Acheteurs :** carnet de contacts avec fiabilité
**Onglet Tendances :** graphique historique des prix
- Bouton IA : analyse marché et timing de vente

### `s-journal` — Journal de Terrain
- Liste chronologique des entrées (observation, traitement, récolte…)
- Chaque entrée : date, titre, description, tags
- Bouton : nouvelle entrée

### `s-newjournal` — Nouvelle entrée journal
- Titre, date, heure, parcelle/lieu, type d'activité
- Description détaillée
- Option : ajouter une photo

### `s-taches` — Tâches & Planning
- Tâches du jour (cochables)
- Tâches de demain
- Tâches de la semaine
- Badges de priorité (urgent, important, planifié)
- Bouton IA : optimisation du planning

### `s-sol` — Analyse de Sol
- Jauges : pH, matière organique, argile
- Niveaux NPK avec évaluation (bon / moyen / faible)
- Alertes de carence
- Recommandations de fertilisation par culture
- Bouton IA : plan de fertilisation

### `s-credit` — Calculateur de Crédit
- Inputs : montant, taux, durée, revenus
- Résultats : mensualité, total remboursé, intérêts, ratio mensualité/revenus
- Alerte si ratio > 33% (risque de surendettement)
- Objet du crédit (orientation conseils IA)
- Bouton IA : trouver institutions de microfinance

### `s-pisciculture` — Pisciculture
- Vue deux bassins (Tilapia, Poisson-chat)
- Indicateurs qualité eau : pH, O₂, température
- Suivi poids moyen et progression du cycle
- Bouton IA : optimisation croissance

### `s-comm` — Communauté
**Onglet Forum :** posts avec auteur, région, tags, réponses, likes
**Onglet Vidéos :** liste de vidéos conseils
**Onglet Challenges :** classement challenge mensuel
- Bouton IA : répondre aux questions du forum

### `s-notif` — Notifications
- Liste des alertes actives avec niveaux (urgent / important / info)
- Groupées par type (santé, météo, stock, commerce, forum)

### `s-settings` — Paramètres
- Saisie et sauvegarde de la clé API Claude
- Profil de la ferme
- Préférences de notification
