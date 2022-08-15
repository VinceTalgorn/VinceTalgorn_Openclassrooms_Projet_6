/* Question à poser, après avoir vu le cours OWASP, est-ce qu'il faut importer un package https 
à la place de http pour sécuriser les données de transit ? */

//Importer le package http
const http = require("http");

//Importation de l'application app.js
const app = require("./app");

/* la fonction normalizePort renvoie un port valide, qu'il 
soit fourni sous la forme d'un numéro ou d'une chaîne  */

const normalizePort = (val) => {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
};

//Création de notre serveur local 3000
const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

/* La fonction errorHandler echerche les différentes erreurs et les gère
de manière appropriée. Elle est ensuite enregistrée dans le serveur */

const errorHandler = (error) => {
    if (error.syscall !== "listen") {
        throw error;
    }
    const address = server.address();
    const bind =
        typeof address === "string" ? "pipe " + address : "port: " + port;
    switch (error.code) {
        case "EACCES":
            console.error(bind + " requires elevated privileges.");
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(bind + " is already in use.");
            process.exit(1);
            break;
        default:
            throw error;
    }
};

//Création du serveur qui utilise l'app express
const server = http.createServer(app);

//Gestion des erreurs
server.on("error", errorHandler);
//Si tout est good affiche le message
server.on("listening", () => {
    const address = server.address();
    const bind =
        typeof address === "string" ? "pipe " + address : "port " + port;
    console.log("Listening on " + bind);
});

server.listen(port);
