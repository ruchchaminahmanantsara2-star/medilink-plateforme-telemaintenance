const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/etablissements', (req, res) => {
  res.json(db.prepare('SELECT * FROM etablissements ORDER BY nom').all());
});

router.get('/', (req, res) => {
  const equipements = db
    .prepare(
      `SELECT e.*, et.nom AS etablissement_nom
       FROM equipements e
       JOIN etablissements et ON et.id = e.etablissement_id
       ORDER BY e.id DESC`
    )
    .all();
  res.json(equipements);
});

router.post('/', (req, res) => {
  const { etablissement_id, nom, type, numero_serie, date_acquisition } = req.body;
  if (!etablissement_id || !nom || !type || !numero_serie) {
    return res.status(400).json({ erreur: 'Champs requis manquants' });
  }
  const info = db
    .prepare(
      'INSERT INTO equipements (etablissement_id, nom, type, numero_serie, date_acquisition, statut) VALUES (?,?,?,?,?,?)'
    )
    .run(etablissement_id, nom, type, numero_serie, date_acquisition || null, 'operationnel');
  res.status(201).json({ id: info.lastInsertRowid });
});

router.patch('/:id/statut', (req, res) => {
  const { statut } = req.body;
  db.prepare('UPDATE equipements SET statut = ? WHERE id = ?').run(statut, req.params.id);
  res.json({ ok: true });
});

module.exports = router;
