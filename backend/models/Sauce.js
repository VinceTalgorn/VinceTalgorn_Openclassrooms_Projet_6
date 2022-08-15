//Importantion de mongoose
const mongoose = require("mongoose");

//On va créer le shéma de données dédié aux informations de la sauce
const sauceSchema = mongoose.Schema({
    //L'identifiant MongoDB unique de l'utilisateur qui a crée la sauce
    userId: {
        type: String,
        required: true,
    },
    //Nom de la sauce
    name: {
        type: String,
        required: true,
    },
    //Fabricant de la cause
    manufacturer: {
        type: String,
        required: true,
    },
    //Description de la sauce
    description: {
        type: String,
        required: true,
    },
    //Principal ingédient épicé de la sauce
    mainPepper: {
        type: String,
        required: true,
    },
    //Url de l'image de la sauce téléchargé par l'utilisateur
    imageUrl: {
        type: String,
        required: true,
    },
    //Nombre entre 1 et 10 décrivant la sauce
    heat: {
        type: Number,
        required: true,
    },
    //Nombre d'utilisateurs qui aiment (=like) la sauce
    likes: {
        type: Number,
    },
    //Nombre d'utilisateurs qui n'aiment pas (=dislike) la sauce
    dislikes: {
        type: Number,
    },
    //Tableau des identifiants des utilisateurs qui ont aimé (=liked) la sauce
    usersLiked: {
        type: [String],
    },
    //Tableau des identifiants des utilisateurs qui n'ont pas aimé (=disliked) la sauce
    usersDisliked: {
        type: [String],
    },
});

//On export le modèle
module.exports = mongoose.model("Sauce", sauceSchema);
