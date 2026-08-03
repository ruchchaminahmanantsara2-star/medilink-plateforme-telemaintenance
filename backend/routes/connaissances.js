const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/', (req, res) => {
  const articles = db
    .prepare(
      `SELECT a.*, u.nom AS auteur
       FROM articles_connaissance a
       JOIN utilisateurs u ON u.id = a.utilisateur_id
       ORDER BY a.date_creation DESC`
    )
    .all();
  res.json(articles);
});

router.post('/', (req, res) => {
  const { utilisateur_id, titre, contenu } = req.body;
  if (!utilisateur_id || !titre || !contenu) {
    return res.status(400).json({ erreur: 'Champs requis manquants' });
  }
  const info = db
    .prepare('INSERT INTO articles_connaissance (utilisateur_id, titre, contenu) VALUES (?,?,?)')
    .run(utilisateur_id, titre, contenu);
  res.status(201).json({ id: info.lastInsertRowid });
});

module.exports = router;
