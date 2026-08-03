const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

function verifierAuthentification(req, res, next) {
  const entete = req.headers.authorization;
  if (!entete || !entete.startsWith('Bearer ')) {
    return res.status(401).json({ erreur: 'Authentification requise' });
  }

  const token = entete.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.utilisateur = payload; // { id, role }
    next();
  } catch (erreur) {
    return res.status(401).json({ erreur: 'Session expirée ou invalide, merci de vous reconnecter' });
  }
}

module.exports = verifierAuthentification;
