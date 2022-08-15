//Importation express
const express = require("express");
//Importation mongoose
const mongoose = require("mongoose");

const path = require("path");
// On importe la route dédiée aux utilisateurs
const userRoutes = require("./routes/user");
const saucesRoutes = require("./routes/sauces");

//Connexion avec MongoDB
mongoose
    .connect(
        //On inseet notreuser + mdp
        "mongodb+srv://Vincent_Talgorn:Projet6opc@projetopenclassrooms6.tihiavq.mongodb.net/?retryWrites=true&w=majority",
        { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(() => console.log("Connexion à MongoDB réussie !"))
    .catch(() => console.log("Connexion à MongoDB échouée !"));

//Création application express
const app = express();

/* Pour éviter les erreurs de CORS, ce code permet d'accéder à notre API depuis n'importe quelle origine '*',
d'ajouter des headers pour pouvoir requêtés vers notre API et d'envoyér des requêtes GET,POST ...*/
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    next();
});
app.use(express.json());
/* Gestion de la ressource image de façon statique, le middleware va permettre
de charger les fichiers qui sont dans le répertoire image */
app.use("/images", express.static(path.join(__dirname, "images")));
// Va servir les routes dédiées aux utilisateurs
app.use("/api/auth", userRoutes);
app.use("/api/sauces", saucesRoutes);
//Export de l'application express
module.exports = app;
