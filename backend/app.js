const express = require("express");
const mongoose = require("mongoose");
//securiter
const helmet = require("helmet");
const session = require('cookie-session');
const nocache = require("nocache");

//const bodyParser = require("body-parser");

//routes
const authRoutes = require("./routes/authentification");
const saucesRoutes = require("./routes/sauces");

const path = require("path");

const app = express();

// ***
const crip=require('./secmong/mong')
let umdb =  "0a47408cd23db4cfde6f";
let mpmdb = "04544e8ecb31aeda893a9b1718f1e8bf";

// app
// adresse de base : 'mongodb+srv://admintotal:<password>@projet.xr3kx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
// Veillez à remplacer l'adresse SRV par la vôtre et la chaîne <PASSWORD> par votre mot de passe utilisateur MongoDB
mongoose
  .connect(
    `mongodb+srv://${crip.lor(umdb)}:${crip.lor(mpmdb)}@projet.xr3kx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

//middleware global
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
  //securité supplementaire (xss, injections de contenu)
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  next();
});
// securisation cookies
app.use(session({ 
  secret: 'mySuperSecretCookieSalt',
  name: 'myCookieSessionId',
  cookie: {
    httpOnly: true,
    secure: true,
    domain: 'http://localhost:3000',
    // Cookie will expire in 1 hour from when it's generated
    expires: new Date( Date.now() + 60 * 60 * 1000 )
  }
}));


//body parser deprecier -> app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Securiter
// helmet permet de securiser par defaut 11 vulnérabilitées:
//helmet.contentSecurityPolicy()
// helmet.dnsPrefetchControl()
// helmet.expectCt()
// helmet.frameguard()
//helmet.hidePoweredBy()
// helmet.hsts()
// helmet.ieNoOpen()
// helmet.noSniff()
// helmet.permittedCrossDomainPolicies()
// helmet.referrerPolicy()
// helmet.xssFilter()
app.use(helmet());
app.use(nocache());

app.use("/images", express.static(path.join(__dirname, "images")));

// ***** ROUTES *****
app.use("/api/auth", authRoutes);
app.use("/api/sauces", saucesRoutes);

module.exports = app;
