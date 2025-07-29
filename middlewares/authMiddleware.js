// backend/middlewares/authMiddleware.js

import jwt from 'jsonwebtoken';

export const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Accès non autorisé (token manquant)' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Accès interdit' });
    }

    req.admin = decoded;
    next();
  } catch (err) {
    console.error("Erreur middleware JWT:", err);
    return res.status(401).json({ error: 'Token invalide ou expiré' });
  }
};
