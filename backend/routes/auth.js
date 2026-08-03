const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { JWT_SECRET } = require('../config');

const router = express.Router();

router.post('/login', (req, res) => {
  const { email, mot_de_passe } = req.body;

  const user = db.prepare('SELECT * FROM utilisateurs WHERE email = ?').get(email);
  if (!user) {
    return res.status(401).json({ erreur: 'Identifiants incorrects' });
  }

  const motDePasseValide = bcrypt.compareSync(mot_de_passe, user.mot_de_passe);
  if (!motDePasseValide) {
    return res.status(401).json({ erreur: 'Identifiants incorrects' });
  }

  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '8h' });

  res.json({
    token,
    utilisateur: { id: user.id, nom: user.nom, email: user.email, role: user.role },
  });
});

// Utilisée uniquement pour peupler la liste déroulante de connexion de la démo
// (ne renvoie jamais les mots de passe, même hachés)
router.get('/utilisateurs', (req, res) => {
  const utilisateurs = db.prepare('SELECT id, nom, email, role FROM utilisateurs').all();
  res.json(utilisateurs);
});

module.exports = router;
