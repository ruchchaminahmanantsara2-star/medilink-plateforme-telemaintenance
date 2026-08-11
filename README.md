# Plateforme-telemaintenance-biomedicale-Madagascar.

Prototype fonctionnel réalisé pour le mini-projet de soutenance DTS (technologies biomédicales).

## Architecture

- **Backend** : Node.js + Express + SQLite (module intégré `node:sqlite`, aucune dépendance native à compiler) — aucune installation de serveur de base de données séparée n'est nécessaire, tout est stocké dans un fichier `plateforme.db` créé automatiquement.
  > Un message `ExperimentalWarning: SQLite is an experimental feature` peut s'afficher au démarrage : c'est normal, sans conséquence, tu peux l'ignorer.
- **Frontend** : HTML/CSS/JavaScript natif (aucun framework, aucune étape de build) — s'ouvre directement dans le navigateur.

## Modules implémentés

- **Authentification sécurisée** : mots de passe hachés (bcryptjs) + sessions par token JWT (8h de validité), toutes les routes de l'API (hors connexion) sont protégées
- Gestion des équipements (inventaire, statut, ajout)
- Signalement des incidents
- Diagnostic à distance (fil de messages lié à chaque incident)
- Suivi des interventions (planification, rapport, clôture)
- Base de connaissances collaborative
- Tableau de bord avec indicateurs
- **Notifications en temps réel** (Socket.io) : un nouvel incident, un message de diagnostic ou une mise à jour d'intervention déclenche une notification instantanée chez tous les utilisateurs connectés, sans avoir à recharger la page
- **Visioconférence intégrée** (Jitsi Meet) : depuis le fil de diagnostic d'un incident, chaque utilisateur peut démarrer un appel vidéo en un clic — aucun compte ni serveur supplémentaire requis

## Installation (dans VS Code)

### 1. Ouvrir le dossier
Ouvre le dossier `plateforme-telemaintenance` dans VS Code (`File > Open Folder`).

### 2. Lancer le backend
Ouvre un terminal dans VS Code (`` Terminal > New Terminal ``) :
```bash
cd backend
npm install
npm start
```
Tu dois voir : `API de la plateforme de télémaintenance démarrée sur http://localhost:3001`

La base de données `plateforme.db` est créée automatiquement au premier lancement, avec des données de démonstration (2 établissements, 3 équipements, 1 incident en cours).

### 3. Lancer le frontend
Dans VS Code, installe l'extension **Live Server** (Ritwick Dey), puis :
- clic droit sur `frontend/index.html` → **Open with Live Server**

(Alternative sans extension : ouvre simplement `frontend/index.html` directement dans ton navigateur — cela fonctionne aussi tant que le backend tourne sur le port 3001.)

### 4. Se connecter
Saisis l'email d'un des comptes de démonstration ci-dessous et le mot de passe `demo123`, puis clique sur "Se connecter". La session reste active même après rechargement de la page (token conservé dans le navigateur).

## Comptes de démonstration

| Email | Rôle |
|---|---|
| rakoto@sante.mg | Personnel médical |
| andry@maintenance.mg | Technicien local |
| rasoa@expert.mg | Expert distant |
| hery@hopital.mg | Responsable hospitalier |
| admin@plateforme.mg | Administrateur |

Mot de passe pour tous les comptes : `demo123`

## Pistes d'évolution pour la suite du projet

- Mode hors-ligne pour le signalement d'incidents en zone à connectivité limitée, avec synchronisation différée
- Upload de photos/vidéos sur un incident pour faciliter le diagnostic à distance
- Auto-hébergement d'un serveur Jitsi (actuellement le prototype utilise le serveur public meet.jit.si — à éviter pour de vraies données de santé en production, un serveur dédié serait nécessaire)
- Migration vers PostgreSQL pour un déploiement en production
- Gestion des rôles plus fine (autorisations différenciées par action, ex. seul un administrateur peut créer un compte)
