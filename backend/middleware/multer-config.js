//On  importe multer qui va nous permettre de gérer les fichiers entrants (image)
const multer = require("multer");

// Gestion du nom, format, et chemin de stockage des images.
const MIME_TYPES = {
    "image/jpg": "jpg",
    "image/jpeg": "jpg",
    "image/png": "png",
};

/* On crée un objet de configuration pour préciser à multer 
où enregistrer les fichiers images et les renommer */
const storage = multer.diskStorage({
    //On met la destination d'enregistrement des images
    destination: (req, file, callback) => {
        //Dans le dossier images du backends précédemment créé
        callback(null, "images");
    },
    //On indique à multer le nom pour éviter les doublons
    filename: (req, file, callback) => {
        /* On génère un nouveau nom d'origine, on remplace les espaces
        par des underscores */
        const name = file.originalname.split(" ").join("_");
        const extension = MIME_TYPES[file.mimetype];
        //On génère le nom complet de l'image (nom orgine + num unique + . + extension)
        callback(null, name + Date.now() + "." + extension);
    },
});
//On export le module multer en indiquant que l'image est un fichier unique
module.exports = multer({ storage: storage }).single("image");
