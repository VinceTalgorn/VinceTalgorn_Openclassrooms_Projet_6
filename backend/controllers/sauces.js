//On récupère le modèle Sauce
const Sauce = require("../models/Sauce");
/* On récupère le module fs (files system) qui permet. Il nous donne accès aux 
fonctions qui nous permettent de modifier le système de fichiers, y compris 
aux fonctions permettant de supprimer les fichiers. */
const fs = require("fs");

// Création d'une nouvelle sauce.
exports.createSauce = (req, res, next) => {
    //On stocke les données envoyées par le front-end
    const sauceObject = JSON.parse(req.body.sauce);
    //On va delete l'id généré automatiquement par MongoDB
    delete sauceObject._id;
    //Création de la nouvelle instance Sauce
    const sauce = new Sauce({
        ...sauceObject,
        //On va venier modifier l'URL de l'image
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
            req.file.filename
        }`,
        //Initialisation des compteurs de like/dislike
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
    });
    //Save de la sauce dans la BDD
    sauce
        .save()
        //Lorsque tout est ok on envoie un status 201
        .then(() => res.status(201).json({ message: "Sauce enregistrée !" }))
        //Sinon on renvoie un ereeur 400
        .catch((error) => res.status(400).json({ error }));
};

// Modification d'une sauce.
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file
        ? {
              ...JSON.parse(req.body.sauce),
              imageUrl: `${req.protocol}://${req.get("host")}/images/${
                  req.file.filename
              }`,
          }
        : { ...req.body };
    //On utiilise la méthode updateOne pour modifier la sauce
    Sauce.updateOne(
        //On va utiliser les objets de comparaisons pour savoir quelles auces on modifie
        { _id: req.params.id },
        //Ici se trouve la nouvelle version de l'objet
        { ...sauceObject, _id: req.params.id }
    ) //Si tout est OK on renvoie un statue 200
        .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
        //Sinon on envoie une ereeur statue 400
        .catch((error) => res.status(400).json({ error }));
};

// Suppression d'une sauce.
exports.deleteSauce = (req, res, next) => {
    /* On utilise la méthode findOne pour trouver la sauce que 
    l'on veut supprimer grâce à l'ID */
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            //On récupère l'URL de la sauce
            const filename = sauce.imageUrl.split("/images/")[1];
            fs.unlink(`images/${filename}`, () => {
                // On utilise la méthode deleteOne pour supprimer la sauce que grâce à l'ID
                Sauce.deleteOne({ _id: req.params.id })
                    //Si tout est OK alors on retourne un statue 200
                    .then(() =>
                        res.status(200).json({ message: "Sauce supprimée !" })
                    )
                    //Sinon on retourne un statue 400
                    .catch((error) => res.status(400).json({ error }));
            });
        })
        //On retourne un erreur serveur 500 si l'on ne trouve pas la sauce avec l'ID
        .catch((error) => res.status(500).json({ error }));
};

// Afficher une sauce.
exports.getOneSauce = (req, res, next) => {
    //On va venir chercher la sauce que l'on veut grâce à la méthode findOne et l'ID
    Sauce.findOne({ _id: req.params.id })
        //Si tout est OK on retourne un statue 200
        .then((sauce) => res.status(200).json(sauce))
        //Sinon on retoune un statue 404
        .catch((error) => res.status(404).json({ error }));
};

// Afficher la liste des sauces.
exports.getAllSauces = (req, res, next) => {
    // On utilise la méthode find pour obtenir la liste complète des sauces
    Sauce.find()
        //Si tout est OK on retoune un tatue 200
        .then((sauces) => res.status(200).json(sauces))
        //Sinon on retourne une erreur statue 400
        .catch((error) => res.status(400).json({ error }));
};

// Gestion de la notation des sauces.
exports.userNotation = (req, res, next) => {
    // Appréciation like.
    if (req.body.like === 1) {
        //On va venir mettre à jour grâce à la méthode updateOne
        Sauce.updateOne(
            //On vient regarder l'ID
            { _id: req.params.id },
            {
                //On push le +1 like
                $push: { usersLiked: req.body.userId },
                $inc: { likes: +1 },
            }
        )
            //Si tout est OK alors satue 200
            .then(() => res.status(200).json({ message: "Like envoyé !" }))
            //Sinon erreur statue 400
            .catch((error) => res.status(400).json({ error }));
    }
    // Appréciation dislike.
    if (req.body.like === -1) {
        //On va venir mettre à jour grâce à la méthode updateOne
        Sauce.updateOne(
            //On vient regarder l'ID
            { _id: req.params.id },
            {
                //On push le +1 dislike
                $push: { usersDisliked: req.body.userId },
                $inc: { dislikes: +1 },
            }
        )
            //Si tout est OK alors satue 200
            .then(() => res.status(200).json({ message: "Dislike envoyé !" }))
            //Sinon erreur statue 400
            .catch((error) => res.status(400).json({ error }));
    }
    // Retrait des like et dslike.
    if (req.body.like === 0) {
        //On va venir chercher la sauce avec findOne et l'ID
        Sauce.findOne({ _id: req.params.id })
            .then((sauce) => {
                // Si la personne à déja llike la sauce alors cela enlève son like
                if (sauce.usersLiked.includes(req.body.userId)) {
                    //On va venir mettre à jour grâce à la méthode updateOne
                    Sauce.updateOne(
                        { _id: req.params.id },
                        {
                            //On push le -1 like pour l'enlever
                            $pull: { usersLiked: req.body.userId },
                            $inc: { likes: -1 },
                        }
                    )
                        //Si tout est OK alors satue 200
                        .then(() =>
                            res.status(200).json({ message: "Like annulé !" })
                        )
                        //Sinon erreur statue 400
                        .catch((error) => res.status(400).json({ error }));
                }
                // Si la personne à déja llike la sauce alors cela enlève son dislike
                if (sauce.usersDisliked.includes(req.body.userId)) {
                    //On va venir mettre à jour grâce à la méthode updateOne
                    Sauce.updateOne(
                        { _id: req.params.id },
                        {
                            //On push le -1 like pour l'enlever
                            $pull: { usersDisliked: req.body.userId },
                            $inc: { dislikes: -1 },
                        }
                    )
                        //Si tout est OK alors satue 200
                        .then(() =>
                            res
                                .status(200)
                                .json({ message: "Dislike annulé !" })
                        )
                        //Sinon erreur statue 400
                        .catch((error) => res.status(400).json({ error }));
                }
            })
            //Si on ne trouve pas la sauce dans la BDD avec l'ID alors erreur statue 404
            .catch((error) => res.status(404).json({ error }));
    }
};
