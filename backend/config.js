// Clé secrète pour signer les tokens JWT.
// Pour un vrai déploiement, définir la variable d'environnement JWT_SECRET
// plutôt que d'utiliser la valeur par défaut ci-dessous.
const JWT_SECRET = process.env.JWT_SECRET || 'cle-secrete-demo-a-changer-en-production';

module.exports = { JWT_SECRET };
