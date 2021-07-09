const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {    
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN);
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Id utilisateur invalide';
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({
      error: error | new Error('Requête non valide !')
    });
  }
};