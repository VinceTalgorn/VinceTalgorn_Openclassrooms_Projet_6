//On appel express
const express = require("express");
// On crée un router avec la méthode mise à disposition par Express
const router = express.Router();
//On associe les fonctions controllers
const userCtrl = require("../controllers/user");

//Chiffre le mdp de l'utilisateur et ajoute l'utilisateur à la BDD
router.post("/signup", userCtrl.signup);
//On vérifie les informations de l'utilisateur, on envoie les infos avec un token
router.post("/login", userCtrl.login);

module.exports = router;
