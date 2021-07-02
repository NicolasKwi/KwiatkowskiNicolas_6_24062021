//models mongoose
const Sauce = require("../models/sauce");
//gestion des fichier 
const fs = require("fs");
//post
// cree une sauce
exports.creeSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  });
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Sauce enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
};

//met a jour le status j'aime de l'utilisateur sur une sauce
exports.updateLikeSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      //permet de stocker les index correspondant au uesrid dans les tableaux des like/dislike
      let indexUserLike = sauce.usersLiked.indexOf(req.body.userId);
      let indexUserDislike = sauce.usersDisliked.indexOf(req.body.userId);
      let messageRes = "";

      switch (req.body.like) {
        case 0: //annule les j'aime/j'aime pas
          //si dans tableau alors supprime
          if (indexUserLike > -1) {
            sauce.usersLiked.splice(indexUserLike, 1);
            sauce.likes -= 1;
            messageRes = "J'aime enlevé";
          }
          if (indexUserDislike > -1) {
            sauce.usersDisliked.splice(indexUserDislike, 1);
            sauce.dislikes -= 1;
            messageRes = "Je n'aime pas enlevé";
          }
          break;
        case 1: //j'aime
          //enleve si dans dislike
          if (indexUserDislike > -1) {
            sauce.usersDisliked.splice(indexUserDislike, 1);
            sauce.dislikes -= 1;
          }
          //ajoute si userid dans usersLiked n'existe pas
          if ((indexUserLike = -1)) {
            sauce.usersLiked.push(req.body.userId);
            sauce.likes += 1;
            messageRes = "J'aime enregistré";
          }
          break;
        case -1: //j'aime pas
          //enleve si dans like
          if (indexUserLike > -1) {
            sauce.indexUserLike.splice(indexUserLike, 1);
            sauce.likes -= 1;
          }
          //ajoute si userid dans usersDisliked n'existe pas
          if ((indexUserLike = -1)) {
            sauce.usersDisliked.push(req.body.userId);
            sauce.dislikes += 1;
            messageRes = "Je n'aime pas enregistré";
          }
          break;
        default:
          throw "Valeur de like/dislike erroné ";
      }
      sauce.save();
      res.status(200).json(messageRes);
    })
    .catch((error) => res.status(400).json({ error }));
};

//put
// met à jour une sauce
exports.ModifySauce = (req, res, next) => {
  let sauceObject = {};

  if (req.file) {
     // supprime l'ancienne image
    Sauce.findOne({ _id: req.params.id }).then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlinkSync(`images/${filename}`); //suppression synchrone
    });
    sauceObject = {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get("host")}/images/${
        req.file.filename
      }`,
    };   
  } else {
    sauceObject = { ...req.body };   
  }

  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: "Sauce modifié !" }))
    .catch((error) => res.status(400).json({ error }));
};

//delete
//supprime une sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Sauce supprimé !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

//get
//renvoie toutes les sauces
exports.getAllSauce = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};
//renvoie la sauces avec l'id
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};
