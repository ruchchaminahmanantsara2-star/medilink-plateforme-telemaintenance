const express = require('express');
const db = require('../db');
const { getIo } = require('../io');

const router = express.Router();

router.get('/', (req, res) => {
  const interventions = db
    .prepare(
      `SELECT iv.*, i.description AS incident_description, u.nom AS technicien_nom
       FROM interventions iv
       JOIN incidents i ON i.id = iv.incident_id
       JOIN utilisateurs u ON u.id = iv.technicien_id
       ORDER BY iv.date_debut DESC`
    )
    .all();
  res.json(interventions);
});

router.post('/', (req, res) => {
  const { incident_id, technicien_id } = req.body;
  if (!incident_id || !technicien_id) {
    return res.status(400).json({ erreur: 'Champs requis manquants' });
  }
  const info = db
    .prepare('INSERT INTO interventions (incident_id, technicien_id, statut) VALUES (?,?,?)')
    .run(incident_id, technicien_id, 'planifiee');

  db.prepare("UPDATE incidents SET statut = 'en_intervention' WHERE id = ?").run(incident_id);

  getIo().emit('intervention:nouvelle', { id: info.lastInsertRowid, incident_id, technicien_id });

  res.status(201).json({ id: info.lastInsertRowid });
});

router.patch('/:id', (req, res) => {
  const { statut, rapport } = req.body;
  const intervention = db.prepare('SELECT * FROM interventions WHERE id = ?').get(req.params.id);
  if (!intervention) return res.status(404).json({ erreur: 'Intervention introuvable' });

  const dateFin = statut === 'terminee' || statut === 'validee' ? new Date().toISOString() : intervention.date_fin;

  db.prepare('UPDATE interventions SET statut = ?, rapport = ?, date_fin = ? WHERE id = ?').run(
    statut || intervention.statut,
    rapport ?? intervention.rapport,
    dateFin,
    req.params.id
  );

  if (statut === 'validee') {
    db.prepare("UPDATE incidents SET statut = 'resolu' WHERE id = ?").run(intervention.incident_id);
    const incident = db.prepare('SELECT equipement_id FROM incidents WHERE id = ?').get(intervention.incident_id);
    db.prepare("UPDATE equipements SET statut = 'operationnel' WHERE id = ?").run(incident.equipement_id);
  }

  getIo().emit('intervention:maj', { id: Number(req.params.id), statut, incident_id: intervention.incident_id });

  res.json({ ok: true });
});

module.exports = router;
