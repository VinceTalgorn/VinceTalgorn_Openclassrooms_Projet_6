//On utilise bcrypt afin de hacher le mot de passe saisie par l'utilisateur
const bcrypt = require("bcrypt");
//On récupère le model User, créer dans les models
const User = require("../models/User");
//On utilise jsonwebtoken pour attribuer un token à un utilisateur lors de la connexion
const jwt = require("jsonwebtoken");

//------------------------------------------------------------------------
// Création du Signup
//------------------------------------------------------------------------

//On sauvegarde un nouvel utilisateur
exports.signup = (req, res, next) => {
    //On va crypter le mdp
    bcrypt
        .hash(req.body.password, 10)
        .then((hash) => {
            //Appel du model mongoose pour créer le nouvel utilisateur
            const user = new User({
                //On passe le mail dans le corps de la requête
                email: req.body.email,
                //On récupère le mdp crypté
                password: hash,
            });
            //On enregistre le nouvel utilisateur dans la base de données
            user.save()
                .then(() =>
                    res.status(201).json({ message: "Utilisateur créé !" })
                )
                //Retourne une erreur si l'utilisateur existe déjà
                .catch((error) => res.status(400).json({ error }));
        })
        .catch((error) => res.status(500).json({ error }));
};

//------------------------------------------------------------------------
// Création du Login
//------------------------------------------------------------------------

//On va rechecher dans la base MongoDB si l'utilisateur existe et si ira voir si son mdp est correct
exports.login = (req, res, next) => {
    //On recherche l'utilisateur dans la BDD MongoDB par son email
    User.findOne({ email: req.body.email })
        .then((user) => {
            //Si on ne le trouve pas alors on retournera une erreur 401
            if (!user) {
                return res
                    .status(401)
                    .json({ error: "Utilisateur non trouvé !" });
            }
            //On va comparer les mdp hash pour voir s'ils ont le même string d'origine
            bcrypt
                .compare(req.body.password, user.password)
                .then((valid) => {
                    //Si ce n'est pas le cas alors l'utilisateur ou le mdp est incorrect
                    if (!valid) {
                        return res
                            .status(401)
                            .json({ error: "Mot de passe incorrect !" });
                    }
                    //Si c'est correct alors on envoie un statu 200 avec un user et un token
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            //Encodage de l'user dans le cas où il pourra être le seul à modifier son article
                            "RANDOM_TOKEN_SECRET",
                            //Expiration de 24h
                            { expiresIn: "24h" }
                        ),
                    });
                })
                .catch((error) => res.status(500).json({ error }));
        })
        .catch((error) => res.status(500).json({ error }));
};
