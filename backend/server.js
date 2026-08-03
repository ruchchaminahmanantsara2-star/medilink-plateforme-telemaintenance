const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const db = require('./db');
const { setIo } = require('./io');

const authRoutes = require('./routes/auth');
const equipementsRoutes = require('./routes/equipements');
const incidentsRoutes = require('./routes/incidents');
const interventionsRoutes = require('./routes/interventions');
const connaissancesRoutes = require('./routes/connaissances');
const verifierAuthentification = require('./middleware/auth');

const app = express();
app.use(cors());
app.use(express.json());

// /api/auth reste public (connexion + liste des comptes de démo)
app.use('/api/auth', authRoutes);

// Toutes les routes suivantes exigent un token JWT valide
app.use('/api/equipements', verifierAuthentification, equipementsRoutes);
app.use('/api/incidents', verifierAuthentification, incidentsRoutes);
app.use('/api/interventions', verifierAuthentification, interventionsRoutes);
app.use('/api/connaissances', verifierAuthentification, connaissancesRoutes);

// Indicateurs simples pour le tableau de bord
app.get('/api/dashboard', verifierAuthentification, (req, res) => {
  const totalEquipements = db.prepare('SELECT COUNT(*) AS n FROM equipements').get().n;
  const equipementsEnPanne = db
    .prepare("SELECT COUNT(*) AS n FROM equipements WHERE statut = 'en_panne'")
    .get().n;
  const incidentsOuverts = db
    .prepare("SELECT COUNT(*) AS n FROM incidents WHERE statut != 'resolu'")
    .get().n;
  const interventionsEnCours = db
    .prepare("SELECT COUNT(*) AS n FROM interventions WHERE statut IN ('planifiee','en_cours')")
    .get().n;

  res.json({ totalEquipements, equipementsEnPanne, incidentsOuverts, interventionsEnCours });
});

const PORT = process.env.PORT || 3001;

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });
setIo(io);

io.on('connection', (socket) => {
  console.log('Client connecté aux notifications en temps réel:', socket.id);
});

server.listen(PORT, () => {
  console.log(`API de la plateforme de télémaintenance démarrée sur http://localhost:${PORT}`);
});
