const Utilisateur = require("../models/utilisateur");
const jwt = require('jsonwebtoken');// securise les echanges de token
const bcrypt = require('bcrypt');

// post
//cree utilisateur (chiffre mot de passe)
exports.signupUser= (req, res, next) => { 
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {      
      const user = new Utilisateur({
        email: req.body.email,
        password: hash,
      });
      user.save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
//connection utilisateur
exports.loginUser= (req, res, next) => {
  // console.log(req.body);
  Utilisateur.findOne({ email: req.body.email })
  .then(user => {
    if (!user) {
      return res.status(401).json({ error: 'Utilisateur non trouvé !' });
    }
    bcrypt.compare(req.body.password, user.password)
      .then(valid => {
        if (!valid) {
          return res.status(401).json({ error: 'Mot de passe incorrect !' });
        }
        res.status(200).json({
          userId: user._id,
          token: jwt.sign(
            { userId: user._id },
            'RANDOM_TOKEN_SECRET',
            { expiresIn: '24h' }
          )
        });
      })
      .catch(error => res.status(500).json({ error }));
  })
  .catch(error => res.status(500).json({ error }));
};
