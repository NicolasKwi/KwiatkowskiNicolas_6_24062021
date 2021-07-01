const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require('../middleware/multer-config');
//controlleur
const sauceCtrl = require("../controllers/sauces");

// cree une sauce
router.post("/", auth,multer, sauceCtrl.creeSauce);
//met a jour le status j'aime de l'utilisateur sur une sauce
router.post("/:id/like", auth, sauceCtrl.updateLikeSauce);

//put
// met à jour une sauce
router.put("/:id", auth,multer, sauceCtrl.ModifySauce);

//delete
//supprime une sauce
router.delete("/:id", auth, sauceCtrl.deleteSauce);

//get
//renvoie toutes les sauces
router.get("/", auth, sauceCtrl.getAllSauce);
//renvoie la sauces avec l'id
router.get("/:id", auth, sauceCtrl.getOneSauce);

module.exports = router;
