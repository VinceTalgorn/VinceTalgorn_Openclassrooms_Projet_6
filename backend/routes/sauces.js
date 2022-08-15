//On appel express
const express = require("express");
//Appel du routeur mise à disposition par Express
const router = express.Router();
//On importe le middleware pour récupérer la configuration d'auth JsonWebToken
const auth = require("../middleware/auth");
//On importe le middleware pour la gestion des images (suppr img = suppr des fichiers)
const multer = require("../middleware/multer-config");
//On importe le controler des sauces
const sauceCtrl = require("../controllers/sauces");

// Routes pour la création d'un sauce.
/* On regarde l'authentification, on utilise multer pour gérer les fichiers 
entrants, on utilise le controller "exports.createSauce" */
router.post("/", auth, multer, sauceCtrl.createSauce);

// Routes pour la modification d'un sauce.
/* On regarde l'authentification, on utilise multer pour gérer les fichiers
entrants, on utilise le controller "exports.modifySauce" */
router.put("/:id", auth, multer, sauceCtrl.modifySauce);

// Routes pour la suppresison d'un sauce.
/* On regarde l'authentification, on supprimer la sauce si l'utilisateur 
est bien le créateur de l'artcile, on va supprimer l'image également 
de nos dossiers on utilise le controller "exports.deleteSauce" */
router.delete("/:id", auth, sauceCtrl.deleteSauce);

// Route qui permet d'afficher une seule sauce
/* On regarde l'authentification, on utilise le controller 
"exports.getOneSauce" */
router.get("/:id", auth, sauceCtrl.getOneSauce);

//Route qui permet d'afficher toutes les sauces
/* On regarde l'authentification, on utilise le controller 
"exports.getAllSauces" */
router.get("/", auth, sauceCtrl.getAllSauces);

//Route qui permet de gérer les likes des sauces
/* On regarde l'authentification, on utilise le controller 
"exports.userNotation" */
router.post("/:id/like", auth, sauceCtrl.userNotation);

//On export le module pour le mettre dans app.js
module.exports = router;
