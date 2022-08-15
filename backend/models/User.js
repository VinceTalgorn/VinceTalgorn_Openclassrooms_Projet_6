//Création de la structure pour permettre de s'identifier
const mongoose = require("mongoose");
//Permet d'avoir seulement une personne par email
const uniqueValidator = require("mongoose-unique-validator");

//On va créer le shéma de données dédié aux informations de l'utilisateur
const userSchema = mongoose.Schema({
    //Email de l'utlisateur
    email: {
        type: String,
        unique: true,
        required: true,
        //RegExp pour vérifier que le mail est correct
    },
    //Mot de passe de l'utlisateur
    password: {
        type: String,
        required: true,
    },
});

//On appel le plugin à notre schéma
userSchema.plugin(uniqueValidator);
//On export ce model
module.exports = mongoose.model("User", userSchema);
